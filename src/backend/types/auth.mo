/// Authentication & admin gate types — II principal allowlist,
/// provider-agnostic identity.
import Common "./common";

module {
  /// Identity provider — provider-agnostic for future Google/Apple/email.
  public type IdentityProvider = {
    #internetIdentity;
    #google;   // reserved for future — not built now
    #apple;    // reserved for future — not built now
    #email;    // reserved for future — not built now
  };

  /// A registered user identity.
  public type UserIdentity = {
    principal : Common.UserId;
    provider : IdentityProvider;
    registeredAt : Common.Timestamp;
    /// Whether this principal is in the admin allowlist.
    isAdmin : Bool;
  };

  /// Admin metrics snapshot.
  public type AdminMetrics = {
    totalUsers : Nat;
    totalVaults : Nat;
    totalDeposits : Nat;
    pendingJobs : Nat;
    deadLetterJobs : Nat;
    waitlistCount : Nat;
  };

  /// Per-vault aggregate stats (admin only).
  public type VaultStats = {
    vaultId : Nat;
    userId : Common.UserId;
    goalName : Text;
    targetAmount : Nat;
    currentAmount : Nat;
    depositCount : Nat;
    status : Text;
  };

  /// Growth analytics over time (admin only).
  public type GrowthAnalytics = {
    totalUsers : Nat;
    newUsersLast7d : Nat;
    newUsersLast30d : Nat;
    totalSavedAcrossVaults : Nat;
    averageVaultsPerUser : Float;
  };
};
