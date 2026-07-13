/// Goals domain — milestones and achievements per vault.
import Common "./common";

module {
  /// Standard milestone percentages.
  public type Milestone = {
    #twentyFive;
    #fifty;
    #seventyFive;
    #oneHundred;
  };

  /// A reached milestone record for a vault.
  public type ReachedMilestone = {
    vaultId : Nat;
    milestone : Milestone;
    percent : Nat;
    reachedAt : Common.Timestamp;
  };

  /// An achievement badge awarded to a user.
  public type Achievement = {
    id : Nat;
    userId : Common.UserId;
    title : Text;
    description : Text;
    awardedAt : Common.Timestamp;
  };

  /// Progress toward a vault goal.
  public type GoalProgress = {
    vaultId : Nat;
    targetAmount : Nat;
    currentAmount : Nat;
    percent : Nat;
    reachedMilestones : [Milestone];
    nextMilestone : ?Milestone;
  };
};
