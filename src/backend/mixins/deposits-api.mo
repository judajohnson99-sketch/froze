/// Public API surface for deposits — manual + recurring.
/// All financial functions require an idempotency key.
/// makeDeposit appends ledger entries, syncs the vault balance, creates a
/// depositFrozen notification, and checks milestones.
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/deposits";
import LedgerTypes "../types/ledger";
import VaultTypes "../types/vaults";
import NotificationTypes "../types/notifications";
import GoalTypes "../types/goals";
import Common "../types/common";
import LedgerLib "../lib/ledger";
import VaultsLib "../lib/vaults";
import DepositsLib "../lib/deposits";
import NotificationsLib "../lib/notifications";
import GoalsLib "../lib/goals";

mixin (
  recurring : Map.Map<Nat, Types.RecurringDeposit>,
  userRecurring : Map.Map<Common.UserId, [Nat]>,
  nextRecurringId : { var value : Nat },
  // Cross-domain state needed by makeDeposit.
  vaults : Map.Map<Nat, VaultTypes.Vault>,
  ledgerEntries : List.List<LedgerTypes.LedgerEntry>,
  balanceCache : Map.Map<Nat, LedgerTypes.VaultBalance>,
  idempotencyIndex : Map.Map<Common.IdempotencyKey, Nat>,
  nextTransactionId : { var value : Nat },
  nextSequence : { var value : Nat },
  userNotifications : Map.Map<Common.UserId, List.List<NotificationTypes.Notification>>,
  nextNotificationId : { var value : Nat },
  reachedMilestones : List.List<GoalTypes.ReachedMilestone>,
  achievements : List.List<GoalTypes.Achievement>,
  nextAchievementId : { var value : Nat },
) {
  /// Make a manual deposit into a vault. Requires an idempotency key.
  public shared ({ caller }) func makeDeposit(
    vaultId : Nat,
    amount : Nat,
    idempotencyKey : Common.IdempotencyKey,
    description : Text,
  ) : async Types.DepositResult {
    // Idempotency check first.
    if (LedgerLib.isDuplicate(idempotencyIndex, idempotencyKey)) {
      return #duplicate;
    };
    // Validate vault exists and belongs to caller.
    let vault = switch (VaultsLib.get(vaults, vaultId)) {
      case (?v) {
        if (v.userId != caller) {
          return #invalidVault;
        };
        v;
      };
      case null { return #invalidVault };
    };
    if (amount == 0) {
      return #insufficientReason;
    };
    let now = Time.now();
    // Append paired debit+credit ledger entries.
    let txnId = LedgerLib.append(
      ledgerEntries, balanceCache, idempotencyIndex,
      nextTransactionId, nextSequence,
      caller, vaultId, amount, idempotencyKey,
      caller, description, #manualDeposit, now,
    );
    // Sync the vault's derived balance from the balance cache.
    let newBalance = switch (LedgerLib.getBalance(balanceCache, vaultId)) {
      case (?b) { b.balance };
      case null { 0 };
    };
    let _ = VaultsLib.syncBalance(vaults, vaultId, newBalance);
    // Create a depositFrozen notification.
    let _ = NotificationsLib.create(
      userNotifications, nextNotificationId,
      caller, #depositFrozen,
      "Deposit frozen",
      "Your deposit of " # amount.toText() # " has been frozen into vault " # vaultId.toText() # ".",
      ?vaultId,
      now,
    );
    // Check + record milestones.
    checkMilestones(vault, newBalance, now, caller);
    #ok({ transactionId = txnId; newBalance });
  };

  /// Set up a recurring deposit schedule for a vault.
  public shared ({ caller }) func setupRecurringDeposit(
    request : Types.SetupRecurringDepositRequest,
  ) : async Nat {
    // Validate vault ownership.
    switch (VaultsLib.get(vaults, request.vaultId)) {
      case (?v) {
        if (v.userId != caller) {
          Runtime.trap("setupRecurringDeposit: not vault owner");
        };
      };
      case null { Runtime.trap("setupRecurringDeposit: vault not found") };
    };
    DepositsLib.setupRecurring(
      recurring, userRecurring, nextRecurringId,
      caller, request, Time.now(),
    );
  };

  /// List the caller's recurring deposits.
  public shared ({ caller }) func getRecurringDeposits() : async [Types.RecurringDeposit] {
    DepositsLib.listRecurringForUser(userRecurring, recurring, caller);
  };

  /// Deactivate a recurring deposit.
  public shared ({ caller }) func cancelRecurringDeposit(recurringId : Nat) : async Bool {
    // Validate ownership before deactivating.
    switch (recurring.get(recurringId)) {
      case (?d) {
        if (d.userId != caller) {
          Runtime.trap("cancelRecurringDeposit: not owner");
        };
      };
      case null { return false };
    };
    DepositsLib.deactivate(recurring, recurringId);
  };

  // ── Internal: check + record any newly reached milestones ──────────────
  func checkMilestones(vault : VaultTypes.Vault, newAmount : Nat, now : Common.Timestamp, userId : Common.UserId) : () {
    let percent = if (vault.targetAmount == 0) { 0 } else {
      let p = (newAmount * 100) / vault.targetAmount;
      if (p > 100) { 100 } else { p };
    };
    let milestones : [GoalTypes.Milestone] = [#twentyFive, #fifty, #seventyFive, #oneHundred];
    for (m in milestones.values()) {
      let threshold = GoalsMilestone_percent(m);
      if (percent >= threshold) {
        let newlyReached = GoalsLib.recordMilestone(
          reachedMilestones, vault.id, m, now,
        );
        if (newlyReached) {
          let _ = NotificationsLib.create(
            userNotifications, nextNotificationId,
            userId, #milestoneReached,
            "Milestone reached",
            "You reached " # threshold.toText() # "% of your goal '" # vault.goalName # "'.",
            ?vault.id,
            now,
          );
          let _ = GoalsLib.awardAchievement(
            achievements, nextAchievementId,
            userId,
            "Milestone: " # threshold.toText() # "%",
            "Reached " # threshold.toText() # "% of vault '" # vault.goalName # "'.",
            now,
          );
        };
      };
    };
  };

  // Local helper to avoid exposing milestoneToPercent publicly.
  func GoalsMilestone_percent(m : GoalTypes.Milestone) : Nat {
    switch (m) {
      case (#twentyFive) { 25 };
      case (#fifty) { 50 };
      case (#seventyFive) { 75 };
      case (#oneHundred) { 100 };
    };
  };
};
