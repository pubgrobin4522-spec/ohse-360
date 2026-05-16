import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Array "mo:core/Array";

module {

  // ─── Sequence number padded string (shared helper) ────────
  public func padded(n : Nat, width : Nat) : Text {
    let s = n.toText();
    let needed : Int = width.toInt() - s.size().toInt();
    if (needed <= 0) return s;
    var pad = "";
    var i = 0;
    while (i < needed.toNat()) { pad := pad # "0"; i += 1 };
    pad # s;
  };

  // ─── Calendar helper ─────────────────────────────────────
  let NS_PER_YEAR : Int = 31_557_600_000_000_000;

  public func currentYear() : Nat {
    let y = 1970 + Time.now() / NS_PER_YEAR;
    y.toNat();
  };

  public func currentMonthLabel() : Text {
    let now = Time.now();
    let year = 1970 + now / NS_PER_YEAR;
    // Approximate month within year (1-12)
    let ns_in_year = now - (year - 1970) * NS_PER_YEAR;
    let ns_per_month : Int = NS_PER_YEAR / 12;
    let month = ns_in_year / ns_per_month + 1;
    let m = if (month > 12) 12 else month.toNat();
    year.toNat().toText() # "-" # padded(m, 2);
  };

  // ─── Number generators ───────────────────────────────────

  public func generateLotoNumber(year : Nat, seq : Nat) : Text {
    "LOTO-" # year.toText() # "-" # padded(seq, 4);
  };

  public func generatePpeItemId(seq : Nat) : Text {
    "PPE-" # padded(seq, 5);
  };

  public func generateIssuanceId(seq : Nat) : Text {
    "ISS-" # padded(seq, 5);
  };

  public func generateInspectionId(seq : Nat) : Text {
    "INSP-" # padded(seq, 5);
  };

  // ─── AI Risk Score calculation ───────────────────────────
  // Each input is normalized relative to a reference threshold, then weighted.
  // Reference thresholds (per 100 employees per year):
  //   nearMiss:             10  -> 100% contribution
  //   unsafeObs:            20  -> 100% contribution
  //   trainingGap:          15  -> 100% contribution
  //   overdueCapa:           5  -> 100% contribution
  //   openHighCriticalInc:   3  -> 100% contribution
  //
  // Weights: NearMiss 30%, UnsafeObs 25%, TrainingGap 25%, OverdueCapa 10%, OpenHighCrit 10%
  public func calcRiskScore(
    nearMissCount        : Nat,
    unsafeObsCount       : Nat,
    trainingGapCount     : Nat,
    overdueCapaCount     : Nat,
    openHighCriticalInc  : Nat,
  ) : Nat {
    // Normalize each metric to 0-100 scale (cap at 100)
    let norm = func(val : Nat, threshold : Nat) : Float {
      if (threshold == 0) return 0.0;
      let r = (val * 100).toFloat() / threshold.toFloat();
      if (r > 100.0) 100.0 else r;
    };

    let n1 = norm(nearMissCount,       10);
    let n2 = norm(unsafeObsCount,      20);
    let n3 = norm(trainingGapCount,    15);
    let n4 = norm(overdueCapaCount,     5);
    let n5 = norm(openHighCriticalInc,  3);

    let score = n1 * 0.30 + n2 * 0.25 + n3 * 0.25 + n4 * 0.10 + n5 * 0.10;
    let rounded = (score + 0.5).toInt();
    if (rounded < 0) return 0;
    let nat = rounded.toNat();
    if (nat > 100) 100 else nat;
  };

  // ─── Risk level from score ────────────────────────────────
  public func getRiskLevel(score : Nat) : Text {
    if (score <= 40)      "Low"
    else if (score <= 60) "Medium"
    else if (score <= 80) "High"
    else                  "Critical";
  };

  // ─── PPE Compliance Rate ─────────────────────────────────
  public func calcPpeComplianceRate(employeeCount : Nat, employeesWithAllPpe : Nat) : Nat {
    if (employeeCount == 0) return 0;
    let pct = (employeesWithAllPpe * 100) / employeeCount;
    if (pct > 100) 100 else pct;
  };

  // ─── Risk recommendation text ────────────────────────────
  public func topRiskDrivers(
    nearMissCount    : Nat,
    unsafeObsCount   : Nat,
    trainingGapCount : Nat,
    overdueCapaCount : Nat,
    openHighCritInc  : Nat,
  ) : [{ driver : Text; weight : Nat }] {
    // Weighted contributions (0-100 each * weight)
    let norm = func(val : Nat, threshold : Nat, weight : Nat) : Nat {
      if (threshold == 0) return 0;
      let pct = (val * 100) / threshold;
      let capped = if (pct > 100) 100 else pct;
      (capped * weight) / 100;
    };
    let d = [
      { driver = "Near Miss Events";         weight = norm(nearMissCount,    10, 30) },
      { driver = "Unsafe Acts & Conditions"; weight = norm(unsafeObsCount,   20, 25) },
      { driver = "Training Gaps";            weight = norm(trainingGapCount, 15, 25) },
      { driver = "Overdue CAPAs";            weight = norm(overdueCapaCount,  5, 10) },
      { driver = "Open High/Critical Incidents"; weight = norm(openHighCritInc, 3, 10) },
    ];
    // Sort descending by weight — simple insertion sort on a 5-element array
    let arr = d.toVarArray<{ driver : Text; weight : Nat }>();
    var i = 1;
    while (i < arr.size()) {
      let key = arr[i];
      var j : Int = i - 1;
      while (j >= 0 and arr[j.toNat()].weight < key.weight) {
        arr[(j + 1).toNat()] := arr[j.toNat()];
        j -= 1;
      };
      arr[(j + 1).toNat()] := key;
      i += 1;
    };
    Array.tabulate(arr.size(), func(i) { arr[i] });
  };

};
