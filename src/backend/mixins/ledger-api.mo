/// Public API surface for the ledger domain — read-only views.
/// All financial writes go through deposits-api; this exposes ledger reads.
import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Types "../types/ledger";
import Common "../types/common";
import AuthLib "../lib/auth";
import LedgerLib "../lib/ledger";

mixin (
  ledgerEntries : List.List<Types.LedgerEntry>,
  balanceCache : Map.Map<Nat, Types.VaultBalance>,
  adminAllowlist : Set.Set<Common.UserId>,
) {
  /// Return the ledger entries for a vault (owner or admin only).
  public shared ({ caller }) func getVaultLedger(
    vaultId : Nat,
  ) : async [Types.LedgerEntry] {
    let entries = LedgerLib.getVaultLedger(ledgerEntries, vaultId);
    if (entries.size() == 0) { return []; };
    let owner = entries[0].userId;
    if (owner == caller or AuthLib.isAdmin(adminAllowlist, caller)) {
      entries;
    } else {
      Runtime.trap("getVaultLedger: not authorized");
    };
  };

  /// Reconcile a single vault (admin only).
  public shared ({ caller }) func reconcileVault(
    vaultId : Nat,
  ) : async Types.ReconciliationResult {
    AuthLib.requireAdmin(adminAllowlist, caller);
    LedgerLib.reconcile(ledgerEntries, vaultId);
  };

  /// Reconcile all vaults for the caller.
  public shared ({ caller }) func reconcileMyVaults() : async [Types.ReconciliationResult] {
    LedgerLib.reconcileUser(ledgerEntries, caller);
  };
};
