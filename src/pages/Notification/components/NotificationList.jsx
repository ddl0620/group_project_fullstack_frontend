import { NotificationItem } from '@/pages/Notification/components/NotificationItem.jsx';

export function NotificationList({
  notifications,
  onDelete,
  onMarkAsRead,
  onNotificationClick,
}) {
  return (
    <div className="divide-y text-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onDelete={onDelete}
          onMarkAsRead={onMarkAsRead}
          onClick={onNotificationClick}
        />
      ))}
    </div>
  );
}
