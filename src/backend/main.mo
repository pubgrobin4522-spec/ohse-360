import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import CT "types/common";
import T "types/auth-users-employees";
import IT "types/incidents-training-ptw";
import T2A "types/phase2-observations-hira-jsa";
import T2 "types/phase2-capa-esg-ai-ppe-contractor";
import Lib "lib/AuthUsersEmployees";
import ITPLib "lib/IncidentsTrainingPtw";
import AuthMixin "mixins/auth-users-employees-api";
import ITPMixin "mixins/incidents-training-ptw-api";
import OHJMixin "mixins/observations-hira-jsa-api";
import CAPAEsgMixin "mixins/capa-esg-api";
import AIPPEMixin "mixins/ai-ppe-loto-api";
import ConMixin "mixins/contractor-api";
import PtwExtMixin "mixins/ptw-extensions-api";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Migration "migration";



(with migration = Migration.run)
actor Main {

  // ─── Core state ──────────────────────────────────────
  let users        = Map.empty<CT.EmployeeId, T.User>();
  let sessions     = Map.empty<Text, CT.EmployeeId>();
  let employees    = Map.empty<Text, T.Employee>();
  let auditLog     = List.empty<T.AuditEntry>();
  let notifications= List.empty<T.Notification>();
  let state        = {
    var nextEmpSeq   = 1;
    var nextAuditId  = 0;
    var nextNotifId  = 0;
    adminEmail              = "admin@ohse360.internal";
    var systemAdminNotifyEmail = "sumesh.j@rktrwheels.com";
  };

  // ─── ITP state ────────────────────────────────────────
  let incidents  = Map.empty<Text, IT.Incident>();
  let capas      = List.empty<IT.CAPA>();
  let trainings  = Map.empty<Text, IT.Training>();
  let ptws       = Map.empty<Text, IT.PermitToWork>();
  let itp_state  = {
    var nextIncSeq  = 1;
    var nextTrnSeq  = 1;
    var nextPtwSeq  = 1;  // kept for backwards compat
    var nextCAPAId  = 0;
    var nextCertSeq = 1;
    var manHours    = 1_200_000;   // cumulative man-hours for TRIR/LTIFR
    var auditScore  = 87;          // audit score percentage
  };
  let ptw_state  = {
    var ptwMonthlyCounter = 0;
    var ptwLastMonth      = "";
  };
  let locationList : [Text] = [
    "Security Gate 1", "Security Gate 2", "Security Gate 3",
    "Propane Yard", "ETP & STP", "Forging Shop", "Machine Shop",
    "Utility 1", "Utility 2", "Hazardous Store", "Scrap Yard",
    "MRS Room", "EB Room", "110 KV Sub Station",
  ];
  let departmentList : [Text] = [
    "EHS", "Purchase and Store", "Production", "Operation",
    "Maintenance", "Maintenance - Automation", "Maintenance - Electrical",
    "Utility", "Admin", "HR", "Accounts & Finance", "Die Shop",
    "Design & Engineering", "Metallurgy & LAB", "Forging",
    "Heat Treatment", "IT & Infrastructure", "Quality",
  ];

  // ─── Phase 2: Observations, HIRA, JSA state ──────────
  let observations = List.empty<T2A.Observation>();
  let hiras        = List.empty<T2A.HIRA>();
  let jsas         = List.empty<T2A.JSA>();
  let ohj_state    = {
    var nextObsSeq  = 0;
    var nextHiraSeq = 0;
    var nextJsaSeq  = 0;
  };

  // ─── Phase 2: CAPA2 & ESG state ──────────────────────
  let capa2s          = List.empty<T2.CAPA2>();
  let capa2_state     = { var nextCapa2Seq = 0 };
  let wasteEntries    = List.empty<T2.WasteEntry>();
  let airEmissions    = List.empty<T2.AirEmissionEntry>();
  let waterEntries    = List.empty<T2.WaterEntry>();
  let effluentEntries = List.empty<T2.EffluentEntry>();
  let energyEntries   = List.empty<T2.EnergyEntry>();
  let carbonEntries   = List.empty<T2.CarbonEntry>();

  // ─── Phase 2: PPE, LOTO, AI Risk state ───────────────
  let ppeItems           = Map.empty<Text, T2.PPEItem>();
  let ppeInventory       = Map.empty<Text, T2.PPEInventory>();
  let ppeIssuances       = List.empty<T2.PPEIssuance>();
  let ppeInspections     = List.empty<T2.PPEInspection>();
  let lotos              = Map.empty<Text, T2.LOTO>();
  let riskScoreHistory   = List.empty<T2.RiskScoreEntry>();
  let apl_state = {
    var ppeSequence        = 0;
    var lotoSequence       = 0;
    var issuanceSequence   = 0;
    var inspectionSequence = 0;
    var riskScoreSeq       = 0;
  };

  // ─── Phase 2: Contractor state ────────────────────────
  let contractors = Map.empty<Text, T2.Contractor>();
  let con_state   = {
    var contractorSequence    = 0;
    var inductionCertSequence = 0;
  };

  // ─── Phase 2: PTW extensions state ───────────────────
  let ptwExtensions = Map.empty<Text, T2.PTWExtension>();

  // ─── Seed System Admin (runs once at first install) ─────────
  // Protected account: ID 230034, Sumesh J, D3IK-IBY8@janu
  // Dual role: System Admin + Safety Officer
  func seedSystemAdmin() {
    if (users.containsKey(230034)) return; // already seeded
    let adminUser = Lib.newUser(
      230034, "Sumesh J", "sumesh.j@rktrwheels.com",
      "Administration", "System Administrator",
      #SystemAdmin, Lib.hashPassword("D3IK-IBY8@janu"), false,
    );
    adminUser.roles := [#SystemAdmin, #SafetyOfficer];
    users.add(230034, adminUser);
  };

  seedSystemAdmin();

  // ─── Mixin includes ─────────────────────────────────────
  include AuthMixin(users, sessions, employees, auditLog, notifications, state);
  include ITPMixin(users, sessions, employees, auditLog, notifications, state, incidents, capas, trainings, ptws, itp_state, ptw_state, locationList, departmentList);
  include OHJMixin(users, sessions, employees, auditLog, notifications, state, observations, hiras, jsas, ohj_state);
  include CAPAEsgMixin(users, sessions, auditLog, notifications, state, capa2s, capa2_state, wasteEntries, airEmissions, waterEntries, effluentEntries, energyEntries, carbonEntries);
  include AIPPEMixin(users, sessions, employees, auditLog, notifications, state, incidents, capas, trainings, observations, capa2s, ppeItems, ppeInventory, ppeIssuances, ppeInspections, lotos, riskScoreHistory, apl_state);
  include ConMixin(users, sessions, auditLog, notifications, state, contractors, con_state);
  include PtwExtMixin(users, sessions, auditLog, notifications, state, ptws, ptwExtensions);
};
