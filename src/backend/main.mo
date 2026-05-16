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
  let ptws       = Map.empty<Text, IT.PTW>();
  let itp_state  = {
    var nextIncSeq  = 1;
    var nextTrnSeq  = 1;
    var nextPtwSeq  = 1;
    var nextCAPAId  = 0;
    var nextCertSeq = 1;
    var manHours    = 1_200_000;   // cumulative man-hours for TRIR/LTIFR
    var auditScore  = 87;          // audit score percentage
  };

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

  // ─── Seed data (runs once at first install) ──────────────
  // Protected System Admin: ID 230034, Sumesh J, D3IK-IBY8@janu
  func seedIfEmpty() {
    if (not users.isEmpty()) return; // already seeded on prior install


    // ─ System Admin (protected, no forced password change) ─
    // Dual role: System Admin + Safety Officer
    let adminUser = Lib.newUser(
      230034, "Sumesh J", "sumesh.j@rktrwheels.com",
      "Administration", "System Administrator",
      #SystemAdmin, Lib.hashPassword("D3IK-IBY8@janu"), false,
    );
    adminUser.roles := [#SystemAdmin, #SafetyOfficer];
    users.add(230034, adminUser);

    // ─ Demo users ───────────────────────────────────
    // password for all demo users: Safety@360
    let demoPw = Lib.hashPassword("Safety@360");

    users.add(100001, Lib.newUser(100001, "Rajesh Kumar",   "rajesh.kumar@ohse360.in",   "Operations",   "Plant Operator",        #Employee,         demoPw, true));
    users.add(100002, Lib.newUser(100002, "Priya Menon",    "priya.menon@ohse360.in",    "Safety",       "Safety Officer",        #SafetyOfficer,    demoPw, true));
    users.add(100003, Lib.newUser(100003, "Mohammed Irfan", "irfan@ohse360.in",          "Operations",   "Head of Department",    #HOD,              demoPw, true));
    users.add(100004, Lib.newUser(100004, "Sunita Sharma",  "sunita.sharma@ohse360.in",  "Maintenance",  "Area In Charge",        #AreaInCharge,     demoPw, true));
    users.add(100005, Lib.newUser(100005, "Deepak Nair",    "deepak.nair@ohse360.in",    "Contractors",  "Contractor Supervisor", #ContractorAdmin,  demoPw, true));

    // ─ Demo employees (master records) ─────────────────
    let ops  = "Operations";
    let safe = "Safety";
    let maint= "Maintenance";
    let hr   = "HR";
    let eng  = "Engineering";

    let addEmp = func(
      name : Text, dob : Text, contact : Text, email : Text,
      dept : Text, desig : Text, site : Text, join : Text,
      empType : T.EmploymentType,
    ) {
      let seq = state.nextEmpSeq;
      state.nextEmpSeq += 1;
      let code = Lib.genEmpCode(seq);
      employees.add(code, Lib.newEmployee(code, {
        fullName = name; dateOfBirth = dob; contact = contact;
        email = email; department = dept; designation = desig;
        site = site; joiningDate = join; employmentType = empType;
      }));
    };

    addEmp("Rajesh Kumar",       "1985-04-12", "+91-9800100001", "rajesh.kumar@ohse360.in",   ops,   "Plant Operator",            "Site A", "2018-06-01", #FullTime);
    addEmp("Priya Menon",        "1990-07-22", "+91-9800100002", "priya.menon@ohse360.in",    safe,  "Safety Officer",            "Site A", "2019-03-15", #FullTime);
    addEmp("Mohammed Irfan",     "1978-11-05", "+91-9800100003", "irfan@ohse360.in",          ops,   "Head of Department",        "Site A", "2010-01-10", #FullTime);
    addEmp("Sunita Sharma",      "1982-02-18", "+91-9800100004", "sunita.sharma@ohse360.in",  maint, "Area In Charge",            "Site B", "2015-08-20", #FullTime);
    addEmp("Deepak Nair",        "1988-09-30", "+91-9800100005", "deepak.nair@ohse360.in",    eng,   "Contractor Supervisor",     "Site B", "2020-11-01", #Contract);
    addEmp("Anitha Krishnan",    "1993-01-14", "+91-9800100006", "anitha@ohse360.in",         hr,    "HR Executive",              "Site A", "2021-04-05", #FullTime);
    addEmp("Vijay Prakash",      "1980-06-28", "+91-9800100007", "vijay@ohse360.in",          eng,   "Electrical Engineer",       "Site C", "2012-07-17", #FullTime);
    addEmp("Shalini Rao",        "1995-12-03", "+91-9800100008", "shalini@ohse360.in",        safe,  "HSE Inspector",             "Site C", "2022-01-10", #FullTime);
    addEmp("Abdul Rashid",       "1975-08-19", "+91-9800100009", "abdul@ohse360.in",          maint, "Mechanical Technician",     "Site B", "2008-03-22", #FullTime);
    addEmp("Kavitha Subramaniam","1991-05-25", "+91-9800100010", "kavitha@ohse360.in",        ops,   "Process Technician",        "Site A", "2017-09-11", #FullTime);
    addEmp("Ravi Mohan",         "1983-03-07", "+91-9800100011", "ravi@ohse360.in",           eng,   "Instrumentation Engineer",  "Site C", "2013-05-30", #FullTime);
    addEmp("Fatima Zahra",       "1997-10-16", "+91-9800100012", "fatima@ohse360.in",         hr,    "Training Coordinator",      "Site A", "2023-02-20", #Temporary);
  };

  // ─── Seed demo incidents, trainings, PTWs ─────────────────
  func seedITPData() {
    if (not incidents.isEmpty()) return; // already seeded

    let year = 2026;

    // ── Helper: seed one incident + CAPA ────────────────────
    let addInc = func(
      seq : Nat,
      iType : IT.IncidentType,
      sev   : IT.Severity,
      loc   : Text,
      dept  : Text,
      desc  : Text,
      date  : Text,
      injCode : ?Text,
      stat  : IT.IncidentStatus,
      root  : Text,
      corr  : Text,
      capaOwner : CT.EmployeeId,
      capaDeadline : Text,
    ) {
      let num = ITPLib.incidentNumber(year, seq);
      let inc : IT.Incident = {
        incidentNumber  = num;
        incidentType    = iType;
        var severity    = sev;
        var status      = stat;
        location        = loc;
        department      = dept;
        description     = desc;
        reportedById    = 100001;
        reportedByName  = "Rajesh Kumar";
        incidentDate    = date;
        injuredPersonCode = injCode;
        var rootCause   = root;
        var correctiveAction = corr;
        var closedAt    = if (stat == #Closed) ?1_747_000_000_000_000_000 else null;
        createdAt       = 1_747_000_000_000_000_000;
      };
      incidents.add(num, inc);
      let capaId = itp_state.nextCAPAId;
      itp_state.nextCAPAId += 1;
      let ownerName = switch (users.get(capaOwner)) { case (?u) u.fullName; case null "Safety Officer" };
      let capa : IT.CAPA = {
        id             = capaId;
        incidentNumber = num;
        var description = "Corrective action for: " # num;
        actionOwnerId  = capaOwner;
        actionOwnerName = ownerName;
        deadline       = capaDeadline;
        var status     = if (stat == #Closed) #Closed else #Open;
        var closedAt   = if (stat == #Closed) ?1_747_000_000_000_000_000 else null;
        createdAt      = 1_747_000_000_000_000_000;
      };
      capas.add(capa);
      itp_state.nextIncSeq += 1;
    };

    // INC-2026-00001  Near Miss  Low  Open
    addInc(1, #NearMiss,  #Low,      "Pump House A",      "Operations",   "Worker slipped near wet pump base; no injury.",                            "2026-01-10", null,             #Open,               "",                                  "",                                        100002, "2026-02-10");
    // INC-2026-00002  LTI  High  UnderInvestigation
    addInc(2, #LTI,       #High,     "Reactor Deck B",    "Operations",   "Operator fell from platform while accessing valve. Lost 3 working days.",  "2026-02-14", ?"EMP-00001",     #UnderInvestigation, "",                                  "",                                        100002, "2026-03-20");
    // INC-2026-00003  UnsafeAct  Medium  CAPAPending
    addInc(3, #UnsafeAct, #Medium,   "Chemical Store",    "Maintenance",  "Technician found handling chemicals without PPE.",                         "2026-03-05", ?"EMP-00009",     #CAPAPending,        "Lack of PPE awareness",             "Conduct refresher safety training",       100004, "2026-04-05");
    // INC-2026-00004  FirstAid  Low  Closed
    addInc(4, #FirstAid,  #Low,      "Electrical Panel C", "Engineering", "Minor cut to hand from exposed cable tray edge.",                          "2026-03-22", ?"EMP-00007",     #Closed,             "Sharp edge not guarded",            "Cable tray edge guard installed",         100002, "2026-04-22");
    // INC-2026-00005  Fatal  Critical  Closed
    addInc(5, #Fatal,     #Critical, "Confined Space D",  "Maintenance",  "Fatal asphyxiation in confined space during maintenance.",                  "2026-04-02", ?"EMP-00009",     #Closed,             "No gas test before entry; no buddy", "Mandatory confined space entry protocol enforced", 100002, "2026-05-02");

    // ── Training records ────────────────────────────────────
    let addTrn = func(
      seq       : Nat,
      name      : Text,
      tType     : IT.TrainingType,
      freq      : IT.TrainingFrequency,
      tDate     : Text,
      trainer   : Text,
      dept      : Text,
      attendeeList : [(Text, Text, IT.AttendanceStatus, ?Text, ?IT.CertificateStatus, ?Text)],
    ) {
      let tId = ITPLib.trainingId(year, seq);
      let n = attendeeList.size();
      let arr = Array.tabulate(n, func(i) {
        let (ec, en, att, certId, cStatus, expDate) = attendeeList[i];
        { empCode = ec; empName = en;
          var attendance = att;
          var certificateId = certId;
          var certStatus = cStatus;
          var expiryDate = expDate;
        };
      });
      let trn : IT.Training = {
        trainingId   = tId;
        name         = name;
        trainingType = tType;
        frequency    = freq;
        trainingDate = tDate;
        trainer      = trainer;
        department   = dept;
        attendees    = arr.toVarArray();
        createdById  = 100002;
        createdAt    = 1_747_000_000_000_000_000;
      };
      trainings.add(tId, trn);
      itp_state.nextTrnSeq += 1;
      itp_state.nextCertSeq += n;
    };

    // TRN-2026-00001  Fire Safety Induction  Annual  Valid certs
    addTrn(1, "Fire Safety Induction", #Induction, #Annual, "2026-01-15", "Priya Menon", "Operations",
      [ ("EMP-00001", "Rajesh Kumar",    #Present, ?"CERT-EMP-00001-2026-00001", ?#Valid,        ?"2027-01-15"),
        ("EMP-00010", "Kavitha Subramaniam", #Present, ?"CERT-EMP-00010-2026-00002", ?#Valid,    ?"2027-01-15"),
        ("EMP-00003", "Mohammed Irfan",  #Absent,  null,                       null,             null),
      ]);
    // TRN-2026-00002  Confined Space Entry  OneTime  Mix Valid/ExpiringSoon
    addTrn(2, "Confined Space Entry", #Regulatory, #Annual, "2025-06-01", "Abdul Rashid", "Maintenance",
      [ ("EMP-00009", "Abdul Rashid",    #Present, ?"CERT-EMP-00009-2026-00003", ?#ExpiringSoon, ?"2026-06-01"),
        ("EMP-00004", "Sunita Sharma",   #Present, ?"CERT-EMP-00004-2026-00004", ?#ExpiringSoon, ?"2026-06-08"),
      ]);
    // TRN-2026-00003  Chemical Handling  Refresher  Expired certs
    addTrn(3, "Chemical Handling Refresher", #Refresher, #Annual, "2025-01-10", "Priya Menon", "Maintenance",
      [ ("EMP-00009", "Abdul Rashid",    #Present, ?"CERT-EMP-00009-2026-00005", ?#Expired,      ?"2026-01-10"),
        ("EMP-00008", "Shalini Rao",     #Present, ?"CERT-EMP-00008-2026-00006", ?#Expired,      ?"2026-01-10"),
      ]);
    // TRN-2026-00004  Work at Height  Regulatory  Valid
    addTrn(4, "Work at Height Safety", #Regulatory, #ThreeYearly, "2024-09-01", "Vijay Prakash", "Engineering",
      [ ("EMP-00007", "Vijay Prakash",   #Present, ?"CERT-EMP-00007-2026-00007", ?#Valid,        ?"2027-09-01"),
        ("EMP-00011", "Ravi Mohan",      #Present, ?"CERT-EMP-00011-2026-00008", ?#Valid,        ?"2027-09-01"),
      ]);
    // TRN-2026-00005  HSE Induction for New Joiners  OnTheJob  ExpiringSoon
    addTrn(5, "HSE New Joiner Induction", #OnTheJob, #Annual, "2025-06-10", "Priya Menon", "HR",
      [ ("EMP-00006", "Anitha Krishnan", #Present, ?"CERT-EMP-00006-2026-00009", ?#ExpiringSoon, ?"2026-06-10"),
        ("EMP-00012", "Fatima Zahra",    #Present, ?"CERT-EMP-00012-2026-00010", ?#ExpiringSoon, ?"2026-06-15"),
      ]);

    // ── PTW records ─────────────────────────────────────────
    let addPTW = func(
      seq   : Nat,
      pType : IT.PermitType,
      desc  : Text,
      loc   : Text,
      start : Text,
      end_  : Text,
      team  : Text,
      ppe   : [Text],
      stat  : IT.PTWStatus,
      hodApproved  : ?Bool,
      hodRemarks   : Text,
      aicApproved  : ?Bool,
      aicRemarks   : Text,
      soApproved   : ?Bool,
      soRemarks    : Text,
    ) {
      let num = ITPLib.permitNumber(year, seq);
      let hodStep : ?IT.ApprovalStep = switch (hodApproved) {
        case (null) null;
        case (?approved) ?{
          approverId = 100003; approverName = "Mohammed Irfan"; role = #HOD;
          var approved = ?approved; var remarks = hodRemarks; var actionAt = ?1_747_100_000_000_000_000;
        };
      };
      let aicStep : ?IT.ApprovalStep = switch (aicApproved) {
        case (null) null;
        case (?approved) ?{
          approverId = 100004; approverName = "Sunita Sharma"; role = #AreaInCharge;
          var approved = ?approved; var remarks = aicRemarks; var actionAt = ?1_747_200_000_000_000_000;
        };
      };
      let soStep : ?IT.ApprovalStep = switch (soApproved) {
        case (null) null;
        case (?approved) ?{
          approverId = 100002; approverName = "Priya Menon"; role = #SafetyOfficer;
          var approved = ?approved; var remarks = soRemarks; var actionAt = ?1_747_300_000_000_000_000;
        };
      };
      let ptw : IT.PTW = {
        permitNumber    = num;
        permitType      = pType;
        workDescription = desc;
        location        = loc;
        startDateTime   = start;
        endDateTime     = end_;
        requestedById   = 100001;
        requestedByName = "Rajesh Kumar";
        contractorTeam  = team;
        riskAssessed    = true;
        ppeRequired     = ppe;
        var status      = stat;
        var hodStep     = hodStep;
        var aicStep     = aicStep;
        var soStep      = soStep;
        var rejectedAt  = if (stat == #Rejected) ?1_747_150_000_000_000_000 else null;
        var rejectedRemarks = if (stat == #Rejected) "Risk assessment incomplete" else "";
        var closedAt    = if (stat == #Closed) ?1_747_400_000_000_000_000 else null;
        createdAt       = 1_747_000_000_000_000_000;
      };
      ptws.add(num, ptw);
      itp_state.nextPtwSeq += 1;
    };

    // PTW-2026-00001  HotWork  PendingHOD
    addPTW(1, #HotWork,          "Welding on pipe flange at Reactor B",         "Reactor Deck B",   "2026-05-20T08:00", "2026-05-20T17:00", "Team Alpha",     ["Welding shield", "Fire extinguisher", "Gloves"],                #PendingHOD,          null,  "",                null,  "",              null, "");
    // PTW-2026-00002  ConfinedSpace  PendingAreaInCharge
    addPTW(2, #ConfinedSpace,    "Inspection and cleaning of storage tank T-4", "Tank Farm C",      "2026-05-22T06:00", "2026-05-22T14:00", "Maintenance Team", ["SCBA", "Lifeline", "Gas detector"],                          #PendingAreaInCharge, ?true, "Approved by HOD", null,  "",              null, "");
    // PTW-2026-00003  WorkAtHeight  Active (all 3 approved)
    addPTW(3, #WorkAtHeight,     "Replacement of rooftop ventilation unit V-12", "Roof Level 3",    "2026-05-10T07:00", "2026-05-12T16:00", "External Vendor",  ["Full body harness", "Safety net", "Hard hat", "Gloves"],    #Active,              ?true, "HOD approved",   ?true, "AIC validated", ?true, "Safety Officer cleared");
    // PTW-2026-00004  ElectricalIsolation  Closed
    addPTW(4, #ElectricalIsolation, "Isolation of MCC Panel for annual maintenance", "MCC Room 1",   "2026-04-05T08:00", "2026-04-05T18:00", "Electrical Team",  ["Insulated gloves", "Lockout/tagout", "Hard hat"],           #Closed,              ?true, "Approved",       ?true, "Validated",     ?true, "Cleared");
    // PTW-2026-00005  Excavation  Rejected (by HOD)
    addPTW(5, #Excavation,       "Excavation for new drainage channel near Site A", "Site A Perimeter", "2026-05-15T07:00", "2026-05-18T17:00", "Civil Contractors", ["Hard hat", "Hi-vis vest", "Safety boots"],               #Rejected,            ?false, "Risk assessment incomplete", null, "",        null, "");
  };

  // ─── Seed Phase 2 demo data ────────────────────────────
  func seedPhase2Data() {
    if (not observations.isEmpty()) return; // already seeded

    let now = 1_747_000_000_000_000_000;

    // ── Safety Observations (BBS) ──────────────────────
    let obs1 : T2A.Observation = {
      obsNumber          = "OBS-2026-0001";
      observerEmpId      = 100001;
      observerName       = "Rajesh Kumar";
      dateTime           = now;
      location           = "Pump House A";
      area               = "Site A";
      department         = "Operations";
      obsType            = #SafeAct;
      severity           = #Low;
      description        = "Worker observed using correct PPE during pump maintenance. Helmet, gloves, and safety boots all in use.";
      immediateAction    = "Positive recognition given.";
      var linkedCapaId   = null;
      var status         = #Closed;
      var acknowledgedBy = ?(100002 : CT.EmployeeId);
      var acknowledgedAt = ?now;
      var acknowledgeRemarks = ?("Good safety behavior – shared as best practice.");
      photoUrl           = null;
      createdAt          = now;
    };
    observations.add(obs1);
    ohj_state.nextObsSeq += 1;

    let obs2 : T2A.Observation = {
      obsNumber          = "OBS-2026-0002";
      observerEmpId      = 100002;
      observerName       = "Priya Menon";
      dateTime           = now;
      location           = "Chemical Store";
      area               = "Site A";
      department         = "Maintenance";
      obsType            = #UnsafeAct;
      severity           = #Medium;
      description        = "Technician found handling chemical drums without face shield or gloves.";
      immediateAction    = "Work stopped. Technician directed to obtain PPE before resuming.";
      var linkedCapaId   = ?"CAPA2-SEED-001";
      var status         = #CAPAPending;
      var acknowledgedBy = ?(100002 : CT.EmployeeId);
      var acknowledgedAt = ?now;
      var acknowledgeRemarks = ?("CAPA raised. PPE refresher training scheduled.");
      photoUrl           = null;
      createdAt          = now;
    };
    observations.add(obs2);
    ohj_state.nextObsSeq += 1;

    // ── HIRA ──────────────────────────────────────────
    let hira1 : T2A.HIRA = {
      hiraNumber       = "HIRA-2026-0001";
      taskDescription  = "Pump maintenance and bearing replacement in confined area";
      location         = "Pump House A";
      area             = "Site A";
      department       = "Operations";
      var hazards      = [var];
      var status       = #Draft;
      var approvalStep = 0;
      var hodEmpId     = null;
      var hodRemarks   = null;
      var hodAt        = null;
      var aicEmpId     = null;
      var aicRemarks   = null;
      var aicAt        = null;
      var soEmpId      = null;
      var soRemarks    = null;
      var soAt         = null;
      responsibleEmpId = ?(100001 : CT.EmployeeId);
      reviewDate       = "2027-05-01";
      var linkedPtwNumber = null;
      createdBy        = 100002;
      createdAt        = now;
      var updatedAt    = now;
    };
    hiras.add(hira1);
    ohj_state.nextHiraSeq += 1;

    // ── JSA ───────────────────────────────────────────
    let jsa1 : T2A.JSA = {
      jsaNumber        = "JSA-2026-0001";
      jobTitle         = "Electrical panel inspection and maintenance";
      department       = "Engineering";
      area             = "Site C";
      location         = "MCC Room 1";
      analysisDate     = "2026-05-01";
      preparedBy       = 100002;
      var reviewedBy   = null;
      var approvedBy   = null;
      var steps        = [var];
      helmetRequired   = true;
      safetyShoes      = true;
      gloves           = true;
      harness          = false;
      faceShield       = true;
      goggles          = true;
      respirator       = false;
      emergencyContacts = "Site Emergency: +60-3-XXXX-0000, Safety Officer: Priya +60-12-XXXX-0001";
      var briefingAttendees = [var];
      var linkedPtwNumber  = ?("PTW-2026-00004");
      var status       = #Draft;
      var hodRemarks   = null;
      var hodAt        = null;
      var soRemarks    = null;
      var soAt         = null;
      createdAt        = now;
      var updatedAt    = now;
    };
    jsas.add(jsa1);
    ohj_state.nextJsaSeq += 1;

    // ── CAPA2 records ─────────────────────────────────
    let capa2_1 : T2.CAPA2 = {
      capaNumber         = "CAPA-2026-0001";
      source             = #Incident;
      linkedRecordNumber = "INC-2026-00003";
      capaType           = #Corrective;
      findingDescription = "Technician handling chemicals without PPE – unsafe act observed during routine audit.";
      rootCauseCat       = #TrainingGap;
      var rootCauseDesc  = "Employee not aware of mandatory PPE requirement for chemical handling area.";
      var actionDescription = "Schedule mandatory PPE refresher for all Maintenance dept employees. Update procedure SOP-CHM-001.";
      actionOwnerEmpId   = 100004;
      department         = "Maintenance";
      targetDate         = "2026-06-30";
      priority           = #High;
      var progressUpdate = "";
      var completionEvidence = null;
      var verifiedByEmpId = null;
      var verifiedAt     = null;
      var status         = #Open;
      var isOverdue      = false;
      createdAt          = now;
      var updatedAt      = now;
    };
    capa2s.add(capa2_1);
    capa2_state.nextCapa2Seq += 1;

    let capa2_2 : T2.CAPA2 = {
      capaNumber         = "CAPA-2026-0002";
      source             = #Observation;
      linkedRecordNumber = "OBS-2026-0002";
      capaType           = #Preventive;
      findingDescription = "Recurring unsafe chemical handling behavior observed – systemic PPE compliance gap in Maintenance.";
      rootCauseCat       = #ProcedureGap;
      var rootCauseDesc  = "PPE compliance check not included in daily pre-task briefing checklist.";
      var actionDescription = "Revise daily pre-task briefing checklist to include PPE compliance verification. Implement supervisor sign-off.";
      actionOwnerEmpId   = 100002;
      department         = "Maintenance";
      targetDate         = "2026-07-15";
      priority           = #Medium;
      var progressUpdate = "Draft checklist revision in progress.";
      var completionEvidence = null;
      var verifiedByEmpId = null;
      var verifiedAt     = null;
      var status         = #InProgress;
      var isOverdue      = false;
      createdAt          = now;
      var updatedAt      = now;
    };
    capa2s.add(capa2_2);
    capa2_state.nextCapa2Seq += 1;

    // ── ESG: Energy entry ─────────────────────────────
    let eng1 : T2.EnergyEntry = {
      energyType       = #Electricity;
      consumption      = 12500.0;
      unit             = "kWh";
      month            = 4;
      year             = 2026;
      target           = 13000.0;
      carbonEquivalent = 5500.0; // approx 0.44 kgCO2/kWh * 12500 kWh
      department       = "Operations";
      loggedBy         = 100002;
      createdAt        = now;
    };
    energyEntries.add(eng1);

    // ── ESG: Water entry ──────────────────────────────
    let water1 : T2.WaterEntry = {
      source      = #Municipal;
      consumption = 450.0;
      month       = 4;
      year        = 2026;
      target      = 500.0;
      department  = "Operations";
      loggedBy    = 100002;
      createdAt   = now;
    };
    waterEntries.add(water1);

    // ── LOTO ─────────────────────────────────────────
    let loto1 : T2.LOTO = {
      lotoNumber              = "LOTO-2026-0001";
      equipmentName           = "MCC Panel — Feeder No. 3";
      tagNumber               = "TAG-MCC-003";
      var energySources       = [var #Electrical];
      var isolationPoints     = [var];
      var authorizedEmpIds    = [var 100007, 100011];
      var procedureSteps      = [var "1. Notify operations supervisor", "2. De-energise feeder at main breaker", "3. Apply lockout device", "4. Test for absence of voltage"];
      var lockRegister        = [var];
      workDescription         = "Annual maintenance and thermal imaging inspection of MCC Panel Feeder 3.";
      startDateTime           = now;
      var endDateTime         = null;
      var authorizedByEmpId   = null;
      var authorizedAt        = null;
      var reEnergizationChecklist = [var "1. Verify all work complete", "2. Remove all lockout devices", "3. Re-energize under supervision"];
      var status              = #Draft;
      createdBy               = 100002;
      createdAt               = now;
      var updatedAt           = now;
    };
    lotos.add("LOTO-2026-0001", loto1);
    apl_state.lotoSequence += 1;

    // ── Contractor ───────────────────────────────────
    let con1 : T2.Contractor = {
      contractorId       = "CON-2026-0001";
      companyName        = "Apex Safety Solutions Sdn Bhd";
      registrationNumber = "202001123456";
      contactPerson      = "Ahmad Zulkifli";
      email              = "ahmad@apexsafety.com.my";
      phone              = "+60-12-3456789";
      typeOfWork         = "Safety inspection, scaffolding, and confined space entry services";
      contractStartDate  = "2026-01-01";
      contractEndDate    = "2026-12-31";
      var documents      = [var
        {
          docType    = "Trade License";
          expiryDate = "2026-12-31";
          var status = #Valid;
          uploadedAt = now;
        },
        {
          docType    = "DOSH Registration";
          expiryDate = "2026-09-30";
          var status = #Expiring;
          uploadedAt = now;
        }
      ];
      var employees      = [var
        {
          empName              = "Mohd Faiz Bin Hassan";
          idNumber             = "880512-01-1234";
          trade                = "Scaffolding Supervisor";
          inductionStatus  = #Pass;
          inductionDate    = ?("2026-01-05");
          certificateNumber = ?("IND-2026-CON-00001");
        }
      ];
      var status         = #Active;
      var linkedPtwNumbers = [var "PTW-2026-00003"];
      var performance    = null;
      createdAt          = now;
      var updatedAt      = now;
    };
    contractors.add("CON-2026-0001", con1);
    con_state.contractorSequence += 1;
    con_state.inductionCertSequence += 1;
  };

  seedPhase2Data();
  seedITPData();
  seedIfEmpty();

  // ─── Mixin includes ─────────────────────────────────────
  include AuthMixin(users, sessions, employees, auditLog, notifications, state);
  include ITPMixin(users, sessions, employees, auditLog, notifications, state, incidents, capas, trainings, ptws, itp_state);
  include OHJMixin(users, sessions, employees, auditLog, notifications, state, observations, hiras, jsas, ohj_state);
  include CAPAEsgMixin(users, sessions, auditLog, notifications, state, capa2s, capa2_state, wasteEntries, airEmissions, waterEntries, effluentEntries, energyEntries, carbonEntries);
  include AIPPEMixin(users, sessions, employees, auditLog, notifications, state, incidents, capas, trainings, observations, capa2s, ppeItems, ppeInventory, ppeIssuances, ppeInspections, lotos, riskScoreHistory, apl_state);
  include ConMixin(users, sessions, auditLog, notifications, state, contractors, con_state);
  include PtwExtMixin(users, sessions, auditLog, notifications, state, ptws, ptwExtensions);
};
