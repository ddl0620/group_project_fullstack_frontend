import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  Info,
  ExternalLink,
  WandSparkles,
  AtSign,
  MessageCircleMore,
  MessageCirclePlus,
  CalendarHeart,
  BadgeX,
  CircleCheckBig,
  X,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotification.js';

export function NotificationDropdown() {
  const navigate = useNavigate();
  const { notifications, loading, error, fetchNotifications, markAsRead } =
    useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Get the 5 most recent notifications
  const latestNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const getTypeIcon = (notification) => {
    switch (notification.type) {
      case 'UPDATE_EVENT':
        return <WandSparkles className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />;
      case 'REPLY':
        return <AtSign className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />;
      case 'COMMENT':
        return (
          <MessageCircleMore className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
        );
      case 'NEW_POST':
        return (
          <MessageCirclePlus className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
        );
      case 'INVITATION':
        return (
          <CalendarHeart className="h-4 w-4 text-purple-500 sm:h-5 sm:w-5" />
        );
      case 'DELETE_EVENT':
        return <BadgeX className="h-4 w-4 text-red-500 sm:h-5 sm:w-5" />;
      case 'RSVP_ACCEPT':
        return (
          <CircleCheckBig className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
        );
      case 'RSVP_DENIED':
        return <X className="h-4 w-4 text-red-500 sm:h-5 sm:w-5" />;
      case 'REQUEST_JOIN':
        return <UserPlus className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />;
      case 'REQUEST_ACCEPT':
        return (
          <CircleCheckBig className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
        );
      case 'REQUEST_DENIED':
        return <X className="h-4 w-4 text-red-500 sm:h-5 sm:w-5" />;
      default:
        return <Info className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />;
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'COMMENT':
      case 'REPLY':
      case 'NEW_POST':
        navigate(`/discussion`);
        break;
      case 'UPDATE_EVENT':
      case 'DELETE_EVENT':
      case 'INVITATION':
      case 'RSVP_ACCEPT':
      case 'RSVP_DENIED':
      case 'REQUEST_JOIN':
      case 'REQUEST_ACCEPT':
      case 'REQUEST_DENIED':
        navigate(`/event/joined`);
        break;
      default:
        // Just close the popover for other types
        break;
    }

    setIsOpen(false);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size="icon"
          className="relative h-8 w-8 text-white hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
        >
          <Bell className="h-4 w-4 text-black sm:h-5 sm:w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full p-0 text-[8px] sm:h-4 sm:w-4 sm:text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-40px)] max-w-[280px] p-0 sm:w-80"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b p-2 sm:p-3">
          <h3 className="text-sm font-medium sm:text-base">Notifications</h3>
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 text-[10px] sm:h-6 sm:text-xs"
            >
              {unreadCount} new
            </Badge>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto sm:max-h-[350px]">
          {loading ? (
            <div className="p-1">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-2 p-2 sm:gap-3">
                  <Skeleton className="h-6 w-6 rounded-full sm:h-8 sm:w-8" />
                  <div className="flex-1 space-y-1 sm:space-y-2">
                    <Skeleton className="h-3 w-3/4 sm:h-4" />
                    <Skeleton className="h-2 w-1/2 sm:h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-3 text-center text-xs text-red-500 sm:p-4 sm:text-sm">
              Failed to load notifications
            </div>
          ) : latestNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center sm:p-6">
              <Bell className="text-muted-foreground/50 mb-2 h-6 w-6 sm:h-8 sm:w-8" />
              <p className="text-xs font-medium sm:text-sm">
                No notifications yet
              </p>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div>
              {latestNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    'hover:bg-muted/50 flex cursor-pointer items-start gap-2 border-b p-2 transition-colors sm:gap-3 sm:p-3',
                    !notification.isRead && 'bg-blue-50/50'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="bg-background flex h-8 w-8 items-center justify-center rounded-full border sm:h-10 sm:w-10">
                    {getTypeIcon(notification)}
                  </div>
                  <div className="flex-1 space-y-0.5 sm:space-y-1">
                    <p
                      className={cn(
                        'text-xs sm:text-sm',
                        !notification.isRead && 'font-medium'
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-muted-foreground line-clamp-2 text-[10px] sm:text-xs">
                      {notification.content}
                    </p>
                    <p className="text-muted-foreground text-[10px] sm:text-xs">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 sm:h-2 sm:w-2"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-1 sm:p-2">
          <Button
            variant="ghost"
            className="h-8 w-full justify-center text-xs sm:h-10 sm:text-sm"
            onClick={handleViewAll}
          >
            View all notifications
            <ExternalLink className="ml-1 h-2.5 w-2.5 sm:ml-2 sm:h-3 sm:w-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
