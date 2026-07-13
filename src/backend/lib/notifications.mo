/// In-app notification store.
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/notifications";
import Common "../types/common";

module {
  public type Notification = Types.Notification;

  /// Create a new notification for a user.
  public func create(
    userNotifications : Map.Map<Common.UserId, List.List<Notification>>,
    nextNotificationId : { var value : Nat },
    userId : Common.UserId,
    notificationType : Types.NotificationType,
    title : Text,
    body : Text,
    vaultId : ?Nat,
    timestamp : Common.Timestamp,
  ) : Notification {
    let id = nextNotificationId.value;
    nextNotificationId.value := id + 1;
    let n : Notification = {
      id;
      userId;
      notificationType;
      title;
      body;
      read = false;
      createdAt = timestamp;
      vaultId;
    };
    let existing = switch (userNotifications.get(userId)) {
      case (?list) { list };
      case null { List.empty<Notification>() };
    };
    existing.add(n);
    userNotifications.add(userId, existing);
    n;
  };

  /// List notifications for a user (newest first).
  public func listForUser(
    userNotifications : Map.Map<Common.UserId, List.List<Notification>>,
    userId : Common.UserId,
  ) : [Notification] {
    switch (userNotifications.get(userId)) {
      case (?list) {
        list.reverse().toArray();
      };
      case null { [] };
    };
  };

  /// Mark a single notification as read.
  public func markRead(
    userNotifications : Map.Map<Common.UserId, List.List<Notification>>,
    userId : Common.UserId,
    notificationId : Nat,
  ) : Bool {
    switch (userNotifications.get(userId)) {
      case (?list) {
        var found = false;
        list.mapInPlace(func(n : Notification) : Notification {
          if (n.id == notificationId) {
            found := true;
            { n with read = true };
          } else { n };
        });
        if (found) { userNotifications.add(userId, list) };
        found;
      };
      case null { false };
    };
  };

  /// Mark all notifications for a user as read.
  public func markAllRead(
    userNotifications : Map.Map<Common.UserId, List.List<Notification>>,
    userId : Common.UserId,
  ) : Nat {
    switch (userNotifications.get(userId)) {
      case (?list) {
        var count = 0;
        list.mapInPlace(func(n : Notification) : Notification {
          if (not n.read) {
            count += 1;
            { n with read = true };
          } else { n };
        });
        userNotifications.add(userId, list);
        count;
      };
      case null { 0 };
    };
  };
};
