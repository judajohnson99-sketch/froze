/// Waitlist domain types — preserves existing Entry shape.
import Common "./common";

module {
  /// Email address (preserved from existing implementation).
  public type Email = Text;

  /// A waitlist entry — preserved shape { email, timestamp }.
  public type Entry = {
    email : Email;
    timestamp : Common.Timestamp;
  };
};
