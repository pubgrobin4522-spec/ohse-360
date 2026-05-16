import T2 "../types/phase2-capa-esg-ai-ppe-contractor";
import CT "../types/common";
import AT "../types/auth-users-employees";
import AuthLib "../lib/AuthUsersEmployees";
import Lib2 "../lib/CapaEsg";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Array "mo:core/Array";
import EmailClient "mo:caffeineai-email/emailClient";

mixin (
  // ── shared state from main actor ──────────────────────────
  users         : Map.Map<CT.EmployeeId, AT.User>,
  sessions      : Map.Map<Text, CT.EmployeeId>,
  auditLog      : List.List<AT.AuditEntry>,
  notifications : List.List<AT.Notification>,
  state         : {
    var nextAuditId  : Nat;
    var nextNotifId  : Nat;
    var systemAdminNotifyEmail : Text;
  },
  // ── domain-specific state ─────────────────────────────────
  capa2s         : List.List<T2.CAPA2>,
  capa2_state    : { var nextCapa2Seq : Nat },
  wasteEntries   : List.List<T2.WasteEntry>,
  airEmissions   : List.List<T2.AirEmissionEntry>,
  waterEntries   : List.List<T2.WaterEntry>,
  effluentEntries : List.List<T2.EffluentEntry>,
  energyEntries  : List.List<T2.EnergyEntry>,
  carbonEntries  : List.List<T2.CarbonEntry>,
) {

  // ─── Auth helpers ─────────────────────────────────────────
  func ce2RequireAuth(token : Text) : CT.Result<AT.User> {
    switch (sessions.get(token)) {
      case (null) { #err("Invalid or expired session") };
      case (?eid) {
        switch (users.get(eid)) {
          case (null) { #err("User not found") };
          case (?u) {
            if (u.status == #Inactive) return #err("Account is deactivated");
            #ok(u);
          };
        };
      };
    };
  };

  func ce2AddAudit(
    actorId   : CT.EmployeeId,
    actorName : Text,
    actorRole : CT.Role,
    module_   : Text,
    action    : AT.AuditAction,
    recordRef : Text,
    detail    : Text,
  ) {
    let id = state.nextAuditId;
    state.nextAuditId += 1;
    auditLog.add(
      AuthLib.newAuditEntry(id, actorId, actorName, actorRole, module_, action, recordRef, detail)
    );
  };

  func ce2PushNotif(recipientId : CT.EmployeeId, message : Text, link : Text) {
    let id = state.nextNotifId;
    state.nextNotifId += 1;
    notifications.add(AuthLib.newNotification(id, recipientId, message, link));
  };

  func ce2CcAdmin(subject : Text, body : Text) : async () {
    let ccAddr = state.systemAdminNotifyEmail;
    try {
      ignore await EmailClient.sendServiceEmail("no-reply", [ccAddr], subject, body);
    } catch (_) {
      let id = state.nextAuditId;
      state.nextAuditId += 1;
      auditLog.add(AuthLib.newAuditEntry(id, 0, "system", #SystemAdmin, "Email", #Created, ccAddr, "CC email failed: " # subject));
    };
  };

  // Notify all Safety Officers in-app
  func ce2NotifySOs(message : Text, link : Text) {
    for ((_, u) in users.entries()) {
      let isSO = u.role == #SafetyOfficer or
        (u.roles.find(func(r : CT.Role) : Bool { r == #SafetyOfficer }) != null);
      if (isSO and u.status == #Active) {
        ce2PushNotif(u.employeeId, message, link);
      };
    };
  };

  // ─── CAPA2 view helpers ───────────────────────────────────
  func toCapa2View(c : T2.CAPA2) : T2.CAPA2View {
    {
      capaNumber         = c.capaNumber;
      source             = c.source;
      linkedRecordNumber = c.linkedRecordNumber;
      capaType           = c.capaType;
      findingDescription = c.findingDescription;
      rootCauseCat       = c.rootCauseCat;
      rootCauseDesc      = c.rootCauseDesc;
      actionDescription  = c.actionDescription;
      actionOwnerEmpId   = c.actionOwnerEmpId;
      department         = c.department;
      targetDate         = c.targetDate;
      priority           = c.priority;
      progressUpdate     = c.progressUpdate;
      completionEvidence = c.completionEvidence;
      verifiedByEmpId    = c.verifiedByEmpId;
      verifiedAt         = c.verifiedAt;
      status             = c.status;
      isOverdue          = c.isOverdue;
      createdAt          = c.createdAt;
      updatedAt          = c.updatedAt;
    };
  };

  // ─── CAPA2 functions ──────────────────────────────────────

  public func createCapa2(token : Text, input : T2.CreateCAPAInput) : async CT.Result<Text> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let year = Lib2.currentYear();
        let seq  = capa2_state.nextCapa2Seq;
        capa2_state.nextCapa2Seq += 1;
        let num  = Lib2.generateCapa2Number(year, seq);
        let now  = Time.now();
        let ownerName = switch (users.get(input.actionOwnerEmpId)) {
          case (null)  { "Unknown" };
          case (?owner) { owner.fullName };
        };
        let capa2 : T2.CAPA2 = {
          capaNumber         = num;
          source             = input.source;
          linkedRecordNumber = input.linkedRecordNumber;
          capaType           = input.capaType;
          findingDescription = input.findingDescription;
          rootCauseCat       = input.rootCauseCat;
          var rootCauseDesc  = input.rootCauseDesc;
          var actionDescription = input.actionDescription;
          actionOwnerEmpId   = input.actionOwnerEmpId;
          department         = input.department;
          targetDate         = input.targetDate;
          priority           = input.priority;
          var progressUpdate = "";
          var completionEvidence = null;
          var verifiedByEmpId = null;
          var verifiedAt     = null;
          var status         = #Open;
          var isOverdue      = false;
          createdAt          = now;
          var updatedAt      = now;
        };
        capa2s.add(capa2);
        ce2AddAudit(u.employeeId, u.fullName, u.role, "CAPA", #Created, num, "CAPA created: " # num);
        // Notify action owner
        ce2PushNotif(input.actionOwnerEmpId,
          "CAPA " # num # " assigned to you: " # input.findingDescription,
          "/capa/" # num);
        // CC admin
        ignore ce2CcAdmin(
          "OHSE 360: CAPA assigned " # num,
          "<p>CAPA <b>" # num # "</b> assigned to " # ownerName # ". Finding: " # input.findingDescription # ".</p>",
        );
        #ok(num);
      };
    };
  };

  public query func listCapa2s(token : Text) : async CT.Result<[T2.CAPA2View]> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let filtered = capa2s.values().filter(func(c) {
          switch (u.role) {
            case (#SystemAdmin or #SafetyOfficer) { true };
            case (#HOD) { c.department == u.department };
            case (#Employee) { c.actionOwnerEmpId == u.employeeId };
            case (_) { true };
          };
        });
        #ok(filtered.map<T2.CAPA2, T2.CAPA2View>(func(c) { toCapa2View(c) }).toArray());
      };
    };
  };

  public query func getCapa2(token : Text, capaNumber : Text) : async CT.Result<T2.CAPA2View> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        switch (capa2s.find(func(c) { c.capaNumber == capaNumber })) {
          case (null)  { #err("CAPA not found") };
          case (?c)    { #ok(toCapa2View(c)) };
        };
      };
    };
  };

  public func updateCapa2Progress(
    token        : Text,
    capaNumber   : Text,
    progressUpdate : Text,
    evidence     : ?Text,
  ) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (capa2s.find(func(c) { c.capaNumber == capaNumber })) {
          case (null) { #err("CAPA not found") };
          case (?c) {
            if (c.actionOwnerEmpId != u.employeeId and u.role != #SafetyOfficer and u.role != #SystemAdmin) {
              return #err("Access denied: action owner only");
            };
            c.progressUpdate      := progressUpdate;
            c.completionEvidence  := evidence;
            c.status              := #InProgress;
            c.updatedAt           := Time.now();
            ce2AddAudit(u.employeeId, u.fullName, u.role, "CAPA", #Updated, capaNumber, "Progress updated");
            #ok(());
          };
        };
      };
    };
  };

  public func submitCapa2ForVerification(token : Text, capaNumber : Text) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        switch (capa2s.find(func(c) { c.capaNumber == capaNumber })) {
          case (null) { #err("CAPA not found") };
          case (?c) {
            if (c.actionOwnerEmpId != u.employeeId and u.role != #SystemAdmin) {
              return #err("Access denied: action owner only");
            };
            c.status    := #PendingVerification;
            c.updatedAt := Time.now();
            ce2AddAudit(u.employeeId, u.fullName, u.role, "CAPA", #Updated, capaNumber, "Submitted for verification");
            ce2NotifySOs("CAPA " # capaNumber # " is ready for verification", "/capa/" # capaNumber);
            ignore ce2CcAdmin(
              "OHSE 360: CAPA pending verification " # capaNumber,
              "<p>CAPA <b>" # capaNumber # "</b> has been submitted for verification by " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  public func verifyCapa2(
    token      : Text,
    capaNumber : Text,
    approved   : Bool,
    remarks    : Text,
  ) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin) {
          return #err("Access denied: Safety Officer required");
        };
        switch (capa2s.find(func(c) { c.capaNumber == capaNumber })) {
          case (null) { #err("CAPA not found") };
          case (?c) {
            let now = Time.now();
            if (approved) {
              c.status        := #Closed;
              c.verifiedByEmpId := ?u.employeeId;
              c.verifiedAt    := ?now;
            } else {
              c.status        := #InProgress;
            };
            c.updatedAt := now;
            ce2AddAudit(u.employeeId, u.fullName, u.role, "CAPA",
              if (approved) #Closed_ else #Updated,
              capaNumber,
              (if (approved) "CAPA verified and closed" else "CAPA verification rejected: ") # remarks);
            // Notify action owner of decision
            ce2PushNotif(c.actionOwnerEmpId,
              "CAPA " # capaNumber # (if (approved) " has been closed by Safety Officer" else (" verification rejected: " # remarks)),
              "/capa/" # capaNumber);
            ignore ce2CcAdmin(
              "OHSE 360: CAPA " # (if (approved) "closed" else "verification rejected") # " " # capaNumber,
              "<p>CAPA <b>" # capaNumber # "</b> was " # (if (approved) "verified and closed" else "rejected for revision") # " by " # u.fullName # ".</p>",
            );
            #ok(());
          };
        };
      };
    };
  };

  public func checkOverdueCapas() : async () {
    let now = Time.now();
    for (c in capa2s.values()) {
      if (c.status == #Open or c.status == #InProgress) {
        if (Lib2.isOverdue(c.targetDate, now)) {
          c.status   := #Overdue;
          c.isOverdue := true;
          c.updatedAt := now;
          ce2PushNotif(c.actionOwnerEmpId,
            "CAPA " # c.capaNumber # " is overdue. Target date: " # c.targetDate,
            "/capa/" # c.capaNumber);
          ce2NotifySOs("CAPA " # c.capaNumber # " is overdue", "/capa/" # c.capaNumber);
        };
      };
    };
  };

  public query func getCapa2Stats(token : Text) : async CT.Result<{
    total       : Nat;
    open        : Nat;
    inProgress  : Nat;
    closed      : Nat;
    overdue     : Nat;
    closureRate : Nat;
    avgDaysToClose : Float;
    bySource    : [(Text, Nat)];
    byDept      : [(Text, Nat)];
  }> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        var total = 0; var open = 0; var inProg = 0; var closed = 0; var overdue = 0;
        var closedDaysTotal : Float = 0.0;
        let sourceMap = Map.empty<Text, Nat>();
        let deptMap   = Map.empty<Text, Nat>();
        let NS_PER_DAY_F : Float = 86_400_000_000_000.0;

        for (c in capa2s.values()) {
          total += 1;
          switch (c.status) {
            case (#Open)               { open    += 1 };
            case (#InProgress)         { inProg  += 1 };
            case (#Closed)             { closed  += 1 };
            case (#Overdue)            { overdue += 1 };
            case (#PendingVerification) {};
          };
          if (c.status == #Closed) {
            switch (c.verifiedAt) {
              case (?vAt) {
                let diff : Float = (vAt - c.createdAt).toFloat() / NS_PER_DAY_F;
                closedDaysTotal := closedDaysTotal + diff;
              };
              case (null) {};
            };
          };
          // by source
          let srcText = debug_show(c.source);
          switch (sourceMap.get(srcText)) {
            case (null) { sourceMap.add(srcText, 1) };
            case (?n)   { sourceMap.add(srcText, n + 1) };
          };
          // by dept
          switch (deptMap.get(c.department)) {
            case (null) { deptMap.add(c.department, 1) };
            case (?n)   { deptMap.add(c.department, n + 1) };
          };
        };
        let avgDays : Float = if (closed == 0) { 0.0 } else {
          closedDaysTotal / closed.toFloat();
        };
        #ok({
          total;
          open;
          inProgress  = inProg;
          closed;
          overdue;
          closureRate = Lib2.calcCapaClosureRate(total, closed);
          avgDaysToClose = avgDays;
          bySource = sourceMap.entries().map<(Text, Nat), (Text, Nat)>(func((k, v)) { (k, v) }).toArray();
          byDept   = deptMap.entries().map<(Text, Nat), (Text, Nat)>(func((k, v)) { (k, v) }).toArray();
        });
      };
    };
  };

  // ─── ESG functions ────────────────────────────────────────

  public func addWasteEntry(token : Text, input : T2.AddWasteInput) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        if (u.role != #SafetyOfficer and u.role != #SystemAdmin) {
          return #err("Access denied: Safety Officer required");
        };
        let entry : T2.WasteEntry = {
          wasteType      = input.wasteType;
          quantity       = input.quantity;
          unit           = input.unit;
          disposalMethod = input.disposalMethod;
          contractorName = input.contractorName;
          manifestNumber = input.manifestNumber;
          disposalDate   = input.disposalDate;
          department     = input.department;
          loggedBy       = u.employeeId;
          createdAt      = Time.now();
        };
        wasteEntries.add(entry);
        ce2AddAudit(u.employeeId, u.fullName, u.role, "ESG", #Created, input.manifestNumber, "Waste entry logged");
        #ok(());
      };
    };
  };

  public func addAirEmission(token : Text, input : T2.AddAirEmissionInput) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let exceeded = input.value > input.regulatoryLimit;
        let entry : T2.AirEmissionEntry = {
          source          = input.source;
          pollutant       = input.pollutant;
          value           = input.value;
          unit            = input.unit;
          measurementDate = input.measurementDate;
          regulatoryLimit = input.regulatoryLimit;
          isExceeded      = exceeded;
          department      = input.department;
          loggedBy        = u.employeeId;
          createdAt       = Time.now();
        };
        airEmissions.add(entry);
        ce2AddAudit(u.employeeId, u.fullName, u.role, "ESG", #Created, input.measurementDate,
          "Air emission logged. Exceeded: " # debug_show(exceeded));
        if (exceeded) {
          ignore ce2CcAdmin(
            "OHSE 360: Non-compliant air emission detected",
            "<p>Air emission reading on <b>" # input.measurementDate # "</b> exceeded regulatory limit. Value: " # debug_show(input.value) # " Limit: " # debug_show(input.regulatoryLimit) # ".</p>",
          );
        };
        #ok(());
      };
    };
  };

  public func addWaterEntry(token : Text, input : T2.AddWaterInput) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let entry : T2.WaterEntry = {
          source      = input.source;
          consumption = input.consumption;
          month       = input.month;
          year        = input.year;
          target      = input.target;
          department  = input.department;
          loggedBy    = u.employeeId;
          createdAt   = Time.now();
        };
        waterEntries.add(entry);
        ce2AddAudit(u.employeeId, u.fullName, u.role, "ESG", #Created,
          input.year.toText() # "-" # input.month.toText(), "Water entry logged");
        #ok(());
      };
    };
  };

  public func addEffluentEntry(token : Text, input : T2.AddEffluentInput) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let compliant = input.value <= input.regulatoryLimit;
        let entry : T2.EffluentEntry = {
          effluentType    = input.effluentType;
          parameter       = input.parameter;
          value           = input.value;
          regulatoryLimit = input.regulatoryLimit;
          isCompliant     = compliant;
          samplingDate    = input.samplingDate;
          department      = input.department;
          loggedBy        = u.employeeId;
          createdAt       = Time.now();
        };
        effluentEntries.add(entry);
        ce2AddAudit(u.employeeId, u.fullName, u.role, "ESG", #Created, input.samplingDate,
          "Effluent entry logged. Compliant: " # debug_show(compliant));
        if (not compliant) {
          ignore ce2CcAdmin(
            "OHSE 360: Non-compliant effluent reading detected",
            "<p>Effluent reading on <b>" # input.samplingDate # "</b> is non-compliant. Value: " # debug_show(input.value) # " Limit: " # debug_show(input.regulatoryLimit) # ".</p>",
          );
        };
        #ok(());
      };
    };
  };

  public func addEnergyEntry(token : Text, input : T2.AddEnergyInput) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let typeText   = Lib2.energyTypeToText(input.energyType);
        let carbonEq   = Lib2.calcCarbonEquivalent(typeText, input.consumption);
        let entry : T2.EnergyEntry = {
          energyType       = input.energyType;
          consumption      = input.consumption;
          unit             = input.unit;
          month            = input.month;
          year             = input.year;
          target           = input.target;
          carbonEquivalent = carbonEq;
          department       = input.department;
          loggedBy         = u.employeeId;
          createdAt        = Time.now();
        };
        energyEntries.add(entry);
        ce2AddAudit(u.employeeId, u.fullName, u.role, "ESG", #Created,
          input.year.toText() # "-" # input.month.toText(), "Energy entry logged");
        #ok(());
      };
    };
  };

  public func addCarbonEntry(token : Text, input : T2.AddCarbonInput) : async CT.Result<()> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(u)) {
        let entry : T2.CarbonEntry = {
          scope       = input.scope;
          co2eTonnes  = input.co2eTonnes;
          month       = input.month;
          year        = input.year;
          description = input.description;
          loggedBy    = u.employeeId;
          createdAt   = Time.now();
        };
        carbonEntries.add(entry);
        ce2AddAudit(u.employeeId, u.fullName, u.role, "ESG", #Created,
          input.year.toText() # "-" # input.month.toText(), "Carbon entry logged");
        #ok(());
      };
    };
  };

  public query func getEsgData(token : Text) : async CT.Result<{
    waste    : [T2.WasteEntry];
    air      : [T2.AirEmissionEntry];
    water    : [T2.WaterEntry];
    effluent : [T2.EffluentEntry];
    energy   : [T2.EnergyEntry];
    carbon   : [T2.CarbonEntry];
    esgScore : Nat;
  }> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        // ESG score: air + effluent compliance
        let airTotal       = airEmissions.size();
        let airCompliant   = airEmissions.values().filter(func(a) { not a.isExceeded }).size();
        let effTotal       = effluentEntries.size();
        let effCompliant   = effluentEntries.values().filter(func(e) { e.isCompliant }).size();
        let totalReadings  = airTotal + effTotal;
        let totalCompliant = airCompliant + effCompliant;
        let score          = Lib2.calcEsgScore(totalReadings, totalCompliant);
        #ok({
          waste    = wasteEntries.toArray();
          air      = airEmissions.toArray();
          water    = waterEntries.toArray();
          effluent = effluentEntries.toArray();
          energy   = energyEntries.toArray();
          carbon   = carbonEntries.toArray();
          esgScore = score;
        });
      };
    };
  };

  public query func getEsgStats(
    token      : Text,
    month      : ?Nat,
    year       : ?Nat,
    department : ?Text,
  ) : async CT.Result<{
    esgScore       : Nat;
    carbonTotal    : Float;
    energyTotal    : Float;
    waterTotal     : Float;
    wasteTotal     : Float;
    complianceRate : Nat;
    trendData      : [(Text, Float)];
  }> {
    switch (ce2RequireAuth(token)) {
      case (#err(e)) { #err(e) };
      case (#ok(_)) {
        // Filter helpers
        func deptOk(dept : Text) : Bool {
          switch (department) { case (null) true; case (?d) dept == d };
        };
        func periodOk(mo : Nat, yr : Nat) : Bool {
          let moOk = switch (month) { case (null) true; case (?m) mo == m };
          let yrOk = switch (year)  { case (null) true; case (?y) yr == y };
          moOk and yrOk;
        };

        // Totals
        var carbonTotal : Float = 0.0;
        for (e in carbonEntries.values()) {
          if (deptOk("global") and periodOk(e.month, e.year)) {
            carbonTotal := carbonTotal + e.co2eTonnes;
          };
        };

        var energyTotal : Float = 0.0;
        for (e in energyEntries.values()) {
          if (deptOk(e.department) and periodOk(e.month, e.year)) {
            energyTotal := energyTotal + e.consumption;
          };
        };

        var waterTotal : Float = 0.0;
        for (e in waterEntries.values()) {
          if (deptOk(e.department) and periodOk(e.month, e.year)) {
            waterTotal := waterTotal + e.consumption;
          };
        };

        var wasteTotal : Float = 0.0;
        for (e in wasteEntries.values()) {
          if (deptOk(e.department)) {
            wasteTotal := wasteTotal + e.quantity;
          };
        };

        // Compliance (air + effluent)
        let airTotal     = airEmissions.values().filter(func(a) { deptOk(a.department) }).size();
        let airCompliant = airEmissions.values().filter(func(a) { deptOk(a.department) and not a.isExceeded }).size();
        let effTotal     = effluentEntries.values().filter(func(e) { deptOk(e.department) }).size();
        let effCompliant = effluentEntries.values().filter(func(e) { deptOk(e.department) and e.isCompliant }).size();
        let complianceRate = Lib2.calcEsgScore(airTotal + effTotal, airCompliant + effCompliant);
        let esgScore       = complianceRate;

        // Trend data: energy consumption by month label
        let trendMap = Map.empty<Text, Float>();
        for (e in energyEntries.values()) {
          if (deptOk(e.department)) {
            let monthLabel = e.year.toText() # "-" # e.month.toText();
            switch (trendMap.get(monthLabel)) {
              case (null) { trendMap.add(monthLabel, e.consumption) };
              case (?v)   { trendMap.add(monthLabel, v + e.consumption) };
            };
          };
        };
        let trendData = trendMap.entries()
          .map(func((k, v)) { (k, v) })
          .toArray();

        #ok({
          esgScore;
          carbonTotal;
          energyTotal;
          waterTotal;
          wasteTotal;
          complianceRate;
          trendData;
        });
      };
    };
  };

};
