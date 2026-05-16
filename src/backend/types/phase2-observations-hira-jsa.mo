import CT "common";

module {

  // ─────────────────────────────────────────────────────
  // SAFETY OBSERVATIONS & BBS
  // ─────────────────────────────────────────────────────
  public type ObservationStatus = {
    #Open; #UnderReview; #CAPAPending; #Closed;
  };

  public type ObservationType = {
    #SafeAct; #UnsafeAct; #UnsafeCondition;
    #NearMiss; #PositiveReinforcement;
  };

  public type ObservationSeverity = { #Low; #Medium; #High };

  public type Observation = {
    obsNumber          : Text;             // OBS-YYYY-0001
    observerEmpId      : CT.EmployeeId;
    observerName       : Text;
    dateTime           : CT.Timestamp;
    location           : Text;
    area               : Text;
    department         : Text;
    obsType            : ObservationType;
    severity           : ObservationSeverity;
    description        : Text;
    immediateAction    : Text;
    var linkedCapaId   : ?Text;
    var status         : ObservationStatus;
    var acknowledgedBy : ?CT.EmployeeId;
    var acknowledgedAt : ?CT.Timestamp;
    var acknowledgeRemarks : ?Text;
    photoUrl           : ?Text;
    createdAt          : CT.Timestamp;
  };

  public type ObservationView = {
    obsNumber          : Text;
    observerEmpId      : CT.EmployeeId;
    observerName       : Text;
    dateTime           : CT.Timestamp;
    location           : Text;
    area               : Text;
    department         : Text;
    obsType            : ObservationType;
    severity           : ObservationSeverity;
    description        : Text;
    immediateAction    : Text;
    linkedCapaId       : ?Text;
    status             : ObservationStatus;
    acknowledgedBy     : ?CT.EmployeeId;
    acknowledgedAt     : ?CT.Timestamp;
    acknowledgeRemarks : ?Text;
    photoUrl           : ?Text;
    createdAt          : CT.Timestamp;
  };

  public type CreateObservationInput = {
    dateTime        : CT.Timestamp;
    location        : Text;
    area            : Text;
    department      : Text;
    obsType         : ObservationType;
    severity        : ObservationSeverity;
    description     : Text;
    immediateAction : Text;
    photoUrl        : ?Text;
  };

  // ─────────────────────────────────────────────────────
  // HIRA
  // ─────────────────────────────────────────────────────
  public type HazardType = {
    #Physical; #Chemical; #Biological;
    #Ergonomic; #Psychological; #Environmental;
  };

  public type HIRAStatus = { #Draft; #UnderReview; #Approved; #Expired };

  // Low=1-4, Medium=5-9, High=10-16, Critical=17-25
  public type RiskLevel = { #Low; #Medium; #High; #Critical };

  public type HazardRow = {
    hazardId           : Text;
    hazardDescription  : Text;
    hazardType         : HazardType;
    likelihood         : Nat;   // 1-5
    severity           : Nat;   // 1-5
    riskScore          : Nat;   // likelihood * severity (auto-calculated)
    riskLevel          : RiskLevel;
    existingControls   : Text;
    additionalControls : Text;
    residualRiskScore  : Nat;
    responsibleEmpId   : ?CT.EmployeeId;
  };

  public type HIRA = {
    hiraNumber       : Text;              // HIRA-YYYY-0001
    taskDescription  : Text;
    location         : Text;
    area             : Text;
    department       : Text;
    var hazards      : [var HazardRow];
    var status       : HIRAStatus;
    // approvalStep: 0=Draft,1=PendingHOD,2=PendingAIC,3=PendingSO,4=Approved
    var approvalStep : Nat;
    var hodEmpId     : ?CT.EmployeeId;
    var hodRemarks   : ?Text;
    var hodAt        : ?CT.Timestamp;
    var aicEmpId     : ?CT.EmployeeId;
    var aicRemarks   : ?Text;
    var aicAt        : ?CT.Timestamp;
    var soEmpId      : ?CT.EmployeeId;
    var soRemarks    : ?Text;
    var soAt         : ?CT.Timestamp;
    responsibleEmpId : ?CT.EmployeeId;
    reviewDate       : Text;
    var linkedPtwNumber : ?Text;
    createdBy        : CT.EmployeeId;
    createdAt        : CT.Timestamp;
    var updatedAt    : CT.Timestamp;
  };

  public type HIRAView = {
    hiraNumber       : Text;
    taskDescription  : Text;
    location         : Text;
    area             : Text;
    department       : Text;
    hazards          : [HazardRow];
    status           : HIRAStatus;
    approvalStep     : Nat;
    hodEmpId         : ?CT.EmployeeId;
    hodRemarks       : ?Text;
    hodAt            : ?CT.Timestamp;
    aicEmpId         : ?CT.EmployeeId;
    aicRemarks       : ?Text;
    aicAt            : ?CT.Timestamp;
    soEmpId          : ?CT.EmployeeId;
    soRemarks        : ?Text;
    soAt             : ?CT.Timestamp;
    responsibleEmpId : ?CT.EmployeeId;
    reviewDate       : Text;
    linkedPtwNumber  : ?Text;
    createdBy        : CT.EmployeeId;
    createdAt        : CT.Timestamp;
    updatedAt        : CT.Timestamp;
  };

  public type CreateHIRAInput = {
    taskDescription  : Text;
    location         : Text;
    area             : Text;
    department       : Text;
    responsibleEmpId : ?CT.EmployeeId;
    reviewDate       : Text;
  };

  // ─────────────────────────────────────────────────────
  // JSA
  // ─────────────────────────────────────────────────────
  public type JSAStatus = { #Draft; #UnderReview; #Approved; #Active; #Closed };

  public type JSAStep = {
    stepNo           : Nat;
    description      : Text;
    hazards          : Text;
    riskLevel        : RiskLevel;
    controls         : Text;
    responsibleEmpId : ?CT.EmployeeId;
  };

  public type JSA = {
    jsaNumber        : Text;              // JSA-YYYY-0001
    jobTitle         : Text;
    department       : Text;
    area             : Text;
    location         : Text;
    analysisDate     : Text;              // ISO-8601
    preparedBy       : CT.EmployeeId;
    var reviewedBy   : ?CT.EmployeeId;
    var approvedBy   : ?CT.EmployeeId;
    var steps        : [var JSAStep];
    helmetRequired   : Bool;
    safetyShoes      : Bool;
    gloves           : Bool;
    harness          : Bool;
    faceShield       : Bool;
    goggles          : Bool;
    respirator       : Bool;
    emergencyContacts : Text;
    var briefingAttendees : [var CT.EmployeeId];
    var linkedPtwNumber  : ?Text;
    var status       : JSAStatus;
    var hodRemarks   : ?Text;
    var hodAt        : ?CT.Timestamp;
    var soRemarks    : ?Text;
    var soAt         : ?CT.Timestamp;
    createdAt        : CT.Timestamp;
    var updatedAt    : CT.Timestamp;
  };

  public type JSAView = {
    jsaNumber         : Text;
    jobTitle          : Text;
    department        : Text;
    area              : Text;
    location          : Text;
    analysisDate      : Text;
    preparedBy        : CT.EmployeeId;
    reviewedBy        : ?CT.EmployeeId;
    approvedBy        : ?CT.EmployeeId;
    steps             : [JSAStep];
    helmetRequired    : Bool;
    safetyShoes       : Bool;
    gloves            : Bool;
    harness           : Bool;
    faceShield        : Bool;
    goggles           : Bool;
    respirator        : Bool;
    emergencyContacts : Text;
    briefingAttendees : [CT.EmployeeId];
    linkedPtwNumber   : ?Text;
    status            : JSAStatus;
    hodRemarks        : ?Text;
    hodAt             : ?CT.Timestamp;
    soRemarks         : ?Text;
    soAt              : ?CT.Timestamp;
    createdAt         : CT.Timestamp;
    updatedAt         : CT.Timestamp;
  };

  public type CreateJSAInput = {
    jobTitle          : Text;
    department        : Text;
    area              : Text;
    location          : Text;
    analysisDate      : Text;
    helmetRequired    : Bool;
    safetyShoes       : Bool;
    gloves            : Bool;
    harness           : Bool;
    faceShield        : Bool;
    goggles           : Bool;
    respirator        : Bool;
    emergencyContacts : Text;
    linkedPtwNumber   : ?Text;
  };

};
