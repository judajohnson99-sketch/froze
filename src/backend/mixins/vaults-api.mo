/// Public API surface for vaults — CRUD + status transitions.
/// createVault also appends a vaultLock ledger entry to mark the vault's
/// creation in the append-only double-entry ledger.
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/vaults";
import LedgerTypes "../types/ledger";
import Common "../types/common";
import VaultsLib "../lib/vaults";
import LedgerLib "../lib/ledger";

mixin (
  vaults : Map.Map<Nat, Types.Vault>,
  userVaults : Map.Map<Common.UserId, [Nat]>,
  nextVaultId : { var value : Nat },
  ledgerEntries : List.List<LedgerTypes.LedgerEntry>,
  balanceCache : Map.Map<Nat, LedgerTypes.VaultBalance>,
  idempotencyIndex : Map.Map<Common.IdempotencyKey, Nat>,
  nextTransactionId : { var value : Nat },
  nextSequence : { var value : Nat },
) {
  /// Create a new savings vault for the caller.
  /// Appends a vaultLock ledger entry to record the vault's creation.
  public shared ({ caller }) func createVault(
    request : Types.CreateVaultRequest,
  ) : async Nat {
    let now = Time.now();
    let vaultId = VaultsLib.create(
      vaults, userVaults, nextVaultId, caller, request, now,
    );
    // Record the vault creation as a vaultLock ledger entry (zero-amount
    // marker so the vault has an audit-trail origin).
    let _ = LedgerLib.append(
      ledgerEntries, balanceCache, idempotencyIndex,
      nextTransactionId, nextSequence,
      caller, vaultId, 0,
      "vault-create-" # vaultId.toText(),
      caller,
      "Vault created: " # request.goalName,
      #vaultLock,
      now,
    );
    vaultId;
  };

  /// List all vaults for the caller.
  public shared ({ caller }) func getVaults() : async [Types.VaultView] {
    VaultsLib.listForUser(userVaults, vaults, caller).map(
      func(v : Types.Vault) : Types.VaultView = VaultsLib.toView(v),
    );
  };

  /// Fetch a single vault by id (owner or admin only).
  public shared ({ caller }) func getVault(vaultId : Nat) : async ?Types.VaultView {
    switch (VaultsLib.get(vaults, vaultId)) {
      case (?v) {
        if (v.userId == caller) {
          ?VaultsLib.toView(v);
        } else {
          Runtime.trap("getVault: not authorized");
        };
      };
      case null { null };
    };
  };
};
