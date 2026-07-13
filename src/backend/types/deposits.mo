/// Deposit domain types — manual and recurring deposits.
import Common "./common";

module {
  /// Recurring deposit cadence.
  public type RecurringCadence = {
    #daily;
    #weekly;
    #monthly;
  };

  /// A scheduled recurring deposit for a vault.
  public type RecurringDeposit = {
    id : Nat;
    userId : Common.UserId;
    vaultId : Nat;
    amount : Nat;
    cadence : RecurringCadence;
    /// Next run time in nanoseconds.
    nextRunAt : Common.Timestamp;
    /// Idempotency key prefix used for each scheduled run.
    idempotencyKeyPrefix : Common.IdempotencyKey;
    active : Bool;
    createdAt : Common.Timestamp;
  };

  /// Request to set up a recurring deposit.
  public type SetupRecurringDepositRequest = {
    vaultId : Nat;
    amount : Nat;
    cadence : RecurringCadence;
    idempotencyKeyPrefix : Common.IdempotencyKey;
  };

  /// Result of a manual deposit attempt.
  public type DepositResult = {
    #ok : { transactionId : Nat; newBalance : Nat };
    #duplicate;                              // idempotency key already used
    #invalidVault;
    #insufficientReason;
  };
};
