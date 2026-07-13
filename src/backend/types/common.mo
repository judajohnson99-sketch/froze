/// Cross-cutting shared types used across all Froze backend domains.
import Map "mo:core/Map";

module {
  /// Internet Computer principal — used as the user identifier.
  public type UserId = Principal;

  /// Timestamp in nanoseconds since epoch (Time.now()).
  public type Timestamp = Int;

  /// Monotonic sequence number per (user, vault) ledger ordering.
  public type Sequence = Nat;

  /// Idempotency key for financial transactions and jobs (client-supplied).
  public type IdempotencyKey = Text;

  /// Stable map keyed by user principal.
  public type UserMap<V> = Map.Map<UserId, V>;

  /// Stable map keyed by text.
  public type TextMap<V> = Map.Map<Text, V>;

  /// Stable map keyed by Nat.
  public type NatMap<V> = Map.Map<Nat, V>;
};
