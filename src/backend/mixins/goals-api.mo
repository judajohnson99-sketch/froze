/// Public API surface for goals — milestones + achievements.
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Types "../types/goals";
import VaultTypes "../types/vaults";
import Common "../types/common";
import GoalsLib "../lib/goals";
import VaultsLib "../lib/vaults";

mixin (
  reachedMilestones : List.List<Types.ReachedMilestone>,
  achievements : List.List<Types.Achievement>,
  nextAchievementId : { var value : Nat },
  vaults : Map.Map<Nat, VaultTypes.Vault>,
) {
  /// Get goal progress for a vault.
  public shared ({ caller }) func getGoalProgress(
    vaultId : Nat,
  ) : async Types.GoalProgress {
    let vault = switch (VaultsLib.get(vaults, vaultId)) {
      case (?v) {
        if (v.userId != caller) {
          Runtime.trap("getGoalProgress: not authorized");
        };
        v;
      };
      case null { Runtime.trap("getGoalProgress: vault not found") };
    };
    GoalsLib.computeProgress(
      vaultId, vault.targetAmount, vault.currentAmount, reachedMilestones,
    );
  };

  /// List milestones reached for a vault.
  public shared ({ caller }) func getMilestones(
    vaultId : Nat,
  ) : async [Types.ReachedMilestone] {
    let vault = switch (VaultsLib.get(vaults, vaultId)) {
      case (?v) {
        if (v.userId != caller) {
          Runtime.trap("getMilestones: not authorized");
        };
        v;
      };
      case null { Runtime.trap("getMilestones: vault not found") };
    };
    reachedMilestones.filter(func(r : Types.ReachedMilestone) : Bool { r.vaultId == vaultId }).toArray();
  };

  /// List the caller's achievements.
  public shared ({ caller }) func getAchievements() : async [Types.Achievement] {
    GoalsLib.listForUser(achievements, caller);
  };
};
