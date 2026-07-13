/// Savings optimization engine — analysis + recommendations.
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/optimization";
import DepositTypes "../types/deposits";
import Common "../types/common";

module {
  public type Recommendation = Types.Recommendation;
  public type UserSavingsProfile = Types.UserSavingsProfile;

  /// Behavioral guidance disclaimer — always present on recommendations.
  let disclaimer : Text = "This is behavioral guidance, not financial advice.";

  /// Build a user's savings profile from their vault + deposit history.
  public func buildProfile(
    userVaults : Map.Map<Common.UserId, [Nat]>,
    recurring : Map.Map<Nat, DepositTypes.RecurringDeposit>,
    userRecurring : Map.Map<Common.UserId, [Nat]>,
    userId : Common.UserId,
    totalSaved : Nat,
    upcomingUnlocks : Nat,
  ) : UserSavingsProfile {
    let vaultCount = switch (userVaults.get(userId)) {
      case (?arr) { arr.size() };
      case null { 0 };
    };
    // Average deposit amount + cadence from recurring schedules.
    var sumAmount : Nat = 0;
    var count : Nat = 0;
    var sumCadenceDays : Nat = 0;
    switch (userRecurring.get(userId)) {
      case (?ids) {
        for (id in ids.values()) {
          switch (recurring.get(id)) {
            case (?d) {
              sumAmount += d.amount;
              count += 1;
              sumCadenceDays += cadenceToDays(d.cadence);
            };
            case null {};
          };
        };
      };
      case null {};
    };
    let averageDepositAmount = if (count == 0) { 0 } else { sumAmount / count };
    let depositCadenceDays = if (count == 0) { 0 } else { sumCadenceDays / count };
    {
      userId;
      vaultCount;
      averageDepositAmount;
      depositCadenceDays;
      totalSaved;
      upcomingUnlocks;
    };
  };

  /// Generate a conservative recommendation for a user.
  /// Always includes the behavioral-guidance disclaimer.
  public func recommend(
    recommendations : List.List<Recommendation>,
    nextRecommendationId : { var value : Nat },
    profile : UserSavingsProfile,
    timestamp : Common.Timestamp,
  ) : Recommendation {
    let id = nextRecommendationId.value;
    nextRecommendationId.value := id + 1;

    // Conservative suggested percent: cap at 10% of total saved as a nudge,
    // or 5% if the user has no savings yet.
    let suggestedPercent : Nat = if (profile.totalSaved == 0) { 5 } else {
      let p = (profile.averageDepositAmount * 100) / (profile.totalSaved + 1);
      if (p > 10) { 10 } else { p };
    };

    // Cash-flow warning: if deposit cadence is long relative to upcoming unlocks.
    let cashFlowWarning : ?Text = if (profile.upcomingUnlocks > 0 and profile.depositCadenceDays > 14) {
      ?"Cash-flow gap detected: your deposit cadence may not keep up with upcoming vault unlocks. Consider shortening your recurring deposit interval.";
    } else if (profile.vaultCount == 0) {
      ?"You have no active vaults yet. Creating one is the first step toward freezing your savings.";
    } else { null };

    let title : Text = if (profile.vaultCount == 0) {
      "Start your first frozen vault";
    } else if (profile.depositCadenceDays == 0) {
      "Set up a recurring deposit";
    } else {
      "Maintain your steady savings rhythm";
    };

    let rationale : Text = "Based on " # Nat_toText(profile.vaultCount) #
      " vault" # (if (profile.vaultCount == 1) { "" } else { "s" }) #
      " and an average deposit of " # Nat_toText(profile.averageDepositAmount) #
      " every " # Nat_toText(profile.depositCadenceDays) # " days, " #
      "we suggest keeping your contributions consistent and conservative.";

    let rec : Recommendation = {
      id;
      userId = profile.userId;
      title;
      rationale;
      suggestedPercent;
      suggestedDepositAdjustment = null;
      cashFlowWarning;
      disclaimer;
      createdAt = timestamp;
    };
    recommendations.add(rec);
    rec;
  };

  /// List past recommendations for a user.
  public func listForUser(
    recommendations : List.List<Recommendation>,
    userId : Common.UserId,
  ) : [Recommendation] {
    recommendations.filter(func(r : Recommendation) : Bool { r.userId == userId }).toArray();
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  func cadenceToDays(c : DepositTypes.RecurringCadence) : Nat {
    switch (c) {
      case (#daily) { 1 };
      case (#weekly) { 7 };
      case (#monthly) { 30 };
    };
  };

  func Nat_toText(n : Nat) : Text { n.toText() };
};
