/// Vault CRUD + status transitions.
import Map "mo:core/Map";
import Types "../types/vaults";
import Common "../types/common";

module {
  public type Vault = Types.Vault;
  public type CreateVaultRequest = Types.CreateVaultRequest;
  public type VaultView = Types.VaultView;

  /// Create a new vault. Returns the new vault id.
  public func create(
    vaults : Map.Map<Nat, Vault>,
    userVaults : Map.Map<Common.UserId, [Nat]>,
    nextVaultId : { var value : Nat },
    userId : Common.UserId,
    request : CreateVaultRequest,
    timestamp : Common.Timestamp,
  ) : Nat {
    let id = nextVaultId.value;
    nextVaultId.value := id + 1;
    let vault : Vault = {
      id;
      userId;
      goalName = request.goalName;
      targetAmount = request.targetAmount;
      currentAmount = 0;
      lockDurationNs = request.lockDurationNs;
      unlockDate = timestamp + request.lockDurationNs;
      status = #freezing;
      createdAt = timestamp;
      note = request.note;
    };
    vaults.add(id, vault);
    let existing = switch (userVaults.get(userId)) {
      case (?arr) { arr };
      case null { [] };
    };
    userVaults.add(userId, Array_append(existing, [id]));
    id;
  };

  /// Fetch a vault by id.
  public func get(
    vaults : Map.Map<Nat, Vault>,
    vaultId : Nat,
  ) : ?Vault {
    vaults.get(vaultId);
  };

  /// List all vault ids for a user.
  public func listForUser(
    userVaults : Map.Map<Common.UserId, [Nat]>,
    vaults : Map.Map<Nat, Vault>,
    userId : Common.UserId,
  ) : [Vault] {
    switch (userVaults.get(userId)) {
      case (?ids) {
        ids.filterMap(
          func(id : Nat) : ?Vault = vaults.get(id),
        );
      };
      case null { [] };
    };
  };

  /// Transition a vault's status (freezing -> thawing -> thawed, or -> broken).
  public func transitionStatus(
    vaults : Map.Map<Nat, Vault>,
    vaultId : Nat,
    newStatus : Types.VaultStatus,
  ) : ?Vault {
    switch (vaults.get(vaultId)) {
      case (?v) {
        let updated : Vault = { v with status = newStatus };
        vaults.add(vaultId, updated);
        ?updated;
      };
      case null { null };
    };
  };

  /// Update the derived currentAmount on a vault from the balance cache.
  public func syncBalance(
    vaults : Map.Map<Nat, Vault>,
    vaultId : Nat,
    newAmount : Nat,
  ) : ?Vault {
    switch (vaults.get(vaultId)) {
      case (?v) {
        let updated : Vault = { v with currentAmount = newAmount };
        vaults.add(vaultId, updated);
        ?updated;
      };
      case null { null };
    };
  };

  /// Convert a Vault to its public view.
  public func toView(vault : Vault) : VaultView {
    let target = vault.targetAmount;
    let current = vault.currentAmount;
    let percent = if (target == 0) { 0 } else {
      let p = (current * 100) / target;
      if (p > 100) { 100 } else { p };
    };
    {
      id = vault.id;
      goalName = vault.goalName;
      targetAmount = target;
      currentAmount = current;
      progressPercent = percent;
      unlockDate = vault.unlockDate;
      status = vault.status;
      createdAt = vault.createdAt;
      note = vault.note;
    };
  };

  // Local helper — Array.append was removed; use concat via a small wrapper.
  func Array_append<T>(a : [T], b : [T]) : [T] {
    a.concat(b);
  };
};
