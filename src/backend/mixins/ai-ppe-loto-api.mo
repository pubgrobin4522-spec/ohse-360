import T2 "../types/phase2-capa-esg-ai-ppe-contractor";
import P2OHJ "../types/phase2-observations-hira-jsa";
import CT "../types/common";
import AT "../types/auth-users-employees";
import IT "../types/incidents-training-ptw";
import Lib "../lib/AiPpeLoto";
import AuthLib "../lib/AuthUsersEmployees";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
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
  // ── Phase 1 domain state (read-only for AI score calculation) ──
  incidents  : Map.Map<Text, IT.Incident>,
  capas      : List.List<IT.CAPA>,
  trainings  : Map.Map<Text, IT.Training>,
  // ── Phase 2 observations (for unsafe obs count) ──
  observations : List.List<P2OHJ.Observation>,
  // ── Phase 2 extended CAPAs (for overdue count) ──
  capa2s : List.List<T2.CAPA2>,
  // ── PPE, LOTO, Risk Score state ───────────────────────────
  ppeItems       : Map.Map<Text, T2.PPEItem>,
  ppeInventory   : Map.Map<Text, T2.PPEInventory>,
  ppeIssuances   : List.List<T2.PPEIssuance>,
  ppeInspections : List.List<T2.PPEInspection>,
  lotos          : Map.Map<Text, T2.LOTO>,
  riskScoreHistory : List.List<T2.RiskScoreEntry>,
  apl_state     : {
    var ppeSequence        : Nat;
    var lotoSequence       : Nat;
    var issuanceSequence   : Nat;
    var inspectionSequence : Nat;
    var riskScoreSeq       : Nat;
  },
) {

  // ─── Auth helpers ─────────────────────────────────────────
  func aplRequireAuth(token : Text) : CT.Result<AT.User> {
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

  func aplIsSafetyOfficerOrAdmin(u : AT.User) : Bool {
    u.role == #SafetyOfficer or u.role == #SystemAdmin or
    (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null);
  };

  func aplAddAudit(
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

  func aplPushNotif(recipientId : CT.EmployeeId, message : Text, link : Text) {
    let id = state.nextNotifId;
    state.nextNotifId += 1;
    notifications.add(AuthLib.newNotification(id, recipientId, message, link));
  };

  func aplCcAdmin(subject : Text, body : Text) : async () {
    let ccAddr = state.systemAdminNotifyEmail;
    try {
      ignore await EmailClient.sendServiceEmail("no-reply", [ccAddr], subject, body);
    } catch (_) {
      let id = state.nextAuditId;
      state.nextAuditId += 1;
      auditLog.add(AuthLib.newAuditEntry(id, 0, "system", #SystemAdmin, "Email", #Created, ccAddr, "CC email failed: " # subject));
    };
  };

  func aplNotifySafetyOfficers(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      let isSO = aplIsSafetyOfficerOrAdmin(u);
      if (isSO and u.status == #Active) {
        aplPushNotif(u.employeeId, message, link);
      };
    };
  };

  // ─────────────────────────────────────────────────────────
  // PPE MANAGEMENT
  // ─────────────────────────────────────────────────────────

  /// Create a new PPE item in the master list.
  public func createPpeItem(token : Text, input : T2.CreatePPEItemInput) : async CT.Result<Text> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        let seq = apl_state.ppeSequence;
        apl_state.ppeSequence += 1;
        let itemId = Lib.generatePpeItemId(seq);
        let item : T2.PPEItem = {
          itemId;
          itemName        = input.itemName;
          itemType        = input.itemType;
          size            = input.size;
          standard        = input.standard;
          shelfLifeMonths = input.shelfLifeMonths;
          createdAt       = Time.now();
        };
        ppeItems.add(itemId, item);
        // Initialise inventory record with zero stock
        let inv : T2.PPEInventory = {
          itemId;
          var quantityInStock = 0;
          minStockLevel       = 0;
          var lastUpdated     = Time.now();
        };
        ppeInventory.add(itemId, inv);
        aplAddAudit(u.employeeId, u.fullName, u.role, "PPE", #Created, itemId, "PPE item created: " # input.itemName);
        #ok(itemId);
      };
    };
  };

  /// List all PPE items.
  public query func listPpeItems(token : Text) : async CT.Result<[T2.PPEItem]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        #ok(ppeItems.values().toArray());
      };
    };
  };

  /// Update PPE inventory quantity (delta) and minimum level.
  public func updatePpeInventory(token : Text, itemId : Text, quantityDelta : Int, minLevel : Nat) : async CT.Result<()> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        switch (ppeInventory.get(itemId)) {
          case (null) { #err("PPE item not found") };
          case (?inv) {
            let newQty : Int = inv.quantityInStock + quantityDelta;
            inv.quantityInStock := if (newQty < 0) 0 else newQty;
            inv.lastUpdated := Time.now();
            aplAddAudit(u.employeeId, u.fullName, u.role, "PPE", #Updated, itemId,
              "Inventory updated. New qty: " # inv.quantityInStock.toText());
            if (inv.quantityInStock <= minLevel.toInt()) {
              let itemName = switch (ppeItems.get(itemId)) { case (?it) it.itemName; case null itemId };
              aplNotifySafetyOfficers("PPE low stock: " # itemName, "/ppe");
              ignore aplCcAdmin(
                "OHSE 360: PPE Low Stock - " # itemName,
                "<p>PPE item <b>" # itemName # "</b> stock has dropped to " # inv.quantityInStock.toText() # ", below minimum " # minLevel.toText() # ".</p>",
              );
            };
            #ok(());
          };
        };
      };
    };
  };

  /// Issue PPE to an employee.
  public func issuePpe(
    token      : Text,
    employeeId : Nat,
    itemId     : Text,
    size       : Text,
    quantity   : Nat,
    condition  : T2.PPEConditionIssue,
  ) : async CT.Result<Text> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        switch (ppeInventory.get(itemId)) {
          case (null) { #err("PPE item not in inventory") };
          case (?inv) {
            if (inv.quantityInStock < quantity.toInt()) return #err("Insufficient stock");
            inv.quantityInStock -= quantity.toInt();
            inv.lastUpdated := Time.now();
            let seq = apl_state.issuanceSequence;
            apl_state.issuanceSequence += 1;
            let issuanceId = Lib.generateIssuanceId(seq);
            let iss : T2.PPEIssuance = {
              issuanceId; employeeId; itemId; size; quantity;
              issueDate = Lib.currentMonthLabel();
              condition;
              createdAt = Time.now();
            };
            ppeIssuances.add(iss);
            aplAddAudit(u.employeeId, u.fullName, u.role, "PPE", #Created, issuanceId,
              "PPE issued to employee " # employeeId.toText() # ": " # itemId # " x" # quantity.toText());
            // Low stock alert after issuance
            if (inv.quantityInStock <= 0) {
              let itemName = switch (ppeItems.get(itemId)) { case (?it) it.itemName; case null itemId };
              aplNotifySafetyOfficers("PPE low stock after issuance: " # itemName, "/ppe");
              ignore aplCcAdmin(
                "OHSE 360: PPE Low Stock - " # itemName,
                "<p>Stock for PPE item <b>" # itemName # "</b> is now " # inv.quantityInStock.toText() # ".</p>",
              );
            };
            #ok(issuanceId);
          };
        };
      };
    };
  };

  /// Record a PPE inspection.
  public func recordPpeInspection(
    token          : Text,
    itemId         : Text,
    condition      : T2.PPEInspectionCondition,
    remarks        : Text,
    inspectionDate : Text,
  ) : async CT.Result<Text> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        if (ppeItems.get(itemId) == null) return #err("PPE item not found");
        let seq = apl_state.inspectionSequence;
        apl_state.inspectionSequence += 1;
        let inspId = Lib.generateInspectionId(seq);
        let insp : T2.PPEInspection = {
          inspectionId    = inspId;
          itemId;
          inspectorEmpId  = u.employeeId;
          inspectionDate;
          condition;
          remarks;
          createdAt       = Time.now();
        };
        ppeInspections.add(insp);
        aplAddAudit(u.employeeId, u.fullName, u.role, "PPE", #Updated, inspId,
          "PPE inspection recorded for " # itemId # ". Condition: " # debug_show(condition));
        if (condition == #Damaged or condition == #Replace) {
          let itemName = switch (ppeItems.get(itemId)) { case (?it) it.itemName; case null itemId };
          aplNotifySafetyOfficers("PPE " # debug_show(condition) # " flagged: " # itemName, "/ppe");
          ignore aplCcAdmin(
            "OHSE 360: PPE Inspection Alert - " # itemName,
            "<p>PPE item <b>" # itemName # "</b> has been marked as <b>" # debug_show(condition) # "</b> during inspection by employee " # u.employeeId.toText() # ".</p>",
          );
        };
        #ok(inspId);
      };
    };
  };

  /// List PPE issuances, optionally filtered by employee.
  public query func listPpeIssuances(token : Text, employeeId : ?Nat) : async CT.Result<[T2.PPEIssuance]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let filtered = ppeIssuances.values().filter(func(iss : T2.PPEIssuance) : Bool {
          let empOk = switch (employeeId) { case (null) true; case (?eid) iss.employeeId == eid };
          let scopeOk = if (u.role == #Employee) { iss.employeeId == u.employeeId } else { true };
          empOk and scopeOk;
        });
        #ok(filtered.toArray());
      };
    };
  };

  /// Get inventory view for all PPE items.
  public query func listPpeInventory(token : Text) : async CT.Result<[T2.PPEInventoryView]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let views = ppeInventory.values().map(func(inv) {
          { itemId = inv.itemId; quantityInStock = inv.quantityInStock;
            minStockLevel = inv.minStockLevel; lastUpdated = inv.lastUpdated }
        }).toArray();
        #ok(views);
      };
    };
  };

  /// Get PPE statistics.
  public query func getPpeStats(token : Text) : async CT.Result<{
    complianceRate  : Nat;
    totalItems      : Nat;
    lowStockItems   : Nat;
    issuanceCount   : Nat;
  }> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let totalItems = ppeItems.size();
        var lowStockItems = 0;
        for ((_, inv) in ppeInventory.entries()) {
          if (inv.quantityInStock <= inv.minStockLevel.toInt()) lowStockItems += 1;
        };
        let issuanceCount = ppeIssuances.size();
        // Compliance: employees with at least one issued PPE item vs active employees
        let totalEmp = employees.values().filter(func(e : AT.Employee) : Bool { e.empStatus == #Active }).size();
        let empWithPpeSet = Set.empty<CT.EmployeeId>();
        for (iss in ppeIssuances.values()) {
          empWithPpeSet.add(iss.employeeId);
        };
        let complianceRate = Lib.calcPpeComplianceRate(totalEmp, empWithPpeSet.size());
        #ok({ complianceRate; totalItems; lowStockItems; issuanceCount });
      };
    };
  };

  // ─────────────────────────────────────────────────────────
  // LOTO
  // ─────────────────────────────────────────────────────────

  /// Create a new LOTO procedure (Draft status).
  public func createLoto(token : Text, input : T2.CreateLOTOInput) : async CT.Result<Text> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        let year = Lib.currentYear();
        let seq = apl_state.lotoSequence;
        apl_state.lotoSequence += 1;
        let lotoNumber = Lib.generateLotoNumber(year, seq);
        let loto : T2.LOTO = {
          lotoNumber;
          equipmentName           = input.equipmentName;
          tagNumber               = input.tagNumber;
          var energySources       = [var];
          var isolationPoints     = [var];
          var authorizedEmpIds    = [var];
          var procedureSteps      = [var];
          var lockRegister        = [var];
          workDescription         = input.workDescription;
          startDateTime           = input.startDateTime;
          var endDateTime         = null;
          var authorizedByEmpId   = null;
          var authorizedAt        = null;
          var reEnergizationChecklist = [var];
          var status              = #Draft;
          createdBy               = u.employeeId;
          createdAt               = Time.now();
          var updatedAt           = Time.now();
        };
        lotos.add(lotoNumber, loto);
        aplAddAudit(u.employeeId, u.fullName, u.role, "LOTO", #Created, lotoNumber,
          "LOTO created for equipment: " # input.equipmentName);
        #ok(lotoNumber);
      };
    };
  };

  /// Activate a LOTO (Draft → Active).
  public func activateLoto(token : Text, lotoNumber : Text) : async CT.Result<()> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        switch (lotos.get(lotoNumber)) {
          case (null) { #err("LOTO not found") };
          case (?loto) {
            if (loto.status != #Draft) return #err("Only Draft LOTOs can be activated");
            loto.status           := #Active;
            loto.authorizedByEmpId := ?u.employeeId;
            loto.authorizedAt     := ?Time.now();
            loto.updatedAt        := Time.now();
            aplAddAudit(u.employeeId, u.fullName, u.role, "LOTO", #Approved, lotoNumber,
              "LOTO activated for equipment: " # loto.equipmentName);
            aplNotifySafetyOfficers("LOTO " # lotoNumber # " activated for " # loto.equipmentName, "/loto/" # lotoNumber);
            ignore aplCcAdmin(
              "OHSE 360: LOTO Activated - " # lotoNumber,
              "<p>LOTO <b>" # lotoNumber # "</b> has been activated for equipment <b>" # loto.equipmentName # "</b> by employee " # u.employeeId.toText() # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Update lock status within a LOTO.
  public func updateLockStatus(
    token      : Text,
    lotoNumber : Text,
    lockNumber : Text,
    newStatus  : T2.LockEntryStatus,
  ) : async CT.Result<()> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (lotos.get(lotoNumber)) {
          case (null) { #err("LOTO not found") };
          case (?loto) {
            if (loto.status != #Active) return #err("LOTO is not Active");
            let isAuthorized =
              (loto.authorizedEmpIds.find(func(eid : CT.EmployeeId) : Bool { eid == u.employeeId }) != null)
              or aplIsSafetyOfficerOrAdmin(u);
            if (not isAuthorized) return #err("Not authorized for this LOTO");
            var found = false;
            var i = 0;
            while (i < loto.lockRegister.size()) {
              if (loto.lockRegister[i].lockNumber == lockNumber) {
                loto.lockRegister[i].status := newStatus;
                found := true;
              };
              i += 1;
            };
            if (not found) return #err("Lock number not found in LOTO");
            loto.updatedAt := Time.now();
            aplAddAudit(u.employeeId, u.fullName, u.role, "LOTO", #Updated, lotoNumber,
              "Lock " # lockNumber # " status updated to " # debug_show(newStatus));
            #ok(());
          };
        };
      };
    };
  };

  /// Complete a LOTO (all locks must be Removed).
  public func completeLoto(token : Text, lotoNumber : Text) : async CT.Result<()> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        switch (lotos.get(lotoNumber)) {
          case (null) { #err("LOTO not found") };
          case (?loto) {
            if (loto.status != #Active) return #err("Only Active LOTOs can be completed");
            // Verify all locks removed
            let allRemoved = loto.lockRegister.all(func(le : T2.LockEntry) : Bool { le.status == #Removed });
            if (not allRemoved) return #err("All locks must be Removed before completing LOTO");
            loto.status    := #Completed;
            loto.endDateTime := ?Time.now();
            loto.updatedAt := Time.now();
            aplAddAudit(u.employeeId, u.fullName, u.role, "LOTO", #Closed_, lotoNumber,
              "LOTO completed for equipment: " # loto.equipmentName);
            ignore aplCcAdmin(
              "OHSE 360: LOTO Completed - " # lotoNumber,
              "<p>LOTO <b>" # lotoNumber # "</b> for equipment <b>" # loto.equipmentName # "</b> has been completed by employee " # u.employeeId.toText() # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Cancel a LOTO with reason.
  public func cancelLoto(token : Text, lotoNumber : Text, reason : Text) : async CT.Result<()> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");
        switch (lotos.get(lotoNumber)) {
          case (null) { #err("LOTO not found") };
          case (?loto) {
            if (loto.status == #Completed or loto.status == #Cancelled) {
              return #err("LOTO is already " # debug_show(loto.status));
            };
            loto.status    := #Cancelled;
            loto.updatedAt := Time.now();
            aplAddAudit(u.employeeId, u.fullName, u.role, "LOTO", #Closed_, lotoNumber,
              "LOTO cancelled. Reason: " # reason);
            #ok(());
          };
        };
      };
    };
  };

  /// List all LOTOs.
  public query func listLotos(token : Text) : async CT.Result<[T2.LOTOView]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let views = lotos.values().map(func(l) { toLOTOView(l) }).toArray();
        #ok(views);
      };
    };
  };

  /// Get a single LOTO.
  public query func getLoto(token : Text, lotoNumber : Text) : async CT.Result<T2.LOTOView> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (lotos.get(lotoNumber)) {
          case (null) { #err("LOTO not found") };
          case (?l) { #ok(toLOTOView(l)) };
        };
      };
    };
  };

  /// Get LOTO statistics.
  public query func getLotoStats(token : Text) : async CT.Result<{ active : Nat; completedThisMonth : Nat; overdue : Nat }> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let now = Time.now();
        // Approximate month start: 30 days ago
        let monthStart : Int = now - 2_592_000_000_000_000;
        var active = 0;
        var completedThisMonth = 0;
        var overdue = 0;
        for ((_, l) in lotos.entries()) {
          switch (l.status) {
            case (#Active) {
              active += 1;
              // Overdue: active and authorizedAt was more than 48h ago
              let authorized : Int = switch (l.authorizedAt) { case (?t) t; case null 0 };
              if (authorized > 0 and now - authorized > 172_800_000_000_000) overdue += 1;
            };
            case (#Completed) {
              let endTs : Int = switch (l.endDateTime) { case (?t) t; case null 0 };
              if (endTs >= monthStart) completedThisMonth += 1;
            };
            case (_) {};
          };
        };
        #ok({ active; completedThisMonth; overdue });
      };
    };
  };

  // ─────────────────────────────────────────────────────────
  // AI RISK SCORING
  // ─────────────────────────────────────────────────────────

  /// Calculate the current site risk score from live data.
  public func calculateRiskScore(token : Text) : async CT.Result<T2.RiskScoreView> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");

        let now = Time.now();
        let thirtyDaysNs : Int = 30 * 86_400_000_000_000;
        let thirtyDaysAgo : Int = now - thirtyDaysNs;

        // Near misses in last 30 days
        var nearMissCount = 0;
        for ((_, inc) in incidents.entries()) {
          if (inc.incidentType == #NearMiss and inc.createdAt >= thirtyDaysAgo) {
            nearMissCount += 1;
          };
        };

        // Unsafe acts & conditions from observations
        var unsafeObsCount = 0;
        for (obs in observations.values()) {
          switch (obs.obsType) {
            case (#UnsafeAct or #UnsafeCondition) { unsafeObsCount += 1 };
            case (_) {};
          };
        };

        // Training gap: employees with expired training
        var trainingGapCount = 0;
        for ((_, trn) in trainings.entries()) {
          var idx = 0;
          while (idx < trn.attendees.size()) {
            switch (trn.attendees[idx].certStatus) {
              case (?#Expired) { trainingGapCount += 1 };
              case (_) {};
            };
            idx += 1;
          };
        };

        // Overdue CAPAs (Phase 2 extended)
        var overdueCapaCount = 0;
        for (capa in capa2s.values()) {
          if (capa.status == #Overdue or capa.isOverdue) overdueCapaCount += 1;
        };
        // Also count Phase 1 CAPAs
        for (c in capas.values()) {
          if (c.status == #Overdue) overdueCapaCount += 1;
        };

        // Open High/Critical incidents
        var openHighCriticalInc = 0;
        for ((_, inc) in incidents.entries()) {
          let isOpen = inc.status == #Open or inc.status == #UnderInvestigation or inc.status == #CAPAPending;
          let isHighCrit = inc.severity == #High or inc.severity == #Critical;
          if (isOpen and isHighCrit) openHighCriticalInc += 1;
        };

        // Compute score
        let score = Lib.calcRiskScore(
          nearMissCount, unsafeObsCount, trainingGapCount,
          overdueCapaCount, openHighCriticalInc,
        );
        let riskLevel : P2OHJ.RiskLevel = (
          if (score <= 40)      #Low
          else if (score <= 60) #Medium
          else if (score <= 80) #High
          else                  #Critical
        );

        // Build department scores (simplified: all depts get same overall score here)
        let entry : T2.RiskScoreEntry = {
          overallScore              = score;
          riskLevel;
          nearMissCount;
          unsafeObsCount;
          trainingGapCount;
          overdueCAPACount          = overdueCapaCount;
          openHighCriticalIncidents = openHighCriticalInc;
          var departmentScores      = [var];
          calculatedAt              = now;
          calculatedBy              = u.fullName;
        };
        riskScoreHistory.add(entry);

        aplAddAudit(u.employeeId, u.fullName, u.role, "AIRisk", #Created,
          "RISK-" # apl_state.riskScoreSeq.toText(),
          "Risk score: " # score.toText() # " (" # Lib.getRiskLevel(score) # "). " #
          "NearMiss=" # nearMissCount.toText() # " UnsafeObs=" # unsafeObsCount.toText() #
          " TrainingGap=" # trainingGapCount.toText() # " OverdueCAPAs=" # overdueCapaCount.toText() #
          " OpenHighCrit=" # openHighCriticalInc.toText());
        apl_state.riskScoreSeq += 1;

        // Alerts
        if (score > 80) {
          aplNotifySafetyOfficers("CRITICAL Risk Alert! Site risk score is " # score.toText() # "/100", "/ai-risk");
          ignore aplCcAdmin(
            "OHSE 360: CRITICAL Risk Score Alert - " # score.toText() # "/100",
            "<p><b>Critical risk level reached.</b> Current site risk score: <b>" # score.toText() # "/100</b>. Immediate action required.</p>",
          );
        } else if (score > 60) {
          aplNotifySafetyOfficers("High Risk Alert: Site risk score is " # score.toText() # "/100", "/ai-risk");
          ignore aplCcAdmin(
            "OHSE 360: High Risk Score Alert - " # score.toText() # "/100",
            "<p>Site risk score has reached <b>" # score.toText() # "/100</b> (High level). Review risk drivers.</p>",
          );
        };

        #ok(toRiskScoreView(entry));
      };
    };
  };

  /// Get the last 6 risk score entries.
  public query func getRiskScoreHistory(token : Text) : async CT.Result<[T2.RiskScoreView]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let arr = riskScoreHistory.toArray();
        let start = if (arr.size() > 6) { arr.size() - 6 : Nat } else 0;
        let len   = if (arr.size() > start) { arr.size() - start : Nat } else 0;
        let slice = Array.tabulate(len, func(i) { arr[start + i] });
        #ok(slice.map<T2.RiskScoreEntry, T2.RiskScoreView>(func(e) { toRiskScoreView(e) }));
      };
    };
  };

  /// Get risk score trend as [(monthLabel, score)] for last 6 entries.
  public query func getRiskScoreTrend(token : Text) : async CT.Result<[(Text, Nat)]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let arr = riskScoreHistory.toArray();
        let start = if (arr.size() > 6) { arr.size() - 6 : Nat } else 0;
        let len   = if (arr.size() > start) { arr.size() - start : Nat } else 0;
        let slice = Array.tabulate(len, func(i) { arr[start + i] });
        #ok(slice.map<T2.RiskScoreEntry, (Text, Nat)>(func(e) { (e.calculatedBy, e.overallScore) }));
      };
    };
  };

  /// Get department-level risk breakdown.
  public query func getDeptRiskBreakdown(token : Text) : async CT.Result<[(Text, Nat, Text)]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let deptMap = Map.empty<Text, { var nearMiss : Nat; var unsafeObs : Nat; var trainingGap : Nat; var overdueCapa : Nat; var highCritInc : Nat }>();
        for ((_, e) in employees.entries()) {
          switch (deptMap.get(e.department)) {
            case (null) {
              deptMap.add(e.department, { var nearMiss = 0; var unsafeObs = 0; var trainingGap = 0; var overdueCapa = 0; var highCritInc = 0 });
            };
            case (_) {};
          };
        };
        for ((_, inc) in incidents.entries()) {
          switch (deptMap.get(inc.department)) {
            case (null) {};
            case (?d) {
              if (inc.incidentType == #NearMiss) d.nearMiss += 1;
              let isOpen = inc.status == #Open or inc.status == #UnderInvestigation or inc.status == #CAPAPending;
              let isHighCrit = inc.severity == #High or inc.severity == #Critical;
              if (isOpen and isHighCrit) d.highCritInc += 1;
            };
          };
        };
        for (obs in observations.values()) {
          switch (deptMap.get(obs.department)) {
            case (null) {};
            case (?d) {
              switch (obs.obsType) {
                case (#UnsafeAct or #UnsafeCondition) { d.unsafeObs += 1 };
                case (_) {};
              };
            };
          };
        };
        for ((_, trn) in trainings.entries()) {
          switch (deptMap.get(trn.department)) {
            case (null) {};
            case (?d) {
              var idx = 0;
              while (idx < trn.attendees.size()) {
                switch (trn.attendees[idx].certStatus) {
                  case (?#Expired) { d.trainingGap += 1 };
                  case (_) {};
                };
                idx += 1;
              };
            };
          };
        };
        let result = deptMap.entries().map(func((dept, d)) {
          let score = Lib.calcRiskScore(d.nearMiss, d.unsafeObs, d.trainingGap, d.overdueCapa, d.highCritInc);
          (dept, score, Lib.getRiskLevel(score));
        }).toArray();
        #ok(result);
      };
    };
  };

  /// Generate top 3 risk driver recommendations.
  public query func getRiskRecommendations(token : Text) : async CT.Result<[{ driver : Text; recommendation : Text; severity : Text }]> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        var nearMissCount = 0;
        var unsafeObsCount = 0;
        var trainingGapCount = 0;
        var overdueCapaCount = 0;
        var openHighCriticalInc = 0;

        for ((_, inc) in incidents.entries()) {
          if (inc.incidentType == #NearMiss) nearMissCount += 1;
          let isOpen = inc.status == #Open or inc.status == #UnderInvestigation or inc.status == #CAPAPending;
          let isHighCrit = inc.severity == #High or inc.severity == #Critical;
          if (isOpen and isHighCrit) openHighCriticalInc += 1;
        };
        for (obs in observations.values()) {
          switch (obs.obsType) {
            case (#UnsafeAct or #UnsafeCondition) { unsafeObsCount += 1 };
            case (_) {};
          };
        };
        for ((_, trn) in trainings.entries()) {
          var idx = 0;
          while (idx < trn.attendees.size()) {
            switch (trn.attendees[idx].certStatus) {
              case (?#Expired) { trainingGapCount += 1 };
              case (_) {};
            };
            idx += 1;
          };
        };
        for (capa in capa2s.values()) {
          if (capa.status == #Overdue or capa.isOverdue) overdueCapaCount += 1;
        };
        for (c in capas.values()) {
          if (c.status == #Overdue) overdueCapaCount += 1;
        };

        let drivers = Lib.topRiskDrivers(nearMissCount, unsafeObsCount, trainingGapCount, overdueCapaCount, openHighCriticalInc);
        let top3Size = if (drivers.size() > 3) 3 else drivers.size();
        let top3 = Array.tabulate(top3Size, func(i) { drivers[i] });
        let recs = top3.map(func(d) {
          let rec = if (d.driver == "Near Miss Events") {
            "Increase near-miss reporting and walkthrough inspections to address root causes before they escalate."
          } else if (d.driver == "Unsafe Acts & Conditions") {
            "Conduct targeted BBS coaching sessions for departments with high unsafe act observations."
          } else if (d.driver == "Training Gaps") {
            "Training compliance has expired for " # trainingGapCount.toText() # " employees — schedule refresher training immediately."
          } else if (d.driver == "Overdue CAPAs") {
            overdueCapaCount.toText() # " CAPAs are overdue — follow up with action owners and escalate if needed."
          } else {
            openHighCriticalInc.toText() # " High/Critical incidents are still open — prioritize investigation and closure."
          };
          let severity = if (d.weight >= 20) "Critical" else if (d.weight >= 10) "High" else "Medium";
          { driver = d.driver; recommendation = rec; severity };
        });
        #ok(recs);
      };
    };
  };

  /// Simple rule-based AI chatbot for risk queries.
  public query func answerRiskQuery(token : Text, question : Text) : async CT.Result<Text> {
    switch (aplRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (not aplIsSafetyOfficerOrAdmin(u)) return #err("Access denied: Safety Officer required");

        let q = question.toLower();

        var nearMissCount = 0;
        var openCAPAs = 0;
        var latestScore : Nat = 0;
        var latestLevel = "No score calculated yet";

        for ((_, inc) in incidents.entries()) {
          if (inc.incidentType == #NearMiss) nearMissCount += 1;
        };
        for (c in capas.values()) {
          if (c.status == #Open or c.status == #InProgress) openCAPAs += 1;
        };
        for (c2 in capa2s.values()) {
          if (c2.status == #Open or c2.status == #InProgress) openCAPAs += 1;
        };
        // Latest risk score
        switch (riskScoreHistory.last()) {
          case (?entry) {
            latestScore := entry.overallScore;
            latestLevel := Lib.getRiskLevel(entry.overallScore);
          };
          case null {};
        };

        // Find highest risk department from incidents
        let deptIncMap = Map.empty<Text, Nat>();
        for ((_, inc) in incidents.entries()) {
          switch (deptIncMap.get(inc.department)) {
            case (null) { deptIncMap.add(inc.department, 1) };
            case (?cnt) { deptIncMap.add(inc.department, cnt + 1) };
          };
        };
        var highestDept = "N/A";
        var highestCount = 0;
        for ((dept, cnt) in deptIncMap.entries()) {
          if (cnt > highestCount) {
            highestCount := cnt;
            highestDept  := dept;
          };
        };

        let answer = if (q.contains(#text "highest risk department") or q.contains(#text "risk department")) {
          "The highest risk department is " # highestDept # " with " # highestCount.toText() # " incidents recorded."
        } else if (q.contains(#text "open capa") or q.contains(#text "overdue capa") or q.contains(#text "how many capa")) {
          "There are currently " # openCAPAs.toText() # " open/in-progress CAPAs."
        } else if (q.contains(#text "risk score") or q.contains(#text "current risk")) {
          if (latestScore == 0 and latestLevel == "No score calculated yet") {
            "No risk score has been calculated yet. Use the Calculate Risk Score function to generate one."
          } else {
            "The current site risk score is " # latestScore.toText() # "/100 (" # latestLevel # ")."
          }
        } else if (q.contains(#text "near miss") or q.contains(#text "near-miss")) {
          "There have been " # nearMissCount.toText() # " near-miss events recorded in the system."
        } else if (q.contains(#text "total incident") or q.contains(#text "how many incident")) {
          "There are " # incidents.size().toText() # " total incidents recorded in the system."
        } else {
          "I can answer questions about: risk score, highest risk department, open CAPAs, near miss events, and total incidents. Please rephrase your question."
        };

        #ok(answer);
      };
    };
  };

  // ─────────────────────────────────────────────────────────
  // INTERNAL VIEW CONVERTERS
  // ─────────────────────────────────────────────────────────

  func toLOTOView(l : T2.LOTO) : T2.LOTOView {
    {
      lotoNumber              = l.lotoNumber;
      equipmentName           = l.equipmentName;
      tagNumber               = l.tagNumber;
      energySources           = Array.tabulate(l.energySources.size(), func(i) { l.energySources[i] });
      isolationPoints         = Array.tabulate(l.isolationPoints.size(), func(i) {
        let p = l.isolationPoints[i];
        { pointId = p.pointId; location = p.location; lockNumber = p.lockNumber; status = p.status } : T2.IsolationPoint
      });
      authorizedEmpIds        = Array.tabulate(l.authorizedEmpIds.size(), func(i) { l.authorizedEmpIds[i] });
      procedureSteps          = Array.tabulate(l.procedureSteps.size(), func(i) { l.procedureSteps[i] });
      lockRegister            = Array.tabulate(l.lockRegister.size(), func(i) {
        let le = l.lockRegister[i];
        { lockNumber = le.lockNumber; assignedEmpId = le.assignedEmpId; status = le.status } : T2.LockEntryView
      });
      workDescription         = l.workDescription;
      startDateTime           = l.startDateTime;
      endDateTime             = l.endDateTime;
      authorizedByEmpId       = l.authorizedByEmpId;
      authorizedAt            = l.authorizedAt;
      reEnergizationChecklist = Array.tabulate(l.reEnergizationChecklist.size(), func(i) { l.reEnergizationChecklist[i] });
      status                  = l.status;
      createdBy               = l.createdBy;
      createdAt               = l.createdAt;
      updatedAt               = l.updatedAt;
    };
  };

  func toRiskScoreView(e : T2.RiskScoreEntry) : T2.RiskScoreView {
    {
      overallScore              = e.overallScore;
      riskLevel                 = e.riskLevel;
      nearMissCount             = e.nearMissCount;
      unsafeObsCount            = e.unsafeObsCount;
      trainingGapCount          = e.trainingGapCount;
      overdueCAPACount          = e.overdueCAPACount;
      openHighCriticalIncidents = e.openHighCriticalIncidents;
      departmentScores          = Array.tabulate(e.departmentScores.size(), func(i) { e.departmentScores[i] });
      calculatedAt              = e.calculatedAt;
      calculatedBy              = e.calculatedBy;
    };
  };

};
