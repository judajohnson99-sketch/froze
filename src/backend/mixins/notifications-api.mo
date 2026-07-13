/// Public API surface for in-app notifications.
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/notifications";
import Common "../types/common";
import NotificationsLib "../lib/notifications";

mixin (
  userNotifications : Map.Map<Common.UserId, List.List<Types.Notification>>,
  nextNotificationId : { var value : Nat },
) {
  /// List the caller's notifications (newest first).
  public shared ({ caller }) func getNotifications() : async [Types.Notification] {
    NotificationsLib.listForUser(userNotifications, caller);
  };

  /// Mark a single notification as read.
  public shared ({ caller }) func markRead(notificationId : Nat) : async Bool {
    NotificationsLib.markRead(userNotifications, caller, notificationId);
  };

  /// Mark all of the caller's notifications as read. Returns count marked.
  public shared ({ caller }) func markAllNotificationsRead() : async Nat {
    NotificationsLib.markAllRead(userNotifications, caller);
  };
};
