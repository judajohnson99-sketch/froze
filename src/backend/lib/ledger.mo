/// Append-only double-entry ledger domain logic.
/// All financial writes produce paired debit+credit entries with monotonic
/// sequence numbers. Balances are derived by recompute — never directly mutated.
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Types "../types/ledger";
import Common "../types/common";

module {
  public type LedgerEntry = Types.LedgerEntry;
  public type VaultBalance = Types.VaultBalance;
  public type ReconciliationResult = Types.ReconciliationResult;

  /// Append a debit+credit pair atomically. Returns the transaction id.
  /// Traps if the idempotency key was already used.
  public func append(
    entries : List.List<LedgerEntry>,
    balanceCache : Map.Map<Nat, VaultBalance>,
    idempotencyIndex : Map.Map<Common.IdempotencyKey, Nat>,
    nextTransactionId : { var value : Nat },
    nextSequence : { var value : Nat },
    userId : Common.UserId,
    vaultId : Nat,
    amount : Nat,
    idempotencyKey : Common.IdempotencyKey,
    actor_ : Common.UserId,
    description : Text,
    reason : Types.EntryReason,
    timestamp : Common.Timestamp,
  ) : Nat {
    if (idempotencyIndex.containsKey(idempotencyKey)) {
      Runtime.trap("ledger.append: duplicate idempotency key");
    };
    let txnId = nextTransactionId.value;
    nextTransactionId.value := txnId + 1;

    let debitSeq = nextSequence.value;
    nextSequence.value := debitSeq + 1;
    let creditSeq = nextSequence.value;
    nextSequence.value := creditSeq + 1;

    let debitEntry : LedgerEntry = {
      sequence = debitSeq;
      transactionId = txnId;
      vaultId;
      userId;
      side = #debit;
      amount;
      idempotencyKey;
      triggeredBy = actor_;
      description;
      reason;
      timestamp;
    };
    let creditEntry : LedgerEntry = {
      sequence = creditSeq;
      transactionId = txnId;
      vaultId;
      userId;
      side = #credit;
      amount;
      idempotencyKey;
      triggeredBy = actor_;
      description;
      reason;
      timestamp;
    };
    entries.add(debitEntry);
    entries.add(creditEntry);

    idempotencyIndex.add(idempotencyKey, txnId);

    // Recompute balance from entries — never directly mutate.
    let result = reconcile(entries, vaultId);
    let newBalance : VaultBalance = {
      vaultId;
      userId;
      balance = result.derivedBalance;
      totalDebits = result.sumDebits;
      totalCredits = result.sumCredits;
      lastSequence = creditSeq;
    };
    balanceCache.add(vaultId, newBalance);

    txnId;
  };

  /// O(1) derived balance lookup for a vault.
  public func getBalance(
    balanceCache : Map.Map<Nat, VaultBalance>,
    vaultId : Nat,
  ) : ?VaultBalance {
    balanceCache.get(vaultId);
  };

  /// Reconcile a single vault: sum of debits vs credits.
  public func reconcile(
    entries : List.List<LedgerEntry>,
    vaultId : Nat,
  ) : ReconciliationResult {
    var sumDebits : Nat = 0;
    var sumCredits : Nat = 0;
    var owner : Common.UserId = Principal.fromText("aaaaa-aa");
    var found = false;
    for (entry in entries.values()) {
      if (entry.vaultId == vaultId) {
        if (not found) {
          owner := entry.userId;
          found := true;
        };
        switch (entry.side) {
          case (#debit) { sumDebits += entry.amount };
          case (#credit) { sumCredits += entry.amount };
        };
      };
    };
    let derived : Nat = if (sumCredits >= sumDebits) {
      sumCredits - sumDebits;
    } else {
      // Debits exceed credits — invariant violation for a balanced ledger.
      // Trap rather than return a negative-derived Nat (which would itself trap).
      Runtime.trap("ledger.reconcile: debits exceed credits");
    };
    let balanced = sumDebits == sumCredits;
    { vaultId; userId = owner; sumDebits; sumCredits; balanced; derivedBalance = derived };
  };

  /// Reconcile all vaults for a user.
  public func reconcileUser(
    entries : List.List<LedgerEntry>,
    userId : Common.UserId,
  ) : [ReconciliationResult] {
    // Collect distinct vault ids for the user, preserving first-seen order.
    let seen : List.List<Nat> = List.empty();
    for (entry in entries.values()) {
      if (entry.userId == userId) {
        if (seen.find(func(v : Nat) : Bool { v == entry.vaultId }) == null) {
          seen.add(entry.vaultId);
        };
      };
    };
    seen.toArray().map(
      func(vaultId : Nat) : ReconciliationResult = reconcile(entries, vaultId),
    );
  };

  /// Return the ledger entries for a single vault, ordered by sequence.
  public func getVaultLedger(
    entries : List.List<LedgerEntry>,
    vaultId : Nat,
  ) : [LedgerEntry] {
    entries.filter(func(e : LedgerEntry) : Bool { e.vaultId == vaultId }).toArray();
  };

  /// Check whether an idempotency key has already been consumed.
  public func isDuplicate(
    idempotencyIndex : Map.Map<Common.IdempotencyKey, Nat>,
    key : Common.IdempotencyKey,
  ) : Bool {
    idempotencyIndex.containsKey(key);
  };
};
