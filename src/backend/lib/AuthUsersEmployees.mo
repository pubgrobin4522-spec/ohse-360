import T "../types/auth-users-employees";
import CT "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";

module {

  // ──────────────────────────────────────────
  // Simple deterministic hash for passwords.
  // Not cryptographic but stable across upgrades.
  // Replace with a canister-side crypto lib if available.
  // ──────────────────────────────────────────
  public func hashPassword(pw : Text) : Text {
    var h : Nat = 5381;
    for (c in pw.toIter()) {
      let code = c.toNat32().toNat();
      h := ((h * 33) + code) % 4294967296;
    };
    "hash:" # h.toText();
  };

  // ──────────────────────────────────────────
  // Password validation rules
  // ──────────────────────────────────────────
  public func validatePassword(pw : Text) : CT.Result<()> {
    if (pw.size() < 8) {
      return #err("Password must be at least 8 characters");
    };
    var hasUpper = false;
    var hasDigit = false;
    var hasSpecial = false;
    for (c in pw.toIter()) {
      let n = c.toNat32();
      let isUpper   = n >= 65 and n <= 90;   // A-Z
      let isLower   = n >= 97 and n <= 122;  // a-z
      let isDigit_  = n >= 48 and n <= 57;   // 0-9
      let isAlpha   = isUpper or isLower;
      if (isUpper)               { hasUpper   := true };
      if (isDigit_)              { hasDigit   := true };
      if (not isAlpha and not isDigit_) { hasSpecial := true };
    };
    if (not hasUpper)   return #err("Password must contain at least 1 uppercase letter");
    if (not hasDigit)   return #err("Password must contain at least 1 number");
    if (not hasSpecial) return #err("Password must contain at least 1 special character");
    #ok(());
  };

  // ──────────────────────────────────────────
  // User factory
  // ──────────────────────────────────────────
  public func newUser(
    employeeId : CT.EmployeeId,
    fullName : Text,
    email : Text,
    department : Text,
    designation : Text,
    role : CT.Role,
    passwordHash : Text,
    mustChangePassword : Bool,
  ) : T.User {
    {
      employeeId;
      var passwordHash;
      fullName;
      email;
      var department;
      var designation;
      var role;
      var roles = [role];  // default: single role
      var status = #Active;
      var mustChangePassword;
      var lastLogin = null;
      createdAt = Time.now();
    };
  };

  // ──────────────────────────────────────────
  // User projection (mutable → shared)
  // ──────────────────────────────────────────
  public func toUserView(u : T.User) : T.UserView {
    {
      employeeId = u.employeeId;
      fullName = u.fullName;
      email = u.email;
      department = u.department;
      designation = u.designation;
      role = u.role;
      roles = u.roles;
      status = u.status;
      mustChangePassword = u.mustChangePassword;
      lastLogin = u.lastLogin;
      createdAt = u.createdAt;
    };
  };

  // ──────────────────────────────────────────
  // Employee factory
  // ──────────────────────────────────────────
  public func newEmployee(
    empCode : Text,
    input : T.AddEmployeeInput,
  ) : T.Employee {
    {
      empCode;
      var fullName = input.fullName;
      var dateOfBirth = input.dateOfBirth;
      var contact = input.contact;
      var email = input.email;
      var department = input.department;
      var designation = input.designation;
      var site = input.site;
      var joiningDate = input.joiningDate;
      var employmentType = input.employmentType;
      var empStatus = #Active;
      createdAt = Time.now();
    };
  };

  // ──────────────────────────────────────────
  // Employee projection
  // ──────────────────────────────────────────
  public func toEmployeeView(e : T.Employee) : T.EmployeeView {
    {
      empCode = e.empCode;
      fullName = e.fullName;
      dateOfBirth = e.dateOfBirth;
      contact = e.contact;
      email = e.email;
      department = e.department;
      designation = e.designation;
      site = e.site;
      joiningDate = e.joiningDate;
      employmentType = e.employmentType;
      empStatus = e.empStatus;
      createdAt = e.createdAt;
    };
  };

  // ──────────────────────────────────────────
  // Employee code generator  EMP-NNNNN
  // ──────────────────────────────────────────
  public func genEmpCode(seq : Nat) : Text {
    let s = seq.toText();
    let needed : Int = 5 - s.size().toInt();
    if (needed <= 0) return "EMP-" # s;
    var pad = "";
    var i = 0;
    while (i < needed.toNat()) {
      pad := pad # "0";
      i += 1;
    };
    "EMP-" # pad # s;
  };

  // ──────────────────────────────────────────
  // Simple session token generation
  // ──────────────────────────────────────────
  public func genToken(employeeId : CT.EmployeeId, now : CT.Timestamp) : Text {
    "tok:" # employeeId.toText() # ":" # now.toText();
  };

  // ──────────────────────────────────────────
  // Audit entry factory
  // ──────────────────────────────────────────
  public func newAuditEntry(
    id : Nat,
    actorId : CT.EmployeeId,
    actorName : Text,
    actorRole : CT.Role,
    module_ : Text,
    action : T.AuditAction,
    recordRef : Text,
    detail : Text,
  ) : T.AuditEntry {
    {
      id;
      timestamp = Time.now();
      actorId;
      actorName;
      actorRole;
      module_;
      action;
      recordRef;
      detail;
    };
  };

  // ──────────────────────────────────────────
  // Notification factory
  // ──────────────────────────────────────────
  public func newNotification(
    id : Nat,
    recipientId : CT.EmployeeId,
    message : Text,
    link : Text,
  ) : T.Notification {
    {
      id;
      recipientId;
      message;
      link;
      var isRead = false;
      createdAt = Time.now();
    };
  };

  public func toNotificationView(n : T.Notification) : T.NotificationView {
    {
      id = n.id;
      recipientId = n.recipientId;
      message = n.message;
      link = n.link;
      isRead = n.isRead;
      createdAt = n.createdAt;
    };
  };
};
