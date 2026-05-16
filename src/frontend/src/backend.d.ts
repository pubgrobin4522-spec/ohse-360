import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Result_32 = {
    __kind__: "ok";
    ok: ObservationView;
} | {
    __kind__: "err";
    err: string;
};
export interface PermitExtension {
    newEndTime: Timestamp;
    originalEndTime: Timestamp;
    extendedAt: Timestamp;
    extendedBy: EmployeeId;
    reason: string;
}
export type Result_2 = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export interface KPISummary {
    trainingCompliancePct: number;
    auditScorePct: number;
    trir: number;
    ptwCompliancePct: number;
    ltifr: number;
    openCAPAs: bigint;
    nearMissCount: bigint;
    totalIncidents: bigint;
}
export interface CreateCAPAInput {
    rootCauseCat: RootCauseCat;
    source: CAPASource2;
    findingDescription: string;
    targetDate: string;
    linkedRecordNumber: string;
    capaType: CAPAType;
    priority: CAPAPriority;
    actionDescription: string;
    actionOwnerEmpId: EmployeeId;
    department: string;
    rootCauseDesc: string;
}
export interface TrainingView {
    name: string;
    createdAt: Timestamp;
    createdById: EmployeeId;
    trainingId: string;
    trainer: string;
    trainingDate: string;
    attendees: Array<TrainingAttendeeView>;
    trainingType: TrainingType;
    frequency: TrainingFrequency;
    department: string;
}
export interface NotificationView {
    id: bigint;
    link: string;
    createdAt: Timestamp;
    isRead: boolean;
    message: string;
    recipientId: EmployeeId;
}
export interface RiskScoreView {
    overallScore: bigint;
    calculatedAt: Timestamp;
    calculatedBy: string;
    unsafeObsCount: bigint;
    openHighCriticalIncidents: bigint;
    nearMissCount: bigint;
    trainingGapCount: bigint;
    departmentScores: Array<[string, bigint]>;
    riskLevel: RiskLevel;
    overdueCAPACount: bigint;
}
export type Result_40 = {
    __kind__: "ok";
    ok: HIRAView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_4 = {
    __kind__: "ok";
    ok: IncidentView;
} | {
    __kind__: "err";
    err: string;
};
export interface ObservationView {
    status: ObservationStatus;
    acknowledgedAt?: Timestamp;
    acknowledgedBy?: EmployeeId;
    linkedCapaId?: string;
    area: string;
    createdAt: Timestamp;
    observerName: string;
    description: string;
    photoUrl?: string;
    immediateAction: string;
    observerEmpId: EmployeeId;
    acknowledgeRemarks?: string;
    obsType: ObservationType;
    severity: ObservationSeverity;
    department: string;
    dateTime: Timestamp;
    obsNumber: string;
    location: string;
}
export type EmployeeId = bigint;
export interface ApprovalSignature {
    name: string;
    designation: string;
    approvalStatus: string;
    signedAt?: Timestamp;
    employeeId: EmployeeId;
    remarks: string;
    ipAddress: string;
}
export type Result_34 = {
    __kind__: "ok";
    ok: {
        active: bigint;
        completedThisMonth: bigint;
        overdue: bigint;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface JSAView {
    status: JSAStatus;
    linkedPtwNumber?: string;
    hodAt?: Timestamp;
    helmetRequired: boolean;
    analysisDate: string;
    area: string;
    soRemarks?: string;
    approvedBy?: EmployeeId;
    createdAt: Timestamp;
    soAt?: Timestamp;
    faceShield: boolean;
    emergencyContacts: string;
    reviewedBy?: EmployeeId;
    preparedBy: EmployeeId;
    updatedAt: Timestamp;
    steps: Array<JSAStep>;
    jobTitle: string;
    briefingAttendees: Array<EmployeeId>;
    harness: boolean;
    respirator: boolean;
    jsaNumber: string;
    hodRemarks?: string;
    safetyShoes: boolean;
    gloves: boolean;
    goggles: boolean;
    department: string;
    location: string;
}
export interface CreatePermitInput {
    crossReference: string;
    nominatedHodEmployeeId?: EmployeeId;
    supervisorName: string;
    selectedPPE: Array<string>;
    timeStart: string;
    jobLocation: string;
    area: string;
    jobDescription: string;
    validityDate: string;
    insurance?: InsuranceInfo;
    permitType: PermitType;
    issuingDepartment: string;
    isolation?: IsolationDetail;
    selectedHazards: Array<string>;
    checklist: Array<[string, boolean]>;
    customHazard: string;
    issuedTo: string;
    department: string;
    timeEnd: string;
    riskLevel: RiskLevel;
    contractorName: string;
}
export type Result_6 = {
    __kind__: "ok";
    ok: {
        token: string;
        mustChangePassword: boolean;
    };
} | {
    __kind__: "err";
    err: string;
};
export type Result_48 = {
    __kind__: "ok";
    ok: {
        byDept: Array<[string, bigint]>;
        closed: bigint;
        closureRate: bigint;
        total: bigint;
        open: bigint;
        overdue: bigint;
        avgDaysToClose: number;
        inProgress: bigint;
        bySource: Array<[string, bigint]>;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface EffluentEntry {
    samplingDate: string;
    isCompliant: boolean;
    value: number;
    parameter: EffluentParameter;
    createdAt: Timestamp;
    effluentType: EffluentType;
    department: string;
    regulatoryLimit: number;
    loggedBy: EmployeeId;
}
export type Result_26 = {
    __kind__: "ok";
    ok: Array<{
        severity: string;
        recommendation: string;
        driver: string;
    }>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_12 = {
    __kind__: "ok";
    ok: Array<PermitToWorkView>;
} | {
    __kind__: "err";
    err: string;
};
export interface ContractorEmployee {
    trade: string;
    inductionStatus: InductionStatus;
    inductionDate?: string;
    idNumber: string;
    empName: string;
    certificateNumber?: string;
}
export interface CreateHIRAInput {
    responsibleEmpId?: EmployeeId;
    area: string;
    taskDescription: string;
    reviewDate: string;
    department: string;
    location: string;
}
export type Result = {
    __kind__: "ok";
    ok: UserView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_10 = {
    __kind__: "ok";
    ok: Array<PPEIssuance>;
} | {
    __kind__: "err";
    err: string;
};
export interface PTWMasterData {
    departments: Array<string>;
    hazards: Array<string>;
    ppeList: Array<string>;
    permitTypes: Array<string>;
    locations: Array<string>;
}
export type Result_8 = {
    __kind__: "ok";
    ok: Array<TrainingView>;
} | {
    __kind__: "err";
    err: string;
};
export interface AddEffluentInput {
    samplingDate: string;
    value: number;
    parameter: EffluentParameter;
    effluentType: EffluentType;
    department: string;
    regulatoryLimit: number;
}
export interface WasteEntry {
    wasteType: WasteType;
    disposalMethod: string;
    createdAt: Timestamp;
    unit: string;
    manifestNumber: string;
    quantity: number;
    department: string;
    disposalDate: string;
    loggedBy: EmployeeId;
    contractorName: string;
}
export interface MonthlyTrend {
    month: bigint;
    year: bigint;
    incidentCount: bigint;
}
export interface InsuranceInfo {
    insuranceType: InsuranceType;
    documentUrls: Array<string>;
    validFrom: string;
    validTill: string;
    policyNumber: string;
    verificationStatus: string;
}
export interface LockEntryView {
    status: LockEntryStatus;
    assignedEmpId: EmployeeId;
    lockNumber: string;
}
export interface AirEmissionEntry {
    value: number;
    source: AirEmissionSource;
    createdAt: Timestamp;
    unit: string;
    pollutant: AirPollutant;
    isExceeded: boolean;
    measurementDate: string;
    department: string;
    regulatoryLimit: number;
    loggedBy: EmployeeId;
}
export type Result_44 = {
    __kind__: "ok";
    ok: Array<[string, bigint, string]>;
} | {
    __kind__: "err";
    err: string;
};
export interface CreateObservationInput {
    area: string;
    description: string;
    photoUrl?: string;
    immediateAction: string;
    obsType: ObservationType;
    severity: ObservationSeverity;
    department: string;
    dateTime: Timestamp;
    location: string;
}
export type Result_13 = {
    __kind__: "ok";
    ok: Array<ObservationView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_25 = {
    __kind__: "ok";
    ok: Array<RiskScoreView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_39 = {
    __kind__: "ok";
    ok: Array<MonthlyTrend>;
} | {
    __kind__: "err";
    err: string;
};
export interface PermitToWorkView {
    id: string;
    requestorSignature?: ApprovalSignature;
    status: PTWStatus;
    crossReference: string;
    safetyOfficerSignature?: ApprovalSignature;
    nominatedHodEmployeeId?: EmployeeId;
    nominatedAreaInChargeEmployeeId?: EmployeeId;
    supervisorName: string;
    selectedPPE: Array<string>;
    isolationAuthoritySignature?: ApprovalSignature;
    timeStart: string;
    jobLocation: string;
    area: string;
    jobDescription: string;
    createdAt: Timestamp;
    createdBy: EmployeeId;
    coPpm?: number;
    linkedJsaNumber?: string;
    validityDate: string;
    hodSignature?: ApprovalSignature;
    insurance?: InsuranceInfo;
    nominatedIsolationAuthorityEmployeeId?: EmployeeId;
    nominatedFinalIssuerEmployeeId?: EmployeeId;
    electricalEnergisation?: EnergisationRecord;
    updatedAt: Timestamp;
    permitType: PermitType;
    areaInChargeSignature?: ApprovalSignature;
    issuingDepartment: string;
    isolation?: IsolationDetail;
    selectedHazards: Array<string>;
    electricalApproverSignature?: ApprovalSignature;
    serviceProcessEnergisation?: EnergisationRecord;
    h2sPpm?: number;
    checklist: Array<[string, boolean]>;
    serviceProcessApproverSignature?: ApprovalSignature;
    emergencyRescueDescription: string;
    toolboxTalkAttendees: Array<string>;
    customHazard: string;
    issuedTo: string;
    lelPercent?: number;
    department: string;
    timeEnd: string;
    nominatedSafetyOfficerEmployeeId?: EmployeeId;
    riskLevel: RiskLevel;
    linkedHiraNumber?: string;
    o2Percent?: number;
    contractorName: string;
    finalIssuerSignature?: ApprovalSignature;
    emergencyRescuePlan: boolean;
    toolboxTalkDone: boolean;
}
export type Result_27 = {
    __kind__: "ok";
    ok: PTWExtensionView | null;
} | {
    __kind__: "err";
    err: string;
};
export type Result_11 = {
    __kind__: "ok";
    ok: Array<PPEInventoryView>;
} | {
    __kind__: "err";
    err: string;
};
export interface DeptOHSEScore {
    score: number;
    department: string;
}
export type Result_46 = {
    __kind__: "ok";
    ok: {
        performanceSummary: Array<[string, string]>;
        incidentCount: bigint;
        activeCount: bigint;
        inductionCompliance: bigint;
        expiringDocs: bigint;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface AddCarbonInput {
    month: bigint;
    co2eTonnes: number;
    year: bigint;
    description: string;
    scope: CarbonScope;
}
export interface CreateIncidentInput {
    description: string;
    capaActionOwnerId: EmployeeId;
    capaDeadline: string;
    injuredPersonCode?: string;
    severity: Severity;
    department: string;
    location: string;
    incidentDate: string;
    incidentType: IncidentType;
}
export interface CreateTrainingInput {
    attendeeCodes: Array<string>;
    name: string;
    trainer: string;
    trainingDate: string;
    trainingType: TrainingType;
    frequency: TrainingFrequency;
    department: string;
}
export interface CreateUserInput {
    password: string;
    designation: string;
    role: Role;
    fullName: string;
    email: string;
    employeeId: EmployeeId;
    department: string;
}
export type Result_21 = {
    __kind__: "ok";
    ok: Array<CAPAView>;
} | {
    __kind__: "err";
    err: string;
};
export interface PPEInventoryView {
    itemId: string;
    quantityInStock: bigint;
    lastUpdated: Timestamp;
    minStockLevel: bigint;
}
export interface JSAStep {
    stepNo: bigint;
    responsibleEmpId?: EmployeeId;
    hazards: string;
    controls: string;
    description: string;
    riskLevel: RiskLevel;
}
export interface ContractorView {
    status: ContractorStatus;
    documents: Array<ContractorDocView>;
    employees: Array<ContractorEmployeeView>;
    createdAt: Timestamp;
    contactPerson: string;
    contractorId: string;
    registrationNumber: string;
    email: string;
    contractEndDate: string;
    updatedAt: Timestamp;
    performance?: ContractorPerformance;
    companyName: string;
    phone: string;
    contractStartDate: string;
    typeOfWork: string;
    linkedPtwNumbers: Array<string>;
}
export type Result_36 = {
    __kind__: "ok";
    ok: Array<string>;
} | {
    __kind__: "err";
    err: string;
};
export interface PTWExtensionView {
    isCancelled: boolean;
    toolboxAttendees: Array<EmployeeId>;
    requiresLOTO: boolean;
    permitNumber: string;
    cancellationReason?: string;
    gasTestCO?: number;
    gasTestO2?: number;
    createdAt: Timestamp;
    linkedJsaNumber?: string;
    cancelledAt?: Timestamp;
    cancelledBy?: EmployeeId;
    gasTestH2S?: number;
    gasTestLEL?: number;
    extensions: Array<PermitExtension>;
    gasTestPassed: boolean;
    linkedHiraNumber?: string;
    emergencyRescueDesc?: string;
    emergencyRescuePlan: boolean;
    toolboxTalkDone: boolean;
}
export interface CAPA2View {
    status: CAPAStatus2;
    rootCauseCat: RootCauseCat;
    source: CAPASource2;
    createdAt: Timestamp;
    findingDescription: string;
    verifiedByEmpId?: EmployeeId;
    updatedAt: Timestamp;
    progressUpdate: string;
    completionEvidence?: string;
    targetDate: string;
    linkedRecordNumber: string;
    isOverdue: boolean;
    capaType: CAPAType;
    priority: CAPAPriority;
    actionDescription: string;
    actionOwnerEmpId: EmployeeId;
    department: string;
    rootCauseDesc: string;
    verifiedAt?: Timestamp;
    capaNumber: string;
}
export interface AddEnergyInput {
    month: bigint;
    carbonEquivalent: number;
    unit: string;
    year: bigint;
    target: number;
    energyType: EnergyType;
    department: string;
    consumption: number;
}
export type Result_42 = {
    __kind__: "ok";
    ok: {
        air: Array<AirEmissionEntry>;
        effluent: Array<EffluentEntry>;
        esgScore: bigint;
        carbon: Array<CarbonEntry>;
        waste: Array<WasteEntry>;
        water: Array<WaterEntry>;
        energy: Array<EnergyEntry>;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface WaterEntry {
    month: bigint;
    source: WaterSource;
    createdAt: Timestamp;
    year: bigint;
    target: number;
    department: string;
    loggedBy: EmployeeId;
    consumption: number;
}
export type Result_51 = {
    __kind__: "ok";
    ok: RiskScoreView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_3 = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export type Result_18 = {
    __kind__: "ok";
    ok: Array<EmployeeView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_23 = {
    __kind__: "ok";
    ok: TrainingView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_38 = {
    __kind__: "ok";
    ok: JSAView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_15 = {
    __kind__: "ok";
    ok: Array<JSAView>;
} | {
    __kind__: "err";
    err: string;
};
export interface PPEIssuance {
    issueDate: string;
    itemId: string;
    createdAt: Timestamp;
    size: string;
    employeeId: EmployeeId;
    quantity: bigint;
    issuanceId: string;
    condition: PPEConditionIssue;
}
export interface ContractorDocView {
    status: ContractorDocStatus;
    expiryDate: string;
    docType: string;
    uploadedAt: Timestamp;
}
export interface AddWasteInput {
    wasteType: WasteType;
    disposalMethod: string;
    unit: string;
    manifestNumber: string;
    quantity: number;
    department: string;
    disposalDate: string;
    contractorName: string;
}
export interface LOTOView {
    status: LOTOStatus;
    reEnergizationChecklist: Array<string>;
    createdAt: Timestamp;
    createdBy: EmployeeId;
    equipmentName: string;
    lotoNumber: string;
    authorizedAt?: Timestamp;
    workDescription: string;
    updatedAt: Timestamp;
    endDateTime?: Timestamp;
    energySources: Array<EnergySourceLOTO>;
    lockRegister: Array<LockEntryView>;
    tagNumber: string;
    authorizedEmpIds: Array<EmployeeId>;
    isolationPoints: Array<IsolationPoint>;
    startDateTime: Timestamp;
    authorizedByEmpId?: EmployeeId;
    procedureSteps: Array<string>;
}
export interface UserView {
    status: UserStatus;
    designation: string;
    createdAt: Timestamp;
    role: Role;
    fullName: string;
    email: string;
    employeeId: EmployeeId;
    department: string;
    lastLogin?: Timestamp;
    roles: Array<Role>;
    mustChangePassword: boolean;
}
export type Result_50 = {
    __kind__: "ok";
    ok: {
        byDept: Array<[string, bigint]>;
        total: bigint;
        safe: bigint;
        unsafe: bigint;
        score: bigint;
    };
} | {
    __kind__: "err";
    err: string;
};
export type Result_5 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface AuditEntry {
    id: bigint;
    action: AuditAction;
    actorName: string;
    actorRole: Role;
    actorId: EmployeeId;
    detail: string;
    timestamp: Timestamp;
    module: string;
    recordRef: string;
}
export interface EnergyEntry {
    month: bigint;
    carbonEquivalent: number;
    createdAt: Timestamp;
    unit: string;
    year: bigint;
    target: number;
    energyType: EnergyType;
    department: string;
    loggedBy: EmployeeId;
    consumption: number;
}
export interface CreateLOTOInput {
    equipmentName: string;
    workDescription: string;
    tagNumber: string;
    startDateTime: Timestamp;
}
export interface CreateContractorInput {
    contactPerson: string;
    registrationNumber: string;
    email: string;
    contractEndDate: string;
    companyName: string;
    phone: string;
    contractStartDate: string;
    typeOfWork: string;
}
export type Result_31 = {
    __kind__: "ok";
    ok: PermitToWorkView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_7 = {
    __kind__: "ok";
    ok: Array<UserView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_41 = {
    __kind__: "ok";
    ok: {
        complianceRate: bigint;
        carbonTotal: number;
        trendData: Array<[string, number]>;
        esgScore: bigint;
        waterTotal: number;
        wasteTotal: number;
        energyTotal: number;
    };
} | {
    __kind__: "err";
    err: string;
};
export type Result_28 = {
    __kind__: "ok";
    ok: {
        byType: Array<[string, bigint]>;
        avgCycleTimeDays: number;
        cancelledThisMonth: bigint;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface IsolationDetail {
    serviceOptions: Array<string>;
    description: string;
    isolationRequired: boolean;
    electricalOptions: Array<string>;
    isolationBy: EmployeeId;
    isolationDateTime?: Timestamp;
    lotoLockNumber: string;
    verificationStatus: string;
}
export type Result_9 = {
    __kind__: "ok";
    ok: Array<PPEItem>;
} | {
    __kind__: "err";
    err: string;
};
export interface PPEItem {
    itemId: string;
    createdAt: Timestamp;
    size: string;
    shelfLifeMonths: bigint;
    itemName: string;
    itemType: string;
    standard: string;
}
export interface CAPAView {
    id: bigint;
    status: CAPAStatus;
    actionOwnerId: EmployeeId;
    createdAt: Timestamp;
    description: string;
    deadline: string;
    closedAt?: Timestamp;
    actionOwnerName: string;
    incidentNumber: string;
}
export interface CreatePPEItemInput {
    size: string;
    shelfLifeMonths: bigint;
    itemName: string;
    itemType: string;
    standard: string;
}
export type Result_30 = {
    __kind__: "ok";
    ok: PTWMasterData;
} | {
    __kind__: "err";
    err: string;
};
export interface AddWaterInput {
    month: bigint;
    source: WaterSource;
    year: bigint;
    target: number;
    department: string;
    consumption: number;
}
export interface PTWExtension {
    isCancelled: boolean;
    toolboxAttendees: Array<EmployeeId>;
    requiresLOTO: boolean;
    permitNumber: string;
    cancellationReason?: string;
    gasTestCO?: number;
    gasTestO2?: number;
    createdAt: Timestamp;
    linkedJsaNumber?: string;
    cancelledAt?: Timestamp;
    cancelledBy?: EmployeeId;
    gasTestH2S?: number;
    gasTestLEL?: number;
    extensions: Array<PermitExtension>;
    gasTestPassed: boolean;
    linkedHiraNumber?: string;
    emergencyRescueDesc?: string;
    emergencyRescuePlan: boolean;
    toolboxTalkDone: boolean;
}
export type Timestamp = bigint;
export type Result_37 = {
    __kind__: "ok";
    ok: KPISummary;
} | {
    __kind__: "err";
    err: string;
};
export type Result_17 = {
    __kind__: "ok";
    ok: Array<HIRAView>;
} | {
    __kind__: "err";
    err: string;
};
export interface TrainingAttendeeView {
    certStatus?: CertificateStatus;
    expiryDate?: string;
    certificateId?: string;
    attendance: AttendanceStatus;
    empCode: string;
    empName: string;
}
export interface IncidentView {
    status: IncidentStatus;
    reportedByName: string;
    reportedById: EmployeeId;
    createdAt: Timestamp;
    description: string;
    closedAt?: Timestamp;
    injuredPersonCode?: string;
    incidentNumber: string;
    severity: Severity;
    department: string;
    correctiveAction: string;
    location: string;
    incidentDate: string;
    incidentType: IncidentType;
    rootCause: string;
}
export interface IsolationPoint {
    status: IsolationPointStatus;
    pointId: string;
    location: string;
    lockNumber: string;
}
export interface EmployeeView {
    contact: string;
    dateOfBirth: string;
    designation: string;
    createdAt: Timestamp;
    site: string;
    joiningDate: string;
    fullName: string;
    email: string;
    employmentType: EmploymentType;
    empCode: string;
    department: string;
    empStatus: EmployeeStatus;
}
export interface CreateJSAInput {
    linkedPtwNumber?: string;
    helmetRequired: boolean;
    analysisDate: string;
    area: string;
    faceShield: boolean;
    emergencyContacts: string;
    jobTitle: string;
    harness: boolean;
    respirator: boolean;
    safetyShoes: boolean;
    gloves: boolean;
    goggles: boolean;
    department: string;
    location: string;
}
export type Result_47 = {
    __kind__: "ok";
    ok: ContractorView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_16 = {
    __kind__: "ok";
    ok: Array<IncidentView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface HazardRow {
    responsibleEmpId?: EmployeeId;
    hazardType: HazardType;
    hazardDescription: string;
    residualRiskScore: bigint;
    additionalControls: string;
    severity: bigint;
    existingControls: string;
    likelihood: bigint;
    riskLevel: RiskLevel;
    riskScore: bigint;
    hazardId: string;
}
export type Result_22 = {
    __kind__: "ok";
    ok: Array<AuditEntry>;
} | {
    __kind__: "err";
    err: string;
};
export interface AddAirEmissionInput {
    value: number;
    source: AirEmissionSource;
    unit: string;
    pollutant: AirPollutant;
    measurementDate: string;
    department: string;
    regulatoryLimit: number;
}
export interface ContractorEmployeeView {
    trade: string;
    inductionStatus: InductionStatus;
    inductionDate?: string;
    idNumber: string;
    empName: string;
    certificateNumber?: string;
}
export type Result_19 = {
    __kind__: "ok";
    ok: Array<ContractorView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_29 = {
    __kind__: "ok";
    ok: {
        complianceRate: bigint;
        issuanceCount: bigint;
        lowStockItems: bigint;
        totalItems: bigint;
    };
} | {
    __kind__: "err";
    err: string;
};
export type Result_24 = {
    __kind__: "ok";
    ok: Array<[string, bigint]>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_14 = {
    __kind__: "ok";
    ok: Array<LOTOView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_49 = {
    __kind__: "ok";
    ok: CAPA2View;
} | {
    __kind__: "err";
    err: string;
};
export interface AddEmployeeInput {
    contact: string;
    dateOfBirth: string;
    designation: string;
    site: string;
    joiningDate: string;
    fullName: string;
    email: string;
    employmentType: EmploymentType;
    department: string;
}
export interface EnergisationRecord {
    signature: string;
    approverEmployeeId: EmployeeId;
    approvedAt?: Timestamp;
    approverName: string;
    checklistItems: Array<[string, boolean]>;
    lotoLockNumber: string;
    energisationType: string;
}
export type Result_33 = {
    __kind__: "ok";
    ok: Array<NotificationView>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_43 = {
    __kind__: "ok";
    ok: EmployeeView;
} | {
    __kind__: "err";
    err: string;
};
export type Result_35 = {
    __kind__: "ok";
    ok: LOTOView;
} | {
    __kind__: "err";
    err: string;
};
export interface ContractorPerformance {
    evaluatedAt: Timestamp;
    evaluatedBy: EmployeeId;
    ptwCompliance: number;
    overallRating: PerformanceRating;
    safetyScore: bigint;
    incidentCount: bigint;
    nearMissCount: bigint;
    trainingCompliance: number;
}
export type Result_45 = {
    __kind__: "ok";
    ok: Array<DeptOHSEScore>;
} | {
    __kind__: "err";
    err: string;
};
export interface CarbonEntry {
    month: bigint;
    co2eTonnes: number;
    createdAt: Timestamp;
    year: bigint;
    description: string;
    scope: CarbonScope;
    loggedBy: EmployeeId;
}
export interface HIRAView {
    status: HIRAStatus;
    responsibleEmpId?: EmployeeId;
    soEmpId?: EmployeeId;
    linkedPtwNumber?: string;
    aicAt?: Timestamp;
    hodAt?: Timestamp;
    hazards: Array<HazardRow>;
    aicRemarks?: string;
    area: string;
    hodEmpId?: EmployeeId;
    soRemarks?: string;
    createdAt: Timestamp;
    createdBy: EmployeeId;
    soAt?: Timestamp;
    aicEmpId?: EmployeeId;
    taskDescription: string;
    reviewDate: string;
    approvalStep: bigint;
    updatedAt: Timestamp;
    hodRemarks?: string;
    hiraNumber: string;
    department: string;
    location: string;
}
export type Result_20 = {
    __kind__: "ok";
    ok: Array<CAPA2View>;
} | {
    __kind__: "err";
    err: string;
};
export enum AirEmissionSource {
    Stack = "Stack",
    Vehicle = "Vehicle",
    Fugitive = "Fugitive"
}
export enum AirPollutant {
    CO2 = "CO2",
    NOx = "NOx",
    SOx = "SOx",
    VOC = "VOC",
    PM10 = "PM10"
}
export enum AttendanceStatus {
    Present = "Present",
    Absent = "Absent"
}
export enum AuditAction {
    Login = "Login",
    Deactivated = "Deactivated",
    Reactivated = "Reactivated",
    Closed = "Closed",
    PasswordChanged = "PasswordChanged",
    Updated = "Updated",
    Approved = "Approved",
    Rejected = "Rejected",
    Logout = "Logout",
    PasswordReset = "PasswordReset",
    Created = "Created"
}
export enum CAPASource2 {
    JSA = "JSA",
    HIRA = "HIRA",
    Incident = "Incident",
    Observation = "Observation",
    Audit = "Audit",
    Manual = "Manual"
}
export enum CAPAStatus {
    Open = "Open",
    Closed = "Closed",
    Overdue = "Overdue",
    InProgress = "InProgress"
}
export enum CAPAStatus2 {
    Open = "Open",
    Closed = "Closed",
    PendingVerification = "PendingVerification",
    Overdue = "Overdue",
    InProgress = "InProgress"
}
export enum CAPAType {
    Corrective = "Corrective",
    Preventive = "Preventive"
}
export enum CarbonScope {
    Scope1 = "Scope1",
    Scope2 = "Scope2",
    Scope3 = "Scope3"
}
export enum CertificateStatus {
    Valid = "Valid",
    ExpiringSoon = "ExpiringSoon",
    Expired = "Expired"
}
export enum ContractorDocStatus {
    Expiring = "Expiring",
    Valid = "Valid",
    Expired = "Expired"
}
export enum ContractorStatus {
    Active = "Active",
    Blacklisted = "Blacklisted",
    Expired = "Expired"
}
export enum EffluentParameter {
    PH = "PH",
    BOD = "BOD",
    COD = "COD",
    TSS = "TSS",
    HeavyMetals = "HeavyMetals"
}
export enum EffluentType {
    Domestic = "Domestic",
    Stormwater = "Stormwater",
    Process = "Process"
}
export enum EmployeeStatus {
    Inactive = "Inactive",
    Active = "Active",
    Resigned = "Resigned"
}
export enum EmploymentType {
    Contract = "Contract",
    FullTime = "FullTime",
    Temporary = "Temporary"
}
export enum EnergySourceLOTO {
    Chemical = "Chemical",
    Hydraulic = "Hydraulic",
    Gravitational = "Gravitational",
    Mechanical = "Mechanical",
    Thermal = "Thermal",
    Pneumatic = "Pneumatic",
    Electrical = "Electrical"
}
export enum EnergyType {
    Gas = "Gas",
    LPG = "LPG",
    Renewable = "Renewable",
    Electricity = "Electricity",
    Diesel = "Diesel"
}
export enum HIRAStatus {
    UnderReview = "UnderReview",
    Approved = "Approved",
    Draft = "Draft",
    Expired = "Expired"
}
export enum HazardType {
    Ergonomic = "Ergonomic",
    Chemical = "Chemical",
    Biological = "Biological",
    Psychological = "Psychological",
    Physical = "Physical",
    Environmental = "Environmental"
}
export enum IncidentStatus {
    UnderInvestigation = "UnderInvestigation",
    Open = "Open",
    Closed = "Closed",
    CAPAPending = "CAPAPending"
}
export enum IncidentType {
    LTI = "LTI",
    UnsafeAct = "UnsafeAct",
    UnsafeCondition = "UnsafeCondition",
    NearMiss = "NearMiss",
    Fatal = "Fatal",
    FirstAid = "FirstAid"
}
export enum InductionStatus {
    Fail = "Fail",
    Pass = "Pass",
    Pending = "Pending"
}
export enum InsuranceType {
    ESI = "ESI",
    GroupAccident = "GroupAccident",
    WorkerCompensation = "WorkerCompensation",
    EmployeeCompensation = "EmployeeCompensation"
}
export enum JSAStatus {
    UnderReview = "UnderReview",
    Closed = "Closed",
    Active = "Active",
    Approved = "Approved",
    Draft = "Draft"
}
export enum LOTOStatus {
    Active = "Active",
    Draft = "Draft",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export enum LockEntryStatus {
    Applied = "Applied",
    Removed = "Removed"
}
export enum ObservationSeverity {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export enum ObservationStatus {
    UnderReview = "UnderReview",
    Open = "Open",
    Closed = "Closed",
    CAPAPending = "CAPAPending"
}
export enum ObservationType {
    UnsafeAct = "UnsafeAct",
    UnsafeCondition = "UnsafeCondition",
    SafeAct = "SafeAct",
    PositiveReinforcement = "PositiveReinforcement",
    NearMiss = "NearMiss"
}
export enum PPEConditionIssue {
    New = "New",
    Reissued = "Reissued"
}
export enum PPEInspectionCondition {
    Good = "Good",
    Replace = "Replace",
    Damaged = "Damaged"
}
export enum PTWStatus {
    Closed = "Closed",
    HODReview = "HODReview",
    Active = "Active",
    IsolationReview = "IsolationReview",
    AreaReview = "AreaReview",
    Approved = "Approved",
    Suspended = "Suspended",
    Draft = "Draft",
    Rejected = "Rejected",
    FinalApproval = "FinalApproval",
    Submitted = "Submitted",
    SafetyReview = "SafetyReview",
    Expired = "Expired"
}
export enum PerformanceRating {
    Fair = "Fair",
    Good = "Good",
    Poor = "Poor",
    Excellent = "Excellent"
}
export enum PermitType {
    HotWork = "HotWork",
    HeightWork = "HeightWork",
    Shutdown = "Shutdown",
    ConfinedSpace = "ConfinedSpace",
    Lifting = "Lifting",
    ElectricalWork = "ElectricalWork",
    ChemicalHandling = "ChemicalHandling",
    GeneralWork = "GeneralWork",
    Excavation = "Excavation",
    ColdWork = "ColdWork"
}
export enum RiskLevel {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical"
}
export enum Role {
    HOD = "HOD",
    SystemAdmin = "SystemAdmin",
    ContractorAdmin = "ContractorAdmin",
    Employee = "Employee",
    AreaInCharge = "AreaInCharge",
    SafetyOfficer = "SafetyOfficer"
}
export enum RootCauseCat {
    ProcedureGap = "ProcedureGap",
    ManagementSystem = "ManagementSystem",
    HumanError = "HumanError",
    TrainingGap = "TrainingGap",
    Environmental = "Environmental",
    EquipmentFailure = "EquipmentFailure"
}
export enum TrainingFrequency {
    OneTime = "OneTime",
    ThreeYearly = "ThreeYearly",
    BiAnnual = "BiAnnual",
    Annual = "Annual"
}
export enum TrainingType {
    Induction = "Induction",
    Regulatory = "Regulatory",
    OnTheJob = "OnTheJob",
    Refresher = "Refresher",
    External = "External"
}
export enum UserStatus {
    Inactive = "Inactive",
    Active = "Active"
}
export enum WasteType {
    Hazardous = "Hazardous",
    General = "General",
    Recyclable = "Recyclable",
    Scheduled = "Scheduled"
}
export enum WaterSource {
    Recycled = "Recycled",
    Groundwater = "Groundwater",
    Municipal = "Municipal"
}
export interface backendInterface {
    acknowledgeObservation(token: string, obsNumber: string, remarks: string): Promise<Result_1>;
    actOnHIRA(token: string, hiraNumber: string, approve: boolean, remarks: string): Promise<Result_1>;
    actOnJSA(token: string, jsaNumber: string, approve: boolean, remarks: string): Promise<Result_1>;
    activateLoto(token: string, lotoNumber: string): Promise<Result_1>;
    addAirEmission(token: string, input: AddAirEmissionInput): Promise<Result_1>;
    addCarbonEntry(token: string, input: AddCarbonInput): Promise<Result_1>;
    addContractorDocument(token: string, contractorId: string, docType: string, expiryDate: string): Promise<Result_1>;
    addContractorEmployee(token: string, contractorId: string, emp: ContractorEmployee): Promise<Result_1>;
    addEffluentEntry(token: string, input: AddEffluentInput): Promise<Result_1>;
    addEmployee(token: string, input: AddEmployeeInput): Promise<Result_43>;
    addEnergyEntry(token: string, input: AddEnergyInput): Promise<Result_1>;
    addHazardRow(token: string, hiraNumber: string, rowId: string, hazardDescription: string, hazardType: HazardType, likelihood: bigint, severity: bigint, existingControls: string, additionalControls: string, residualRiskScore: bigint, responsibleEmpId: EmployeeId | null): Promise<Result_1>;
    addWasteEntry(token: string, input: AddWasteInput): Promise<Result_1>;
    addWaterEntry(token: string, input: AddWaterInput): Promise<Result_1>;
    answerRiskQuery(token: string, question: string): Promise<Result_5>;
    approvePTWAreaInCharge(token: string, permitId: string, remarks: string, nominatedNextId: bigint): Promise<Result_1>;
    approvePTWFinalIssuer(token: string, permitId: string, remarks: string): Promise<Result_1>;
    approvePTWHOD(token: string, permitId: string, remarks: string, nominatedAreaInChargeId: bigint): Promise<Result_1>;
    approvePTWIsolationAuthority(token: string, permitId: string, remarks: string, nominatedSafetyOfficerId: bigint): Promise<Result_1>;
    approvePTWSafetyOfficer(token: string, permitId: string, remarks: string, nominatedFinalIssuerId: bigint): Promise<Result_1>;
    calculateRiskScore(token: string): Promise<Result_51>;
    cancelLoto(token: string, lotoNumber: string, reason: string): Promise<Result_1>;
    cancelPermit(token: string, permitNumber: string, reason: string): Promise<Result_1>;
    changePassword(token: string, oldPassword: string, newPassword: string): Promise<Result_1>;
    checkAndUpdateDocumentStatuses(): Promise<void>;
    checkOverdueCapas(): Promise<void>;
    closeCAPA(token: string, capaId: bigint): Promise<Result_1>;
    closeObservation(token: string, obsNumber: string): Promise<Result_1>;
    closePTW(token: string, permitId: string): Promise<Result_1>;
    completeLoto(token: string, lotoNumber: string): Promise<Result_1>;
    createCapa2(token: string, input: CreateCAPAInput): Promise<Result_5>;
    createContractor(token: string, input: CreateContractorInput): Promise<Result_5>;
    createHIRA(token: string, input: CreateHIRAInput): Promise<Result_5>;
    createJSA(token: string, input: CreateJSAInput): Promise<Result_5>;
    createLoto(token: string, input: CreateLOTOInput): Promise<Result_5>;
    createObservation(token: string, input: CreateObservationInput): Promise<Result_5>;
    createOrUpdatePtwExtension(token: string, permitNumber: string, ext: PTWExtension): Promise<Result_1>;
    createPTW(token: string, input: CreatePermitInput): Promise<Result_5>;
    createPpeItem(token: string, input: CreatePPEItemInput): Promise<Result_5>;
    createTraining(token: string, input: CreateTrainingInput): Promise<Result_23>;
    createUser(token: string, input: CreateUserInput): Promise<Result>;
    extendPermit(token: string, permitNumber: string, newEndTime: Timestamp, reason: string): Promise<Result_1>;
    getBbsStats(token: string): Promise<Result_50>;
    getCapa2(token: string, capaNumber: string): Promise<Result_49>;
    getCapa2Stats(token: string): Promise<Result_48>;
    getContractor(token: string, contractorId: string): Promise<Result_47>;
    getContractorStats(token: string): Promise<Result_46>;
    getDepartments(token: string): Promise<Result_36>;
    getDeptOHSEScores(token: string): Promise<Result_45>;
    getDeptRiskBreakdown(token: string): Promise<Result_44>;
    getEmployee(token: string, empCode: string): Promise<Result_43>;
    getEsgData(token: string): Promise<Result_42>;
    getEsgStats(token: string, month: bigint | null, year: bigint | null, department: string | null): Promise<Result_41>;
    getHIRA(token: string, hiraNumber: string): Promise<Result_40>;
    getIncident(token: string, incNum: string): Promise<Result_4>;
    getIncidentTrend(token: string, year: bigint): Promise<Result_39>;
    getJSA(token: string, jsaNumber: string): Promise<Result_38>;
    getKPISummary(token: string, filterDept: string | null): Promise<Result_37>;
    getLocations(token: string): Promise<Result_36>;
    getLoto(token: string, lotoNumber: string): Promise<Result_35>;
    getLotoStats(token: string): Promise<Result_34>;
    getNotifications(token: string): Promise<Result_33>;
    getObservation(token: string, obsNumber: string): Promise<Result_32>;
    getPTW(token: string, permitId: string): Promise<Result_31>;
    getPTWMasterData(token: string): Promise<Result_30>;
    getPpeStats(token: string): Promise<Result_29>;
    getPtwDashboardStats(token: string): Promise<Result_28>;
    getPtwExtension(token: string, permitNumber: string): Promise<Result_27>;
    getRiskRecommendations(token: string): Promise<Result_26>;
    getRiskScoreHistory(token: string): Promise<Result_25>;
    getRiskScoreTrend(token: string): Promise<Result_24>;
    getTraining(token: string, trainingId: string): Promise<Result_23>;
    issuePpe(token: string, employeeId: bigint, itemId: string, size: string, quantity: bigint, condition: PPEConditionIssue): Promise<Result_5>;
    linkContractorToPtw(token: string, contractorId: string, ptwNumber: string): Promise<Result_1>;
    listAuditEntries(token: string, filterModule: string | null, fromTime: Timestamp | null, toTime: Timestamp | null): Promise<Result_22>;
    listCAPAs(token: string, filterInc: string | null): Promise<Result_21>;
    listCapa2s(token: string): Promise<Result_20>;
    listContractors(token: string): Promise<Result_19>;
    listEmployees(token: string, filterDept: string | null, filterSite: string | null, filterStatus: EmployeeStatus | null, search: string | null): Promise<Result_18>;
    listHIRAs(token: string): Promise<Result_17>;
    listIncidents(token: string, filterType: IncidentType | null, filterSeverity: Severity | null, filterStatus: IncidentStatus | null, filterDept: string | null): Promise<Result_16>;
    listJSAs(token: string): Promise<Result_15>;
    listLotos(token: string): Promise<Result_14>;
    listObservations(token: string): Promise<Result_13>;
    listPTWs(token: string, filterStatus: PTWStatus | null, filterType: PermitType | null): Promise<Result_12>;
    listPpeInventory(token: string): Promise<Result_11>;
    listPpeIssuances(token: string, employeeId: bigint | null): Promise<Result_10>;
    listPpeItems(token: string): Promise<Result_9>;
    listTrainings(token: string, filterDept: string | null, filterType: TrainingType | null): Promise<Result_8>;
    listUsers(token: string, filterRole: Role | null, filterDept: string | null, filterStatus: UserStatus | null): Promise<Result_7>;
    login(employeeId: EmployeeId, password: string): Promise<Result_6>;
    logout(token: string): Promise<void>;
    markAttendance(token: string, trainingId: string, empCode: string, attendance: AttendanceStatus): Promise<Result_1>;
    markNotifRead(token: string, notifId: bigint): Promise<Result_1>;
    recordContractorPerformance(token: string, contractorId: string, performance: ContractorPerformance): Promise<Result_1>;
    recordEnergisation(token: string, permitId: string, record: EnergisationRecord): Promise<Result_1>;
    recordInduction(token: string, contractorId: string, empIdNumber: string, passed: boolean): Promise<Result_5>;
    recordJSABriefing(token: string, jsaNumber: string, attendeeIds: Array<EmployeeId>): Promise<Result_1>;
    recordPpeInspection(token: string, itemId: string, condition: PPEInspectionCondition, remarks: string, inspectionDate: string): Promise<Result_5>;
    recordToolboxTalk(token: string, permitNumber: string, attendeeIds: Array<EmployeeId>): Promise<Result_1>;
    rejectPTW(token: string, permitId: string, remarks: string): Promise<Result_1>;
    reportIncident(token: string, input: CreateIncidentInput): Promise<Result_4>;
    resetPassword(token: string, targetEmployeeId: EmployeeId, newPassword: string): Promise<Result_1>;
    setPtwGasTest(token: string, permitNumber: string, o2: number, lel: number, h2s: number, co: number): Promise<Result_3>;
    setUserStatus(token: string, targetEmployeeId: EmployeeId, newStatus: UserStatus): Promise<Result_1>;
    submitCapa2ForVerification(token: string, capaNumber: string): Promise<Result_1>;
    submitHIRAForApproval(token: string, hiraNumber: string): Promise<Result_1>;
    submitJSAForApproval(token: string, jsaNumber: string): Promise<Result_1>;
    submitPTW(token: string, permitId: string, nominatedHodId: bigint): Promise<Result_1>;
    suspendPTW(token: string, permitId: string, reason: string): Promise<Result_1>;
    unreadNotifCount(token: string): Promise<Result_2>;
    updateCapa2Progress(token: string, capaNumber: string, progressUpdate: string, evidence: string | null): Promise<Result_1>;
    updateContractorStatus(token: string, contractorId: string, status: ContractorStatus): Promise<Result_1>;
    updateIncidentStatus(token: string, incNum: string, newStatus: IncidentStatus, rootCause: string, correctiveAction: string): Promise<Result_1>;
    updateLockStatus(token: string, lotoNumber: string, lockNumber: string, newStatus: LockEntryStatus): Promise<Result_1>;
    updatePpeInventory(token: string, itemId: string, quantityDelta: bigint, minLevel: bigint): Promise<Result_1>;
    verifyCapa2(token: string, capaNumber: string, approved: boolean, remarks: string): Promise<Result_1>;
    whoAmI(token: string): Promise<Result>;
}
