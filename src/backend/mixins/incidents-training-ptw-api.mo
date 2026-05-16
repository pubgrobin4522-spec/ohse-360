import T "../types/incidents-training-ptw";
import CT "../types/common";
import AT "../types/auth-users-employees";
import Lib "../lib/IncidentsTrainingPtw";
import AuthLib "../lib/AuthUsersEmployees";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import EmailClient "mo:caffeineai-email/emailClient";

mixin (
  // ── shared state from main actor ──────────────────────────
  users         : Map.Map<CT.EmployeeId, AT.User>,
  sessions      : Map.Map<Text, CT.EmployeeId>,
  employees     : Map.Map<Text, AT.Employee>,
  auditLog      : List.List<AT.AuditEntry>,
  notifications : List.List<AT.Notification>,
  state         : {
    var nextEmpSeq   : Nat;
    var nextAuditId  : Nat;
    var nextNotifId  : Nat;
    adminEmail       : Text;
    var systemAdminNotifyEmail : Text;  // permanent CC recipient
  },
  // ── domain-specific state ─────────────────────────────────
  incidents  : Map.Map<Text, T.Incident>,
  capas      : List.List<T.CAPA>,
  trainings  : Map.Map<Text, T.Training>,
  ptws       : Map.Map<Text, T.PermitToWork>,
  itp_state  : {
    var nextIncSeq  : Nat;
    var nextTrnSeq  : Nat;
    var nextPtwSeq  : Nat;  // kept for backwards compat
    var nextCAPAId  : Nat;
    var nextCertSeq : Nat;
    var manHours    : Nat;
    var auditScore  : Nat;
  },
  ptw_state : {
    var ptwMonthlyCounter : Nat;
    var ptwLastMonth      : Text;
  },
  locationList   : [Text],
  departmentList : [Text],
) {

  // ─── Auth helpers (duplicated from auth mixin — no shared funcs between mixins) ──
  func itpRequireAuth(token : Text) : CT.Result<AT.User> {
    switch (sessions.get(token)) {
      case (null) { #err("Invalid or expired session") };
      case (?eid) {
        switch (users.get(eid)) {
          case (null) { #err("User not found") };
          case (?u) {
            if (u.status == #Inactive) return #err("Account is deactivated");
            #ok(u);
          };
        };
      };
    };
  };

  func itpAddAudit(
    actorId    : CT.EmployeeId,
    actorName  : Text,
    actorRole  : CT.Role,
    module_    : Text,
    action     : AT.AuditAction,
    recordRef  : Text,
    detail     : Text,
  ) {
    let id = state.nextAuditId;
    state.nextAuditId += 1;
    auditLog.add(
      AuthLib.newAuditEntry(id, actorId, actorName, actorRole, module_, action, recordRef, detail)
    );
  };

  func itpPushNotif(recipientId : CT.EmployeeId, message : Text, link : Text) {
    let id = state.nextNotifId;
    state.nextNotifId += 1;
    notifications.add(AuthLib.newNotification(id, recipientId, message, link));
  };

  // CC the system admin notify email. Skips if primary == notify email. Fire-and-forget.
  func itpCcAdminNotify(primaryRecipient : Text, subject : Text, body : Text) : async () {
    let ccAddr = state.systemAdminNotifyEmail;
    if (primaryRecipient == ccAddr) return;
    try {
      ignore await EmailClient.sendServiceEmail("no-reply", [ccAddr], subject, body);
    } catch (e) {
      let id = state.nextAuditId;
      state.nextAuditId += 1;
      auditLog.add(AuthLib.newAuditEntry(id, 0, "system", #SystemAdmin, "Email", #Created, ccAddr, "CC email failed: " # subject));
    };
  };

  // Notify all Safety Officers
  func notifySafetyOfficers(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      let isSO = u.role == #SafetyOfficer or
        (switch (u.roles.find<CT.Role>(func(r) { r == #SafetyOfficer })) {
          case (?_) true;
          case null false;
        });
      if (isSO and u.status == #Active) {
        itpPushNotif(u.employeeId, message, link);
      };
    };
  };

  // Notify all HODs
  func notifyHODs(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      if (u.role == #HOD and u.status == #Active) {
        itpPushNotif(u.employeeId, message, link);
      };
    };
  };

  // Notify all AreaInCharge
  func notifyAICs(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      if (u.role == #AreaInCharge and u.status == #Active) {
        itpPushNotif(u.employeeId, message, link);
      };
    };
  };

  // ─────────────────────────────────────────────────────────
  // INCIDENT REPORTING
  // ─────────────────────────────────────────────────────────

  /// Report a new incident. Returns the incident view.
  public func reportIncident(token : Text, input : T.CreateIncidentInput) : async CT.Result<T.IncidentView> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let year = Lib.currentYear();
        let seq  = itp_state.nextIncSeq;
        itp_state.nextIncSeq += 1;
        let num  = Lib.incidentNumber(year, seq);
        let inc  = Lib.newIncident(num, input, u.employeeId, u.fullName);
        incidents.add(num, inc);

        // Auto-create CAPA
        let capaId = itp_state.nextCAPAId;
        itp_state.nextCAPAId += 1;
        // Find owner name
        let ownerName = switch (users.get(input.capaActionOwnerId)) {
          case (null)  { "Unknown" };
          case (?owner) { owner.fullName };
        };
        let capa = Lib.newCAPA(
          capaId, num,
          "Corrective action for: " # num,
          input.capaActionOwnerId, ownerName,
          input.capaDeadline,
        );
        capas.add(capa);

        itpAddAudit(u.employeeId, u.fullName, u.role, "Incidents", #Created, num, "Incident reported: " # num);

        // Notify CAPA owner
        itpPushNotif(input.capaActionOwnerId,
          "CAPA assigned to you for incident " # num,
          "/incidents/" # num);

        // Notify Safety Officers
        notifySafetyOfficers("New incident reported: " # num, "/incidents/" # num);

        // CC admin on new incident
        ignore itpCcAdminNotify(
          state.adminEmail,
          "OHSE 360: New incident reported " # num,
          "<p>Incident <b>" # num # "</b> has been reported by " # u.fullName # ".</p>",
        );
        #ok(Lib.toIncidentView(inc));
      };
    };
  };

  /// Update incident status.
  public func updateIncidentStatus(
    token  : Text,
    incNum : Text,
    newStatus : T.IncidentStatus,
    rootCause : Text,
    correctiveAction : Text,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin) {
          return #err("Access denied: Safety Officer required");
        };
        switch (incidents.get(incNum)) {
          case (null)  { #err("Incident not found") };
          case (?inc) {
            inc.status         := newStatus;
            inc.rootCause      := rootCause;
            inc.correctiveAction := correctiveAction;
            if (newStatus == #Closed) {
              inc.closedAt := ?Time.now();
            };
            itpAddAudit(u.employeeId, u.fullName, u.role, "Incidents", #Updated, incNum,
              "Status changed to " # debug_show(newStatus));
            if (newStatus == #Closed) {
              ignore itpCcAdminNotify(
                "",
                "OHSE 360: Incident closed " # incNum,
                "<p>Incident <b>" # incNum # "</b> has been closed.</p>",
              );
            };
            #ok(());
          };
        };
      };
    };
  };

  /// List incidents with optional filters.
  public query func listIncidents(
    token       : Text,
    filterType   : ?T.IncidentType,
    filterSeverity : ?T.Severity,
    filterStatus : ?T.IncidentStatus,
    filterDept   : ?Text,
  ) : async CT.Result<[T.IncidentView]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let all = incidents.values().filter(func(i) {
          let deptOk  = switch (filterDept)     { case (null) true; case (?d) i.department == d };
          let typeOk  = switch (filterType)     { case (null) true; case (?t) i.incidentType == t };
          let sevOk   = switch (filterSeverity) { case (null) true; case (?s) i.severity == s };
          let statOk  = switch (filterStatus)   { case (null) true; case (?s) i.status == s };
          // Employee sees only own incidents
          let scopeOk = if (u.role == #Employee) { i.reportedById == u.employeeId } else { true };
          deptOk and typeOk and sevOk and statOk and scopeOk;
        });
        #ok(all.map<T.Incident, T.IncidentView>(func(i) { Lib.toIncidentView(i) }).toArray());
      };
    };
  };

  /// Get a single incident.
  public query func getIncident(token : Text, incNum : Text) : async CT.Result<T.IncidentView> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (incidents.get(incNum)) {
          case (null)  { #err("Incident not found") };
          case (?inc)  { #ok(Lib.toIncidentView(inc)) };
        };
      };
    };
  };

  /// List CAPAs.
  public query func listCAPAs(
    token     : Text,
    filterInc : ?Text,
  ) : async CT.Result<[T.CAPAView]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let all = capas.values().filter(func(c) {
          let incOk   = switch (filterInc) { case (null) true; case (?n) c.incidentNumber == n };
          let scopeOk = if (u.role == #Employee) { c.actionOwnerId == u.employeeId } else { true };
          incOk and scopeOk;
        });
        #ok(all.map<T.CAPA, T.CAPAView>(func(c) { Lib.toCAPAView(c) }).toArray());
      };
    };
  };

  /// Close a CAPA.
  public func closeCAPA(token : Text, capaId : Nat) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (capas.find(func(c) { c.id == capaId })) {
          case (null) { #err("CAPA not found") };
          case (?c) {
            if (c.actionOwnerId != u.employeeId and u.role != #SafetyOfficer and u.role != #SystemAdmin) {
              return #err("Access denied");
            };
            c.status   := #Closed;
            c.closedAt := ?Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "Incidents", #Updated, c.incidentNumber,
              "CAPA " # capaId.toText() # " closed");
            #ok(());
          };
        };
      };
    };
  };

  // ─────────────────────────────────────────────────────────
  // TRAINING MANAGEMENT
  // ─────────────────────────────────────────────────────────

  /// Create a new training session.
  public func createTraining(token : Text, input : T.CreateTrainingInput) : async CT.Result<T.TrainingView> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin and u.role != #HOD) {
          return #err("Access denied");
        };
        let year = Lib.currentYear();
        let seq  = itp_state.nextTrnSeq;
        itp_state.nextTrnSeq += 1;
        let tId  = Lib.trainingId(year, seq);

        // Build attendee array
        let attArr = Array.tabulate<T.TrainingAttendee>(
          input.attendeeCodes.size(),
          func(i) {
            let code = input.attendeeCodes[i];
            let name = switch (employees.get(code)) {
              case (null)  { "Unknown" };
              case (?emp)  { emp.fullName };
            };
            {
              empCode        = code;
              empName        = name;
              var attendance = #Absent;
              var certificateId  = null;
              var certStatus = null;
              var expiryDate = null;
            };
          },
        );
        let attVarArr : [var T.TrainingAttendee] = attArr.toVarArray();
        let trn = Lib.newTraining(tId, input, u.employeeId, attVarArr);
        trainings.add(tId, trn);

        itpAddAudit(u.employeeId, u.fullName, u.role, "Training", #Created, tId, "Training created: " # input.name);
        ignore itpCcAdminNotify(
          "",
          "OHSE 360: Training record created " # tId,
          "<p>Training <b>" # input.name # "</b> (" # tId # ") has been created.</p>",
        );
        #ok(Lib.toTrainingView(trn));
      };
    };
  };

  /// Mark attendance and auto-generate certificates.
  public func markAttendance(
    token      : Text,
    trainingId : Text,
    empCode    : Text,
    attendance : T.AttendanceStatus,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin and u.role != #HOD) {
          return #err("Access denied");
        };
        switch (trainings.get(trainingId)) {
          case (null)  { #err("Training not found") };
          case (?trn) {
            // Find attendee index
            var found = false;
            var i = 0;
            while (i < trn.attendees.size()) {
              if (trn.attendees[i].empCode == empCode) {
                trn.attendees[i].attendance := attendance;
                if (attendance == #Present) {
                  let certSeq = itp_state.nextCertSeq;
                  itp_state.nextCertSeq += 1;
                  let expiry  = Lib.expiryDateText(trn.trainingDate, trn.frequency);
                  let certId  = Lib.certId(empCode, Lib.currentYear(), certSeq);
                  trn.attendees[i].certificateId := ?certId;
                  trn.attendees[i].expiryDate    := ?expiry;
                  trn.attendees[i].certStatus    := ?Lib.certStatusFromExpiry(expiry);
                  ignore itpCcAdminNotify(
                    "",
                    "OHSE 360: Certificate generated " # certId,
                    "<p>Certificate <b>" # certId # "</b> generated for " # empCode # " in training " # trainingId # ".</p>",
                  );
                };
                found := true;
              };
              i += 1;
            };
            if (not found) return #err("Attendee not found in this training");
            itpAddAudit(u.employeeId, u.fullName, u.role, "Training", #Updated, trainingId,
              "Attendance marked for " # empCode);
            #ok(());
          };
        };
      };
    };
  };

  /// List trainings.
  public query func listTrainings(
    token       : Text,
    filterDept  : ?Text,
    filterType  : ?T.TrainingType,
  ) : async CT.Result<[T.TrainingView]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let all = trainings.values().filter(func(t) {
          let deptOk = switch (filterDept) { case (null) true; case (?d) t.department == d };
          let typeOk = switch (filterType) { case (null) true; case (?tp) t.trainingType == tp };
          deptOk and typeOk;
        });
        #ok(all.map<T.Training, T.TrainingView>(func(t) { Lib.toTrainingView(t) }).toArray());
      };
    };
  };

  /// Get a single training.
  public query func getTraining(token : Text, trainingId : Text) : async CT.Result<T.TrainingView> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (trainings.get(trainingId)) {
          case (null)  { #err("Training not found") };
          case (?trn)  { #ok(Lib.toTrainingView(trn)) };
        };
      };
    };
  };

  // ─────────────────────────────────────────────────────────
  // WORK PERMIT (PTW) — Full Rebuild
  // ─────────────────────────────────────────────────────────

  // Build an ApprovalSignature for the current user
  func mkSig(u : AT.User, status : Text, remarks : Text) : T.ApprovalSignature {
    {
      employeeId     = u.employeeId;
      name           = u.fullName;
      designation    = u.designation;
      approvalStatus = status;
      signedAt       = ?Time.now();
      ipAddress      = "";
      remarks;
    };
  };

  // Validate an employee ID has an expected role (returns error text or null)
  func validateRole(eid : CT.EmployeeId, expected : CT.Role) : ?Text {
    switch (users.get(eid)) {
      case (null) { ?("Employee ID " # eid.toText() # " not found") };
      case (?u) {
        let hasRole = u.role == expected or
          (u.roles.find(func(r : CT.Role) : Bool { r == expected }) != null);
        if (hasRole) null
        else ?("Employee ID " # eid.toText() # " does not have role " # debug_show(expected));
      };
    };
  };

  // Get current yearMonth "YYYY/MM" and manage monthly counter reset
  func nextPtwId() : Text {
    let ym = Lib.currentYearMonth();
    if (ym != ptw_state.ptwLastMonth) {
      ptw_state.ptwMonthlyCounter := 1;
      ptw_state.ptwLastMonth      := ym;
    } else {
      ptw_state.ptwMonthlyCounter += 1;
    };
    Lib.generatePTWNumber(ptw_state.ptwMonthlyCounter, ym);
  };

  /// Create a new PTW.
  public func createPTW(token : Text, input : T.CreatePermitInput) : async CT.Result<Text> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        // Mandatory header validations
        if (input.department == "") return #err("Department is required");
        if (input.jobLocation == "") return #err("Job location is required");
        // Validate nominated HOD if not System Admin
        if (u.role != #SystemAdmin) {
          switch (input.nominatedHodEmployeeId) {
            case (null) { return #err("Nominated HOD employee ID is required") };
            case (?hodId) {
              switch (validateRole(hodId, #HOD)) {
                case (?err) { return #err(err) };
                case (null) {};
              };
            };
          };
        };
        let permitId = nextPtwId();
        let ptw = Lib.newPermitToWork(permitId, input, u.employeeId);
        if (u.role == #SystemAdmin) {
          ptw.status := #Active;
        };
        ptws.add(permitId, ptw);
        itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Created, permitId, "PTW created: " # permitId);
        if (u.role != #SystemAdmin) {
          switch (input.nominatedHodEmployeeId) {
            case (?hodId) {
              itpPushNotif(hodId, "New PTW " # permitId # " requires your review", "/ptw/" # permitId);
            };
            case (null) {};
          };
          ignore itpCcAdminNotify(
            "",
            "OHSE 360: New PTW created " # permitId,
            "<p>PTW <b>" # permitId # "</b> created by " # u.fullName # ".</p>",
          );
        };
        #ok(permitId);
      };
    };
  };

  /// Submit PTW for HOD review (Draft → HODReview).
  public func submitPTW(token : Text, permitId : Text, nominatedHodId : Nat) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.createdBy != u.employeeId) return #err("Only the permit creator can submit");
            if (ptw.status != #Draft) return #err("Only Draft permits can be submitted");
            if (ptw.selectedHazards.size() == 0) return #err("At least one hazard must be selected");
            if (ptw.selectedPPE.size() == 0) return #err("At least one PPE item must be selected");
            switch (validateRole(nominatedHodId, #HOD)) {
              case (?err) { return #err(err) };
              case (null) {};
            };
            ptw.status := #HODReview;
            ptw.nominatedHodEmployeeId := ?nominatedHodId;
            ptw.updatedAt := Time.now();
            ptw.requestorSignature := ?mkSig(u, "Approved", "Submitted for HOD review");
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitId, "Submitted for HOD review");
            itpPushNotif(nominatedHodId, "PTW " # permitId # " requires your HOD review", "/ptw/" # permitId);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW submitted " # permitId,
              "<p>PTW <b>" # permitId # "</b> submitted by " # u.fullName # " — pending HOD review.</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// HOD approves PTW (HODReview → AreaReview).
  public func approvePTWHOD(
    token                  : Text,
    permitId               : Text,
    remarks                : Text,
    nominatedAreaInChargeId : Nat,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #HOD and u.role != #SystemAdmin) return #err("HOD role required");
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.status != #HODReview) return #err("Permit is not in HOD Review status");
            switch (validateRole(nominatedAreaInChargeId, #AreaInCharge)) {
              case (?err) { return #err(err) };
              case (null) {};
            };
            ptw.hodSignature := ?mkSig(u, "Approved", remarks);
            ptw.status := #AreaReview;
            ptw.nominatedAreaInChargeEmployeeId := ?nominatedAreaInChargeId;
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Approved, permitId, "HOD approved — " # remarks);
            itpPushNotif(nominatedAreaInChargeId, "PTW " # permitId # " requires your area validation", "/ptw/" # permitId);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW HOD approved " # permitId,
              "<p>PTW <b>" # permitId # "</b> approved by HOD " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Area In-Charge approves PTW (AreaReview → IsolationReview or SafetyReview).
  public func approvePTWAreaInCharge(
    token           : Text,
    permitId        : Text,
    remarks         : Text,
    nominatedNextId : Nat,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #AreaInCharge and u.role != #SystemAdmin) return #err("Area In-Charge role required");
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.status != #AreaReview) return #err("Permit is not in Area Review status");
            ptw.areaInChargeSignature := ?mkSig(u, "Approved", remarks);
            ptw.updatedAt := Time.now();
            let isolationRequired = switch (ptw.isolation) {
              case (null) { false };
              case (?iso) { iso.isolationRequired };
            };
            if (isolationRequired) {
              // validate nominatedNextId exists (any role for isolation authority)
              switch (users.get(nominatedNextId)) {
                case (null) { return #err("Employee ID " # nominatedNextId.toText() # " not found") };
                case (_) {};
              };
              ptw.status := #IsolationReview;
              ptw.nominatedIsolationAuthorityEmployeeId := ?nominatedNextId;
              itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Approved, permitId,
                "Area In-Charge approved — routed to Isolation — " # remarks);
              itpPushNotif(nominatedNextId, "PTW " # permitId # " requires isolation authority review", "/ptw/" # permitId);
            } else {
              switch (validateRole(nominatedNextId, #SafetyOfficer)) {
                case (?err) { return #err(err) };
                case (null) {};
              };
              ptw.status := #SafetyReview;
              ptw.nominatedSafetyOfficerEmployeeId := ?nominatedNextId;
              itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Approved, permitId,
                "Area In-Charge approved — routed to Safety Review — " # remarks);
              itpPushNotif(nominatedNextId, "PTW " # permitId # " requires Safety Officer review", "/ptw/" # permitId);
            };
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW Area In-Charge approved " # permitId,
              "<p>PTW <b>" # permitId # "</b> approved by Area In-Charge " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Isolation Authority approves (IsolationReview → SafetyReview).
  public func approvePTWIsolationAuthority(
    token                    : Text,
    permitId                 : Text,
    remarks                  : Text,
    nominatedSafetyOfficerId : Nat,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.status != #IsolationReview) return #err("Permit is not in Isolation Review status");
            switch (validateRole(nominatedSafetyOfficerId, #SafetyOfficer)) {
              case (?err) { return #err(err) };
              case (null) {};
            };
            ptw.isolationAuthoritySignature := ?mkSig(u, "Approved", remarks);
            ptw.status := #SafetyReview;
            ptw.nominatedSafetyOfficerEmployeeId := ?nominatedSafetyOfficerId;
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Approved, permitId,
              "Isolation Authority approved — " # remarks);
            itpPushNotif(nominatedSafetyOfficerId,
              "PTW " # permitId # " requires Safety Officer review",
              "/ptw/" # permitId);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW Isolation Authority approved " # permitId,
              "<p>PTW <b>" # permitId # "</b> isolation approved by " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Safety Officer approves (SafetyReview → FinalApproval).
  public func approvePTWSafetyOfficer(
    token                 : Text,
    permitId              : Text,
    remarks               : Text,
    nominatedFinalIssuerId : Nat,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let isSO = u.role == #SafetyOfficer or u.role == #SystemAdmin or
          (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null);
        if (not isSO) return #err("Safety Officer role required");
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.status != #SafetyReview) return #err("Permit is not in Safety Review status");
            // Validate insurance not expired
            switch (ptw.insurance) {
              case (?ins) {
                if (ins.verificationStatus == "Expired") {
                  return #err("Insurance has expired — permit cannot be approved");
                };
              };
              case (null) {};
            };
            // Validate final issuer exists
            switch (users.get(nominatedFinalIssuerId)) {
              case (null) { return #err("Final Issuer Employee ID " # nominatedFinalIssuerId.toText() # " not found") };
              case (_) {};
            };
            ptw.safetyOfficerSignature := ?mkSig(u, "Approved", remarks);
            ptw.status := #FinalApproval;
            ptw.nominatedFinalIssuerEmployeeId := ?nominatedFinalIssuerId;
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Approved, permitId,
              "Safety Officer approved — " # remarks);
            itpPushNotif(nominatedFinalIssuerId,
              "PTW " # permitId # " requires your final issuance approval",
              "/ptw/" # permitId);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW Safety Officer approved " # permitId,
              "<p>PTW <b>" # permitId # "</b> safety-approved by " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Final Issuer approves (FinalApproval → Active).
  public func approvePTWFinalIssuer(
    token    : Text,
    permitId : Text,
    remarks  : Text,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.status != #FinalApproval) return #err("Permit is not in Final Approval status");
            ptw.finalIssuerSignature := ?mkSig(u, "Approved", remarks);
            ptw.status := #Active;
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Approved, permitId,
              "Final Issuer approved — permit now Active — " # remarks);
            itpPushNotif(ptw.createdBy,
              "PTW " # permitId # " is now ACTIVE — work may commence",
              "/ptw/" # permitId);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW ACTIVE " # permitId,
              "<p>PTW <b>" # permitId # "</b> is now Active. Final Issuer: " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Reject PTW at any active approval stage.
  public func rejectPTW(token : Text, permitId : Text, remarks : Text) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            let canReject = switch (ptw.status) {
              case (#HODReview) { u.role == #HOD or u.role == #SystemAdmin };
              case (#AreaReview) { u.role == #AreaInCharge or u.role == #SystemAdmin };
              case (#IsolationReview) { u.role == #SystemAdmin or true }; // isolation authority
              case (#SafetyReview) {
                u.role == #SafetyOfficer or u.role == #SystemAdmin or
                (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null)
              };
              case (#FinalApproval) { u.role == #SystemAdmin or true }; // final issuer
              case (_) { false };
            };
            if (not canReject) return #err("You are not authorised to reject at this stage");
            // Set the stage signature as Rejected
            let sig = mkSig(u, "Rejected", remarks);
            switch (ptw.status) {
              case (#HODReview)       { ptw.hodSignature := ?sig };
              case (#AreaReview)      { ptw.areaInChargeSignature := ?sig };
              case (#IsolationReview) { ptw.isolationAuthoritySignature := ?sig };
              case (#SafetyReview)    { ptw.safetyOfficerSignature := ?sig };
              case (#FinalApproval)   { ptw.finalIssuerSignature := ?sig };
              case (_) {};
            };
            ptw.status := #Rejected;
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Rejected_, permitId,
              "Rejected at " # debug_show(ptw.status) # " — " # remarks);
            itpPushNotif(ptw.createdBy,
              "PTW " # permitId # " has been REJECTED by " # u.fullName # ": " # remarks,
              "/ptw/" # permitId);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW rejected " # permitId,
              "<p>PTW <b>" # permitId # "</b> rejected by " # u.fullName # ". Reason: " # remarks # "</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Suspend an active permit (Safety Officer or System Admin).
  public func suspendPTW(token : Text, permitId : Text, reason : Text) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let isSO = u.role == #SafetyOfficer or u.role == #SystemAdmin or
          (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null);
        if (not isSO) return #err("Safety Officer or System Admin required");
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.status != #Active) return #err("Only Active permits can be suspended");
            ptw.status := #Suspended;
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitId,
              "Permit SUSPENDED — " # reason);
            #ok(());
          };
        };
      };
    };
  };

  /// Close a permit (original requestor only).
  public func closePTW(token : Text, permitId : Text) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (ptw.createdBy != u.employeeId and u.role != #SystemAdmin)
              return #err("Only the original requestor can close the permit");
            if (ptw.status != #Active and ptw.status != #Approved)
              return #err("Only Active or Approved permits can be closed");
            ptw.status := #Closed;
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Closed_, permitId, "Permit closed");
            itpPushNotif(ptw.createdBy,
              "PTW " # permitId # " has been CLOSED",
              "/ptw/" # permitId);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW closed " # permitId,
              "<p>PTW <b>" # permitId # "</b> has been closed by " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Get a single PTW (role-scoped).
  public query func getPTW(token : Text, permitId : Text) : async CT.Result<T.PermitToWorkView> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            let allowed = switch (u.role) {
              case (#Employee or #ContractorAdmin) { ptw.createdBy == u.employeeId };
              case (#HOD) { ptw.department == u.department or ptw.createdBy == u.employeeId };
              case (_) { true };
            };
            if (not allowed) return #err("Access denied");
            #ok(Lib.toPermitView(ptw));
          };
        };
      };
    };
  };

  /// List PTWs (role-scoped).
  public query func listPTWs(
    token        : Text,
    filterStatus : ?T.PTWStatus,
    filterType   : ?T.PermitType,
  ) : async CT.Result<[T.PermitToWorkView]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let all = ptws.values().filter(func(p) {
          let statOk = switch (filterStatus) { case (null) true; case (?s) p.status == s };
          let typeOk = switch (filterType)   { case (null) true; case (?t) p.permitType == t };
          let scopeOk = switch (u.role) {
            case (#Employee or #ContractorAdmin) { p.createdBy == u.employeeId };
            case (#HOD) { p.department == u.department or p.createdBy == u.employeeId };
            case (#AreaInCharge) { p.status == #AreaReview or p.createdBy == u.employeeId };
            case (_) { true };
          };
          statOk and typeOk and scopeOk;
        });
        #ok(all.map<T.PermitToWork, T.PermitToWorkView>(func(p) { Lib.toPermitView(p) }).toArray());
      };
    };
  };

  /// Record energisation (electrical or service/process).
  public func recordEnergisation(
    token    : Text,
    permitId : Text,
    record   : T.EnergisationRecord,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #SystemAdmin or
          (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null);
        if (not allowed) return #err("Safety Officer required");
        switch (ptws.get(permitId)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            if (record.energisationType == "Electrical") {
              ptw.electricalEnergisation := ?record;
            } else {
              ptw.serviceProcessEnergisation := ?record;
            };
            ptw.updatedAt := Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitId,
              record.energisationType # " energisation recorded");
            #ok(());
          };
        };
      };
    };
  };

  /// Get PTW master data (permit types, hazards, PPE, locations, departments).
  public query func getPTWMasterData(token : Text) : async CT.Result<T.PTWMasterData> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        #ok({
          permitTypes = ["General Work Permit","Hot Work Permit","Height Work Permit","Confined Space Permit","Electrical Work Permit","Excavation Permit","Lifting Permit","Shutdown Permit","Chemical Handling Permit","Cold Work Permit"];
          hazards     = ["Corrosive Chemicals","Flammables","Explosives","Hot Materials","Steam","Compressed Gas","Fumes Dust","High/Low Pressure","High/Low Temperature","Live/Dead Electrical","Overhead Danger","Radiation Source","Moving Machine","Open Rotating Parts","Traffic","Confined Space","Use of Ladder","Use of Scaffold","Roof Condition Slippery","Floor Condition Slip Trip","Hidden Cables","Leaky Pipelines","Buried Pipelines","Suspended Load","Biological Hazards","Fall from Height","Others"];
          ppeList     = ["Helmet","Safety Shoes","Gum Boots","Hand Gloves Cotton","Hand Gloves Cut Resistant","Hand Gloves PU","Hand Gloves Electrical","Hand Gloves Nitrile","Hand Gloves Leather","Apron","PVC Overall","Ear Plug/Ear Muff","Dust/Gas Mask","Breathing Apparatus","Full Body Safety Harness","Safety Net","Crawling Boards","Others"];
          locations   = locationList;
          departments = departmentList;
        });
      };
    };
  };

  /// Get location list.
  public query func getLocations(token : Text) : async CT.Result<[Text]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) { #ok(locationList) };
    };
  };

  /// Get department list.
  public query func getDepartments(token : Text) : async CT.Result<[Text]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) { #ok(departmentList) };
    };
  };

  // ─────────────────────────────────────────────────────────
  // DASHBOARD KPIs
  // ─────────────────────────────────────────────────────────

  /// Get live KPI summary. Role-scoped.
  public query func getKPISummary(token : Text, filterDept : ?Text) : async CT.Result<T.KPISummary> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        // Filter incidents by dept and role
        let myIncidents = incidents.values().filter(func(i) {
          let deptOk  = switch (filterDept) { case (null) true; case (?d) i.department == d };
          let scopeOk = if (u.role == #Employee) { i.reportedById == u.employeeId }
                        else if (u.role == #HOD) { i.department == u.department }
                        else { true };
          deptOk and scopeOk;
        });

        var nearMiss    = 0;
        var recordable  = 0;
        var lti         = 0;
        for (i in myIncidents) {
          switch (i.incidentType) {
            case (#NearMiss)    { nearMiss   += 1 };
            case (#LTI)         { lti        += 1; recordable += 1 };
            case (#Fatal)       { recordable += 1; lti        += 1 };
            case (#FirstAid)    { recordable += 1 };
            case (_)            {};
          };
        };

        let empCount = employees.values().filter(func(e) {
          e.empStatus == #Active;
        }).size();

        // Training compliance
        var empWithValidCert = 0;
        let empTotal = empCount;
        for ((_, trn) in trainings.entries()) {
          var idx = 0;
          while (idx < trn.attendees.size()) {
            let a = trn.attendees[idx];
            switch (a.certStatus) {
              case (?#Valid)         { empWithValidCert += 1 };
              case (_) {};
            };
            idx += 1;
          };
        };
        let trainingPct : Float = if (empTotal == 0) { 0.0 } else {
          empWithValidCert.toFloat() / empTotal.toFloat() * 100.0;
        };

        // PTW compliance (closed on time = closed)
        let ptwTotal  = ptws.size();
        let ptwClosed = ptws.values().filter(func(p) { p.status == #Closed }).size();
        let ptwPct : Float = if (ptwTotal == 0) { 0.0 } else {
          ptwClosed.toFloat() / ptwTotal.toFloat() * 100.0;
        };

        // Open CAPAs
        let openCAPAs = capas.values().filter(func(c) { c.status == #Open or c.status == #InProgress }).size();

        #ok({
          trir                  = Lib.computeTRIR(recordable, empCount);
          ltifr                 = Lib.computeLTIFR(lti, empCount);
          nearMissCount         = nearMiss;
          auditScorePct         = itp_state.auditScore.toFloat();
          trainingCompliancePct = trainingPct;
          ptwCompliancePct      = ptwPct;
          totalIncidents        = incidents.size();
          openCAPAs;
        });
      };
    };
  };

  /// Get monthly incident trend for a year.
  public query func getIncidentTrend(token : Text, year : Nat) : async CT.Result<[T.MonthlyTrend]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        // Count incidents per month using incidentDate "YYYY-MM-DD"
        let counts = Array.tabulate(12, func(_) { 0 });
        let varCounts = counts.toVarArray<Nat>();
        for ((_, i) in incidents.entries()) {
          let parts = i.incidentDate.split(#char '-').toArray();
          if (parts.size() >= 2) {
            switch (Nat.fromText(parts[0]), Nat.fromText(parts[1])) {
              case (?yr, ?mo) {
                if (yr == year and mo >= 1 and mo <= 12) {
                   varCounts[(mo - 1 : Nat)] += 1;
                };
              };
              case (_) {};
            };
          };
        };
        let trend = Array.tabulate(
          12,
          func(i) { { month = i + 1; year; incidentCount = varCounts[i] } },
        );
        #ok(trend);
      };
    };
  };

  /// Get department OHSE scores.
  public query func getDeptOHSEScores(token : Text) : async CT.Result<[T.DeptOHSEScore]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        // Collect departments from employees
        let deptMap = Map.empty<Text, Nat>();  // dept -> incident count
        for ((_, e) in employees.entries()) {
          if (not deptMap.containsKey(e.department)) {
            deptMap.add(e.department, 0);
          };
        };
        for ((_, i) in incidents.entries()) {
          switch (deptMap.get(i.department)) {
            case (null) {};
            case (?cnt) { deptMap.add(i.department, cnt + 1) };
          };
        };
        // Score: 100 - (incident_count * 5), clamped to 0-100
        let scores = deptMap.entries()
          .map(func((dept, cnt)) {
            let raw : Int = (100 : Int) - cnt.toInt() * 5;
            let score : Float = if (raw < 0) { 0.0 } else { raw.toNat().toFloat() };
            { department = dept; score };
          }).toArray();
        #ok(scores);
      };
    };
  };
};
