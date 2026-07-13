/// Savings optimization engine types — recommendations + rationale.
import Common "./common";

module {
  /// A single savings recommendation.
  public type Recommendation = {
    id : Nat;
    userId : Common.UserId;
    /// Plain-language headline recommendation.
    title : Text;
    /// Explainable, conservative rationale.
    rationale : Text;
    /// Suggested savings percentage (0-100), conservatively derived.
    suggestedPercent : Nat;
    /// Suggested adjustment to a recurring deposit amount, if any.
    suggestedDepositAdjustment : ?{ vaultId : Nat; newAmount : Nat };
    /// Predicted cash-flow shortage warning, if any.
    cashFlowWarning : ?Text;
    /// Behavioral guidance disclaimer — not financial advice.
    disclaimer : Text;
    createdAt : Common.Timestamp;
  };

  /// Aggregate analytics used to derive recommendations.
  public type UserSavingsProfile = {
    userId : Common.UserId;
    vaultCount : Nat;
    averageDepositAmount : Nat;
    depositCadenceDays : Nat;
    totalSaved : Nat;
    upcomingUnlocks : Nat;
  };
};
