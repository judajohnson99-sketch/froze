/// Milestones + achievements.
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/goals";
import Common "../types/common";

module {
  public type GoalProgress = Types.GoalProgress;
  public type ReachedMilestone = Types.ReachedMilestone;
  public type Achievement = Types.Achievement;
  public type Milestone = Types.Milestone;

  /// Compute goal progress for a vault given its current + target amounts.
  public func computeProgress(
    vaultId : Nat,
    targetAmount : Nat,
    currentAmount : Nat,
    reached : List.List<ReachedMilestone>,
  ) : GoalProgress {
    let percent = if (targetAmount == 0) { 0 } else {
      let p = (currentAmount * 100) / targetAmount;
      if (p > 100) { 100 } else { p };
    };
    let reachedArr = reached.filter(func(r : ReachedMilestone) : Bool { r.vaultId == vaultId }).toArray();
    let reachedMilestones = reachedArr.map(
      func(r : ReachedMilestone) : Milestone = r.milestone,
    );
    let nextMilestone = computeNextMilestone(percent);
    { vaultId; targetAmount; currentAmount; percent; reachedMilestones; nextMilestone };
  };

  /// Record a newly reached milestone (idempotent per vault+milestone).
  /// Returns true if this was a newly reached milestone.
  public func recordMilestone(
    reached : List.List<ReachedMilestone>,
    vaultId : Nat,
    milestone : Milestone,
    timestamp : Common.Timestamp,
  ) : Bool {
    let already = reached.find(func(r : ReachedMilestone) : Bool {
      r.vaultId == vaultId and Milestone_eq(r.milestone, milestone);
    });
    switch (already) {
      case (?_) { false };
      case null {
        let percent = milestoneToPercent(milestone);
        reached.add({ vaultId; milestone; percent; reachedAt = timestamp });
        true;
      };
    };
  };

  /// Award an achievement to a user.
  public func awardAchievement(
    achievements : List.List<Achievement>,
    nextAchievementId : { var value : Nat },
    userId : Common.UserId,
    title : Text,
    description : Text,
    timestamp : Common.Timestamp,
  ) : Achievement {
    let id = nextAchievementId.value;
    nextAchievementId.value := id + 1;
    let a : Achievement = { id; userId; title; description; awardedAt = timestamp };
    achievements.add(a);
    a;
  };

  /// List achievements for a user.
  public func listForUser(
    achievements : List.List<Achievement>,
    userId : Common.UserId,
  ) : [Achievement] {
    achievements.filter(func(a : Achievement) : Bool { a.userId == userId }).toArray();
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  func milestoneToPercent(m : Milestone) : Nat {
    switch (m) {
      case (#twentyFive) { 25 };
      case (#fifty) { 50 };
      case (#seventyFive) { 75 };
      case (#oneHundred) { 100 };
    };
  };

  func computeNextMilestone(percent : Nat) : ?Milestone {
    if (percent < 25) { ?#twentyFive }
    else if (percent < 50) { ?#fifty }
    else if (percent < 75) { ?#seventyFive }
    else if (percent < 100) { ?#oneHundred }
    else { null };
  };

  func Milestone_eq(a : Milestone, b : Milestone) : Bool {
    switch (a, b) {
      case (#twentyFive, #twentyFive) { true };
      case (#fifty, #fifty) { true };
      case (#seventyFive, #seventyFive) { true };
      case (#oneHundred, #oneHundred) { true };
      case _ { false };
    };
  };
};
