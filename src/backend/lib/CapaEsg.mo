import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {

  // ─── Shared nanoseconds constant ─────────────────────────
  let NS_PER_YEAR : Int = 31_557_600_000_000_000; // 365.25 days

  public func currentYear() : Nat {
    let y = 1970 + Time.now() / NS_PER_YEAR;
    y.toNat();
  };

  // ─── Sequence padded to 4 digits ─────────────────────────
  public func padded4(n : Nat) : Text {
    let s = n.toText();
    let needed : Int = (4 : Int) - s.size().toInt();
    if (needed <= 0) return s;
    var pad = "";
    var i = 0;
    while (i < needed.toNat()) { pad := pad # "0"; i += 1 };
    pad # s;
  };

  // ─── Number generators ────────────────────────────────────
  public func generateCapa2Number(year : Nat, seq : Nat) : Text {
    "CAPA-" # year.toText() # "-" # padded4(seq);
  };

  // ─── Date parsing helper: "YYYY-MM-DD" → nanoseconds from epoch ──
  // Approximate: treats day of month as day-of-year for simplicity
  let NS_PER_DAY : Int = 86_400_000_000_000;

  public func parseDateNs(dateText : Text) : ?Int {
    let parts = dateText.split(#char '-').toArray();
    if (parts.size() < 3) return null;
    switch (Nat.fromText(parts[0]), Nat.fromText(parts[1]), Nat.fromText(parts[2])) {
      case (?yr, ?mo, ?day) {
        // year offset from 1970, plus approximate month/day offsets
        let yearNs : Int = (yr.toInt() - 1970) * NS_PER_YEAR;
        let moNs   : Int = (mo.toInt() - 1) * 30 * NS_PER_DAY;   // approx 30 days/month
        let dayNs  : Int = (day.toInt() - 1) * NS_PER_DAY;
        ?(yearNs + moNs + dayNs);
      };
      case (_) { null };
    };
  };

  // ─── Overdue check ────────────────────────────────────────
  // targetDateText: "YYYY-MM-DD", now: nanoseconds (Int)
  public func isOverdue(targetDateText : Text, now : Int) : Bool {
    switch (parseDateNs(targetDateText)) {
      case (null)  { false };
      case (?tNs)  { now > tNs };
    };
  };

  // ─── ESG score ────────────────────────────────────────────
  // compliant readings / total readings × 100
  public func calcEsgScore(totalReadings : Nat, compliantReadings : Nat) : Nat {
    if (totalReadings == 0) return 100;
    (compliantReadings * 100) / totalReadings;
  };

  // ─── Carbon equivalent (kg CO2e per unit) ────────────────
  public func calcCarbonEquivalent(energyTypeText : Text, consumption : Float) : Float {
    let factor : Float = if (energyTypeText == "Electricity") { 0.4  }
      else if (energyTypeText == "Gas")         { 2.0  }
      else if (energyTypeText == "Diesel")      { 2.68 }
      else if (energyTypeText == "LPG")         { 1.51 }
      else if (energyTypeText == "Renewable")   { 0.0  }
      else                                       { 1.0  };
    consumption * factor;
  };

  // ─── CAPA closure rate ────────────────────────────────────
  public func calcCapaClosureRate(total : Nat, closed : Nat) : Nat {
    if (total == 0) return 100;
    (closed * 100) / total;
  };

  // ─── Energy type variant → text ──────────────────────────
  // Used internally to call calcCarbonEquivalent from variant type
  public func energyTypeToText(et : { #Electricity; #Gas; #Diesel; #LPG; #Renewable }) : Text {
    switch (et) {
      case (#Electricity) { "Electricity" };
      case (#Gas)         { "Gas"         };
      case (#Diesel)      { "Diesel"      };
      case (#LPG)         { "LPG"         };
      case (#Renewable)   { "Renewable"   };
    };
  };

};
