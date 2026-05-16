import CT "common";
import P2OHJ "phase2-observations-hira-jsa";

module {

  // ─────────────────────────────────────────────────────
  // CAPA TRACKING (Phase 2 standalone — distinct from Phase 1 incident CAPA)
  // ─────────────────────────────────────────────────────

  // Renamed to avoid clash with incidents-training-ptw.mo CAPAStatus
  public type CAPAStatus2 = {
    #Open; #InProgress; #PendingVerification; #Closed; #Overdue;
  };

  // Renamed to avoid clash with incidents-training-ptw.mo (no CAPASource there, but using suffix for clarity)
  public type CAPASource2 = {
    #Incident; #Observation; #Audit; #HIRA; #JSA; #Manual;
  };

  public type CAPAType = { #Corrective; #Preventive };

  public type CAPAPriority = { #Low; #Medium; #High; #Critical };

  public type RootCauseCat = {
    #HumanError; #EquipmentFailure; #ProcedureGap;
    #TrainingGap; #Environmental; #ManagementSystem;
  };

  public type CAPA2 = {
    capaNumber         : Text;             // CAPA-YYYY-0001
    source             : CAPASource2;
    linkedRecordNumber : Text;
    capaType           : CAPAType;
    findingDescription : Text;
    rootCauseCat       : RootCauseCat;
    var rootCauseDesc  : Text;
    var actionDescription : Text;
    actionOwnerEmpId   : CT.EmployeeId;
    department         : Text;
    targetDate         : Text;             // ISO-8601
    priority           : CAPAPriority;
    var progressUpdate : Text;
    var completionEvidence : ?Text;
    var verifiedByEmpId : ?CT.EmployeeId;
    var verifiedAt     : ?CT.Timestamp;
    var status         : CAPAStatus2;
    var isOverdue      : Bool;
    createdAt          : CT.Timestamp;
    var updatedAt      : CT.Timestamp;
  };

  public type CAPA2View = {
    capaNumber         : Text;
    source             : CAPASource2;
    linkedRecordNumber : Text;
    capaType           : CAPAType;
    findingDescription : Text;
    rootCauseCat       : RootCauseCat;
    rootCauseDesc      : Text;
    actionDescription  : Text;
    actionOwnerEmpId   : CT.EmployeeId;
    department         : Text;
    targetDate         : Text;
    priority           : CAPAPriority;
    progressUpdate     : Text;
    completionEvidence : ?Text;
    verifiedByEmpId    : ?CT.EmployeeId;
    verifiedAt         : ?CT.Timestamp;
    status             : CAPAStatus2;
    isOverdue          : Bool;
    createdAt          : CT.Timestamp;
    updatedAt          : CT.Timestamp;
  };

  public type CreateCAPAInput = {
    source             : CAPASource2;
    linkedRecordNumber : Text;
    capaType           : CAPAType;
    findingDescription : Text;
    rootCauseCat       : RootCauseCat;
    rootCauseDesc      : Text;
    actionDescription  : Text;
    actionOwnerEmpId   : CT.EmployeeId;
    department         : Text;
    targetDate         : Text;
    priority           : CAPAPriority;
  };

  // ─────────────────────────────────────────────────────
  // ENVIRONMENTAL MONITORING & ESG
  // ─────────────────────────────────────────────────────
  public type WasteType = { #Scheduled; #General; #Recyclable; #Hazardous };

  public type WasteEntry = {
    wasteType      : WasteType;
    quantity       : Float;
    unit           : Text;
    disposalMethod : Text;
    contractorName : Text;
    manifestNumber : Text;
    disposalDate   : Text;
    department     : Text;
    loggedBy       : CT.EmployeeId;
    createdAt      : CT.Timestamp;
  };

  public type AddWasteInput = {
    wasteType      : WasteType;
    quantity       : Float;
    unit           : Text;
    disposalMethod : Text;
    contractorName : Text;
    manifestNumber : Text;
    disposalDate   : Text;
    department     : Text;
  };

  public type AirEmissionSource = { #Stack; #Fugitive; #Vehicle };
  public type AirPollutant     = { #CO2; #NOx; #SOx; #PM10; #VOC };

  public type AirEmissionEntry = {
    source           : AirEmissionSource;
    pollutant        : AirPollutant;
    value            : Float;
    unit             : Text;
    measurementDate  : Text;
    regulatoryLimit  : Float;
    isExceeded       : Bool;
    department       : Text;
    loggedBy         : CT.EmployeeId;
    createdAt        : CT.Timestamp;
  };

  public type AddAirEmissionInput = {
    source          : AirEmissionSource;
    pollutant       : AirPollutant;
    value           : Float;
    unit            : Text;
    measurementDate : Text;
    regulatoryLimit : Float;
    department      : Text;
  };

  public type WaterSource = { #Municipal; #Groundwater; #Recycled };

  public type WaterEntry = {
    source      : WaterSource;
    consumption : Float;
    month       : Nat;
    year        : Nat;
    target      : Float;
    department  : Text;
    loggedBy    : CT.EmployeeId;
    createdAt   : CT.Timestamp;
  };

  public type AddWaterInput = {
    source      : WaterSource;
    consumption : Float;
    month       : Nat;
    year        : Nat;
    target      : Float;
    department  : Text;
  };

  public type EffluentType      = { #Process; #Domestic; #Stormwater };
  public type EffluentParameter = { #COD; #BOD; #TSS; #PH; #HeavyMetals };

  public type EffluentEntry = {
    effluentType    : EffluentType;
    parameter       : EffluentParameter;
    value           : Float;
    regulatoryLimit : Float;
    isCompliant     : Bool;
    samplingDate    : Text;
    department      : Text;
    loggedBy        : CT.EmployeeId;
    createdAt       : CT.Timestamp;
  };

  public type AddEffluentInput = {
    effluentType    : EffluentType;
    parameter       : EffluentParameter;
    value           : Float;
    regulatoryLimit : Float;
    samplingDate    : Text;
    department      : Text;
  };

  public type EnergyType = { #Electricity; #Gas; #Diesel; #LPG; #Renewable };

  public type EnergyEntry = {
    energyType      : EnergyType;
    consumption     : Float;
    unit            : Text;
    month           : Nat;
    year            : Nat;
    target          : Float;
    carbonEquivalent : Float;
    department      : Text;
    loggedBy        : CT.EmployeeId;
    createdAt       : CT.Timestamp;
  };

  public type AddEnergyInput = {
    energyType       : EnergyType;
    consumption      : Float;
    unit             : Text;
    month            : Nat;
    year             : Nat;
    target           : Float;
    carbonEquivalent : Float;
    department       : Text;
  };

  public type CarbonScope = { #Scope1; #Scope2; #Scope3 };

  public type CarbonEntry = {
    scope       : CarbonScope;
    co2eTonnes  : Float;
    month       : Nat;
    year        : Nat;
    description : Text;
    loggedBy    : CT.EmployeeId;
    createdAt   : CT.Timestamp;
  };

  public type AddCarbonInput = {
    scope       : CarbonScope;
    co2eTonnes  : Float;
    month       : Nat;
    year        : Nat;
    description : Text;
  };

  // ─────────────────────────────────────────────────────
  // AI RISK SCORING
  // ─────────────────────────────────────────────────────
  public type RiskScoreEntry = {
    overallScore              : Nat;   // 0-100
    riskLevel                 : P2OHJ.RiskLevel;
    nearMissCount             : Nat;
    unsafeObsCount            : Nat;
    trainingGapCount          : Nat;
    overdueCAPACount          : Nat;
    openHighCriticalIncidents : Nat;
    var departmentScores      : [var (Text, Nat)];
    calculatedAt              : CT.Timestamp;
    calculatedBy              : Text;  // "system" or employee name
  };

  public type RiskScoreView = {
    overallScore              : Nat;
    riskLevel                 : P2OHJ.RiskLevel;
    nearMissCount             : Nat;
    unsafeObsCount            : Nat;
    trainingGapCount          : Nat;
    overdueCAPACount          : Nat;
    openHighCriticalIncidents : Nat;
    departmentScores          : [(Text, Nat)];
    calculatedAt              : CT.Timestamp;
    calculatedBy              : Text;
  };

  // ─────────────────────────────────────────────────────
  // PPE MANAGEMENT
  // ─────────────────────────────────────────────────────
  public type PPEItem = {
    itemId          : Text;
    itemName        : Text;
    itemType        : Text;
    size            : Text;
    standard        : Text;
    shelfLifeMonths : Nat;
    createdAt       : CT.Timestamp;
  };

  public type CreatePPEItemInput = {
    itemName        : Text;
    itemType        : Text;
    size            : Text;
    standard        : Text;
    shelfLifeMonths : Nat;
  };

  public type PPEInventory = {
    itemId           : Text;
    var quantityInStock : Int;
    minStockLevel    : Nat;
    var lastUpdated  : CT.Timestamp;
  };

  public type PPEInventoryView = {
    itemId          : Text;
    quantityInStock : Int;
    minStockLevel   : Nat;
    lastUpdated     : CT.Timestamp;
  };

  public type PPEConditionIssue = { #New; #Reissued };

  public type PPEIssuance = {
    issuanceId  : Text;
    employeeId  : CT.EmployeeId;
    itemId      : Text;
    size        : Text;
    quantity    : Nat;
    issueDate   : Text;
    condition   : PPEConditionIssue;
    createdAt   : CT.Timestamp;
  };

  public type PPEInspectionCondition = { #Good; #Damaged; #Replace };

  public type PPEInspection = {
    inspectionId    : Text;
    itemId          : Text;
    inspectorEmpId  : CT.EmployeeId;
    inspectionDate  : Text;
    condition       : PPEInspectionCondition;
    remarks         : Text;
    createdAt       : CT.Timestamp;
  };

  // ─────────────────────────────────────────────────────
  // LOTO (Lockout-Tagout)
  // ─────────────────────────────────────────────────────
  public type LOTOStatus = { #Draft; #Active; #Completed; #Cancelled };

  public type EnergySourceLOTO = {
    #Electrical; #Pneumatic; #Hydraulic;
    #Mechanical; #Thermal; #Chemical; #Gravitational;
  };

  public type IsolationPointStatus = { #Applied; #Removed };

  public type IsolationPoint = {
    pointId    : Text;
    location   : Text;
    lockNumber : Text;
    status     : IsolationPointStatus;
  };

  public type IsolationPointMut = {
    pointId    : Text;
    location   : Text;
    lockNumber : Text;
    var status : IsolationPointStatus;
  };

  public type LockEntryStatus = { #Applied; #Removed };

  public type LockEntry = {
    lockNumber    : Text;
    assignedEmpId : CT.EmployeeId;
    var status    : LockEntryStatus;
  };

  public type LockEntryView = {
    lockNumber    : Text;
    assignedEmpId : CT.EmployeeId;
    status        : LockEntryStatus;
  };

  public type LOTO = {
    lotoNumber              : Text;             // LOTO-YYYY-0001
    equipmentName           : Text;
    tagNumber               : Text;
    var energySources       : [var EnergySourceLOTO];
    var isolationPoints     : [var IsolationPointMut];
    var authorizedEmpIds    : [var CT.EmployeeId];
    var procedureSteps      : [var Text];
    var lockRegister        : [var LockEntry]; // mutable lock register
    workDescription         : Text;
    startDateTime           : CT.Timestamp;
    var endDateTime         : ?CT.Timestamp;
    var authorizedByEmpId   : ?CT.EmployeeId;
    var authorizedAt        : ?CT.Timestamp;
    var reEnergizationChecklist : [var Text];
    var status              : LOTOStatus;
    createdBy               : CT.EmployeeId;
    createdAt               : CT.Timestamp;
    var updatedAt           : CT.Timestamp;
  };

  public type LOTOView = {
    lotoNumber              : Text;
    equipmentName           : Text;
    tagNumber               : Text;
    energySources           : [EnergySourceLOTO];
    isolationPoints         : [IsolationPoint];
    authorizedEmpIds        : [CT.EmployeeId];
    procedureSteps          : [Text];
    lockRegister            : [LockEntryView];
    workDescription         : Text;
    startDateTime           : CT.Timestamp;
    endDateTime             : ?CT.Timestamp;
    authorizedByEmpId       : ?CT.EmployeeId;
    authorizedAt            : ?CT.Timestamp;
    reEnergizationChecklist : [Text];
    status                  : LOTOStatus;
    createdBy               : CT.EmployeeId;
    createdAt               : CT.Timestamp;
    updatedAt               : CT.Timestamp;
  };

  public type CreateLOTOInput = {
    equipmentName   : Text;
    tagNumber       : Text;
    workDescription : Text;
    startDateTime   : CT.Timestamp;
  };

  // ─────────────────────────────────────────────────────
  // CONTRACTOR SAFETY MANAGEMENT
  // ─────────────────────────────────────────────────────
  public type ContractorStatus    = { #Active; #Expired; #Blacklisted };
  public type ContractorDocStatus = { #Valid; #Expiring; #Expired };

  public type ContractorDoc = {
    docType    : Text;
    expiryDate : Text;              // ISO-8601
    var status : ContractorDocStatus;
    uploadedAt : CT.Timestamp;
  };

  public type ContractorDocView = {
    docType    : Text;
    expiryDate : Text;
    status     : ContractorDocStatus;
    uploadedAt : CT.Timestamp;
  };

  public type InductionStatus = { #Pending; #Pass; #Fail };

  public type ContractorEmployee = {
    empName           : Text;
    idNumber          : Text;
    trade             : Text;
    inductionStatus   : InductionStatus;
    inductionDate     : ?Text;
    certificateNumber : ?Text;
  };

  public type ContractorEmployeeView = {
    empName           : Text;
    idNumber          : Text;
    trade             : Text;
    inductionStatus   : InductionStatus;
    inductionDate     : ?Text;
    certificateNumber : ?Text;
  };

  public type PerformanceRating = { #Poor; #Fair; #Good; #Excellent };

  public type ContractorPerformance = {
    safetyScore        : Nat;    // 0-100
    incidentCount      : Nat;
    nearMissCount      : Nat;
    ptwCompliance      : Float;
    trainingCompliance : Float;
    overallRating      : PerformanceRating;
    evaluatedAt        : CT.Timestamp;
    evaluatedBy        : CT.EmployeeId;
  };

  public type Contractor = {
    contractorId      : Text;     // CON-YYYY-0001
    companyName       : Text;
    registrationNumber : Text;
    contactPerson     : Text;
    email             : Text;
    phone             : Text;
    typeOfWork        : Text;
    contractStartDate : Text;
    contractEndDate   : Text;
    var documents     : [var ContractorDoc];
    var employees     : [var ContractorEmployee];
    var status        : ContractorStatus;
    var linkedPtwNumbers : [var Text];
    var performance   : ?ContractorPerformance;
    createdAt         : CT.Timestamp;
    var updatedAt     : CT.Timestamp;
  };

  public type ContractorView = {
    contractorId       : Text;
    companyName        : Text;
    registrationNumber : Text;
    contactPerson      : Text;
    email              : Text;
    phone              : Text;
    typeOfWork         : Text;
    contractStartDate  : Text;
    contractEndDate    : Text;
    documents          : [ContractorDocView];
    employees          : [ContractorEmployeeView];
    status             : ContractorStatus;
    linkedPtwNumbers   : [Text];
    performance        : ?ContractorPerformance;
    createdAt          : CT.Timestamp;
    updatedAt          : CT.Timestamp;
  };

  public type CreateContractorInput = {
    companyName        : Text;
    registrationNumber : Text;
    contactPerson      : Text;
    email              : Text;
    phone              : Text;
    typeOfWork         : Text;
    contractStartDate  : Text;
    contractEndDate    : Text;
  };

  // ─────────────────────────────────────────────────────
  // PTW PHASE 2 ENHANCEMENTS
  // ─────────────────────────────────────────────────────
  public type PermitExtension = {
    extendedBy      : CT.EmployeeId;
    originalEndTime : CT.Timestamp;
    newEndTime      : CT.Timestamp;
    reason          : Text;
    extendedAt      : CT.Timestamp;
  };

  // Linked to an existing PTW by permitNumber (FK)
  public type PTWExtension = {
    permitNumber           : Text;
    linkedJsaNumber        : ?Text;
    linkedHiraNumber       : ?Text;
    requiresLOTO           : Bool;
    gasTestO2              : ?Float;
    gasTestLEL             : ?Float;
    gasTestH2S             : ?Float;
    gasTestCO              : ?Float;
    gasTestPassed          : Bool;
    toolboxTalkDone        : Bool;
    toolboxAttendees       : [CT.EmployeeId];
    emergencyRescuePlan    : Bool;
    emergencyRescueDesc    : ?Text;
    extensions             : [PermitExtension];
    isCancelled            : Bool;
    cancellationReason     : ?Text;
    cancelledBy            : ?CT.EmployeeId;
    cancelledAt            : ?CT.Timestamp;
    createdAt              : CT.Timestamp;
  };

  public type PTWExtensionView = {
    permitNumber           : Text;
    linkedJsaNumber        : ?Text;
    linkedHiraNumber       : ?Text;
    requiresLOTO           : Bool;
    gasTestO2              : ?Float;
    gasTestLEL             : ?Float;
    gasTestH2S             : ?Float;
    gasTestCO              : ?Float;
    gasTestPassed          : Bool;
    toolboxTalkDone        : Bool;
    toolboxAttendees       : [CT.EmployeeId];
    emergencyRescuePlan    : Bool;
    emergencyRescueDesc    : ?Text;
    extensions             : [PermitExtension];
    isCancelled            : Bool;
    cancellationReason     : ?Text;
    cancelledBy            : ?CT.EmployeeId;
    cancelledAt            : ?CT.Timestamp;
    createdAt              : CT.Timestamp;
  };

};
