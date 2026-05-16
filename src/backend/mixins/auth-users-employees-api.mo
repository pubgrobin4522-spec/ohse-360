import T "../types/auth-users-employees";
import CT "../types/common";
import Lib "../lib/AuthUsersEmployees";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import EmailClient "mo:caffeineai-email/emailClient";

mixin (
  users : Map.Map<CT.EmployeeId, T.User>,
  sessions : Map.Map<Text, CT.EmployeeId>, // token -> employeeId
  employees : Map.Map<Text, T.Employee>,   // empCode -> Employee
  auditLog : List.List<T.AuditEntry>,
  notifications : List.List<T.Notification>,
  state : {
    var nextEmpSeq : Nat;
    var nextAuditId : Nat;
    var nextNotifId : Nat;
    adminEmail : Text;  // System Admin email for alerts
    var systemAdminNotifyEmail : Text;  // permanent CC recipient
  },
) {

  // ──────────────────────────────────────────
  // Internal helpers
  // ──────────────────────────────────────────
  let PROTECTED_ID : CT.EmployeeId = 230034;

  func requireAuth(token : Text) : CT.Result<T.User> {
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

  func isAdmin(u : T.User) : Bool {
    switch (u.role) { case (#SystemAdmin) true; case (_) false };
  };

  // Check if a role is (or includes) SystemAdmin — used for role-based access
  func hasRoleOrAdmin(u : T.User, checkRole : CT.Role) : Bool {
    if (u.role == #SystemAdmin) return true;
    u.role == checkRole;
  };

  // CC the system admin notify email after a primary email send.
  // Skips if primary recipient IS the notify email (no duplicate).
  // Fire-and-forget: on failure, logs to audit trail.
  func ccAdminNotify(primaryRecipient : Text, subject : Text, body : Text) : async () {
    let ccAddr = state.systemAdminNotifyEmail;
    if (primaryRecipient == ccAddr) return; // already the primary, skip
    try {
      ignore await EmailClient.sendServiceEmail("no-reply", [ccAddr], subject, body);
    } catch (e) {
      // Log failure to audit trail without blocking primary action
      let id = state.nextAuditId;
      state.nextAuditId += 1;
      auditLog.add(Lib.newAuditEntry(id, 0, "system", #SystemAdmin, "Email", #Created, ccAddr, "CC email failed: " # subject));
    };
  };

  func addAudit(
    actorId : CT.EmployeeId,
    actorName : Text,
    actorRole : CT.Role,
    module_ : Text,
    action : T.AuditAction,
    recordRef : Text,
    detail : Text,
  ) {
    let id = state.nextAuditId;
    state.nextAuditId += 1;
    auditLog.add(
      Lib.newAuditEntry(id, actorId, actorName, actorRole, module_, action, recordRef, detail)
    );
  };

  func pushNotif(recipientId : CT.EmployeeId, message : Text, link : Text) {
    let id = state.nextNotifId;
    state.nextNotifId += 1;
    notifications.add(Lib.newNotification(id, recipientId, message, link));
  };

  // ──────────────────────────────────────────
  // AUTH
  // ──────────────────────────────────────────

  /// Login with employee ID and password. Returns session token.
  public func login(employeeId : CT.EmployeeId, password : Text) : async CT.Result<{ token : Text; mustChangePassword : Bool }> {
    switch (users.get(employeeId)) {
      case (null) { #err("Invalid employee ID or password") };
      case (?u) {
        if (u.status == #Inactive) return #err("Account is deactivated");
        if (u.passwordHash != Lib.hashPassword(password)) {
          return #err("Invalid employee ID or password");
        };
        let now = Time.now();
        let token = Lib.genToken(employeeId, now);
        sessions.add(token, employeeId);
        u.lastLogin := ?now;
        addAudit(employeeId, u.fullName, u.role, "Auth", #Login, employeeId.toText(), "Login successful");
        #ok({ token; mustChangePassword = u.mustChangePassword });
      };
    };
  };

  /// Logout — invalidates session token.
  public func logout(token : Text) : async () {
    switch (sessions.get(token)) {
      case (null) {};
      case (?eid) {
        sessions.remove(token);
        switch (users.get(eid)) {
          case (null) {};
          case (?u) {
            addAudit(eid, u.fullName, u.role, "Auth", #Logout, eid.toText(), "Logged out");
          };
        };
      };
    };
  };

  /// Get current user profile from token.
  public query func whoAmI(token : Text) : async CT.Result<T.UserView> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) { #ok(Lib.toUserView(u)) };
    };
  };

  /// Forced password change (first login or reset).
  public func changePassword(
    token : Text,
    oldPassword : Text,
    newPassword : Text,
  ) : async CT.Result<()> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.passwordHash != Lib.hashPassword(oldPassword)) {
          return #err("Current password is incorrect");
        };
        switch (Lib.validatePassword(newPassword)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        u.passwordHash := Lib.hashPassword(newPassword);
        u.mustChangePassword := false;
        addAudit(u.employeeId, u.fullName, u.role, "Auth", #PasswordChanged, u.employeeId.toText(), "Password changed");
        #ok(());
      };
    };
  };

  // ──────────────────────────────────────────
  // USER MANAGEMENT (System Admin only)
  // ──────────────────────────────────────────

  /// Create a new user. System Admin only.
  public func createUser(token : Text, input : T.CreateUserInput) : async CT.Result<T.UserView> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(admin)) {
        if (not isAdmin(admin)) return #err("Access denied: System Admin only");
        if (users.containsKey(input.employeeId)) {
          return #err("Employee ID already exists");
        };
        switch (Lib.validatePassword(input.password)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        // No forced password change — the System Admin's entered password is permanent
        let u = Lib.newUser(
          input.employeeId,
          input.fullName,
          input.email,
          input.department,
          input.designation,
          input.role,
          Lib.hashPassword(input.password),
          false, // mustChangePassword = false for all users
        );
        users.add(input.employeeId, u);
        addAudit(admin.employeeId, admin.fullName, admin.role, "UserManagement", #Created, input.employeeId.toText(), "User " # input.fullName # " created");
        pushNotif(admin.employeeId, "New user created: " # input.fullName, "/users");
        // Welcome email sent to System Admin's registered email with plain-text credentials
        let roleLabel = switch (input.role) {
          case (#SystemAdmin)    "System Admin";
          case (#Employee)       "Employee";
          case (#SafetyOfficer)  "Safety Officer";
          case (#HOD)            "Head of Department";
          case (#AreaInCharge)   "Area In Charge";
          case (#ContractorAdmin) "Contractor Admin";
        };
        let welcomeSubject = "New User Account Created — OHSE 360";
        let welcomeBody =
          "<p>A new user account has been created in OHSE 360.</p>" #
          "<p><b>Full Name:</b> " # input.fullName # "</p>" #
          "<p><b>Username (Employee ID):</b> " # input.employeeId.toText() # "</p>" #
          "<p><b>Password:</b> " # input.password # "</p>" #
          "<p><b>Role:</b> " # roleLabel # "</p>" #
          "<p><b>App Login Link:</b> <a href=\"https://ohse360.app/login\">https://ohse360.app/login</a></p>" #
          "<p>Please share these credentials with the employee offline.</p>";
        ignore EmailClient.sendServiceEmail(
          "no-reply",
          [state.adminEmail],
          welcomeSubject,
          welcomeBody,
        );
        ignore ccAdminNotify(state.adminEmail, welcomeSubject, welcomeBody);
        #ok(Lib.toUserView(u));
      };
    };
  };

  /// Reset password for a user. System Admin only.
  public func resetPassword(
    token : Text,
    targetEmployeeId : CT.EmployeeId,
    newPassword : Text,
  ) : async CT.Result<()> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(admin)) {
        if (not isAdmin(admin)) return #err("Access denied: System Admin only");
        switch (Lib.validatePassword(newPassword)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        switch (users.get(targetEmployeeId)) {
          case (null) { #err("User not found") };
          case (?u) {
            u.passwordHash := Lib.hashPassword(newPassword);
            u.mustChangePassword := false;
            addAudit(admin.employeeId, admin.fullName, admin.role, "UserManagement", #PasswordReset, targetEmployeeId.toText(), "Password reset for " # u.fullName);
            pushNotif(admin.employeeId, "Password reset for: " # u.fullName, "/users");
            ignore EmailClient.sendServiceEmail(
              "no-reply",
              [state.adminEmail],
              "OHSE 360: Password reset",
              "<p>Password for <b>" # u.fullName # "</b> (ID: " # targetEmployeeId.toText() # ") has been reset.</p>",
            );
            ignore ccAdminNotify(
              state.adminEmail,
              "OHSE 360: Password reset",
              "<p>Password for <b>" # u.fullName # "</b> (ID: " # targetEmployeeId.toText() # ") has been reset.</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// Deactivate or reactivate a user. System Admin only. Cannot touch ID 230034.
  public func setUserStatus(
    token : Text,
    targetEmployeeId : CT.EmployeeId,
    newStatus : CT.UserStatus,
  ) : async CT.Result<()> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(admin)) {
        if (not isAdmin(admin)) return #err("Access denied: System Admin only");
        if (targetEmployeeId == PROTECTED_ID) {
          return #err("Protected account cannot be deactivated");
        };
        switch (users.get(targetEmployeeId)) {
          case (null) { #err("User not found") };
          case (?u) {
            u.status := newStatus;
            let action = switch (newStatus) { case (#Active) #Reactivated; case (#Inactive) #Deactivated };
            addAudit(admin.employeeId, admin.fullName, admin.role, "UserManagement", action, targetEmployeeId.toText(), "Status changed for " # u.fullName);
            let statusLabel = switch (newStatus) { case (#Active) "reactivated"; case (#Inactive) "deactivated" };
            ignore ccAdminNotify(
              "",
              "OHSE 360: User account " # statusLabel,
              "<p>User <b>" # u.fullName # "</b> (ID: " # targetEmployeeId.toText() # ") has been " # statusLabel # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  /// List users with optional role/dept/status filters. System Admin only.
  public query func listUsers(
    token : Text,
    filterRole : ?CT.Role,
    filterDept : ?Text,
    filterStatus : ?CT.UserStatus,
  ) : async CT.Result<[T.UserView]> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(admin)) {
        if (not isAdmin(admin)) return #err("Access denied: System Admin only");
        let filtered = users.values().filter(func(u) {
          let roleOk = switch (filterRole) { case (null) true; case (?r) u.role == r };
          let deptOk = switch (filterDept) { case (null) true; case (?d) u.department == d };
          let statusOk = switch (filterStatus) { case (null) true; case (?s) u.status == s };
          roleOk and deptOk and statusOk;
        });
        #ok(filtered.map<T.User, T.UserView>(func(u) { Lib.toUserView(u) }).toArray());
      };
    };
  };

  // ──────────────────────────────────────────
  // EMPLOYEE MASTER
  // ──────────────────────────────────────────

  /// Add a new employee. Returns the auto-generated employee code.
  public func addEmployee(token : Text, input : T.AddEmployeeInput) : async CT.Result<T.EmployeeView> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(actor_)) {
        if (not (actor_.role == #SystemAdmin or actor_.role == #SafetyOfficer or actor_.role == #HOD)) {
          return #err("Access denied");
        };
        let seq = state.nextEmpSeq;
        state.nextEmpSeq += 1;
        let empCode = Lib.genEmpCode(seq);
        let emp = Lib.newEmployee(empCode, input);
        employees.add(empCode, emp);
        addAudit(actor_.employeeId, actor_.fullName, actor_.role, "EmployeeMaster", #Created, empCode, "Employee " # input.fullName # " added");
        #ok(Lib.toEmployeeView(emp));
      };
    };
  };

  /// List employees with optional filters.
  public query func listEmployees(
    token : Text,
    filterDept : ?Text,
    filterSite : ?Text,
    filterStatus : ?T.EmployeeStatus,
    search : ?Text,
  ) : async CT.Result<[T.EmployeeView]> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        let filtered = employees.values().filter(func(e) {
          let deptOk = switch (filterDept) { case (null) true; case (?d) e.department == d };
          let siteOk = switch (filterSite) { case (null) true; case (?s) e.site == s };
          let statusOk = switch (filterStatus) { case (null) true; case (?st) e.empStatus == st };
          let searchOk = switch (search) {
            case (null) true;
            case (?q) {
              let ql = q.toLower();
              e.fullName.toLower().contains(#text ql) or e.empCode.toLower().contains(#text ql);
            };
          };
          deptOk and siteOk and statusOk and searchOk;
        });
        #ok(filtered.map<T.Employee, T.EmployeeView>(func(e) { Lib.toEmployeeView(e) }).toArray());
      };
    };
  };

  /// Get a single employee by code.
  public query func getEmployee(token : Text, empCode : Text) : async CT.Result<T.EmployeeView> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (employees.get(empCode)) {
          case (null) { #err("Employee not found") };
          case (?e) { #ok(Lib.toEmployeeView(e)) };
        };
      };
    };
  };

  // ──────────────────────────────────────────
  // AUDIT TRAIL
  // ──────────────────────────────────────────

  /// List audit entries. System Admin sees all; others see own scope.
  public query func listAuditEntries(
    token : Text,
    filterModule : ?Text,
    fromTime : ?CT.Timestamp,
    toTime : ?CT.Timestamp,
  ) : async CT.Result<[T.AuditEntry]> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let filtered = auditLog.values().filter(func(entry) {
          let scopeOk = if (isAdmin(u)) { true } else { entry.actorId == u.employeeId };
          let modOk = switch (filterModule) { case (null) true; case (?m) entry.module_ == m };
          let fromOk = switch (fromTime) { case (null) true; case (?t) entry.timestamp >= t };
          let toOk = switch (toTime) { case (null) true; case (?t) entry.timestamp <= t };
          scopeOk and modOk and fromOk and toOk;
        });
        #ok(filtered.toArray());
      };
    };
  };

  // ──────────────────────────────────────────
  // NOTIFICATIONS
  // ──────────────────────────────────────────

  /// Get notifications for the current user.
  public query func getNotifications(token : Text) : async CT.Result<[T.NotificationView]> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let mine = notifications.values().filter(func(n) { n.recipientId == u.employeeId });
        #ok(mine.map<T.Notification, T.NotificationView>(func(n) { Lib.toNotificationView(n) }).toArray());
      };
    };
  };

  /// Unread notification count.
  public query func unreadNotifCount(token : Text) : async CT.Result<Nat> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let count = notifications.values().filter(func(n) {
          n.recipientId == u.employeeId and not n.isRead;
        }).size();
        #ok(count);
      };
    };
  };

  /// Mark a notification as read.
  public func markNotifRead(token : Text, notifId : Nat) : async CT.Result<()> {
    switch (requireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (notifications.find(func(n) { n.id == notifId and n.recipientId == u.employeeId })) {
          case (null) { #err("Notification not found") };
          case (?n) {
            n.isRead := true;
            #ok(());
          };
        };
      };
    };
  };
};
