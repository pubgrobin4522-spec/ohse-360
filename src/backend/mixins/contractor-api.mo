import CT "../types/common";
import AT "../types/auth-users-employees";
import T2 "../types/phase2-capa-esg-ai-ppe-contractor";
import AuthLib "../lib/AuthUsersEmployees";
import ConLib "../lib/ContractorPtwExt";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import EmailClient "mo:caffeineai-email/emailClient";

mixin (
  // ── shared state from main actor ───────────────────────────
  users         : Map.Map<CT.EmployeeId, AT.User>,
  sessions      : Map.Map<Text, CT.EmployeeId>,
  auditLog      : List.List<AT.AuditEntry>,
  notifications : List.List<AT.Notification>,
  state         : {
    var nextAuditId  : Nat;
    var nextNotifId  : Nat;
    var systemAdminNotifyEmail : Text;
  },
  // ── domain state ────────────────────────────────────────────
  contractors          : Map.Map<Text, T2.Contractor>,
  con_state            : {
    var contractorSequence    : Nat;
    var inductionCertSequence : Nat;
  },
) {

  // ─── Auth helpers ─────────────────────────────────────────
  func conRequireAuth(token : Text) : CT.Result<AT.User> {
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

  func conAddAudit(
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

  func conPushNotif(recipientId : CT.EmployeeId, message : Text, link : Text) {
    let id = state.nextNotifId;
    state.nextNotifId += 1;
    notifications.add(AuthLib.newNotification(id, recipientId, message, link));
  };

  func conCcAdmin(subject : Text, body : Text) : async () {
    let ccAddr = state.systemAdminNotifyEmail;
    try {
      ignore await EmailClient.sendServiceEmail("no-reply", [ccAddr], subject, body);
    } catch (_) {
      let id = state.nextAuditId;
      state.nextAuditId += 1;
      auditLog.add(AuthLib.newAuditEntry(id, 0, "system", #SystemAdmin, "Email", #Created, ccAddr, "CC email failed: " # subject));
    };
  };

  func notifySafetyOfficersCon(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      let isSO = u.role == #SafetyOfficer or
        (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null);
      if (isSO and u.status == #Active) {
        conPushNotif(u.employeeId, message, link);
      };
    };
  };

  // ─── currentYear helper (ns → year) ──────────────────────
  let NS_PER_YEAR : Int = 31_557_600_000_000_000;
  func conCurrentYear() : Nat {
    let y = 1970 + Time.now() / NS_PER_YEAR;
    y.toNat();
  };

  // ─── View converters ────────────────────────────────────────
  func conToDocView(d : T2.ContractorDoc) : T2.ContractorDocView {
    { docType = d.docType; expiryDate = d.expiryDate;
      status = d.status; uploadedAt = d.uploadedAt };
  };

  func conToEmpView(e : T2.ContractorEmployee) : T2.ContractorEmployeeView {
    { empName = e.empName; idNumber = e.idNumber; trade = e.trade;
      inductionStatus = e.inductionStatus;
      inductionDate = e.inductionDate;
      certificateNumber = e.certificateNumber };
  };

  func conToContractorView(c : T2.Contractor) : T2.ContractorView {
    let docs = Array.tabulate(c.documents.size(), func(i) { conToDocView(c.documents[i]) });
    let emps = Array.tabulate(c.employees.size(), func(i) { conToEmpView(c.employees[i]) });
    let ptws = Array.tabulate(c.linkedPtwNumbers.size(), func(i) { c.linkedPtwNumbers[i] });
    {
      contractorId       = c.contractorId;
      companyName        = c.companyName;
      registrationNumber = c.registrationNumber;
      contactPerson      = c.contactPerson;
      email              = c.email;
      phone              = c.phone;
      typeOfWork         = c.typeOfWork;
      contractStartDate  = c.contractStartDate;
      contractEndDate    = c.contractEndDate;
      documents          = docs;
      employees          = emps;
      status             = c.status;
      linkedPtwNumbers   = ptws;
      performance        = c.performance;
      createdAt          = c.createdAt;
      updatedAt          = c.updatedAt;
    };
  };

  // ──────────────────────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────────────────────

  /// Create a new contractor company record.
  public func createContractor(token : Text, input : T2.CreateContractorInput) : async CT.Result<Text> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #ContractorAdmin or u.role == #SystemAdmin;
        if (not allowed) return #err("Access denied: Safety Officer, Contractor Admin, or System Admin required");
        let seq  = con_state.contractorSequence + 1;
        con_state.contractorSequence := seq;
        let cId  = ConLib.generateContractorId(conCurrentYear(), seq);
        let now  = Time.now();
        let c : T2.Contractor = {
          contractorId       = cId;
          companyName        = input.companyName;
          registrationNumber = input.registrationNumber;
          contactPerson      = input.contactPerson;
          email              = input.email;
          phone              = input.phone;
          typeOfWork         = input.typeOfWork;
          contractStartDate  = input.contractStartDate;
          contractEndDate    = input.contractEndDate;
          var documents      = [var];
          var employees      = [var];
          var status         = #Active;
          var linkedPtwNumbers = [var];
          var performance    = null;
          createdAt          = now;
          var updatedAt      = now;
        };
        contractors.add(cId, c);
        conAddAudit(u.employeeId, u.fullName, u.role, "Contractor", #Created, cId,
          "Contractor created: " # input.companyName);
        ignore conCcAdmin(
          "OHSE 360: New Contractor Registered " # cId,
          "<p>Contractor <b>" # input.companyName # "</b> (" # cId # ") has been registered.</p>",
        );
        #ok(cId);
      };
    };
  };

  /// Get a contractor by ID.
  public query func getContractor(token : Text, contractorId : Text) : async CT.Result<T2.ContractorView> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (contractors.get(contractorId)) {
          case (null) { #err("Contractor not found") };
          case (?c)   { #ok(conToContractorView(c)) };
        };
      };
    };
  };

  /// List all contractors. Contractor Admin sees only their company (matched by email).
  public query func listContractors(token : Text) : async CT.Result<[T2.ContractorView]> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let all = contractors.values().filter(func(c) {
          if (u.role == #ContractorAdmin) { c.email == u.email } else { true };
        });
        #ok(all.map<T2.Contractor, T2.ContractorView>(func(c) { conToContractorView(c) }).toArray());
      };
    };
  };

  /// Update contractor status (Safety Officer / System Admin).
  public func updateContractorStatus(
    token        : Text,
    contractorId : Text,
    status       : T2.ContractorStatus,
  ) : async CT.Result<()> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin)
          return #err("Access denied: Safety Officer or System Admin required");
        switch (contractors.get(contractorId)) {
          case (null) { #err("Contractor not found") };
          case (?c) {
            let prev = debug_show(c.status);
            c.status    := status;
            c.updatedAt := Time.now();
            conAddAudit(u.employeeId, u.fullName, u.role, "Contractor", #Updated, contractorId,
              "Status changed from " # prev # " to " # debug_show(status));
            #ok(());
          };
        };
      };
    };
  };

  /// Add or update a document for a contractor.
  public func addContractorDocument(
    token        : Text,
    contractorId : Text,
    docType      : Text,
    expiryDate   : Text,
  ) : async CT.Result<()> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #ContractorAdmin or u.role == #SystemAdmin;
        if (not allowed) return #err("Access denied");
        switch (contractors.get(contractorId)) {
          case (null) { #err("Contractor not found") };
          case (?c) {
            let now    = Time.now();
            let docStat = ConLib.getContractorDocStatus(expiryDate, now);
            let doc : T2.ContractorDoc = {
              docType; expiryDate; var status = docStat; uploadedAt = now;
            };
            // Append to documents array
            let oldDocs = Array.tabulate(c.documents.size(), func(i) { c.documents[i] });
            let newDocs = oldDocs.concat([doc]);
            c.documents := newDocs.toVarArray();
            c.updatedAt := now;
            conAddAudit(u.employeeId, u.fullName, u.role, "Contractor", #Created, contractorId,
              "Document uploaded: " # docType # " expiry: " # expiryDate);
            // Notify on expiring / expired docs
            if (docStat == #Expired) {
              notifySafetyOfficersCon(
                "Contractor " # c.companyName # " document EXPIRED: " # docType,
                "/contractors/" # contractorId,
              );
              ignore conCcAdmin(
                "OHSE 360: Contractor Document EXPIRED — " # c.companyName,
                "<p>Document <b>" # docType # "</b> for contractor " # c.companyName # " has <b>expired</b> (" # expiryDate # ").</p>",
              );
            } else if (docStat == #Expiring) {
              notifySafetyOfficersCon(
                "Contractor " # c.companyName # " document expiring soon: " # docType,
                "/contractors/" # contractorId,
              );
              ignore conCcAdmin(
                "OHSE 360: Contractor Document Expiring Soon — " # c.companyName,
                "<p>Document <b>" # docType # "</b> for contractor " # c.companyName # " is expiring on " # expiryDate # ".</p>",
              );
            };
            #ok(());
          };
        };
      };
    };
  };

  /// Refresh all document statuses against the current time.
  public func checkAndUpdateDocumentStatuses() : async () {
    let now = Time.now();
    for ((cId, c) in contractors.entries()) {
      var i = 0;
      var changed = false;
      while (i < c.documents.size()) {
        let newStat = ConLib.getContractorDocStatus(c.documents[i].expiryDate, now);
        if (c.documents[i].status != newStat) {
          c.documents[i].status := newStat;
          changed := true;
          if (newStat == #Expired) {
            notifySafetyOfficersCon(
              "Contractor document expired: " # c.documents[i].docType # " for " # c.companyName,
              "/contractors/" # cId,
            );
            ignore conCcAdmin(
              "OHSE 360: Contractor Document EXPIRED — " # c.companyName,
              "<p>Document <b>" # c.documents[i].docType # "</b> for " # c.companyName # " has expired.</p>",
            );
          } else if (newStat == #Expiring) {
            notifySafetyOfficersCon(
              "Contractor document expiring soon: " # c.documents[i].docType # " for " # c.companyName,
              "/contractors/" # cId,
            );
            ignore conCcAdmin(
              "OHSE 360: Contractor Document Expiring — " # c.companyName,
              "<p>Document <b>" # c.documents[i].docType # "</b> for " # c.companyName # " expires soon.</p>",
            );
          };
        };
        i += 1;
      };
      if (changed) { c.updatedAt := now };
    };
  };

  /// Add a contractor employee to a contractor company.
  public func addContractorEmployee(
    token        : Text,
    contractorId : Text,
    emp          : T2.ContractorEmployee,
  ) : async CT.Result<()> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #ContractorAdmin or u.role == #SystemAdmin;
        if (not allowed) return #err("Access denied");
        switch (contractors.get(contractorId)) {
          case (null) { #err("Contractor not found") };
          case (?c) {
            // Ensure induction status starts as Pending
            let empRec : T2.ContractorEmployee = {
              empName           = emp.empName;
              idNumber          = emp.idNumber;
              trade             = emp.trade;
              inductionStatus   = #Pending;
              inductionDate     = null;
              certificateNumber = null;
            };
            let oldEmps = Array.tabulate(c.employees.size(), func(i) { c.employees[i] });
            let newEmps = oldEmps.concat([empRec]);
            c.employees := newEmps.toVarArray();
            c.updatedAt := Time.now();
            conAddAudit(u.employeeId, u.fullName, u.role, "Contractor", #Created, contractorId,
              "Employee added: " # emp.empName # " (" # emp.idNumber # ")");
            #ok(());
          };
        };
      };
    };
  };

  /// Record induction result for a contractor employee.
  public func recordInduction(
    token        : Text,
    contractorId : Text,
    empIdNumber  : Text,
    passed       : Bool,
  ) : async CT.Result<Text> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #SystemAdmin;
        if (not allowed) return #err("Access denied: Safety Officer required");
        switch (contractors.get(contractorId)) {
          case (null) { #err("Contractor not found") };
          case (?c) {
            var found  = false;
            var certOut = "";
            var idx    = 0;
            while (idx < c.employees.size()) {
              if (c.employees[idx].idNumber == empIdNumber) {
                found := true;
                let now     = Time.now();
                let curEmp  = c.employees[idx];
                if (passed) {
                  let seq = con_state.inductionCertSequence + 1;
                  con_state.inductionCertSequence := seq;
                  let certNum = ConLib.generateInductionCertNumber(conCurrentYear(), seq);
                  c.employees[idx] := { curEmp with
                    inductionStatus   = #Pass;
                    inductionDate     = ?("Passed at " # now.toText());
                    certificateNumber = ?certNum;
                  };
                  certOut := certNum;
                } else {
                  c.employees[idx] := { curEmp with inductionStatus = #Fail };
                  // Notify on failure
                  notifySafetyOfficersCon(
                    "Contractor induction FAILED: " # curEmp.empName # " at " # c.companyName,
                    "/contractors/" # contractorId,
                  );
                  ignore conCcAdmin(
                    "OHSE 360: Contractor Induction FAILED — " # c.companyName,
                    "<p>Employee <b>" # curEmp.empName # "</b> (" # empIdNumber # ") failed induction at contractor " # c.companyName # ".</p>",
                  );
                };
              };
              idx += 1;
            };
            if (not found) return #err("Employee not found in contractor roster");
            c.updatedAt := Time.now();
            conAddAudit(u.employeeId, u.fullName, u.role, "Contractor",
              if (passed) #Updated else #Updated,
              contractorId,
              "Induction " # (if passed "PASSED" else "FAILED") # " for " # empIdNumber,
            );
            #ok(certOut);
          };
        };
      };
    };
  };

  /// Link a contractor to an active PTW.
  public func linkContractorToPtw(
    token        : Text,
    contractorId : Text,
    ptwNumber    : Text,
  ) : async CT.Result<()> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #SystemAdmin or u.role == #ContractorAdmin;
        if (not allowed) return #err("Access denied");
        switch (contractors.get(contractorId)) {
          case (null) { #err("Contractor not found") };
          case (?c) {
            let old  = Array.tabulate(c.linkedPtwNumbers.size(), func(i) { c.linkedPtwNumbers[i] });
            c.linkedPtwNumbers := old.concat([ptwNumber]).toVarArray();
            c.updatedAt := Time.now();
            conAddAudit(u.employeeId, u.fullName, u.role, "Contractor", #Updated, contractorId,
              "Linked to PTW: " # ptwNumber);
            #ok(());
          };
        };
      };
    };
  };

  /// Record contractor performance evaluation (Safety Officer).
  public func recordContractorPerformance(
    token        : Text,
    contractorId : Text,
    performance  : T2.ContractorPerformance,
  ) : async CT.Result<()> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin)
          return #err("Access denied: Safety Officer required");
        switch (contractors.get(contractorId)) {
          case (null) { #err("Contractor not found") };
          case (?c) {
            c.performance := ?performance;
            c.updatedAt   := Time.now();
            conAddAudit(u.employeeId, u.fullName, u.role, "Contractor", #Updated, contractorId,
              "Performance recorded: " # debug_show(performance.overallRating));
            #ok(());
          };
        };
      };
    };
  };

  /// Dashboard statistics for contractors.
  public query func getContractorStats(token : Text) : async CT.Result<{
    activeCount        : Nat;
    expiringDocs       : Nat;
    inductionCompliance : Nat;
    incidentCount      : Nat;
    performanceSummary : [(Text, Text)];
  }> {
    switch (conRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        var activeCount = 0;
        var expiringDocs = 0;
        var totalEmps = 0;
        var passedEmps = 0;
        var totalIncidents = 0;
        let summaryList = List.empty<(Text, Text)>();
        for ((_, c) in contractors.entries()) {
          if (c.status == #Active) { activeCount += 1 };
          // Expiring docs
          var di = 0;
          while (di < c.documents.size()) {
            if (c.documents[di].status == #Expiring or c.documents[di].status == #Expired) {
              expiringDocs += 1;
            };
            di += 1;
          };
          // Induction compliance
          var ei = 0;
          while (ei < c.employees.size()) {
            totalEmps += 1;
            if (c.employees[ei].inductionStatus == #Pass) { passedEmps += 1 };
            ei += 1;
          };
          // Performance incidents
          switch (c.performance) {
            case (null) {};
            case (?p) {
              totalIncidents += p.incidentCount;
              summaryList.add((c.companyName, debug_show(p.overallRating)));
            };
          };
        };
        #ok({
          activeCount;
          expiringDocs;
          inductionCompliance = ConLib.calcContractorInductionCompliance(totalEmps, passedEmps);
          incidentCount       = totalIncidents;
          performanceSummary  = summaryList.toArray();
        });
      };
    };
  };
};
