/// Waitlist domain logic — preserves existing Entry type + functions.
import Map "mo:core/Map";
import Types "../types/waitlist";
import Common "../types/common";

module {
  public type Entry = Types.Entry;
  public type Email = Types.Email;

  /// Add an email to the waitlist. Returns false if already present.
  public func add(
    waitlist : Map.Map<Email, Entry>,
    email : Email,
    timestamp : Common.Timestamp,
  ) : Bool {
    if (waitlist.containsKey(email)) {
      false;
    } else {
      waitlist.add(email, { email; timestamp });
      true;
    };
  };

  /// Return all waitlist entries.
  public func list(waitlist : Map.Map<Email, Entry>) : [Entry] {
    waitlist.toArray().map<(Email, Entry), Entry>(
      func(_k : Email, v : Entry) : Entry = v,
    );
  };

  /// Return the count of waitlist entries.
  public func count(waitlist : Map.Map<Email, Entry>) : Nat {
    waitlist.size();
  };

  /// Check whether an email is already on the waitlist.
  public func exists(waitlist : Map.Map<Email, Entry>, email : Email) : Bool {
    waitlist.containsKey(email);
  };

  /// Return the timestamp an email was added, if present.
  public func timestamp(
    waitlist : Map.Map<Email, Entry>,
    email : Email,
  ) : ?Common.Timestamp {
    switch (waitlist.get(email)) {
      case (?e) { ?e.timestamp };
      case null { null };
    };
  };
};
