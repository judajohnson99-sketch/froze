/// Append-only double-entry ledger types.
import Common "./common";

module {
  /// Debit or credit side of a double-entry record.
  public type EntrySide = { #debit; #credit };

  /// The reason / source for a ledger entry — full audit trail "why".
  public type EntryReason = {
    #manualDeposit;
    #recurringDeposit;
    #withdrawal;
    #interestReward;
    #vaultLock;
    #vaultUnlock;
    #vaultBreak;
    #reconciliationAdjustment;
    #jobProcessing;
  };

  /// A single append-only ledger entry. One financial transaction produces
  /// at least two entries (debit + credit) sharing the same `transactionId`.
  public type LedgerEntry = {
    /// Globally monotonic sequence number across the whole ledger.
    sequence : Common.Sequence;
    /// Groups the debit + credit sides of one transaction.
    transactionId : Nat;
    /// The vault account this entry applies to.
    vaultId : Nat;
    /// Owning user.
    userId : Common.UserId;
    /// Debit or credit side.
    side : EntrySide;
    /// Amount in the smallest unit (conceptual frozen-cents).
    amount : Nat;
    /// Idempotency key supplied by the caller.
    idempotencyKey : Common.IdempotencyKey;
    /// Who triggered the entry (caller principal).
    triggeredBy : Common.UserId;
    /// Human-readable "what" description.
    description : Text;
    /// "Why" — categorized reason.
    reason : EntryReason;
    /// When the entry was committed (nanoseconds).
    timestamp : Common.Timestamp;
  };

  /// Derived balance for a single vault account.
  public type VaultBalance = {
    vaultId : Nat;
    userId : Common.UserId;
    /// credits - debits, never negative (traps if it would be).
    balance : Nat;
    totalDebits : Nat;
    totalCredits : Nat;
    lastSequence : Common.Sequence;
  };

  /// Reconciliation result for a single vault account.
  public type ReconciliationResult = {
    vaultId : Nat;
    userId : Common.UserId;
    sumDebits : Nat;
    sumCredits : Nat;
    /// true iff sumDebits == sumCredits (zero net for closed accounts,
    /// or credits >= debits for an active savings account).
    balanced : Bool;
    derivedBalance : Nat;
  };
};
