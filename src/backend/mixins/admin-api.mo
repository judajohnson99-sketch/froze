/// Public API surface for admin-only metrics, vault stats, and growth
/// analytics. All functions check the caller against the admin allowlist.
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/auth";
import VaultTypes "../types/vaults";
import JobTypes "../types/jobs";
import WaitlistTypes "../types/waitlist";
import Common "../types/common";
import AuthLib "../lib/auth";
import VaultsLib "../lib/vaults";

mixin (
  adminAllowlist : Set.Set<Common.UserId>,
  vaults : Map.Map<Nat, VaultTypes.Vault>,
  identities : Map.Map<Common.UserId, Types.UserIdentity>,
  waitlist : Map.Map<WaitlistTypes.Email, WaitlistTypes.Entry>,
  jobLog : List.List<JobTypes.JobLogEntry>,
  deadLetter : List.List<JobTypes.Job>,
) {
  /// Get aggregate admin metrics (admin only).
  public shared ({ caller }) func getMetrics() : async Types.AdminMetrics {
    AuthLib.requireAdmin(adminAllowlist, caller);
    {
      totalUsers = identities.size();
      totalVaults = vaults.size();
      totalDeposits = 0; // derived from ledger; not in this mixin's scope
      pendingJobs = 0;   // pending queue not in this mixin's scope
      deadLetterJobs = deadLetter.size();
      waitlistCount = waitlist.size();
    };
  };

  /// Get per-vault stats (admin only).
  public shared ({ caller }) func getVaultStats() : async [Types.VaultStats] {
    AuthLib.requireAdmin(adminAllowlist, caller);
    vaults.toArray().map<(Nat, VaultTypes.Vault), Types.VaultStats>(
      func(_id : Nat, v : VaultTypes.Vault) : Types.VaultStats = {
        vaultId = v.id;
        userId = v.userId;
        goalName = v.goalName;
        targetAmount = v.targetAmount;
        currentAmount = v.currentAmount;
        depositCount = 0; // derived from ledger; not in this mixin's scope
        status = statusToText(v.status);
      },
    );
  };

  /// Get growth analytics over time (admin only).
  public shared ({ caller }) func getGrowthAnalytics() : async Types.GrowthAnalytics {
    AuthLib.requireAdmin(adminAllowlist, caller);
    let now = Time.now();
    let dayNs : Int = 86_400_000_000_000;
    let sevenDaysAgo = now - (dayNs * 7);
    let thirtyDaysAgo = now - (dayNs * 30);
    var newUsers7d : Nat = 0;
    var newUsers30d : Nat = 0;
    identities.forEach(func(_p : Common.UserId, id : Types.UserIdentity) : () {
      if (id.registeredAt >= sevenDaysAgo) { newUsers7d += 1 };
      if (id.registeredAt >= thirtyDaysAgo) { newUsers30d += 1 };
    });
    var totalSaved : Nat = 0;
    vaults.forEach(func(_id : Nat, v : VaultTypes.Vault) : () {
      totalSaved += v.currentAmount;
    });
    let totalUsers = identities.size();
    let totalVaults = vaults.size();
    let avgVaultsPerUser : Float = if (totalUsers == 0) {
      0.0;
    } else {
      totalVaults.toFloat() / totalUsers.toFloat();
    };
    {
      totalUsers;
      newUsersLast7d = newUsers7d;
      newUsersLast30d = newUsers30d;
      totalSavedAcrossVaults = totalSaved;
      averageVaultsPerUser = avgVaultsPerUser;
    };
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  func statusToText(s : VaultTypes.VaultStatus) : Text {
    switch (s) {
      case (#freezing) { "freezing" };
      case (#thawing) { "thawing" };
      case (#thawed) { "thawed" };
      case (#broken) { "broken" };
    };
  };
};
