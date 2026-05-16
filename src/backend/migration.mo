import Map "mo:core/Map";
import List "mo:core/List";
import IT "types/incidents-training-ptw";
import T "types/auth-users-employees";
import CT "types/common";
import T2A "types/phase2-observations-hira-jsa";
import T2 "types/phase2-capa-esg-ai-ppe-contractor";

// Migration: ptws field type changed from Map<Text, OldPTW> to Map<Text, IT.PermitToWork>.
// Since all prior data was demo/seed data (no real production permits), we discard the old
// ptws map and start fresh. All other stable state passes through unchanged.
module {

  // ─── Old types (copied inline from .old/src/backend/types/) ─────────────────

  type OldRole = {
    #SystemAdmin; #Employee; #SafetyOfficer;
    #HOD; #AreaInCharge; #ContractorAdmin;
  };

  type OldApprovalStep = {
    approverId   : CT.EmployeeId;
    approverName : Text;
    role         : OldRole;
    var approved : ?Bool;
    var remarks  : Text;
    var actionAt : ?CT.Timestamp;
  };

  type OldPTWStatus = {
    #Draft; #PendingHOD; #PendingAreaInCharge; #PendingSafetyOfficer;
    #Active; #Completed; #Closed; #Rejected;
  };

  type OldPermitType = {
    #HotWork; #ColdWork; #ConfinedSpace;
    #WorkAtHeight; #ElectricalIsolation; #Excavation;
  };

  type OldPTW = {
    permitNumber    : Text;
    permitType      : OldPermitType;
    workDescription : Text;
    location        : Text;
    startDateTime   : Text;
    endDateTime     : Text;
    requestedById   : CT.EmployeeId;
    requestedByName : Text;
    contractorTeam  : Text;
    riskAssessed    : Bool;
    ppeRequired     : [Text];
    var status      : OldPTWStatus;
    var hodStep     : ?OldApprovalStep;
    var aicStep     : ?OldApprovalStep;
    var soStep      : ?OldApprovalStep;
    var rejectedAt  : ?CT.Timestamp;
    var rejectedRemarks : Text;
    var closedAt    : ?CT.Timestamp;
    createdAt       : CT.Timestamp;
  };

  // ─── Old actor stable state ──────────────────────────────────────────────────

  public type OldActor = {
    // Core state
    users         : Map.Map<CT.EmployeeId, T.User>;
    sessions      : Map.Map<Text, CT.EmployeeId>;
    employees     : Map.Map<Text, T.Employee>;
    auditLog      : List.List<T.AuditEntry>;
    notifications : List.List<T.Notification>;
    state         : {
      var nextEmpSeq             : Nat;
      var nextAuditId            : Nat;
      var nextNotifId            : Nat;
      adminEmail                 : Text;
      var systemAdminNotifyEmail : Text;
    };
    // ITP state
    incidents  : Map.Map<Text, IT.Incident>;
    capas      : List.List<IT.CAPA>;
    trainings  : Map.Map<Text, IT.Training>;
    ptws       : Map.Map<Text, OldPTW>;   // OLD type
    itp_state  : {
      var nextIncSeq  : Nat;
      var nextTrnSeq  : Nat;
      var nextPtwSeq  : Nat;
      var nextCAPAId  : Nat;
      var nextCertSeq : Nat;
      var manHours    : Nat;
      var auditScore  : Nat;
    };
    // Phase 2: Observations, HIRA, JSA
    observations : List.List<T2A.Observation>;
    hiras        : List.List<T2A.HIRA>;
    jsas         : List.List<T2A.JSA>;
    ohj_state    : {
      var nextObsSeq  : Nat;
      var nextHiraSeq : Nat;
      var nextJsaSeq  : Nat;
    };
    // Phase 2: CAPA2 & ESG
    capa2s          : List.List<T2.CAPA2>;
    capa2_state     : { var nextCapa2Seq : Nat };
    wasteEntries    : List.List<T2.WasteEntry>;
    airEmissions    : List.List<T2.AirEmissionEntry>;
    waterEntries    : List.List<T2.WaterEntry>;
    effluentEntries : List.List<T2.EffluentEntry>;
    energyEntries   : List.List<T2.EnergyEntry>;
    carbonEntries   : List.List<T2.CarbonEntry>;
    // Phase 2: PPE, LOTO, AI Risk
    ppeItems         : Map.Map<Text, T2.PPEItem>;
    ppeInventory     : Map.Map<Text, T2.PPEInventory>;
    ppeIssuances     : List.List<T2.PPEIssuance>;
    ppeInspections   : List.List<T2.PPEInspection>;
    lotos            : Map.Map<Text, T2.LOTO>;
    riskScoreHistory : List.List<T2.RiskScoreEntry>;
    apl_state : {
      var ppeSequence        : Nat;
      var lotoSequence       : Nat;
      var issuanceSequence   : Nat;
      var inspectionSequence : Nat;
      var riskScoreSeq       : Nat;
    };
    // Phase 2: Contractor
    contractors : Map.Map<Text, T2.Contractor>;
    con_state   : {
      var contractorSequence    : Nat;
      var inductionCertSequence : Nat;
    };
    // Phase 2: PTW extensions
    ptwExtensions : Map.Map<Text, T2.PTWExtension>;
  };

  // ─── New actor stable state ──────────────────────────────────────────────────

  public type NewActor = {
    // Core state (unchanged)
    users         : Map.Map<CT.EmployeeId, T.User>;
    sessions      : Map.Map<Text, CT.EmployeeId>;
    employees     : Map.Map<Text, T.Employee>;
    auditLog      : List.List<T.AuditEntry>;
    notifications : List.List<T.Notification>;
    state         : {
      var nextEmpSeq             : Nat;
      var nextAuditId            : Nat;
      var nextNotifId            : Nat;
      adminEmail                 : Text;
      var systemAdminNotifyEmail : Text;
    };
    // ITP state — ptws now holds new PermitToWork type
    incidents  : Map.Map<Text, IT.Incident>;
    capas      : List.List<IT.CAPA>;
    trainings  : Map.Map<Text, IT.Training>;
    ptws       : Map.Map<Text, IT.PermitToWork>;  // NEW type
    itp_state  : {
      var nextIncSeq  : Nat;
      var nextTrnSeq  : Nat;
      var nextPtwSeq  : Nat;
      var nextCAPAId  : Nat;
      var nextCertSeq : Nat;
      var manHours    : Nat;
      var auditScore  : Nat;
    };
    // ptw_state is new — not in OldActor; gets initializer on upgrade
    // locationList / departmentList are new immutable fields; get initializers on upgrade
    // Phase 2: unchanged
    observations : List.List<T2A.Observation>;
    hiras        : List.List<T2A.HIRA>;
    jsas         : List.List<T2A.JSA>;
    ohj_state    : {
      var nextObsSeq  : Nat;
      var nextHiraSeq : Nat;
      var nextJsaSeq  : Nat;
    };
    capa2s          : List.List<T2.CAPA2>;
    capa2_state     : { var nextCapa2Seq : Nat };
    wasteEntries    : List.List<T2.WasteEntry>;
    airEmissions    : List.List<T2.AirEmissionEntry>;
    waterEntries    : List.List<T2.WaterEntry>;
    effluentEntries : List.List<T2.EffluentEntry>;
    energyEntries   : List.List<T2.EnergyEntry>;
    carbonEntries   : List.List<T2.CarbonEntry>;
    ppeItems         : Map.Map<Text, T2.PPEItem>;
    ppeInventory     : Map.Map<Text, T2.PPEInventory>;
    ppeIssuances     : List.List<T2.PPEIssuance>;
    ppeInspections   : List.List<T2.PPEInspection>;
    lotos            : Map.Map<Text, T2.LOTO>;
    riskScoreHistory : List.List<T2.RiskScoreEntry>;
    apl_state : {
      var ppeSequence        : Nat;
      var lotoSequence       : Nat;
      var issuanceSequence   : Nat;
      var inspectionSequence : Nat;
      var riskScoreSeq       : Nat;
    };
    contractors : Map.Map<Text, T2.Contractor>;
    con_state   : {
      var contractorSequence    : Nat;
      var inductionCertSequence : Nat;
    };
    ptwExtensions : Map.Map<Text, T2.PTWExtension>;
  };

  // ─── Migration function ──────────────────────────────────────────────────────
  // ptws: old demo/seed permits are discarded — return empty map.
  // All other fields pass through unchanged.
  public func run(old : OldActor) : NewActor {
    {
      // Core
      users         = old.users;
      sessions      = old.sessions;
      employees     = old.employees;
      auditLog      = old.auditLog;
      notifications = old.notifications;
      state         = old.state;
      // ITP — discard old PTWs, keep everything else
      incidents  = old.incidents;
      capas      = old.capas;
      trainings  = old.trainings;
      ptws       = Map.empty<Text, IT.PermitToWork>();  // fresh start
      itp_state  = old.itp_state;
      // Phase 2
      observations    = old.observations;
      hiras           = old.hiras;
      jsas            = old.jsas;
      ohj_state       = old.ohj_state;
      capa2s          = old.capa2s;
      capa2_state     = old.capa2_state;
      wasteEntries    = old.wasteEntries;
      airEmissions    = old.airEmissions;
      waterEntries    = old.waterEntries;
      effluentEntries = old.effluentEntries;
      energyEntries   = old.energyEntries;
      carbonEntries   = old.carbonEntries;
      ppeItems         = old.ppeItems;
      ppeInventory     = old.ppeInventory;
      ppeIssuances     = old.ppeIssuances;
      ppeInspections   = old.ppeInspections;
      lotos            = old.lotos;
      riskScoreHistory = old.riskScoreHistory;
      apl_state        = old.apl_state;
      contractors      = old.contractors;
      con_state        = old.con_state;
      ptwExtensions    = old.ptwExtensions;
    }
  };
};
