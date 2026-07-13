/// Manual + recurring deposit logic.
import Map "mo:core/Map";
import Types "../types/deposits";
import Common "../types/common";

module {
  public type RecurringDeposit = Types.RecurringDeposit;
  public type SetupRecurringDepositRequest = Types.SetupRecurringDepositRequest;
  public type DepositResult = Types.DepositResult;

  /// Set up a recurring deposit schedule for a vault.
  public func setupRecurring(
    recurring : Map.Map<Nat, RecurringDeposit>,
    userRecurring : Map.Map<Common.UserId, [Nat]>,
    nextRecurringId : { var value : Nat },
    userId : Common.UserId,
    request : SetupRecurringDepositRequest,
    timestamp : Common.Timestamp,
  ) : Nat {
    let id = nextRecurringId.value;
    nextRecurringId.value := id + 1;
    let deposit : RecurringDeposit = {
      id;
      userId;
      vaultId = request.vaultId;
      amount = request.amount;
      cadence = request.cadence;
      nextRunAt = nextRunForCadence(request.cadence, timestamp);
      idempotencyKeyPrefix = request.idempotencyKeyPrefix;
      active = true;
      createdAt = timestamp;
    };
    recurring.add(id, deposit);
    let existing = switch (userRecurring.get(userId)) {
      case (?arr) { arr };
      case null { [] };
    };
    userRecurring.add(userId, existing.concat([id]));
    id;
  };

  /// List recurring deposits for a user.
  public func listRecurringForUser(
    userRecurring : Map.Map<Common.UserId, [Nat]>,
    recurring : Map.Map<Nat, RecurringDeposit>,
    userId : Common.UserId,
  ) : [RecurringDeposit] {
    switch (userRecurring.get(userId)) {
      case (?ids) {
        ids.filterMap(
          func(id : Nat) : ?RecurringDeposit = recurring.get(id),
        );
      };
      case null { [] };
    };
  };

  /// Deactivate a recurring deposit.
  public func deactivate(
    recurring : Map.Map<Nat, RecurringDeposit>,
    recurringId : Nat,
  ) : Bool {
    switch (recurring.get(recurringId)) {
      case (?d) {
        recurring.add(recurringId, { d with active = false });
        true;
      };
      case null { false };
    };
  };

  /// Compute the next run timestamp for a cadence.
  /// daily=+1day, weekly=+7days, monthly=+30days (in nanoseconds).
  public func nextRunForCadence(
    cadence : Types.RecurringCadence,
    from : Common.Timestamp,
  ) : Common.Timestamp {
    let dayNs : Int = 86_400_000_000_000; // 24h in ns
    let delta : Int = switch (cadence) {
      case (#daily) { dayNs };
      case (#weekly) { dayNs * 7 };
      case (#monthly) { dayNs * 30 };
    };
    from + delta;
  };
};
