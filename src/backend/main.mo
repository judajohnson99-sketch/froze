/// Froze backend — composition root.
///
/// Wires all domain modules together via mixins. No business logic lives
/// here; every public function is delegated to a mixin. Stable state is
/// declared here and passed into the mixins that need it.
///
/// State shape change from the previous waitlist-only actor requires an
/// explicit migration (see migration.mo).
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Queue "mo:core/Queue";
import Time "mo:core/Time";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";

import Common "types/common";
import LedgerTypes "types/ledger";
import VaultTypes "types/vaults";
import DepositTypes "types/deposits";
import GoalTypes "types/goals";
import NotificationTypes "types/notifications";
import JobTypes "types/jobs";
import OptimizationTypes "types/optimization";
import AuthTypes "types/auth";
import WaitlistTypes "types/waitlist";



import LedgerLib "lib/ledger";
import VaultsLib "lib/vaults";
import DepositsLib "lib/deposits";
import NotificationsLib "lib/notifications";
import JobsLib "lib/jobs";

import LedgerApi "mixins/ledger-api";
import VaultsApi "mixins/vaults-api";
import DepositsApi "mixins/deposits-api";
import GoalsApi "mixins/goals-api";
import NotificationsApi "mixins/notifications-api";
import JobsApi "mixins/jobs-api";
import OptimizationApi "mixins/optimization-api";
import AuthApi "mixins/auth-api";
import WaitlistApi "mixins/waitlist-api";
import AdminApi "mixins/admin-api";


