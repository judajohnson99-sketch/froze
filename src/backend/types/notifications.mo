/// In-app notification store types.
import Common "./common";

module {
  /// Notification category.
  public type NotificationType = {
    #depositFrozen;
    #milestoneReached;
    #unlockApproaching;
    #vaultUnlocked;
    #recommendationAvailable;
    #adminBroadcast;
  };

  /// A single in-app notification.
  public type Notification = {
    id : Nat;
    userId : Common.UserId;
    notificationType : NotificationType;
    title : Text;
    body : Text;
    read : Bool;
    createdAt : Common.Timestamp;
    /// Optional related vault id.
    vaultId : ?Nat;
  };
};
