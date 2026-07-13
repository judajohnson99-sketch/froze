/// Public API surface for the waitlist — preserves existing functions
/// and adds an email confirmation trigger via the caffeineai-email extension.
import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/waitlist";
import Common "../types/common";
import WaitlistLib "../lib/waitlist";
import EmailClient "mo:caffeineai-email/emailClient";

mixin (waitlist : Map.Map<Types.Email, Types.Entry>) {
  /// Add a new email to the waitlist. Sends a confirmation email on signup.
  /// Returns false if the email is already present.
  public shared ({ caller }) func addToWaitlist(email : Types.Email) : async Bool {
    let now = Time.now();
    let added = WaitlistLib.add(waitlist, email, now);
    if (added) {
      // Send a confirmation email — best-effort; a send failure does not
      // roll back the waitlist entry.
      let result = await EmailClient.sendServiceEmail(
        "no-reply",
        [email],
        "Welcome to the Froze waitlist",
        "Thanks for joining the Froze waitlist. We'll be in touch when early access opens up. Your savings are about to get frozen.",
      );
      switch (result) {
        case (#ok) {};
        case (#err(_)) {};
      };
    };
    added;
  };

  /// Returns all waitlist entries (admin view).
  public query ({ caller }) func getWaitlist() : async [Types.Entry] {
    WaitlistLib.list(waitlist);
  };

  /// Returns the size of the waitlist.
  public query ({ caller }) func getWaitlistCount() : async Nat {
    WaitlistLib.count(waitlist);
  };

  /// Checks if an email is already in the waitlist.
  public query ({ caller }) func emailAlreadyExists(email : Types.Email) : async Bool {
    WaitlistLib.exists(waitlist, email);
  };

  /// Returns the timestamp an email was added, if it exists.
  public query ({ caller }) func getEmailTimestamp(email : Text) : async ?Common.Timestamp {
    WaitlistLib.timestamp(waitlist, email);
  };
};
