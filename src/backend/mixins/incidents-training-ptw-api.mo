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
  ptws       : Map.Map<Text, T.PTW>,
  itp_state  : {
    var nextIncSeq  : Nat;
    var nextTrnSeq  : Nat;
    var nextPtwSeq  : Nat;
    var nextCAPAId  : Nat;
    var nextCertSeq : Nat;
    var manHours    : Nat;
    var auditScore  : Nat;
  },
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
  // WORK PERMIT (PTW)
  // ─────────────────────────────────────────────────────────

  /// Create a new PTW (starts as Draft).
  public func createPTW(token : Text, input : T.CreatePTWInput) : async CT.Result<T.PTWView> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let year = Lib.currentYear();
        let seq  = itp_state.nextPtwSeq;
        itp_state.nextPtwSeq += 1;
        let num  = Lib.permitNumber(year, seq);
        let ptw  = Lib.newPTW(num, input, u.employeeId, u.fullName);
        ptws.add(num, ptw);
        itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Created, num, "PTW created: " # num);
        #ok(Lib.toPTWView(ptw));
      };
    };
  };

  /// Submit PTW for approval (Draft → PendingHOD).
  public func submitPTW(token : Text, permitNum : Text) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitNum)) {
          case (null)  { #err("Permit not found") };
          case (?ptw) {
            if (ptw.requestedById != u.employeeId) return #err("Only requester can submit");
            if (ptw.status != #Draft) return #err("Only Draft permits can be submitted");
            ptw.status := #PendingHOD;
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitNum, "Submitted for HOD approval");
            notifyHODs("PTW " # permitNum # " requires your approval", "/ptw/" # permitNum);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW submitted " # permitNum,
              "<p>PTW <b>" # permitNum # "</b> has been submitted and is pending HOD approval.</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Approve or reject PTW at the current step.
  public func actOnPTW(
    token     : Text,
    permitNum : Text,
    approve   : Bool,
    remarks   : Text,
  ) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (ptws.get(permitNum)) {
          case (null)  { #err("Permit not found") };
          case (?ptw) {
            let now = Time.now();
            let step : T.ApprovalStep = {
              approverId   = u.employeeId;
              approverName = u.fullName;
              role         = u.role;
              var approved = ?approve;
              var remarks  = remarks;
              var actionAt = ?now;
            };
            if (ptw.status == #PendingHOD) {
              if (u.role != #HOD and u.role != #SystemAdmin) return #err("HOD role required");
              ptw.hodStep := ?step;
              if (approve) {
                ptw.status := #PendingAreaInCharge;
                notifyAICs("PTW " # permitNum # " requires your validation", "/ptw/" # permitNum);
              } else {
                ptw.status := #Rejected;
                ptw.rejectedAt := ?now;
                ptw.rejectedRemarks := remarks;
                itpPushNotif(ptw.requestedById, "PTW " # permitNum # " rejected by HOD: " # remarks, "/ptw/" # permitNum);
              };
            } else if (ptw.status == #PendingAreaInCharge) {
              if (u.role != #AreaInCharge and u.role != #SystemAdmin) return #err("Area In Charge role required");
              ptw.aicStep := ?step;
              if (approve) {
                ptw.status := #PendingSafetyOfficer;
                notifySafetyOfficers("PTW " # permitNum # " requires Safety Officer approval", "/ptw/" # permitNum);
              } else {
                ptw.status := #Rejected;
                ptw.rejectedAt := ?now;
                ptw.rejectedRemarks := remarks;
                itpPushNotif(ptw.requestedById, "PTW " # permitNum # " rejected by AIC: " # remarks, "/ptw/" # permitNum);
              };
            } else if (ptw.status == #PendingSafetyOfficer) {
              if (u.role != #SafetyOfficer and u.role != #SystemAdmin) return #err("Safety Officer role required");
              ptw.soStep := ?step;
              if (approve) {
                ptw.status := #Active;
                itpPushNotif(ptw.requestedById, "PTW " # permitNum # " is now Active!", "/ptw/" # permitNum);
              } else {
                ptw.status := #Rejected;
                ptw.rejectedAt := ?now;
                ptw.rejectedRemarks := remarks;
                itpPushNotif(ptw.requestedById, "PTW " # permitNum # " rejected by Safety Officer: " # remarks, "/ptw/" # permitNum);
              };
            } else {
              return #err("No approval action required at current status");
            };
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW",
              if (approve) #Approved else #Rejected_,
              permitNum, "Action: " # (if approve "Approved" else "Rejected") # " - " # remarks);
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW " # (if approve "approved" else "rejected") # " at " # debug_show(u.role) # " stage - " # permitNum,
              "<p>PTW <b>" # permitNum # "</b> was " # (if approve "approved" else "rejected") # " by " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Close a permit (mark as Closed).
  public func closePTW(token : Text, permitNum : Text) : async CT.Result<()> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin) {
          return #err("Safety Officer required");
        };
        switch (ptws.get(permitNum)) {
          case (null)  { #err("Permit not found") };
          case (?ptw) {
            ptw.status  := #Closed;
            ptw.closedAt := ?Time.now();
            itpAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Closed_, permitNum, "Permit closed");
            ignore itpCcAdminNotify(
              "",
              "OHSE 360: PTW closed " # permitNum,
              "<p>PTW <b>" # permitNum # "</b> has been closed.</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// List PTWs.
  public query func listPTWs(
    token         : Text,
    filterStatus  : ?T.PTWStatus,
    filterType    : ?T.PermitType,
  ) : async CT.Result<[T.PTWView]> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let all = ptws.values().filter(func(p) {
          let statOk = switch (filterStatus) { case (null) true; case (?s) p.status == s };
          let typeOk = switch (filterType)   { case (null) true; case (?t) p.permitType == t };
          let scopeOk = switch (u.role) {
            case (#Employee or #ContractorAdmin) { p.requestedById == u.employeeId };
            case (#HOD) { p.status == #PendingHOD or p.requestedById == u.employeeId };
            case (#AreaInCharge) { p.status == #PendingAreaInCharge or p.requestedById == u.employeeId };
            case (_) { true };
          };
          statOk and typeOk and scopeOk;
        });
        #ok(all.map<T.PTW, T.PTWView>(func(p) { Lib.toPTWView(p) }).toArray());
      };
    };
  };

  /// Get a single PTW.
  public query func getPTW(token : Text, permitNum : Text) : async CT.Result<T.PTWView> {
    switch (itpRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (ptws.get(permitNum)) {
          case (null)  { #err("Permit not found") };
          case (?ptw)  { #ok(Lib.toPTWView(ptw)) };
        };
      };
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
        var ptwTotal  = ptws.size();
        var ptwClosed = ptws.values().filter(func(p) { p.status == #Closed }).size();
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