actor {
  // ── Ledger (append-only, stable memory) ────────────────────────────────
  let ledgerEntries = List.empty<LedgerTypes.LedgerEntry>();
  let balanceCache = Map.empty<Nat, LedgerTypes.VaultBalance>();
  let idempotencyIndex = Map.empty<Common.IdempotencyKey, Nat>();
  let nextTransactionId = { var value = 0 };
  let nextSequence = { var value = 0 };

  // ── Vaults ────────────────────────────────────────────────────────────
  let vaults = Map.empty<Nat, VaultTypes.Vault>();
  let userVaults = Map.empty<Common.UserId, [Nat]>();
  let nextVaultId = { var value = 0 };

  // ── Deposits (recurring schedules) ─────────────────────────────────────
  let recurring = Map.empty<Nat, DepositTypes.RecurringDeposit>();
  let userRecurring = Map.empty<Common.UserId, [Nat]>();
  let nextRecurringId = { var value = 0 };

  // ── Goals (milestones + achievements) ─────────────────────────────────
  let reachedMilestones = List.empty<GoalTypes.ReachedMilestone>();
  let achievements = List.empty<GoalTypes.Achievement>();
  let nextAchievementId = { var value = 0 };

  // ── Notifications (in-app store) ───────────────────────────────────────
  let userNotifications = Map.empty<Common.UserId, List.List<NotificationTypes.Notification>>();
  let nextNotificationId = { var value = 0 };

  // ── Jobs (background system) ───────────────────────────────────────────
  let pendingJobs = Queue.empty<JobTypes.Job>();
  let jobLog = List.empty<JobTypes.JobLogEntry>();
  let deadLetterJobs = List.empty<JobTypes.Job>();
  let jobIndex = Map.empty<Common.IdempotencyKey, Nat>();
  let nextJobId = { var value = 0 };

  // ── Optimization (recommendations) ─────────────────────────────────────
  let recommendations = List.empty<OptimizationTypes.Recommendation>();
  let nextRecommendationId = { var value = 0 };
  // Aggregate counters used by the optimization engine.
  let totalSaved = { var value = 0 };
  let upcomingUnlocks = { var value = 0 };

  // ── Auth (identities + admin allowlist) ────────────────────────────────
  let identities = Map.empty<Common.UserId, AuthTypes.UserIdentity>();
  let adminAllowlist = Set.empty<Common.UserId>();

  // ── Waitlist (preserved from previous actor) ───────────────────────────
  let waitlist = Map.empty<WaitlistTypes.Email, WaitlistTypes.Entry>();

  // ── Mixin composition ──────────────────────────────────────────────────
  include LedgerApi(ledgerEntries, balanceCache, adminAllowlist);
  include VaultsApi(
    vaults, userVaults, nextVaultId,
    ledgerEntries, balanceCache, idempotencyIndex,
    nextTransactionId, nextSequence,
  );
  include DepositsApi(
    recurring, userRecurring, nextRecurringId,
    vaults, ledgerEntries, balanceCache, idempotencyIndex,
    nextTransactionId, nextSequence,
    userNotifications, nextNotificationId,
    reachedMilestones, achievements, nextAchievementId,
  );
  include GoalsApi(reachedMilestones, achievements, nextAchievementId, vaults);
  include NotificationsApi(userNotifications, nextNotificationId);
  include JobsApi(jobLog, deadLetterJobs, pendingJobs, adminAllowlist);
  include OptimizationApi(
    recommendations, nextRecommendationId,
    userVaults, recurring, userRecurring,
    totalSaved, upcomingUnlocks,
  );
  include AuthApi(identities, adminAllowlist);
  include WaitlistApi(waitlist);
  include AdminApi(
    adminAllowlist, vaults, identities, waitlist, jobLog, deadLetterJobs,
  );

  // ── System heartbeat — drives the background job system ───────────────
  // Pops due jobs, executes them by kind, records the attempt outcome,
  // moves exhausted jobs to the dead-letter queue, and reschedules the
  // global timer for the next due job.
  system func timer(setGlobalTimer : Nat64 -> ()) : async () {
    let now = Time.now();
    let (maybeJob, remaining) = JobsLib.popDue(pendingJobs, now);
    // Reassign the pending queue to the remaining queue.
    // (Queue is passed by reference via the actor binding, so we rebuild it.)
    pendingJobs.clear();
    for (j in remaining.values()) { pendingJobs.pushBack(j) };

    switch (maybeJob) {
      case (?job) {
        let executed = await executeJob(job, now);
        let updated = JobsLib.recordAttempt(
          jobLog, job, executed.status, executed.message, now,
        );
        if (JobsLib.isExhausted(updated)) {
          JobsLib.moveToDeadLetter(deadLetterJobs, updated);
        } else {
          let nextAt = JobsLib.nextAttemptWithBackoff(
            updated.retryCount, 1_000_000_000, now,
          );
          let rescheduled : JobTypes.Job = { updated with nextAttemptAt = nextAt };
          pendingJobs.pushBack(rescheduled);
        };
      };
      case null {};
    };

    // Reschedule the global timer for the next due job (or 60s default).
    let nextDelayNs : Int = nextJobDelayNs(now);
    setGlobalTimer(Nat64.fromNat(Int.abs(nextDelayNs)));
  };

  // ── Job execution by kind ──────────────────────────────────────────────
  type JobOutcome = { status : JobTypes.JobStatus; message : Text };

  func executeJob(job : JobTypes.Job, now : Common.Timestamp) : async JobOutcome {
    switch (job.kind) {
      case (#autoDeposit) {
        // Auto-deposit: parse vaultId + amount from payload, append ledger
        // entry, sync balance. Payload format: "vaultId:amount".
        let parsed = parseAutoDepositPayload(job.payload);
        switch (parsed) {
          case (?{ vaultId; amount; userId }) {
            let _ = LedgerLib.append(
              ledgerEntries, balanceCache, idempotencyIndex,
              nextTransactionId, nextSequence,
              userId, vaultId, amount,
              job.idempotencyKey,
              userId,
              "Auto deposit",
              #jobProcessing,
              now,
            );
            let newBalance = switch (LedgerLib.getBalance(balanceCache, vaultId)) {
              case (?b) { b.balance };
              case null { 0 };
            };
            let _ = VaultsLib.syncBalance(vaults, vaultId, newBalance);
            { status = #succeeded; message = "autoDeposit processed" };
          };
          case null { { status = #failed; message = "autoDeposit: invalid payload" } };
        };
      };
      case (#unlockCheck) {
        // Unlock check: transition vault status + create notification.
        let vaultId = parseVaultId(job.payload);
        switch (VaultsLib.get(vaults, vaultId)) {
          case (?v) {
            if (now >= v.unlockDate and v.status == #freezing) {
              let _ = VaultsLib.transitionStatus(vaults, vaultId, #thawed);
              let _ = NotificationsLib.create(
                userNotifications, nextNotificationId,
                v.userId, #vaultUnlocked,
                "Vault unlocked",
                "Your vault '" # v.goalName # "' has thawed and is now unlocked.",
                ?vaultId,
                now,
              );
              { status = #succeeded; message = "unlockCheck: vault thawed" };
            } else {
              { status = #succeeded; message = "unlockCheck: not due yet" };
            };
          };
          case null { { status = #failed; message = "unlockCheck: vault not found" } };
        };
      };
      case (#recurringDeposit) {
        // Recurring deposit: process a scheduled deposit, then advance nextRunAt.
        let recurringId = parseVaultId(job.payload);
        switch (recurring.get(recurringId)) {
          case (?d) {
            if (d.active) {
              let _ = LedgerLib.append(
                ledgerEntries, balanceCache, idempotencyIndex,
                nextTransactionId, nextSequence,
                d.userId, d.vaultId, d.amount,
                d.idempotencyKeyPrefix # "-" # now.toText(),
                d.userId,
                "Recurring deposit",
                #recurringDeposit,
                now,
              );
              let newBalance = switch (LedgerLib.getBalance(balanceCache, d.vaultId)) {
                case (?b) { b.balance };
                case null { 0 };
              };
              let _ = VaultsLib.syncBalance(vaults, d.vaultId, newBalance);
              // Advance the next run time.
              let nextRun = DepositsLib.nextRunForCadence(d.cadence, now);
              recurring.add(recurringId, { d with nextRunAt = nextRun });
              { status = #succeeded; message = "recurringDeposit processed" };
            } else {
              { status = #succeeded; message = "recurringDeposit: inactive" };
            };
          };
          case null { { status = #failed; message = "recurringDeposit: not found" } };
        };
      };
      case (#withdrawalProcess) {
        { status = #succeeded; message = "withdrawalProcess: no-op (no real money movement)" };
      };
      case (#interestReward) {
        { status = #succeeded; message = "interestReward: no-op (conceptual frozen money)" };
      };
      case (#milestoneCheck) {
        { status = #succeeded; message = "milestoneCheck: handled inline by makeDeposit" };
      };
      case (#optimizationRun) {
        { status = #succeeded; message = "optimizationRun: handled on-demand by getRecommendations" };
      };
    };
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  // Compute the delay (ns) until the next due job, or a 60s default.
  func nextJobDelayNs(now : Common.Timestamp) : Int {
    var earliest : ?Common.Timestamp = null;
    for (j in pendingJobs.values()) {
      switch (earliest) {
        case (?e) {
          if (j.nextAttemptAt < e) { earliest := ?j.nextAttemptAt };
        };
        case null { earliest := ?j.nextAttemptAt };
      };
    };
    switch (earliest) {
      case (?e) {
        let delay = e - now;
        if (delay < 1_000_000_000) { 1_000_000_000 } else { delay };
      };
      case null { 60_000_000_000 }; // 60s default heartbeat
    };
  };

  // Parse "vaultId:amount:userIdPrincipal" for autoDeposit jobs.
  func parseAutoDepositPayload(payload : Text) : ?{ vaultId : Nat; amount : Nat; userId : Common.UserId } {
    let parts = payload.split(#text ":");
    let arr = parts.toArray();
    if (arr.size() < 3) { return null };
    let vaultId = Nat.fromText(arr[0]);
    let amount = Nat.fromText(arr[1]);
    let userId = Principal.fromText(arr[2]);
    switch (vaultId, amount) {
      case (?v, ?a) { ?{ vaultId = v; amount = a; userId } };
      case (_, _) { null };
    };
  };

  // Parse a single vault id from a payload (used for unlockCheck / recurringDeposit).
  func parseVaultId(payload : Text) : Nat {
    switch (Nat.fromText(payload)) {
      case (?n) { n };
      case null { 0 };
    };
  };

};
