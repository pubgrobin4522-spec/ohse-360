import CT "common";
import Time "mo:core/Time";

module {

  // ─────────────────────────────────────────────────────
  // INCIDENT REPORTING
  // ─────────────────────────────────────────────────────
  public type IncidentType = {
    #NearMiss; #UnsafeAct; #UnsafeCondition;
    #FirstAid; #LTI; #Fatal;
  };

  public type Severity = { #Low; #Medium; #High; #Critical };

  public type IncidentStatus = {
    #Open; #UnderInvestigation; #CAPAPending; #Closed;
  };

  public type CAPAStatus = { #Open; #InProgress; #Closed; #Overdue };

  public type Incident = {
    incidentNumber : Text;            // INC-YYYY-NNNNN
    incidentType   : IncidentType;
    var severity   : Severity;
    var status     : IncidentStatus;
    location       : Text;
    department     : Text;
    description    : Text;
    reportedById   : CT.EmployeeId;
    reportedByName : Text;
    incidentDate   : Text;            // ISO-8601
    injuredPersonCode : ?Text;        // empCode from Employee Master
    var rootCause  : Text;
    var correctiveAction : Text;
    var closedAt   : ?CT.Timestamp;
    createdAt      : CT.Timestamp;
  };

  public type IncidentView = {
    incidentNumber : Text;
    incidentType   : IncidentType;
    severity       : Severity;
    status         : IncidentStatus;
    location       : Text;
    department     : Text;
    description    : Text;
    reportedById   : CT.EmployeeId;
    reportedByName : Text;
    incidentDate   : Text;
    injuredPersonCode : ?Text;
    rootCause      : Text;
    correctiveAction : Text;
    closedAt       : ?CT.Timestamp;
    createdAt      : CT.Timestamp;
  };

  public type CAPA = {
    id             : Nat;
    incidentNumber : Text;
    var description : Text;
    actionOwnerId  : CT.EmployeeId;
    actionOwnerName : Text;
    deadline       : Text;            // ISO-8601 date
    var status     : CAPAStatus;
    var closedAt   : ?CT.Timestamp;
    createdAt      : CT.Timestamp;
  };

  public type CAPAView = {
    id             : Nat;
    incidentNumber : Text;
    description    : Text;
    actionOwnerId  : CT.EmployeeId;
    actionOwnerName : Text;
    deadline       : Text;
    status         : CAPAStatus;
    closedAt       : ?CT.Timestamp;
    createdAt      : CT.Timestamp;
  };

  public type CreateIncidentInput = {
    incidentType      : IncidentType;
    severity          : Severity;
    location          : Text;
    department        : Text;
    description       : Text;
    incidentDate      : Text;
    injuredPersonCode : ?Text;
    capaActionOwnerId : CT.EmployeeId;
    capaDeadline      : Text;
  };

  // ─────────────────────────────────────────────────────
  // TRAINING MANAGEMENT
  // ─────────────────────────────────────────────────────
  public type TrainingType = {
    #Induction; #Refresher; #Regulatory; #OnTheJob; #External;
  };

  public type TrainingFrequency = {
    #OneTime; #Annual; #BiAnnual; #ThreeYearly;
  };

  public type AttendanceStatus = { #Present; #Absent };

  public type CertificateStatus = { #Valid; #ExpiringSoon; #Expired };

  public type TrainingAttendee = {
    empCode        : Text;
    empName        : Text;
    var attendance : AttendanceStatus;
    var certificateId  : ?Text;        // CERT-EMP001-2026-NNNNN (set after present)
    var certStatus : ?CertificateStatus;
    var expiryDate : ?Text;            // ISO-8601
  };

  public type Training = {
    trainingId   : Text;              // TRN-YYYY-NNNNN
    name         : Text;
    trainingType : TrainingType;
    frequency    : TrainingFrequency;
    trainingDate : Text;              // ISO-8601
    trainer      : Text;
    department   : Text;
    attendees    : [var TrainingAttendee]; // mutable array stored inline
    createdById  : CT.EmployeeId;
    createdAt    : CT.Timestamp;
  };

  // We need a shared type for API responses:
  public type TrainingAttendeeView = {
    empCode      : Text;
    empName      : Text;
    attendance   : AttendanceStatus;
    certificateId : ?Text;
    certStatus   : ?CertificateStatus;
    expiryDate   : ?Text;
  };

  public type TrainingView = {
    trainingId   : Text;
    name         : Text;
    trainingType : TrainingType;
    frequency    : TrainingFrequency;
    trainingDate : Text;
    trainer      : Text;
    department   : Text;
    attendees    : [TrainingAttendeeView];
    createdById  : CT.EmployeeId;
    createdAt    : CT.Timestamp;
  };

  public type CreateTrainingInput = {
    name         : Text;
    trainingType : TrainingType;
    frequency    : TrainingFrequency;
    trainingDate : Text;
    trainer      : Text;
    department   : Text;
    attendeeCodes : [Text];            // empCodes
  };

  // ─────────────────────────────────────────────────────
  // WORK PERMIT (PTW)
  // ─────────────────────────────────────────────────────
  public type PermitType = {
    #HotWork; #ColdWork; #ConfinedSpace;
    #WorkAtHeight; #ElectricalIsolation; #Excavation;
  };

  public type PTWStatus = {
    #Draft;
    #PendingHOD;
    #PendingAreaInCharge;
    #PendingSafetyOfficer;
    #Active;
    #Completed;
    #Closed;
    #Rejected;
  };

  public type ApprovalStep = {
    approverId   : CT.EmployeeId;
    approverName : Text;
    role         : CT.Role;
    var approved : ?Bool;             // null = pending
    var remarks  : Text;
    var actionAt : ?CT.Timestamp;
  };

  public type PTW = {
    permitNumber   : Text;            // PTW-YYYY-NNNNN
    permitType     : PermitType;
    workDescription : Text;
    location       : Text;
    startDateTime  : Text;            // ISO-8601
    endDateTime    : Text;            // ISO-8601
    requestedById  : CT.EmployeeId;
    requestedByName : Text;
    contractorTeam : Text;
    riskAssessed   : Bool;
    ppeRequired    : [Text];
    var status     : PTWStatus;
    var hodStep    : ?ApprovalStep;
    var aicStep    : ?ApprovalStep;
    var soStep     : ?ApprovalStep;
    var rejectedAt : ?CT.Timestamp;
    var rejectedRemarks : Text;
    var closedAt   : ?CT.Timestamp;
    createdAt      : CT.Timestamp;
  };

  public type ApprovalStepView = {
    approverId   : CT.EmployeeId;
    approverName : Text;
    role         : CT.Role;
    approved     : ?Bool;
    remarks      : Text;
    actionAt     : ?CT.Timestamp;
  };

  public type PTWView = {
    permitNumber   : Text;
    permitType     : PermitType;
    workDescription : Text;
    location       : Text;
    startDateTime  : Text;
    endDateTime    : Text;
    requestedById  : CT.EmployeeId;
    requestedByName : Text;
    contractorTeam : Text;
    riskAssessed   : Bool;
    ppeRequired    : [Text];
    status         : PTWStatus;
    hodStep        : ?ApprovalStepView;
    aicStep        : ?ApprovalStepView;
    soStep         : ?ApprovalStepView;
    rejectedAt     : ?CT.Timestamp;
    rejectedRemarks : Text;
    closedAt       : ?CT.Timestamp;
    createdAt      : CT.Timestamp;
  };

  public type CreatePTWInput = {
    permitType     : PermitType;
    workDescription : Text;
    location       : Text;
    startDateTime  : Text;
    endDateTime    : Text;
    contractorTeam : Text;
    riskAssessed   : Bool;
    ppeRequired    : [Text];
  };

  // ─────────────────────────────────────────────────────
  // DASHBOARD KPIs
  // ─────────────────────────────────────────────────────
  public type KPISummary = {
    trir                : Float;   // (recordable * 200000) / manHours
    ltifr               : Float;   // (lti * 1000000) / manHours
    nearMissCount       : Nat;
    auditScorePct       : Float;
    trainingCompliancePct : Float;
    ptwCompliancePct    : Float;
    totalIncidents      : Nat;
    openCAPAs           : Nat;
  };

  public type MonthlyTrend = {
    month       : Nat;  // 1-12
    year        : Nat;
    incidentCount : Nat;
  };

  public type DeptOHSEScore = {
    department : Text;
    score      : Float;  // 0-100
  };
};
