import CT "../types/common";
import AT "../types/auth-users-employees";
import IT "../types/incidents-training-ptw";
import T2 "../types/phase2-capa-esg-ai-ppe-contractor";
import AuthLib "../lib/AuthUsersEmployees";
import ConLib "../lib/ContractorPtwExt";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";
import EmailClient "mo:caffeineai-email/emailClient";
import Iter "mo:core/Iter";

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
  // ── phase-1 PTW state (read access for extension operations) ──
  ptws          : Map.Map<Text, IT.PermitToWork>,
  // ── domain state ────────────────────────────────────────────
  ptwExtensions : Map.Map<Text, T2.PTWExtension>,
) {

  // ─── Auth helpers ─────────────────────────────────────────
  func extRequireAuth(token : Text) : CT.Result<AT.User> {
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

  func extAddAudit(
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

  func extPushNotif(recipientId : CT.EmployeeId, message : Text, link : Text) {
    let id = state.nextNotifId;
    state.nextNotifId += 1;
    notifications.add(AuthLib.newNotification(id, recipientId, message, link));
  };

  func extCcAdmin(subject : Text, body : Text) : async () {
    let ccAddr = state.systemAdminNotifyEmail;
    try {
      ignore await EmailClient.sendServiceEmail("no-reply", [ccAddr], subject, body);
    } catch (_) {
      let id = state.nextAuditId;
      state.nextAuditId += 1;
      auditLog.add(AuthLib.newAuditEntry(id, 0, "system", #SystemAdmin, "Email", #Created, ccAddr, "CC email failed: " # subject));
    };
  };

  func notifySafetyOfficersExt(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      let isSO = u.role == #SafetyOfficer or
        (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null);
      if (isSO and u.status == #Active) {
        extPushNotif(u.employeeId, message, link);
      };
    };
  };

  // ─── View converter ─────────────────────────────────────────
  func toPTWExtView(e : T2.PTWExtension) : T2.PTWExtensionView {
    {
      permitNumber           = e.permitNumber;
      linkedJsaNumber        = e.linkedJsaNumber;
      linkedHiraNumber       = e.linkedHiraNumber;
      requiresLOTO           = e.requiresLOTO;
      gasTestO2              = e.gasTestO2;
      gasTestLEL             = e.gasTestLEL;
      gasTestH2S             = e.gasTestH2S;
      gasTestCO              = e.gasTestCO;
      gasTestPassed          = e.gasTestPassed;
      toolboxTalkDone        = e.toolboxTalkDone;
      toolboxAttendees       = e.toolboxAttendees;
      emergencyRescuePlan    = e.emergencyRescuePlan;
      emergencyRescueDesc    = e.emergencyRescueDesc;
      extensions             = e.extensions;
      isCancelled            = e.isCancelled;
      cancellationReason     = e.cancellationReason;
      cancelledBy            = e.cancelledBy;
      cancelledAt            = e.cancelledAt;
      createdAt              = e.createdAt;
    };
  };

  // ──────────────────────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────────────────────

  /// Create or replace a PTW extension record for a permit.
  public func createOrUpdatePtwExtension(
    token     : Text,
    permitNumber : Text,
    ext       : T2.PTWExtension,
  ) : async CT.Result<()> {
    switch (extRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        // Must be an approver or the requester
        let permitted = u.role == #HOD or u.role == #AreaInCharge or
          u.role == #SafetyOfficer or u.role == #SystemAdmin or
          (switch (ptws.get(permitNumber)) {
            case (null) false;
            case (?p)   p.createdBy == u.employeeId;
          });
        if (not permitted) return #err("Access denied");
        let isNew = switch (ptwExtensions.get(permitNumber)) { case (null) true; case (_) false };
        ptwExtensions.add(permitNumber, ext);
        extAddAudit(u.employeeId, u.fullName, u.role, "PTW",
          if (isNew) #Created else #Updated,
          permitNumber, "PTW extension " # (if isNew "created" else "updated"));
        #ok(());
      };
    };
  };

  /// Get the PTW extension record for a permit.
  public query func getPtwExtension(token : Text, permitNumber : Text) : async CT.Result<?T2.PTWExtensionView> {
    switch (extRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (ptwExtensions.get(permitNumber)) {
          case (null) { #ok(null) };
          case (?e)   { #ok(?toPTWExtView(e)) };
        };
      };
    };
  };

  /// Record gas test readings for a confined-space permit.
  public func setPtwGasTest(
    token        : Text,
    permitNumber : Text,
    o2           : Float,
    lel          : Float,
    h2s          : Float,
    co           : Float,
  ) : async CT.Result<Bool> {
    switch (extRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #SystemAdmin;
        if (not allowed) return #err("Access denied: Safety Officer required");
        switch (ptwExtensions.get(permitNumber)) {
          case (null) { #err("PTW extension not found — create it first") };
          case (?e) {
            let ok = ConLib.gasTestPassed(o2, lel, h2s, co);
            let updGas = { e with
              gasTestO2     = ?o2;
              gasTestLEL    = ?lel;
              gasTestH2S    = ?h2s;
              gasTestCO     = ?co;
              gasTestPassed = ok;
            };
            ptwExtensions.add(permitNumber, updGas);
            extAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitNumber,
              "Gas test recorded — O2: " # debug_show(o2) # "% LEL: " # debug_show(lel) #
              "% H2S: " # debug_show(h2s) # "ppm CO: " # debug_show(co) # "ppm — " #
              (if ok "PASSED" else "FAILED"));
            #ok(ok);
          };
        };
      };
    };
  };

  /// Record toolbox talk attendance before permit activation.
  public func recordToolboxTalk(
    token        : Text,
    permitNumber : Text,
    attendeeIds  : [CT.EmployeeId],
  ) : async CT.Result<()> {
    switch (extRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #SafetyOfficer or u.role == #SystemAdmin or u.role == #HOD;
        if (not allowed) return #err("Access denied");
        switch (ptwExtensions.get(permitNumber)) {
          case (null) { #err("PTW extension not found — create it first") };
          case (?e) {
            let attsArr = Array.tabulate(attendeeIds.size(), func(i) { attendeeIds[i] });
            let updTbx = { e with
              toolboxTalkDone  = true;
              toolboxAttendees = attsArr;
            };
            ptwExtensions.add(permitNumber, updTbx);
            extAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitNumber,
              "Toolbox talk recorded with " # attendeeIds.size().toText() # " attendees");
            #ok(());
          };
        };
      };
    };
  };

  /// Extend the end time of an active permit (Safety Officer only).
  public func extendPermit(
    token        : Text,
    permitNumber : Text,
    newEndTime   : CT.Timestamp,
    reason       : Text,
  ) : async CT.Result<()> {
    switch (extRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin)
          return #err("Access denied: Safety Officer required");
        switch (ptws.get(permitNumber)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            switch (ptwExtensions.get(permitNumber)) {
              case (null) { #err("PTW extension not found — create it first") };
              case (?e) {
                let now    = Time.now();
                let extRec : T2.PermitExtension = {
                  extendedBy      = u.employeeId;
                  originalEndTime = now; // Use current time as original reference
                  newEndTime;
                  reason;
                  extendedAt      = now;
                };
                let old  = Array.tabulate(e.extensions.size(), func(i) { e.extensions[i] });
                let updExt = { e with extensions = old.concat([extRec]) };
                ptwExtensions.add(permitNumber, updExt);
                extAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitNumber,
                  "Permit extended to " # debug_show(newEndTime) # " — reason: " # reason);
                ignore extCcAdmin(
                  "OHSE 360: PTW Extended — " # permitNumber,
                  "<p>PTW <b>" # permitNumber # "</b> extended by " # u.fullName #
                  ".</p><p>Reason: " # reason # "</p>",
                );
                #ok(());
              };
            };
          };
        };
      };
    };
  };

  /// Cancel a permit. Any approver or Safety Officer.
  public func cancelPermit(
    token        : Text,
    permitNumber : Text,
    reason       : Text,
  ) : async CT.Result<()> {
    switch (extRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let allowed = u.role == #HOD or u.role == #AreaInCharge or
          u.role == #SafetyOfficer or u.role == #SystemAdmin;
        if (not allowed) return #err("Access denied: Approver or Safety Officer required");
        switch (ptws.get(permitNumber)) {
          case (null) { #err("Permit not found") };
          case (?ptw) {
            switch (ptwExtensions.get(permitNumber)) {
              case (null) { #err("PTW extension not found — create it first") };
              case (?e) {
                let now = Time.now();
                let updCan = { e with
                  isCancelled        = true;
                  cancellationReason = ?reason;
                  cancelledBy        = ?u.employeeId;
                  cancelledAt        = ?now;
                };
                ptwExtensions.add(permitNumber, updCan);
                // Notify requester
                extPushNotif(ptw.createdBy,
                  "PTW " # permitNumber # " has been CANCELLED by " # u.fullName # ": " # reason,
                  "/ptw/" # permitNumber);
                extAddAudit(u.employeeId, u.fullName, u.role, "PTW", #Updated, permitNumber,
                  "Permit CANCELLED — reason: " # reason);
                ignore extCcAdmin(
                  "OHSE 360: PTW CANCELLED — " # permitNumber,
                  "<p>PTW <b>" # permitNumber # "</b> was cancelled by " # u.fullName #
                  ".</p><p>Reason: " # reason # "</p>",
                );
                #ok(());
              };
            };
          };
        };
      };
    };
  };

  /// Dashboard stats: permits by type, avg cycle time, cancellations this month.
  public query func getPtwDashboardStats(token : Text) : async CT.Result<{
    byType           : [(Text, Nat)];
    avgCycleTimeDays : Float;
    cancelledThisMonth : Nat;
  }> {
    switch (extRequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        // Count by permit type
        let typeMap = Map.empty<Text, Nat>();
        var totalCycleDays : Float = 0.0;
        var closedCount = 0;
        // Approximate current month (ns)
        let NS_PER_DAY : Int = 86_400_000_000_000;
        let now = Time.now();
        let approxMonthStart : Int = now - (30 * NS_PER_DAY);
        var cancelledThisMonth = 0;

        for ((_, ptw) in ptws.entries()) {
          let typeKey = debug_show(ptw.permitType);
          let prev = switch (typeMap.get(typeKey)) { case (null) 0; case (?n) n };
          typeMap.add(typeKey, prev + 1);

          // Cycle time for closed permits
          switch (ptw.updatedAt) {
            case (_closed) {
              if (ptw.status == #Closed) {
                let diffDays : Float = (_closed - ptw.createdAt).toFloat() / NS_PER_DAY.toFloat();
                totalCycleDays += if (diffDays < 0.0) 0.0 else diffDays;
                closedCount += 1;
              };
            };
          };
        };

        // Cancelled this month from extensions
        for ((_, e) in ptwExtensions.entries()) {
          if (e.isCancelled) {
            switch (e.cancelledAt) {
              case (null) {};
              case (?at) {
                if (at >= approxMonthStart) { cancelledThisMonth += 1 };
              };
            };
          };
        };

        let avgCycle : Float = if (closedCount == 0) 0.0
          else totalCycleDays / closedCount.toFloat();

        let byType = typeMap.entries().toArray().map(func(kv) { kv });
        #ok({ byType; avgCycleTimeDays = avgCycle; cancelledThisMonth });
      };
    };
  };
};
