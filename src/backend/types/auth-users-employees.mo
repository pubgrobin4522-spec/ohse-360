import CommonTypes "common";
import Time "mo:core/Time";

module {
  // ──────────────────────────────────────────
  // User (login account)
  // ──────────────────────────────────────────
  public type User = {
    employeeId : CommonTypes.EmployeeId;  // login credential
    var passwordHash : Text;
    fullName : Text;
    email : Text;                          // notification email
    var department : Text;
    var designation : Text;
    var role : CommonTypes.Role;           // primary role
    var roles : [CommonTypes.Role];        // all assigned roles (supports dual role)
    var status : CommonTypes.UserStatus;
    var mustChangePassword : Bool;        // forced on first login
    var lastLogin : ?CommonTypes.Timestamp;
    createdAt : CommonTypes.Timestamp;
  };

  // Shared-safe projection (no var fields, no mutable state)
  public type UserView = {
    employeeId : CommonTypes.EmployeeId;
    fullName : Text;
    email : Text;
    department : Text;
    designation : Text;
    role : CommonTypes.Role;
    roles : [CommonTypes.Role];           // all assigned roles
    status : CommonTypes.UserStatus;
    mustChangePassword : Bool;
    lastLogin : ?CommonTypes.Timestamp;
    createdAt : CommonTypes.Timestamp;
  };

  // ──────────────────────────────────────────
  // Employee Master record
  // ──────────────────────────────────────────
  public type EmploymentType = { #FullTime; #Contract; #Temporary };
  public type EmployeeStatus = { #Active; #Inactive; #Resigned };

  public type Employee = {
    empCode : Text;           // EMP-00001 format, auto-generated
    var fullName : Text;
    var dateOfBirth : Text;   // ISO-8601 text
    var contact : Text;
    var email : Text;
    var department : Text;
    var designation : Text;
    var site : Text;
    var joiningDate : Text;   // ISO-8601 text
    var employmentType : EmploymentType;
    var empStatus : EmployeeStatus;
    createdAt : CommonTypes.Timestamp;
  };

  public type EmployeeView = {
    empCode : Text;
    fullName : Text;
    dateOfBirth : Text;
    contact : Text;
    email : Text;
    department : Text;
    designation : Text;
    site : Text;
    joiningDate : Text;
    employmentType : EmploymentType;
    empStatus : EmployeeStatus;
    createdAt : CommonTypes.Timestamp;
  };

  // ──────────────────────────────────────────
  // Session
  // ──────────────────────────────────────────
  public type Session = {
    employeeId : CommonTypes.EmployeeId;
    token : Text;
    createdAt : CommonTypes.Timestamp;
  };

  // ──────────────────────────────────────────
  // Audit
  // ──────────────────────────────────────────
  public type AuditAction = {
    #Created;
    #Updated;
    #Deactivated;
    #Reactivated;
    #PasswordReset;
    #Login;
    #Logout;
    #PasswordChanged;
    #Approved;
    #Rejected_;
    #Closed_;
  };

  public type AuditEntry = {
    id : Nat;
    timestamp : CommonTypes.Timestamp;
    actorId : CommonTypes.EmployeeId;
    actorName : Text;
    actorRole : CommonTypes.Role;
    module_ : Text;
    action : AuditAction;
    recordRef : Text;
    detail : Text;
  };

  // ──────────────────────────────────────────
  // Input records for public API
  // ──────────────────────────────────────────
  public type CreateUserInput = {
    employeeId : CommonTypes.EmployeeId;
    fullName : Text;
    email : Text;
    department : Text;
    designation : Text;
    role : CommonTypes.Role;
    password : Text;
  };

  public type AddEmployeeInput = {
    fullName : Text;
    dateOfBirth : Text;
    contact : Text;
    email : Text;
    department : Text;
    designation : Text;
    site : Text;
    joiningDate : Text;
    employmentType : EmploymentType;
  };

  // ──────────────────────────────────────────
  // Notification
  // ──────────────────────────────────────────
  public type Notification = {
    id : Nat;
    recipientId : CommonTypes.EmployeeId;
    message : Text;
    link : Text;
    var isRead : Bool;
    createdAt : CommonTypes.Timestamp;
  };

  public type NotificationView = {
    id : Nat;
    recipientId : CommonTypes.EmployeeId;
    message : Text;
    link : Text;
    isRead : Bool;
    createdAt : CommonTypes.Timestamp;
  };
};
