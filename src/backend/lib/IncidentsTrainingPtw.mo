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

  // ─── PTW factory ──────────────────────────────────────────
  public func newPTW(
    number  : Text,
    input   : T.CreatePTWInput,
    requestedById  : CT.EmployeeId,
    requestedByName : Text,
  ) : T.PTW {
    {
      permitNumber    = number;
      permitType      = input.permitType;
      workDescription = input.workDescription;
      location        = input.location;
      startDateTime   = input.startDateTime;
      endDateTime     = input.endDateTime;
      requestedById;
      requestedByName;
      contractorTeam  = input.contractorTeam;
      riskAssessed    = input.riskAssessed;
      ppeRequired     = input.ppeRequired;
      var status      = #Draft;
      var hodStep     = null;
      var aicStep     = null;
      var soStep      = null;
      var rejectedAt  = null;
      var rejectedRemarks = "";
      var closedAt    = null;
      createdAt       = Time.now();
    };
  };

  public func toStepView(s : T.ApprovalStep) : T.ApprovalStepView {
    {
      approverId   = s.approverId;
      approverName = s.approverName;
      role         = s.role;
      approved     = s.approved;
      remarks      = s.remarks;
      actionAt     = s.actionAt;
    };
  };

  public func toPTWView(p : T.PTW) : T.PTWView {
    {
      permitNumber    = p.permitNumber;
      permitType      = p.permitType;
      workDescription = p.workDescription;
      location        = p.location;
      startDateTime   = p.startDateTime;
      endDateTime     = p.endDateTime;
      requestedById   = p.requestedById;
      requestedByName = p.requestedByName;
      contractorTeam  = p.contractorTeam;
      riskAssessed    = p.riskAssessed;
      ppeRequired     = p.ppeRequired;
      status          = p.status;
      hodStep         = switch (p.hodStep) { case (null) null; case (?s) ?toStepView(s) };
      aicStep         = switch (p.aicStep) { case (null) null; case (?s) ?toStepView(s) };
      soStep          = switch (p.soStep)  { case (null) null; case (?s) ?toStepView(s) };
      rejectedAt      = p.rejectedAt;
      rejectedRemarks = p.rejectedRemarks;
      closedAt        = p.closedAt;
      createdAt       = p.createdAt;
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
