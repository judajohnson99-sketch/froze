/// Public API surface for authentication & admin gate.
import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Types "../types/auth";
import Common "../types/common";
import AuthLib "../lib/auth";

mixin (
  identities : Map.Map<Common.UserId, Types.UserIdentity>,
  adminAllowlist : Set.Set<Common.UserId>,
) {
  /// Check whether the caller is an admin.
  public shared ({ caller }) func isAdmin() : async Bool {
    AuthLib.isAdmin(adminAllowlist, caller);
  };

  /// Return the caller's principal as text (for frontend display).
  public shared ({ caller }) func getMyPrincipal() : async Text {
    caller.toText();
  };

  /// Register or fetch the caller's identity (provider-agnostic).
  public shared ({ caller }) func getMyIdentity() : async Types.UserIdentity {
    AuthLib.registerOrFetch(
      identities, caller, #internetIdentity, Time.now(), adminAllowlist,
    );
  };

  /// Add a principal to the admin allowlist (admin only).
  public shared ({ caller }) func addAdmin(principal : Common.UserId) : async Bool {
    AuthLib.requireAdmin(adminAllowlist, caller);
    AuthLib.addAdmin(adminAllowlist, principal);
  };
};
