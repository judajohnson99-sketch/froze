/// II principal admin allowlist + provider-agnostic identity.
import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Types "../types/auth";
import Common "../types/common";

module {
  public type UserIdentity = Types.UserIdentity;

  /// Check whether a principal is in the admin allowlist.
  public func isAdmin(
    adminAllowlist : Set.Set<Common.UserId>,
    principal : Common.UserId,
  ) : Bool {
    adminAllowlist.contains(principal);
  };

  /// Register or fetch a user identity (provider-agnostic).
  public func registerOrFetch(
    identities : Map.Map<Common.UserId, UserIdentity>,
    principal : Common.UserId,
    provider : Types.IdentityProvider,
    timestamp : Common.Timestamp,
    adminAllowlist : Set.Set<Common.UserId>,
  ) : UserIdentity {
    switch (identities.get(principal)) {
      case (?existing) { existing };
      case null {
        let identity : UserIdentity = {
          principal;
          provider;
          registeredAt = timestamp;
          isAdmin = isAdmin(adminAllowlist, principal);
        };
        identities.add(principal, identity);
        identity;
      };
    };
  };

  /// Trap if the caller is not an admin.
  public func requireAdmin(
    adminAllowlist : Set.Set<Common.UserId>,
    principal : Common.UserId,
  ) : () {
    if (not isAdmin(adminAllowlist, principal)) {
      Runtime.trap("auth.requireAdmin: caller is not an admin");
    };
  };

  /// Add a principal to the admin allowlist (admin-only operation).
  /// Returns true if newly added, false if already present.
  public func addAdmin(
    adminAllowlist : Set.Set<Common.UserId>,
    principal : Common.UserId,
  ) : Bool {
    if (adminAllowlist.contains(principal)) {
      false;
    } else {
      adminAllowlist.add(principal);
      true;
    };
  };
};
