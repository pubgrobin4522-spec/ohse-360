import CT "../types/common";
import T2 "../types/phase2-capa-esg-ai-ppe-contractor";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {

  // ─── Shared calendar constants ─────────────────────────────
  let NS_PER_DAY : Int = 86_400_000_000_000;

  // ─── Sequence formatters ────────────────────────────────────
  func padded(n : Nat, width : Nat) : Text {
    let s = n.toText();
    let needed : Int = width.toInt() - s.size().toInt();
    if (needed <= 0) return s;
    var pad = "";
    var i = 0;
    while (i < needed.toNat()) { pad := pad # "0"; i += 1 };
    pad # s;
  };

  /// Generate a contractor ID: CON-YYYY-0001
  public func generateContractorId(year : Nat, seq : Nat) : Text {
    "CON-" # year.toText() # "-" # padded(seq, 4);
  };

  /// Generate an induction certificate number: CONIND-YYYY-0001
  public func generateInductionCertNumber(year : Nat, seq : Nat) : Text {
    "CONIND-" # year.toText() # "-" # padded(seq, 4);
  };

  // ─── Date parsing helper ────────────────────────────────────
  // Accepts ISO-8601 text "YYYY-MM-DD". Returns approximate
  // nanoseconds from Unix epoch (noon UTC of given date).
  func parseDateNs(dateText : Text) : ?Int {
    let parts = dateText.split(#char '-').toArray();
    if (parts.size() < 3) return null;
    switch (Nat.fromText(parts[0]), Nat.fromText(parts[1]), Nat.fromText(parts[2])) {
      case (?yr, ?mo, ?day) {
        // Days from epoch (approximate, no leap-year correction)
        let daysFromEpoch : Int =
          (yr.toInt() - 1970) * 365 +
          (mo.toInt() - 1) * 30 +
          (day.toInt() - 1);
        ?(daysFromEpoch * NS_PER_DAY);
      };
      case (_) null;
    };
  };

  /// Returns true when expiryDate is within 30 days from `now`
  public func isDocumentExpiringSoon(expiryDate : Text, now : CT.Timestamp) : Bool {
    switch (parseDateNs(expiryDate)) {
      case (null) false;
      case (?exNs) {
        let diff : Int = exNs - now;
        diff >= 0 and diff <= 30 * NS_PER_DAY;
      };
    };
  };

  /// Returns true when expiryDate is in the past relative to `now`
  public func isDocumentExpired(expiryDate : Text, now : CT.Timestamp) : Bool {
    switch (parseDateNs(expiryDate)) {
      case (null) false;
      case (?exNs) { exNs < now };
    };
  };

  /// Derive document status from expiry date vs current time
  public func getContractorDocStatus(expiryDate : Text, now : CT.Timestamp) : T2.ContractorDocStatus {
    if (isDocumentExpired(expiryDate, now))       { #Expired  }
    else if (isDocumentExpiringSoon(expiryDate, now)) { #Expiring }
    else                                           { #Valid    };
  };

  /// Induction compliance: percentage of employees who have Passed
  public func calcContractorInductionCompliance(total : Nat, passed : Nat) : Nat {
    if (total == 0) return 0;
    let pct : Int = (passed * 100).toInt() / total.toInt();
    if (pct > 100) return 100;
    pct.toNat();
  };

  /// Validates gas test readings against safe operating limits.
  /// Safe ranges: O2 19.5–23 %, LEL < 10 %, H2S < 1 ppm, CO < 25 ppm
  public func gasTestPassed(o2 : Float, lel : Float, h2s : Float, co : Float) : Bool {
    o2  >= 19.5 and o2  <= 23.0 and
    lel < 10.0  and
    h2s < 1.0   and
    co  < 25.0;
  };

};
