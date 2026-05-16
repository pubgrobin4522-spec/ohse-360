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
  // WORK PERMIT (PTW) — Full Rebuild
  // ─────────────────────────────────────────────────────
  public type PermitType = {
    #GeneralWork; #HotWork; #HeightWork; #ConfinedSpace;
    #ElectricalWork; #Excavation; #Lifting; #Shutdown;
    #ChemicalHandling; #ColdWork;
  };

  public type RiskLevel = { #Low; #Medium; #High; #Critical };

  public type InsuranceType = {
    #ESI; #GroupAccident; #WorkerCompensation; #EmployeeCompensation;
  };

  public type PTWStatus = {
    #Draft; #Submitted; #HODReview; #AreaReview; #IsolationReview;
    #SafetyReview; #FinalApproval; #Approved; #Active; #Suspended;
    #Rejected; #Closed; #Expired;
  };

  public type ApprovalSignature = {
    employeeId     : CT.EmployeeId;
    name           : Text;
    designation    : Text;
    approvalStatus : Text;       // "Pending" | "Approved" | "Rejected"
    signedAt       : ?CT.Timestamp;
    ipAddress      : Text;
    remarks        : Text;
  };

  public type IsolationDetail = {
    isolationRequired  : Bool;
    electricalOptions  : [Text]; // multi-select
    serviceOptions     : [Text]; // multi-select
    description        : Text;
    lotoLockNumber     : Text;
    isolationBy        : CT.EmployeeId;
    isolationDateTime  : ?CT.Timestamp;
    verificationStatus : Text;
  };

  public type EnergisationRecord = {
    energisationType  : Text;           // "Electrical" | "ServiceProcess"
    checklistItems    : [(Text, Bool)];  // item name, checked
    lotoLockNumber    : Text;
    approverEmployeeId : CT.EmployeeId;
    approverName      : Text;
    approvedAt        : ?CT.Timestamp;
    signature         : Text;
  };

  public type InsuranceInfo = {
    insuranceType      : InsuranceType;
    validFrom          : Text;
    validTill          : Text;
    policyNumber       : Text;
    verificationStatus : Text;    // "Pending" | "Verified" | "Expired"
    documentUrls       : [Text];  // uploaded doc references
  };

  public type PermitToWork = {
    id                 : Text;   // RKTR/PTW/YYYY/MM/0001
    permitType         : PermitType;
    validityDate       : Text;
    timeStart          : Text;
    timeEnd            : Text;
    issuingDepartment  : Text;
    issuedTo           : Text;
    crossReference     : Text;
    jobLocation        : Text;
    jobDescription     : Text;
    contractorName     : Text;
    supervisorName     : Text;
    var status         : PTWStatus;
    department         : Text;
    area               : Text;
    riskLevel          : RiskLevel;
    // Insurance
    insurance          : ?InsuranceInfo;
    // Hazard selection
    selectedHazards    : [Text];
    customHazard       : Text;
    // PPE selection
    selectedPPE        : [Text];
    // Isolation
    isolation          : ?IsolationDetail;
    // Dynamic checklist
    checklist          : [(Text, Bool)];
    // Approval signatures — 8 slots
    var requestorSignature           : ?ApprovalSignature;
    var hodSignature                 : ?ApprovalSignature;
    var areaInChargeSignature        : ?ApprovalSignature;
    var isolationAuthoritySignature  : ?ApprovalSignature;
    var safetyOfficerSignature       : ?ApprovalSignature;
    var finalIssuerSignature         : ?ApprovalSignature;
    var electricalApproverSignature  : ?ApprovalSignature;
    var serviceProcessApproverSignature : ?ApprovalSignature;
    // Energisation
    var electricalEnergisation       : ?EnergisationRecord;
    var serviceProcessEnergisation   : ?EnergisationRecord;
    // Gas test (Confined Space)
    var o2Percent      : ?Float;
    var lelPercent     : ?Float;
    var h2sPpm         : ?Float;
    var coPpm          : ?Float;
    // Toolbox talk
    var toolboxTalkDone      : Bool;
    var toolboxTalkAttendees : [Text];
    // Emergency rescue plan (Confined Space)
    var emergencyRescuePlan        : Bool;
    var emergencyRescueDescription : Text;
    // HIRA and JSA links
    var linkedHiraNumber : ?Text;
    var linkedJsaNumber  : ?Text;
    // Meta
    createdBy  : CT.EmployeeId;
    createdAt  : CT.Timestamp;
    var updatedAt : CT.Timestamp;
    // Nominated next approver employee IDs
    var nominatedHodEmployeeId             : ?CT.EmployeeId;
    var nominatedAreaInChargeEmployeeId    : ?CT.EmployeeId;
    var nominatedIsolationAuthorityEmployeeId : ?CT.EmployeeId;
    var nominatedSafetyOfficerEmployeeId   : ?CT.EmployeeId;
    var nominatedFinalIssuerEmployeeId     : ?CT.EmployeeId;
  };

  // Shared-safe projection of PermitToWork (no var fields)
  public type PermitToWorkView = {
    id                 : Text;
    permitType         : PermitType;
    validityDate       : Text;
    timeStart          : Text;
    timeEnd            : Text;
    issuingDepartment  : Text;
    issuedTo           : Text;
    crossReference     : Text;
    jobLocation        : Text;
    jobDescription     : Text;
    contractorName     : Text;
    supervisorName     : Text;
    status             : PTWStatus;
    department         : Text;
    area               : Text;
    riskLevel          : RiskLevel;
    insurance          : ?InsuranceInfo;
    selectedHazards    : [Text];
    customHazard       : Text;
    selectedPPE        : [Text];
    isolation          : ?IsolationDetail;
    checklist          : [(Text, Bool)];
    requestorSignature           : ?ApprovalSignature;
    hodSignature                 : ?ApprovalSignature;
    areaInChargeSignature        : ?ApprovalSignature;
    isolationAuthoritySignature  : ?ApprovalSignature;
    safetyOfficerSignature       : ?ApprovalSignature;
    finalIssuerSignature         : ?ApprovalSignature;
    electricalApproverSignature  : ?ApprovalSignature;
    serviceProcessApproverSignature : ?ApprovalSignature;
    electricalEnergisation       : ?EnergisationRecord;
    serviceProcessEnergisation   : ?EnergisationRecord;
    o2Percent          : ?Float;
    lelPercent         : ?Float;
    h2sPpm             : ?Float;
    coPpm              : ?Float;
    toolboxTalkDone      : Bool;
    toolboxTalkAttendees : [Text];
    emergencyRescuePlan        : Bool;
    emergencyRescueDescription : Text;
    linkedHiraNumber   : ?Text;
    linkedJsaNumber    : ?Text;
    createdBy          : CT.EmployeeId;
    createdAt          : CT.Timestamp;
    updatedAt          : CT.Timestamp;
    nominatedHodEmployeeId             : ?CT.EmployeeId;
    nominatedAreaInChargeEmployeeId    : ?CT.EmployeeId;
    nominatedIsolationAuthorityEmployeeId : ?CT.EmployeeId;
    nominatedSafetyOfficerEmployeeId   : ?CT.EmployeeId;
    nominatedFinalIssuerEmployeeId     : ?CT.EmployeeId;
  };

  public type CreatePermitInput = {
    permitType        : PermitType;
    validityDate      : Text;
    timeStart         : Text;
    timeEnd           : Text;
    issuingDepartment : Text;
    issuedTo          : Text;
    crossReference    : Text;
    jobLocation       : Text;
    jobDescription    : Text;
    contractorName    : Text;
    supervisorName    : Text;
    department        : Text;
    area              : Text;
    riskLevel         : RiskLevel;
    insurance         : ?InsuranceInfo;
    selectedHazards   : [Text];
    customHazard      : Text;
    selectedPPE       : [Text];
    isolation         : ?IsolationDetail;
    checklist         : [(Text, Bool)];
    nominatedHodEmployeeId : ?CT.EmployeeId;
  };

  public type PTWListFilter = {
    status     : ?PTWStatus;
    permitType : ?PermitType;
    department : ?Text;
    area       : ?Text;
  };

  public type PTWMasterData = {
    permitTypes : [Text];
    hazards     : [Text];
    ppeList     : [Text];
    locations   : [Text];
    departments : [Text];
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
