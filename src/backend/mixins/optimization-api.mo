/// Public API surface for the savings optimization engine.
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/optimization";
import DepositTypes "../types/deposits";
import Common "../types/common";
import OptimizationLib "../lib/optimization";

mixin (
  recommendations : List.List<Types.Recommendation>,
  nextRecommendationId : { var value : Nat },
  userVaults : Map.Map<Common.UserId, [Nat]>,
  recurring : Map.Map<Nat, DepositTypes.RecurringDeposit>,
  userRecurring : Map.Map<Common.UserId, [Nat]>,
  totalSaved : { var value : Nat },
  upcomingUnlocks : { var value : Nat },
) {
  /// Generate a fresh recommendation for the caller (conservative,
  /// with disclaimer).
  public shared ({ caller }) func getRecommendations() : async Types.Recommendation {
    let profile = OptimizationLib.buildProfile(
      userVaults, recurring, userRecurring,
      caller, totalSaved.value, upcomingUnlocks.value,
    );
    OptimizationLib.recommend(
      recommendations, nextRecommendationId, profile, Time.now(),
    );
  };

  /// List the caller's past recommendations.
  public shared ({ caller }) func getRecommendationHistory() : async [Types.Recommendation] {
    OptimizationLib.listForUser(recommendations, caller);
  };
};
