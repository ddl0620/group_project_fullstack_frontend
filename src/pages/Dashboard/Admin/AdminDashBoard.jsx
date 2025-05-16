import { useState, useEffect } from 'react';
import { useAdminStatistics } from '@/hooks/useAdminStatistics.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { Users, UserPlus, Calendar, MessageSquare } from 'lucide-react';
import {
  DeletedUsersDisplay,
  EventsByDateDisplay,
  EventVisibilityDisplay,
  UsersByDateDisplay,
} from '@/pages/Dashboard/Admin/components/index.js';

export default function AdminDashboard() {
  const {
    overview,
    eventsByDate,
    usersByDate,
    deletedUsersByDate,
    publicAndPrivateEvents,
    fetchOverview,
    fetchEventsByDate,
    fetchUsersByDate,
    fetchDeletedUsersByDate,
    fetchPublicAndPrivateEvents,
    loading,
    error,
  } = useAdminStatistics();

  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    isMobile: false,
    isExtraSmall: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isMobile: width < 640,
        isExtraSmall: width < 375,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Dynamic date range: last 30 days
    const endDate = new Date().toISOString().split('T')[0]; // Today
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]; // 30 days ago

    fetchOverview();
    fetchEventsByDate({ startDate, endDate });
    fetchUsersByDate({ startDate, endDate });
    fetchDeletedUsersByDate({ startDate, endDate });
    fetchPublicAndPrivateEvents();
  }, [
    fetchOverview,
    fetchEventsByDate,
    fetchUsersByDate,
    fetchDeletedUsersByDate,
    fetchPublicAndPrivateEvents,
  ]);

  // Sample data as fallback
  const [overviewData] = useState({
    content: {
      totalUsers: 0,
      activeUsers: 0,
      totalDiscussionPosts: 0,
      activeDiscussionPosts: 0,
      totalEvents: 0,
      deletedEvents: 0,
      lastWeek: {
        totalUsers: 0,
        activeUsers: 0,
        totalDiscussionPosts: 0,
        activeDiscussionPosts: 0,
        totalEvents: 0,
        deletedEvents: 0,
      },
    },
  });

  const [eventsByDateData] = useState({
    content: [],
  });

  // Sample RSVP trend data
  const [rsvpTrendData] = useState({
    content: [],
  });

  const [deletedUsersData] = useState({
    content: [],
  });

  const [eventVisibilityData] = useState({
    publicEvents: 0,
    privateEvents: 0,
  });

  // Use sample data if API fails
  const finalOverview = error ? overviewData.content : overview;
  const finalEventsByDate = error ? eventsByDateData.content : eventsByDate;
  const finalUsersByDate = error ? [] : usersByDate;
  const finalDeletedUsersByDate = error
    ? deletedUsersData.content
    : deletedUsersByDate;
  const finalPublicAndPrivateEvents = error
    ? eventVisibilityData
    : publicAndPrivateEvents;

  // Format data for text displays - ensure proper formatting for small screens
  const eventsByDateDisplayData =
    finalEventsByDate?.map((item) => {
      // For small screens, use shorter date format
      const dateFormat = screenSize.isExtraSmall
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric' };

      return {
        name: new Date(item.date).toLocaleDateString('en-US', dateFormat),
        total: item.count,
      };
    }) || [];

  // Format users by date display data
  const usersByDateDisplayData =
    finalUsersByDate?.map((item) => {
      const dateFormat = screenSize.isExtraSmall
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric' };

      return {
        name: new Date(item.date).toLocaleDateString('en-US', dateFormat),
        total: item.count,
      };
    }) || [];

  const eventVisibilityDisplayData = [
    { name: 'Public', total: finalPublicAndPrivateEvents?.publicEvents || 0 },
    { name: 'Private', total: finalPublicAndPrivateEvents?.privateEvents || 0 },
  ];

  // Helper to avoid division by zero
  const safePercentage = (numerator, denominator) => {
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error) console.warn('API error, using sample data:', error);

  return (
    <div className="min-h-screen flex-1 space-y-4 overflow-x-hidden bg-gray-50 p-2 pt-6 sm:p-4 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Overview
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-xs sm:text-sm">
            Last updated:{' '}
            {new Date().toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      <div className={'space-y-4'}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Users Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 sm:px-6 sm:pt-6 sm:pb-2">
              <CardTitle className="truncate text-xs font-medium sm:text-sm">
                Total Users
              </CardTitle>
              <Users className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                {finalOverview?.totalUsers || 0}
              </div>
              <p className="text-muted-foreground truncate text-[10px] sm:text-xs">
                {finalOverview?.activeUsers || 0} active users (
                {safePercentage(
                  finalOverview?.activeUsers,
                  finalOverview?.totalUsers
                )}
                %)
              </p>
              <p className="mt-1 text-[10px] text-blue-500 sm:text-xs">
                {safePercentage(
                  finalOverview?.activeUsers,
                  finalOverview?.totalUsers
                ) > 50
                  ? 'Good engagement rate'
                  : 'Engagement could be improved'}
              </p>
            </CardContent>
          </Card>

          {/* Discussion Posts Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 sm:px-6 sm:pt-6 sm:pb-2">
              <CardTitle className="truncate text-xs font-medium sm:text-sm">
                Discussion Posts
              </CardTitle>
              <MessageSquare className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                {finalOverview?.totalDiscussionPosts || 0}
              </div>
              <p className="text-muted-foreground truncate text-[10px] sm:text-xs">
                {finalOverview?.activeDiscussionPosts || 0} active posts (
                {safePercentage(
                  finalOverview?.activeDiscussionPosts,
                  finalOverview?.totalDiscussionPosts
                )}
                %)
              </p>
              <p className="mt-1 text-[10px] text-blue-500 sm:text-xs">
                {finalOverview?.totalDiscussionPosts > 0
                  ? `~${(finalOverview?.totalDiscussionPosts / (finalOverview?.totalUsers || 1)).toFixed(1)} posts per user`
                  : 'No discussion activity'}
              </p>
            </CardContent>
          </Card>

          {/* Events Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 sm:px-6 sm:pt-6 sm:pb-2">
              <CardTitle className="truncate text-xs font-medium sm:text-sm">
                Total Events
              </CardTitle>
              <Calendar className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                {finalOverview?.totalEvents || 0}
              </div>
              <p className="text-muted-foreground truncate text-[10px] sm:text-xs">
                {finalOverview?.deletedEvents || 0} deleted events (
                {safePercentage(
                  finalOverview?.deletedEvents,
                  finalOverview?.totalEvents
                )}
                %)
              </p>
              <p className="mt-1 text-[10px] text-blue-500 sm:text-xs">
                {finalOverview?.totalEvents > 0
                  ? `${(((finalOverview?.totalEvents - (finalOverview?.deletedEvents || 0)) / finalOverview?.totalEvents) * 100).toFixed(1)}% retention rate`
                  : 'No events created'}
              </p>
            </CardContent>
          </Card>

          {/* New Users Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 sm:px-6 sm:pt-6 sm:pb-2">
              <CardTitle className="truncate text-xs font-medium sm:text-sm">
                New Users (Last Week)
              </CardTitle>
              <UserPlus className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                {finalOverview?.lastWeek?.totalUsers || 0}
              </div>
              <p className="text-muted-foreground truncate text-[10px] sm:text-xs">
                {finalOverview?.lastWeek?.activeUsers || 0} active new users (
                {safePercentage(
                  finalOverview?.lastWeek?.activeUsers,
                  finalOverview?.lastWeek?.totalUsers
                )}
                %)
              </p>
              <p className="mt-1 text-[10px] text-blue-500 sm:text-xs">
                {finalOverview?.lastWeek?.totalUsers > 0
                  ? `${((finalOverview?.lastWeek?.totalUsers / (finalOverview?.totalUsers || 1)) * 100).toFixed(1)}% growth`
                  : 'No new users'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Text Displays Row 1 */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Events by Date Display */}
          <div className="lg:col-span-4">
            <EventsByDateDisplay data={eventsByDateDisplayData} />
          </div>

          {/* Event Visibility Display */}
          <div className="lg:col-span-3">
            <EventVisibilityDisplay data={eventVisibilityDisplayData} />
          </div>
        </div>

        {/* Text Displays Row 2 */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Users by Date Display */}
          <div className="lg:col-span-4">
            <UsersByDateDisplay data={usersByDateDisplayData} />
          </div>

          {/* Deleted Users Display */}
          <div className="lg:col-span-3">
            <DeletedUsersDisplay data={finalDeletedUsersByDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
