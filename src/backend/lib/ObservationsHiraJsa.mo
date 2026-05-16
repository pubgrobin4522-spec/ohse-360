import T2A "../types/phase2-observations-hira-jsa";
import CT "../types/common";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {

  // ──────────────────────────────────────────
  // Number generators
  // ──────────────────────────────────────────

  func padSeq(seq : Nat) : Text {
    let s = seq.toText();
    let needed : Int = 4 - s.size().toInt();
    if (needed <= 0) return s;
    var pad = "";
    var i = 0;
    while (i < needed.toNat()) {
      pad := pad # "0";
      i += 1;
    };
    pad # s;
  };

  public func generateObsNumber(year : Nat, seq : Nat) : Text {
    "OBS-" # year.toText() # "-" # padSeq(seq);
  };

  public func generateHiraNumber(year : Nat, seq : Nat) : Text {
    "HIRA-" # year.toText() # "-" # padSeq(seq);
  };

  public func generateJsaNumber(year : Nat, seq : Nat) : Text {
    "JSA-" # year.toText() # "-" # padSeq(seq);
  };

  // ──────────────────────────────────────────
  // Risk calculations
  // ──────────────────────────────────────────

  public func calcRiskScore(likelihood : Nat, severity : Nat) : Nat {
    likelihood * severity;
  };

  public func calcRiskLevel(likelihood : Nat, severity : Nat) : T2A.RiskLevel {
    let score = calcRiskScore(likelihood, severity);
    if (score <= 4)  return #Low;
    if (score <= 9)  return #Medium;
    if (score <= 16) return #High;
    #Critical;
  };

  // ──────────────────────────────────────────
  // BBS helpers
  // ──────────────────────────────────────────

  public func isBbsObsUnsafe(obsType : T2A.ObservationType) : Bool {
    switch (obsType) {
      case (#UnsafeAct or #UnsafeCondition) true;
      case (_) false;
    };
  };

  public func calcBbsScore(totalObs : Nat, safeObs : Nat) : Nat {
    if (totalObs == 0) return 100;
    (safeObs * 100) / totalObs;
  };

};
