import T "../types/incidents-training-ptw";
import CT "../types/common";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";

module {

  // ─── Sequence number to padded string ─────────────────────
  public func padded(n : Nat, width : Nat) : Text {
    let s = n.toText();
    let needed : Int = width.toInt() - s.size().toInt();
    if (needed <= 0) return s;
    var pad = "";
    var i = 0;
    while (i < needed.toNat()) { pad := pad # "0"; i += 1 };
    pad # s;
  };

  // ─── Number generators ───────────────────────────────────
  public func incidentNumber(year : Nat, seq : Nat) : Text {
    "INC-" # year.toText() # "-" # padded(seq, 5);
  };

  public func trainingId(year : Nat, seq : Nat) : Text {
    "TRN-" # year.toText() # "-" # padded(seq, 5);
  };

  public func permitNumber(year : Nat, seq : Nat) : Text {
    "PTW-" # year.toText() # "-" # padded(seq, 5);
  };

  public func certId(empCode : Text, year : Nat, seq : Nat) : Text {
    "CERT-" # empCode # "-" # year.toText() # "-" # padded(seq, 5);
  };

  // ─── Calendar helpers (nanoseconds → year) ───────────────
  // Approximate: uses 365.25 days/year from Unix epoch (1970-01-01)
  let NS_PER_YEAR : Int = 31_557_600_000_000_000; // 365.25 * 24 * 3600 * 1e9

  public func currentYear() : Nat {
    let y = 1970 + Time.now() / NS_PER_YEAR;
    y.toNat();
  };

  // Expiry date string from training date + frequency (simple year offset)
  public func expiryDateText(trainingDate : Text, freq : T.TrainingFrequency) : Text {
    // trainingDate is "YYYY-MM-DD"; extract year, add offset
    let parts = trainingDate.split(#char '-').toArray();
    if (parts.size() < 3) return trainingDate;
    let yearText = parts[0];
    let yearOpt = Nat.fromText(yearText);
    let addYears : Nat = switch (freq) {
      case (#OneTime)     { 99 };
      case (#Annual)      { 1  };
      case (#BiAnnual)    { 2  };
      case (#ThreeYearly) { 3  };
    };
    switch (yearOpt) {
      case (null) { trainingDate };
      case (?yr) {
        (yr + addYears).toText() # "-" # parts[1] # "-" # parts[2];
      };
    };
  };

  // Cert status from expiry date text (days remaining, approximate)
  // Returns #Expired / #ExpiringSoon (<=30 days) / #Valid
  let NS_PER_DAY : Int = 86_400_000_000_000;

  public func certStatusFromExpiry(expiryDate : Text) : T.CertificateStatus {
    let now = Time.now();
    // Parse expiry year (coarse, assume same day-of-year = Jan 1)
    let parts = expiryDate.split(#char '-').toArray();
    if (parts.size() < 1) return #Expired;
    switch (Nat.fromText(parts[0])) {
      case (null) { #Expired };
      case (?yr) {
        // Approximate: Jan 1 of expiry year in nanoseconds from epoch
        let expiryNs : Int = (yr.toInt() - 1970) * NS_PER_YEAR;
        let diffDays : Int = (expiryNs - now) / NS_PER_DAY;
        if (diffDays < 0)  { #Expired }      else
        if (diffDays <= 30) { #ExpiringSoon } else
        { #Valid };
      };
    };
  };

  // ─── Incident factory ─────────────────────────────────────
  public func newIncident(
    number   : Text,
    input    : T.CreateIncidentInput,
    reportedById   : CT.EmployeeId,
    reportedByName : Text,
  ) : T.Incident {
    {
      incidentNumber  = number;
      incidentType    = input.incidentType;
      var severity    = input.severity;
      var status      = #Open;
      location        = input.location;
      department      = input.department;
      description     = input.description;
      reportedById;
      reportedByName;
      incidentDate    = input.incidentDate;
      injuredPersonCode = input.injuredPersonCode;
      var rootCause   = "";
      var correctiveAction = "";
      var closedAt    = null;
      createdAt       = Time.now();
    };
  };

  public func toIncidentView(i : T.Incident) : T.IncidentView {
    {
      incidentNumber  = i.incidentNumber;
      incidentType    = i.incidentType;
      severity        = i.severity;
      status          = i.status;
      location        = i.location;
      department      = i.department;
      description     = i.description;
      reportedById    = i.reportedById;
      reportedByName  = i.reportedByName;
      incidentDate    = i.incidentDate;
      injuredPersonCode = i.injuredPersonCode;
      rootCause       = i.rootCause;
      correctiveAction = i.correctiveAction;
      closedAt        = i.closedAt;
      createdAt       = i.createdAt;
    };
  };

  // ─── CAPA factory ─────────────────────────────────────────
  public func newCAPA(
    id             : Nat,
    incidentNumber : Text,
    description    : Text,
    actionOwnerId  : CT.EmployeeId,
    actionOwnerName : Text,
    deadline       : Text,
  ) : T.CAPA {
    {
      id;
      incidentNumber;
      var description;
      actionOwnerId;
      actionOwnerName;
      deadline;
      var status  = #Open;
      var closedAt = null;
      createdAt   = Time.now();
    };
  };

  public func toCAPAView(c : T.CAPA) : T.CAPAView {
    {
      id             = c.id;
      incidentNumber = c.incidentNumber;
      description    = c.description;
      actionOwnerId  = c.actionOwnerId;
      actionOwnerName = c.actionOwnerName;
      deadline       = c.deadline;
      status         = c.status;
      closedAt       = c.closedAt;
      createdAt      = c.createdAt;
    };
  };

  // ─── Training factory ─────────────────────────────────────
  public func newTraining(
    tId         : Text,
    input       : T.CreateTrainingInput,
    createdById : CT.EmployeeId,
    attendees   : [var T.TrainingAttendee],
  ) : T.Training {
    {
      trainingId   = tId;
      name         = input.name;
      trainingType = input.trainingType;
      frequency    = input.frequency;
      trainingDate = input.trainingDate;
      trainer      = input.trainer;
      department   = input.department;
      attendees;
      createdById;
      createdAt    = Time.now();
    };
  };

  public func toAttendeeView(a : T.TrainingAttendee) : T.TrainingAttendeeView {
    {
      empCode      = a.empCode;
      empName      = a.empName;
      attendance   = a.attendance;
      certificateId = a.certificateId;
      certStatus   = a.certStatus;
      expiryDate   = a.expiryDate;
    };
  };

  public func toTrainingView(t : T.Training) : T.TrainingView {
    let attViews = Array.tabulate(
      t.attendees.size(),
      func(i) { toAttendeeView(t.attendees[i]) },
    );
    {
      trainingId   = t.trainingId;
      name         = t.name;
      trainingType = t.trainingType;
      frequency    = t.frequency;
      trainingDate = t.trainingDate;
      trainer      = t.trainer;
      department   = t.department;
      attendees    = attViews;
      createdById  = t.createdById;
      createdAt    = t.createdAt;
    };
  };

  // ─── PTW number generator ─────────────────────────────────
  // Format: RKTR/PTW/YYYY/MM/0001 (zero-padded 4-digit sequential counter)
  public func generatePTWNumber(counter : Nat, yearMonth : Text) : Text {
    let padded4 = if (counter < 10) "000" # counter.toText()
                  else if (counter < 100) "00" # counter.toText()
                  else if (counter < 1000) "0" # counter.toText()
                  else counter.toText();
    "RKTR/PTW/" # yearMonth # "/" # padded4;
  };

  // Returns current year/month as "YYYY/MM" text
  let NS_PER_MONTH : Int = 2_629_800_000_000_000; // ~30.4375 days
  public func currentYearMonth() : Text {
    let now = Time.now();
    let y = 1970 + now / NS_PER_YEAR;
    // Approximate month: (days since year start) / 30.4375
    let startOfYear : Int = (y - 1970) * NS_PER_YEAR;
    let daysIntoYear : Int = (now - startOfYear) / 86_400_000_000_000;
    let mo : Int = daysIntoYear / 30 + 1;
    let moClamp : Nat = if (mo < 1) 1 else if (mo > 12) 12 else mo.toNat();
    let ym = y.toNat().toText() # "/" # padded(moClamp, 2);
    ym;
  };

  // ─── PermitToWork factory ─────────────────────────────────
  public func newPermitToWork(
    id    : Text,
    input : T.CreatePermitInput,
    createdBy : CT.EmployeeId,
  ) : T.PermitToWork {
    let now = Time.now();
    {
      id;
      permitType        = input.permitType;
      validityDate      = input.validityDate;
      timeStart         = input.timeStart;
      timeEnd           = input.timeEnd;
      issuingDepartment = input.issuingDepartment;
      issuedTo          = input.issuedTo;
      crossReference    = input.crossReference;
      jobLocation       = input.jobLocation;
      jobDescription    = input.jobDescription;
      contractorName    = input.contractorName;
      supervisorName    = input.supervisorName;
      var status        = #Draft;
      department        = input.department;
      area              = input.area;
      riskLevel         = input.riskLevel;
      insurance         = input.insurance;
      selectedHazards   = input.selectedHazards;
      customHazard      = input.customHazard;
      selectedPPE       = input.selectedPPE;
      isolation         = input.isolation;
      checklist         = input.checklist;
      var requestorSignature           = null;
      var hodSignature                 = null;
      var areaInChargeSignature        = null;
      var isolationAuthoritySignature  = null;
      var safetyOfficerSignature       = null;
      var finalIssuerSignature         = null;
      var electricalApproverSignature  = null;
      var serviceProcessApproverSignature = null;
      var electricalEnergisation       = null;
      var serviceProcessEnergisation   = null;
      var o2Percent      = null;
      var lelPercent     = null;
      var h2sPpm         = null;
      var coPpm          = null;
      var toolboxTalkDone      = false;
      var toolboxTalkAttendees = [];
      var emergencyRescuePlan        = false;
      var emergencyRescueDescription = "";
      var linkedHiraNumber = null;
      var linkedJsaNumber  = null;
      createdBy;
      createdAt  = now;
      var updatedAt = now;
      var nominatedHodEmployeeId             = input.nominatedHodEmployeeId;
      var nominatedAreaInChargeEmployeeId    = null;
      var nominatedIsolationAuthorityEmployeeId = null;
      var nominatedSafetyOfficerEmployeeId   = null;
      var nominatedFinalIssuerEmployeeId     = null;
    };
  };

  public func toPermitView(p : T.PermitToWork) : T.PermitToWorkView {
    {
      id                = p.id;
      permitType        = p.permitType;
      validityDate      = p.validityDate;
      timeStart         = p.timeStart;
      timeEnd           = p.timeEnd;
      issuingDepartment = p.issuingDepartment;
      issuedTo          = p.issuedTo;
      crossReference    = p.crossReference;
      jobLocation       = p.jobLocation;
      jobDescription    = p.jobDescription;
      contractorName    = p.contractorName;
      supervisorName    = p.supervisorName;
      status            = p.status;
      department        = p.department;
      area              = p.area;
      riskLevel         = p.riskLevel;
      insurance         = p.insurance;
      selectedHazards   = p.selectedHazards;
      customHazard      = p.customHazard;
      selectedPPE       = p.selectedPPE;
      isolation         = p.isolation;
      checklist         = p.checklist;
      requestorSignature           = p.requestorSignature;
      hodSignature                 = p.hodSignature;
      areaInChargeSignature        = p.areaInChargeSignature;
      isolationAuthoritySignature  = p.isolationAuthoritySignature;
      safetyOfficerSignature       = p.safetyOfficerSignature;
      finalIssuerSignature         = p.finalIssuerSignature;
      electricalApproverSignature  = p.electricalApproverSignature;
      serviceProcessApproverSignature = p.serviceProcessApproverSignature;
      electricalEnergisation       = p.electricalEnergisation;
      serviceProcessEnergisation   = p.serviceProcessEnergisation;
      o2Percent         = p.o2Percent;
      lelPercent        = p.lelPercent;
      h2sPpm            = p.h2sPpm;
      coPpm             = p.coPpm;
      toolboxTalkDone      = p.toolboxTalkDone;
      toolboxTalkAttendees = p.toolboxTalkAttendees;
      emergencyRescuePlan        = p.emergencyRescuePlan;
      emergencyRescueDescription = p.emergencyRescueDescription;
      linkedHiraNumber  = p.linkedHiraNumber;
      linkedJsaNumber   = p.linkedJsaNumber;
      createdBy         = p.createdBy;
      createdAt         = p.createdAt;
      updatedAt         = p.updatedAt;
      nominatedHodEmployeeId             = p.nominatedHodEmployeeId;
      nominatedAreaInChargeEmployeeId    = p.nominatedAreaInChargeEmployeeId;
      nominatedIsolationAuthorityEmployeeId = p.nominatedIsolationAuthorityEmployeeId;
      nominatedSafetyOfficerEmployeeId   = p.nominatedSafetyOfficerEmployeeId;
      nominatedFinalIssuerEmployeeId     = p.nominatedFinalIssuerEmployeeId;
    };
  };

  // ─── KPI Computation ──────────────────────────────────────
  // manHours proxy: 8h/day * 250days/year * activeEmployee count
  public func computeTRIR(recordableCount : Nat, employeeCount : Nat) : Float {
    let manHours = employeeCount * 8 * 250;
    if (manHours == 0) return 0.0;
    (recordableCount * 200000).toFloat() / manHours.toFloat();
  };

  public func computeLTIFR(ltiCount : Nat, employeeCount : Nat) : Float {
    let manHours = employeeCount * 8 * 250;
    if (manHours == 0) return 0.0;
    (ltiCount * 1000000).toFloat() / manHours.toFloat();
  };
};
