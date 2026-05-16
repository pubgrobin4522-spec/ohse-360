import T2A "../types/phase2-observations-hira-jsa";
import CT "../types/common";
import AT "../types/auth-users-employees";
import OLib "../lib/ObservationsHiraJsa";
import AuthLib "../lib/AuthUsersEmployees";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
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
    var systemAdminNotifyEmail : Text;
  },
  // ── domain state ─────────────────────────────────────────
  observations    : List.List<T2A.Observation>,
  hiras           : List.List<T2A.HIRA>,
  jsas            : List.List<T2A.JSA>,
  ohj_state       : {
    var nextObsSeq  : Nat;
    var nextHiraSeq : Nat;
    var nextJsaSeq  : Nat;
  },
) {

  // ──────────────────────────────────────────
  // Internal auth helpers
  // ──────────────────────────────────────────

  func ohjRequireAuth(token : Text) : CT.Result<AT.User> {
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

  func ohjIsSafetyOfficerOrAdmin(u : AT.User) : Bool {
    switch (u.role) {
      case (#SystemAdmin or #SafetyOfficer) true;
      case (_) false;
    };
  };

  func ohjAddAudit(
    actorId   : CT.EmployeeId,
    actorName : Text,
    actorRole : CT.Role,
    module_   : Text,
    action    : AT.AuditAction,
    recordRef : Text,
    detail    : Text,
  ) {
    let id = state.nextAuditId;
    state.nextAuditId += 1;
    auditLog.add(
      AuthLib.newAuditEntry(id, actorId, actorName, actorRole, module_, action, recordRef, detail)
    );
  };

  func ohjPushNotif(recipientId : CT.EmployeeId, message : Text, link : Text) {
    let id = state.nextNotifId;
    state.nextNotifId += 1;
    notifications.add(AuthLib.newNotification(id, recipientId, message, link));
  };

  // CC the system admin on every email notification
  func ohjCcAdmin(subject : Text, body : Text) : async () {
    let ccAddr = state.systemAdminNotifyEmail;
    try {
      ignore await EmailClient.sendServiceEmail("no-reply", [ccAddr], subject, body);
    } catch (_) {}; // fire-and-forget
  };

  // Push notification to all Safety Officers
  func notifyAllSafetyOfficers(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      switch (u.role) {
        case (#SafetyOfficer or #SystemAdmin) {
          ohjPushNotif(u.employeeId, message, link);
        };
        case (_) {};
      };
    };
  };

  // Find first HOD user
  func findFirstHOD() : ?AT.User {
    users.values().find(func(u) { u.role == #HOD });
  };

  // Find first AreaInCharge user
  func findFirstAIC() : ?AT.User {
    users.values().find(func(u) { u.role == #AreaInCharge });
  };

  // ──────────────────────────────────────────
  // SAFETY OBSERVATIONS (BBS)
  // ──────────────────────────────────────────

  /// Create a new safety observation.
  public func createObservation(token : Text, input : T2A.CreateObservationInput) : async CT.Result<Text> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let year = 2026; // current year
        ohj_state.nextObsSeq += 1;
        let obsNumber = OLib.generateObsNumber(year, ohj_state.nextObsSeq);
        let needsCapa = OLib.isBbsObsUnsafe(input.obsType);
        let now = Time.now();
        let obs : T2A.Observation = {
          obsNumber;
          observerEmpId      = u.employeeId;
          observerName       = u.fullName;
          department         = input.department;
          location           = input.location;
          area               = input.area;
          dateTime           = input.dateTime;
          obsType            = input.obsType;
          severity           = input.severity;
          description        = input.description;
          immediateAction    = input.immediateAction;
          var status         = if (needsCapa) #CAPAPending else #Open;
          var linkedCapaId   = null;
          var acknowledgedBy = null;
          var acknowledgedAt = null;
          var acknowledgeRemarks = null;
          photoUrl           = input.photoUrl;
          createdAt          = now;
        };
        observations.add(obs);
        ohjAddAudit(u.employeeId, u.fullName, u.role, "Observations", #Created, obsNumber, "Observation created: " # obsNumber);
        // Notify Safety Officers
        let notifMsg = "New safety observation: " # obsNumber # " (" # input.location # ")";
        notifyAllSafetyOfficers(notifMsg, "/observations/" # obsNumber);
        // Email CC admin
        ignore ohjCcAdmin(
          "OHSE 360: New Safety Observation " # obsNumber,
          "<p>A new safety observation <b>" # obsNumber # "</b> has been submitted by " # u.fullName # " at " # input.location # ".</p>",
        );
        #ok(obsNumber);
      };
    };
  };

  /// List observations — role-filtered.
  public query func listObservations(token : Text) : async CT.Result<[T2A.ObservationView]> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let filtered = observations.values().filter(func(obs) {
          switch (u.role) {
            case (#SystemAdmin or #SafetyOfficer) true;
            case (#HOD) obs.department == u.department;
            case (_) obs.observerEmpId == u.employeeId;
          };
        });
        #ok(filtered.map<T2A.Observation, T2A.ObservationView>(func(obs) { toObsView(obs) }).toArray());
      };
    };
  };

  func toObsView(obs : T2A.Observation) : T2A.ObservationView {
    {
      obsNumber          = obs.obsNumber;
      observerEmpId      = obs.observerEmpId;
      observerName       = obs.observerName;
      dateTime           = obs.dateTime;
      location           = obs.location;
      area               = obs.area;
      department         = obs.department;
      obsType            = obs.obsType;
      severity           = obs.severity;
      description        = obs.description;
      immediateAction    = obs.immediateAction;
      linkedCapaId       = obs.linkedCapaId;
      status             = obs.status;
      acknowledgedBy     = obs.acknowledgedBy;
      acknowledgedAt     = obs.acknowledgedAt;
      acknowledgeRemarks = obs.acknowledgeRemarks;
      photoUrl           = obs.photoUrl;
      createdAt          = obs.createdAt;
    }
  };

  /// Get a single observation by number.
  public query func getObservation(token : Text, obsNumber : Text) : async CT.Result<T2A.ObservationView> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (observations.find(func(obs) { obs.obsNumber == obsNumber })) {
          case (null) { #err("Observation not found") };
          case (?obs) {
            // Access check
            let canView = switch (u.role) {
              case (#SystemAdmin or #SafetyOfficer) true;
              case (#HOD) obs.department == u.department;
              case (_) obs.observerEmpId == u.employeeId;
            };
            if (not canView) return #err("Access denied");
            #ok(toObsView(obs));
          };
        };
      };
    };
  };

  /// Safety Officer acknowledges an observation.
  public func acknowledgeObservation(token : Text, obsNumber : Text, remarks : Text) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not ohjIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer only");
        switch (observations.find(func(obs) { obs.obsNumber == obsNumber })) {
          case (null) { #err("Observation not found") };
          case (?obs) {
            obs.acknowledgeRemarks := ?remarks;
            obs.acknowledgedAt     := ?Time.now();
            obs.acknowledgedBy     := ?u.employeeId;
            if (obs.status == #Open) {
              obs.status := #UnderReview;
            };
            ohjAddAudit(u.employeeId, u.fullName, u.role, "Observations", #Updated, obsNumber, "Observation acknowledged by " # u.fullName);
            #ok(());
          };
        };
      };
    };
  };

  /// Safety Officer closes an observation (only if no pending CAPA).
  public func closeObservation(token : Text, obsNumber : Text) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not ohjIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer only");
        switch (observations.find(func(obs) { obs.obsNumber == obsNumber })) {
          case (null) { #err("Observation not found") };
          case (?obs) {
            if (obs.status == #CAPAPending) {
              return #err("Cannot close: linked CAPA is still open");
            };
            obs.status   := #Closed;
            ohjAddAudit(u.employeeId, u.fullName, u.role, "Observations", #Closed_, obsNumber, "Observation closed");
            #ok(());
          };
        };
      };
    };
  };

  // ──────────────────────────────────────────
  // BBS STATS
  // ──────────────────────────────────────────

  /// Live BBS stats from observations data.
  public query func getBbsStats(token : Text) : async CT.Result<{
    total  : Nat;
    safe   : Nat;
    unsafe : Nat;
    score  : Nat;
    byDept : [(Text, Nat)];
  }> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let allObs = observations.toArray();
        let total  = allObs.size();
        var safe_  = 0;
        var unsafe_ = 0;
        // dept -> count accumulator
        let deptMap = Map.empty<Text, Nat>();
        for (obs in allObs.values()) {
          if (OLib.isBbsObsUnsafe(obs.obsType)) {
            unsafe_ += 1;
          } else {
            safe_ += 1;
          };
          let prev = switch (deptMap.get(obs.department)) {
            case (?n) n;
            case null 0;
          };
          deptMap.add(obs.department, prev + 1);
        };
        let score = OLib.calcBbsScore(total, safe_);
        let byDept = deptMap.entries().map(func(entry) { (entry.0, entry.1) }).toArray();
        #ok({ total; safe = safe_; unsafe = unsafe_; score; byDept });
      };
    };
  };

  // ──────────────────────────────────────────
  // HIRA
  // ──────────────────────────────────────────

  /// Create a new HIRA record.
  public func createHIRA(token : Text, input : T2A.CreateHIRAInput) : async CT.Result<Text> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not ohjIsSafetyOfficerOrAdmin(u) and u.role != #HOD) {
          return #err("Access denied: Safety Officer or HOD only");
        };
        let year = 2026;
        ohj_state.nextHiraSeq += 1;
        let hiraNumber = OLib.generateHiraNumber(year, ohj_state.nextHiraSeq);
        let now = Time.now();
        let hira : T2A.HIRA = {
          hiraNumber;
          taskDescription  = input.taskDescription;
          location         = input.location;
          area             = "";
          department       = input.department;
          var hazards      = [var];
          var status       = #Draft;
          var approvalStep = 0;
          var hodEmpId     = null;
          var hodRemarks   = null;
          var hodAt        = null;
          var aicEmpId     = null;
          var aicRemarks   = null;
          var aicAt        = null;
          var soEmpId      = null;
          var soRemarks    = null;
          var soAt         = null;
          responsibleEmpId = input.responsibleEmpId;
          reviewDate       = input.reviewDate;
          var linkedPtwNumber = null;
          createdBy        = u.employeeId;
          createdAt        = now;
          var updatedAt    = now;
        };
        hiras.add(hira);
        ohjAddAudit(u.employeeId, u.fullName, u.role, "HIRA", #Created, hiraNumber, "HIRA created: " # hiraNumber);
        ignore ohjCcAdmin(
          "OHSE 360: New HIRA Created " # hiraNumber,
          "<p>HIRA <b>" # hiraNumber # "</b> created by " # u.fullName # " for task: " # input.taskDescription # ".</p>",
        );
        #ok(hiraNumber);
      };
    };
  };

  /// Submit a HIRA for approval (Draft → PendingHOD).
  public func submitHIRAForApproval(token : Text, hiraNumber : Text) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (hiras.find(func(h) { h.hiraNumber == hiraNumber })) {
          case (null) { #err("HIRA not found") };
          case (?hira) {
            if (hira.createdBy != u.employeeId and not ohjIsSafetyOfficerOrAdmin(u)) {
              return #err("Access denied");
            };
            if (hira.status != #Draft) return #err("HIRA is not in Draft status");
            hira.status      := #UnderReview;
            hira.approvalStep := 1;
            ohjAddAudit(u.employeeId, u.fullName, u.role, "HIRA", #Updated, hiraNumber, "HIRA submitted for HOD approval");
            // Notify HOD
            switch (findFirstHOD()) {
              case (?hod) {
                ohjPushNotif(hod.employeeId, "HIRA pending your review: " # hiraNumber, "/hira/" # hiraNumber);
                ignore EmailClient.sendServiceEmail(
                  "no-reply", [hod.email],
                  "OHSE 360: HIRA Pending Review",
                  "<p>HIRA <b>" # hiraNumber # "</b> is pending your review.</p>",
                );
                ignore ohjCcAdmin(
                  "OHSE 360: HIRA Pending Review",
                  "<p>HIRA <b>" # hiraNumber # "</b> is pending HOD review.</p>",
                );
              };
              case null {};
            };
            #ok(());
          };
        };
      };
    };
  };

  /// HOD / AIC / SO acts on a HIRA (approve or reject).
  public func actOnHIRA(token : Text, hiraNumber : Text, approve : Bool, remarks : Text) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (hiras.find(func(h) { h.hiraNumber == hiraNumber })) {
          case (null) { #err("HIRA not found") };
          case (?hira) {
            let now = Time.now();
            if (not approve) {
              // Rejection at any step — return to Draft
              hira.status       := #Draft;
              hira.approvalStep := 0;
              switch (u.role) {
                case (#HOD) { hira.hodRemarks := ?remarks; hira.hodEmpId := ?u.employeeId; hira.hodAt := ?now };
                case (#AreaInCharge) { hira.aicRemarks := ?remarks; hira.aicEmpId := ?u.employeeId; hira.aicAt := ?now };
                case (#SafetyOfficer or #SystemAdmin) { hira.soRemarks := ?remarks; hira.soEmpId := ?u.employeeId; hira.soAt := ?now };
                case (_) return #err("Access denied");
              };
              hira.updatedAt := now;
              ohjAddAudit(u.employeeId, u.fullName, u.role, "HIRA", #Rejected_, hiraNumber, "HIRA rejected by " # u.fullName # ": " # remarks);
              // Notify creator
              ohjPushNotif(hira.createdBy, "HIRA " # hiraNumber # " rejected by " # u.fullName, "/hira/" # hiraNumber);
              #ok(());
            } else {
              // Approval
              switch (hira.approvalStep) {
                case (1) {
                  // HOD step
                  if (u.role != #HOD and u.role != #SystemAdmin) return #err("HOD role required for step 1");
                  hira.hodRemarks   := ?remarks;
                  hira.hodEmpId     := ?u.employeeId;
                  hira.hodAt        := ?now;
                  hira.approvalStep := 2;
                  hira.updatedAt    := now;
                  // Notify AIC
                  switch (findFirstAIC()) {
                    case (?aic) {
                      ohjPushNotif(aic.employeeId, "HIRA pending your validation: " # hiraNumber, "/hira/" # hiraNumber);
                      ignore EmailClient.sendServiceEmail(
                        "no-reply", [aic.email],
                        "OHSE 360: HIRA Pending Validation",
                        "<p>HIRA <b>" # hiraNumber # "</b> is pending your validation.</p>",
                      );
                    };
                    case null {};
                  };
                  ohjAddAudit(u.employeeId, u.fullName, u.role, "HIRA", #Approved, hiraNumber, "HIRA approved by HOD");
                };
                case (2) {
                  // AIC step
                  if (u.role != #AreaInCharge and u.role != #SystemAdmin) return #err("Area In Charge role required for step 2");
                  hira.aicRemarks   := ?remarks;
                  hira.aicEmpId     := ?u.employeeId;
                  hira.aicAt        := ?now;
                  hira.approvalStep := 3;
                  hira.updatedAt    := now;
                  // Notify Safety Officers
                  notifyAllSafetyOfficers("HIRA pending final approval: " # hiraNumber, "/hira/" # hiraNumber);
                  ohjAddAudit(u.employeeId, u.fullName, u.role, "HIRA", #Approved, hiraNumber, "HIRA validated by Area In Charge");
                };
                case (3) {
                  // Safety Officer final approval
                  if (not ohjIsSafetyOfficerOrAdmin(u)) return #err("Safety Officer role required for step 3");
                  hira.soRemarks    := ?remarks;
                  hira.soEmpId      := ?u.employeeId;
                  hira.soAt         := ?now;
                  hira.status       := #Approved;
                  hira.approvalStep := 4;
                  hira.updatedAt    := now;
                  ohjAddAudit(u.employeeId, u.fullName, u.role, "HIRA", #Approved, hiraNumber, "HIRA finalized and approved by Safety Officer");
                  ignore ohjCcAdmin(
                    "OHSE 360: HIRA Approved " # hiraNumber,
                    "<p>HIRA <b>" # hiraNumber # "</b> has been fully approved.</p>",
                  );
                };
                case (_) return #err("HIRA is not pending approval");
              };
              #ok(());
            };
          };
        };
      };
    };
  };

  func toHiraView(h : T2A.HIRA) : T2A.HIRAView {
    {
      hiraNumber       = h.hiraNumber;
      taskDescription  = h.taskDescription;
      location         = h.location;
      area             = h.area;
      department       = h.department;
      hazards          = Array.tabulate(h.hazards.size(), func(i) { h.hazards[i] });
      status           = h.status;
      approvalStep     = h.approvalStep;
      hodEmpId         = h.hodEmpId;
      hodRemarks       = h.hodRemarks;
      hodAt            = h.hodAt;
      aicEmpId         = h.aicEmpId;
      aicRemarks       = h.aicRemarks;
      aicAt            = h.aicAt;
      soEmpId          = h.soEmpId;
      soRemarks        = h.soRemarks;
      soAt             = h.soAt;
      responsibleEmpId = h.responsibleEmpId;
      reviewDate       = h.reviewDate;
      linkedPtwNumber  = h.linkedPtwNumber;
      createdBy        = h.createdBy;
      createdAt        = h.createdAt;
      updatedAt        = h.updatedAt;
    }
  };

  /// List HIRAs — role-filtered.
  public query func listHIRAs(token : Text) : async CT.Result<[T2A.HIRAView]> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let filtered = hiras.values().filter(func(h) {
          switch (u.role) {
            case (#SystemAdmin or #SafetyOfficer) true;
            case (#HOD) h.department == u.department;
            case (_) h.createdBy == u.employeeId;
          };
        });
        #ok(filtered.map<T2A.HIRA, T2A.HIRAView>(func(h) { toHiraView(h) }).toArray());
      };
    };
  };

  /// Get a single HIRA by number.
  public query func getHIRA(token : Text, hiraNumber : Text) : async CT.Result<T2A.HIRAView> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (hiras.find(func(h) { h.hiraNumber == hiraNumber })) {
          case (null) { #err("HIRA not found") };
          case (?hira) {
            let canView = switch (u.role) {
              case (#SystemAdmin or #SafetyOfficer) true;
              case (#HOD) hira.department == u.department;
              case (_) hira.createdBy == u.employeeId;
            };
            if (not canView) return #err("Access denied");
            #ok(toHiraView(hira));
          };
        };
      };
    };
  };

  /// Add a hazard row to a HIRA (auto-calculates risk score and level).
  public func addHazardRow(
    token      : Text,
    hiraNumber : Text,
    rowId      : Text,
    hazardDescription : Text,
    hazardType : T2A.HazardType,
    likelihood : Nat,
    severity   : Nat,
    existingControls : Text,
    additionalControls : Text,
    residualRiskScore : Nat,
    responsibleEmpId : ?CT.EmployeeId,
  ) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (hiras.find(func(h) { h.hiraNumber == hiraNumber })) {
          case (null) { #err("HIRA not found") };
          case (?hira) {
            if (hira.createdBy != u.employeeId and not ohjIsSafetyOfficerOrAdmin(u)) {
              return #err("Access denied");
            };
            if (hira.status == #Approved) return #err("Cannot edit an approved HIRA");
            let riskScore = OLib.calcRiskScore(likelihood, severity);
            let riskLevel = OLib.calcRiskLevel(likelihood, severity);
            let newRow : T2A.HazardRow = {
              hazardId           = rowId;
              hazardDescription;
              hazardType;
              likelihood;
              severity;
              riskScore;
              riskLevel;
              existingControls;
              additionalControls;
              residualRiskScore;
              responsibleEmpId;
            };
            let old = Array.tabulate(hira.hazards.size(), func(i) { hira.hazards[i] });
            hira.hazards  := old.concat([newRow]).toVarArray();
            hira.updatedAt := Time.now();
            ohjAddAudit(u.employeeId, u.fullName, u.role, "HIRA", #Updated, hiraNumber, "Hazard row added to HIRA " # hiraNumber);
            #ok(());
          };
        };
      };
    };
  };

  // ──────────────────────────────────────────
  // JSA
  // ──────────────────────────────────────────

  /// Create a new JSA record.
  public func createJSA(token : Text, input : T2A.CreateJSAInput) : async CT.Result<Text> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not ohjIsSafetyOfficerOrAdmin(u) and u.role != #HOD) {
          return #err("Access denied: Safety Officer or HOD only");
        };
        let year = 2026;
        ohj_state.nextJsaSeq += 1;
        let jsaNumber = OLib.generateJsaNumber(year, ohj_state.nextJsaSeq);
        let now = Time.now();
        let jsa : T2A.JSA = {
          jsaNumber;
          jobTitle          = input.jobTitle;
          department        = input.department;
          area              = input.area;
          location          = input.location;
          analysisDate      = input.analysisDate;
          preparedBy        = u.employeeId;
          var reviewedBy    = null;
          var approvedBy    = null;
          var steps         = [var];
          helmetRequired    = input.helmetRequired;
          safetyShoes       = input.safetyShoes;
          gloves            = input.gloves;
          harness           = input.harness;
          faceShield        = input.faceShield;
          goggles           = input.goggles;
          respirator        = input.respirator;
          emergencyContacts = input.emergencyContacts;
          var briefingAttendees = [var];
          var linkedPtwNumber  = input.linkedPtwNumber;
          var status           = #Draft;
          var hodRemarks       = null;
          var hodAt            = null;
          var soRemarks        = null;
          var soAt             = null;
          createdAt            = now;
          var updatedAt        = now;
        };
        jsas.add(jsa);
        ohjAddAudit(u.employeeId, u.fullName, u.role, "JSA", #Created, jsaNumber, "JSA created: " # jsaNumber);
        ignore ohjCcAdmin(
          "OHSE 360: New JSA Created " # jsaNumber,
          "<p>JSA <b>" # jsaNumber # "</b> created by " # u.fullName # " for job: " # input.jobTitle # ".</p>",
        );
        #ok(jsaNumber);
      };
    };
  };

  /// Submit a JSA for approval (Draft → UnderReview, notify HOD).
  public func submitJSAForApproval(token : Text, jsaNumber : Text) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (jsas.find(func(j) { j.jsaNumber == jsaNumber })) {
          case (null) { #err("JSA not found") };
          case (?jsa) {
            if (jsa.preparedBy != u.employeeId and not ohjIsSafetyOfficerOrAdmin(u)) {
              return #err("Access denied");
            };
            if (jsa.status != #Draft) return #err("JSA is not in Draft status");
            jsa.status := #UnderReview;
            ohjAddAudit(u.employeeId, u.fullName, u.role, "JSA", #Updated, jsaNumber, "JSA submitted for approval");
            // Notify HOD
            switch (findFirstHOD()) {
              case (?hod) {
                ohjPushNotif(hod.employeeId, "JSA pending your review: " # jsaNumber, "/jsa/" # jsaNumber);
                ignore EmailClient.sendServiceEmail(
                  "no-reply", [hod.email],
                  "OHSE 360: JSA Pending Review",
                  "<p>JSA <b>" # jsaNumber # "</b> is pending your review.</p>",
                );
                ignore ohjCcAdmin(
                  "OHSE 360: JSA Pending Review",
                  "<p>JSA <b>" # jsaNumber # "</b> is pending HOD review.</p>",
                );
              };
              case null {};
            };
            #ok(());
          };
        };
      };
    };
  };

  /// HOD reviews / Safety Officer approves a JSA.
  public func actOnJSA(token : Text, jsaNumber : Text, approve : Bool, remarks : Text) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (jsas.find(func(j) { j.jsaNumber == jsaNumber })) {
          case (null) { #err("JSA not found") };
          case (?jsa) {
            if (jsa.status != #UnderReview and jsa.status != #Approved) {
              return #err("JSA is not pending action");
            };
            if (not approve) {
              jsa.status := #Draft;
              let now = Time.now();
              switch (u.role) {
                case (#HOD) { jsa.hodRemarks := ?remarks; jsa.hodAt := ?now };
                case (#SafetyOfficer or #SystemAdmin) { jsa.soRemarks := ?remarks; jsa.soAt := ?now };
                case (_) return #err("Access denied");
              };
              jsa.updatedAt := now;
              ohjAddAudit(u.employeeId, u.fullName, u.role, "JSA", #Rejected_, jsaNumber, "JSA rejected by " # u.fullName);
              ohjPushNotif(jsa.preparedBy, "JSA " # jsaNumber # " rejected by " # u.fullName, "/jsa/" # jsaNumber);
              #ok(());
            } else {
              let now2 = Time.now();
              switch (u.role) {
                case (#HOD) {
                  if (jsa.status != #UnderReview) return #err("Not at HOD review stage");
                  jsa.hodRemarks := ?remarks;
                  jsa.hodAt      := ?now2;
                  jsa.reviewedBy := ?u.employeeId;
                  jsa.updatedAt  := now2;
                  // Notify Safety Officers
                  notifyAllSafetyOfficers("JSA pending your approval: " # jsaNumber, "/jsa/" # jsaNumber);
                  ohjAddAudit(u.employeeId, u.fullName, u.role, "JSA", #Approved, jsaNumber, "JSA reviewed and passed by HOD");
                };
                case (#SafetyOfficer or #SystemAdmin) {
                  jsa.soRemarks  := ?remarks;
                  jsa.soAt       := ?now2;
                  jsa.approvedBy := ?u.employeeId;
                  jsa.status     := #Approved;
                  jsa.updatedAt  := now2;
                  ohjAddAudit(u.employeeId, u.fullName, u.role, "JSA", #Approved, jsaNumber, "JSA approved by Safety Officer");
                  ignore ohjCcAdmin(
                    "OHSE 360: JSA Approved " # jsaNumber,
                    "<p>JSA <b>" # jsaNumber # "</b> has been approved by " # u.fullName # ".</p>",
                  );
                };
                case (_) return #err("Access denied");
              };
              #ok(());
            };
          };
        };
      };
    };
  };

  func toJsaView(j : T2A.JSA) : T2A.JSAView {
    {
      jsaNumber         = j.jsaNumber;
      jobTitle          = j.jobTitle;
      department        = j.department;
      area              = j.area;
      location          = j.location;
      analysisDate      = j.analysisDate;
      preparedBy        = j.preparedBy;
      reviewedBy        = j.reviewedBy;
      approvedBy        = j.approvedBy;
      steps             = Array.tabulate(j.steps.size(), func(i) { j.steps[i] });
      helmetRequired    = j.helmetRequired;
      safetyShoes       = j.safetyShoes;
      gloves            = j.gloves;
      harness           = j.harness;
      faceShield        = j.faceShield;
      goggles           = j.goggles;
      respirator        = j.respirator;
      emergencyContacts = j.emergencyContacts;
      briefingAttendees = Array.tabulate(j.briefingAttendees.size(), func(i) { j.briefingAttendees[i] });
      linkedPtwNumber   = j.linkedPtwNumber;
      status            = j.status;
      hodRemarks        = j.hodRemarks;
      hodAt             = j.hodAt;
      soRemarks         = j.soRemarks;
      soAt              = j.soAt;
      createdAt         = j.createdAt;
      updatedAt         = j.updatedAt;
    }
  };

  /// List JSAs — role-filtered.
  public query func listJSAs(token : Text) : async CT.Result<[T2A.JSAView]> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let filtered = jsas.values().filter(func(j) {
          switch (u.role) {
            case (#SystemAdmin or #SafetyOfficer) true;
            case (#HOD) j.department == u.department;
            case (_) j.preparedBy == u.employeeId;
          };
        });
        #ok(filtered.map<T2A.JSA, T2A.JSAView>(func(j) { toJsaView(j) }).toArray());
      };
    };
  };

  /// Get a single JSA by number.
  public query func getJSA(token : Text, jsaNumber : Text) : async CT.Result<T2A.JSAView> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (jsas.find(func(j) { j.jsaNumber == jsaNumber })) {
          case (null) { #err("JSA not found") };
          case (?jsa) {
            let canView = switch (u.role) {
              case (#SystemAdmin or #SafetyOfficer) true;
              case (#HOD) jsa.department == u.department;
              case (_) jsa.preparedBy == u.employeeId;
            };
            if (not canView) return #err("Access denied");
            #ok(toJsaView(jsa));
          };
        };
      };
    };
  };

  /// Record JSA briefing attendees.
  public func recordJSABriefing(token : Text, jsaNumber : Text, attendeeIds : [CT.EmployeeId]) : async CT.Result<()> {
    switch (ohjRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not ohjIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer only");
        switch (jsas.find(func(j) { j.jsaNumber == jsaNumber })) {
          case (null) { #err("JSA not found") };
          case (?jsa) {
            let old = Array.tabulate(jsa.briefingAttendees.size(), func(i) { jsa.briefingAttendees[i] });
            jsa.briefingAttendees := old.concat(attendeeIds).toVarArray();
            jsa.updatedAt := Time.now();
            ohjAddAudit(u.employeeId, u.fullName, u.role, "JSA", #Updated, jsaNumber, "Briefing recorded for " # jsaNumber # " (" # attendeeIds.size().toText() # " attendees)");
            #ok(());
          };
        };
      };
    };
  };

};
