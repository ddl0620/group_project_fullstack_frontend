import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { NotificationList } from '@/pages/Notification/components/NotificationList.jsx';
import { EmptyState } from '@/pages/Notification/components/EmptyState.jsx';
import { useNotifications } from '@/hooks/useNotification.js';
import { NotificationDetailModal } from '@/pages/Notification/components/NotificationDetailModal.jsx';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on active tab and type filter
  const filteredNotifications = notifications.filter((notification) => {
    // First apply tab filter
    if (activeTab === 'all') {
      // Then apply type filter if set
      return filterType ? notification.type === filterType : true;
    } else if (activeTab === 'unread') {
      return (
        !notification.isRead &&
        (filterType ? notification.type === filterType : true)
      );
    }
    return false;
  });

  const handleRefresh = () => {
    fetchNotifications();
    toast.success('Notifications refreshed');
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="container mx-auto max-w-4xl px-2 py-4 sm:px-4 sm:py-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          <h1 className="text-xl font-bold sm:text-2xl">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-1 text-xs sm:ml-2">
              {unreadCount} total
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="px-2 text-xs sm:px-3 sm:text-sm"
          >
            <RefreshCw className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-xs sm:px-3 sm:text-sm"
              >
                <Filter className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('INFO')}>
                Information
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('SUCCESS')}>
                Success
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('WARNING')}>
                Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('ERROR')}>
                Error
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/*Temorarily removed the dropdown menu for actions*/}

          {/*<DropdownMenu>*/}
          {/*  <DropdownMenuTrigger asChild>*/}
          {/*    <Button variant="outline" size="sm">*/}
          {/*      Actions*/}
          {/*    </Button>*/}
          {/*  </DropdownMenuTrigger>*/}
          {/*  <DropdownMenuContent align="end">*/}
          {/*    <DropdownMenuItem onClick={handleMarkAllAsRead}>*/}
          {/*      <Check className="mr-2 h-4 w-4" />*/}
          {/*      Mark all as read*/}
          {/*    </DropdownMenuItem>*/}
          {/*    <DropdownMenuSeparator />*/}
          {/*    <DropdownMenuItem onClick={handleClearAll} className="text-red-600">*/}
          {/*      <Trash2 className="mr-2 h-4 w-4" />*/}
          {/*      Clear all notifications*/}
          {/*    </DropdownMenuItem>*/}
          {/*  </DropdownMenuContent>*/}
          {/*</DropdownMenu>*/}
        </div>
      </div>

      <Card>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-3 py-2 text-xs data-[state=active]:bg-transparent sm:px-4 sm:py-3 sm:text-sm"
              >
                All
              </TabsTrigger>
              {/*<TabsTrigger*/}
              {/*  value="unread"*/}
              {/*  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"*/}
              {/*>*/}
              {/*  Unread*/}
              {/*  {unreadCount > 0 && (*/}
              {/*    <Badge variant="secondary" className="ml-2">*/}
              {/*      {unreadCount}*/}
              {/*    </Badge>*/}
              {/*  )}*/}
              {/*</TabsTrigger>*/}
            </TabsList>
          </div>

          <CardContent className="p-0">
            <TabsContent value="all" className="m-0">
              {loading ? (
                <NotificationSkeleton count={5} />
              ) : error ? (
                <div className="p-6 text-center text-red-500">
                  Error loading notifications: {error}
                </div>
              ) : filteredNotifications.length > 0 ? (
                <NotificationList
                  notifications={filteredNotifications}
                  onDelete={deleteNotification}
                  onMarkAsRead={handleMarkAsRead}
                  onNotificationClick={handleNotificationClick}
                />
              ) : (
                <EmptyState
                  title="No notifications"
                  description={
                    filterType
                      ? `No ${filterType.toLowerCase()} notifications found`
                      : "You don't have any notifications yet"
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              {loading ? (
                <NotificationSkeleton count={3} />
              ) : error ? (
                <div className="p-6 text-center text-red-500">
                  Error loading notifications: {error}
                </div>
              ) : filteredNotifications.length > 0 ? (
                <NotificationList
                  notifications={filteredNotifications}
                  onDelete={deleteNotification}
                  onMarkAsRead={handleMarkAsRead}
                  onNotificationClick={handleNotificationClick}
                />
              ) : (
                <EmptyState
                  title="No unread notifications"
                  description="You've read all your notifications"
                />
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={handleCloseModal}
        onMarkAsRead={handleMarkAsRead}
        onDelete={deleteNotification}
      />
    </div>
  );
}

function NotificationSkeleton({ count = 3 }) {
  return (
    <div className="divide-y">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex gap-2 p-3 sm:gap-4 sm:p-4">
            <Skeleton className="h-8 w-8 rounded-full sm:h-10 sm:w-10" />
            <div className="flex-1 space-y-1 sm:space-y-2">
              <Skeleton className="h-3 w-1/3 sm:h-4" />
              <Skeleton className="h-3 w-full sm:h-4" />
              <Skeleton className="h-3 w-1/4 sm:h-4" />
            </div>
          </div>
        ))}
    </div>
  );
}
