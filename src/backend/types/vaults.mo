/// Vault domain types — each vault is its own account in the ledger.
import Common "./common";

module {
  /// Lifecycle status of a vault.
  public type VaultStatus = {
    #freezing;  // actively accumulating deposits toward a goal
    #thawing;   // lock period ending soon, unlock approaching
    #thawed;    // unlocked, funds available to withdraw
    #broken;    // user broke the lock early (penalty may apply)
  };

  /// A savings vault — one account per (user, vaultId) in the ledger.
  public type Vault = {
    id : Nat;
    userId : Common.UserId;
    goalName : Text;
    targetAmount : Nat;
    /// Derived from ledger entries — never directly mutable.
    currentAmount : Nat;
    lockDurationNs : Common.Timestamp;
    /// Scheduled unlock date (createdAt + lockDurationNs).
    unlockDate : Common.Timestamp;
    status : VaultStatus;
    createdAt : Common.Timestamp;
    /// Optional user-supplied note.
    note : ?Text;
  };

  /// Payload for creating a new vault.
  public type CreateVaultRequest = {
    goalName : Text;
    targetAmount : Nat;
    lockDurationNs : Common.Timestamp;
    note : ?Text;
  };

  /// Public view of a vault with its derived balance.
  public type VaultView = {
    id : Nat;
    goalName : Text;
    targetAmount : Nat;
    currentAmount : Nat;
    progressPercent : Nat;
    unlockDate : Common.Timestamp;
    status : VaultStatus;
    createdAt : Common.Timestamp;
    note : ?Text;
  };
};
