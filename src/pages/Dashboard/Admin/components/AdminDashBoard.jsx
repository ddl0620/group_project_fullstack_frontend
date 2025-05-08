// "use client";
// import { useState, useEffect } from "react";
// import { useAdminStatistics } from "@/hooks/useAdminStatistics";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { BarChart, BarList, LineChart } from "@tremor/react";
// import { Users, UserPlus, Calendar, MessageSquare, AlertTriangle, Eye, EyeOff } from "lucide-react";

// export default function AdminDashboard() {
//   const {
//     overview,
//     eventsByDate,
//     usersByDate,
//     deletedUsersByDate,
//     publicAndPrivateEvents,
//     fetchOverview,
//     fetchEventsByDate,
//     fetchUsersByDate,
//     fetchDeletedUsersByDate,
//     fetchPublicAndPrivateEvents,
//     loading,
//     error,
//   } = useAdminStatistics();

//   useEffect(() => {
//     const startDate = "2025-01-01";
//     const endDate = "2025-05-08";

//     fetchOverview();
//     fetchEventsByDate({ startDate, endDate });
//     fetchUsersByDate({ startDate, endDate });
//     fetchDeletedUsersByDate({ startDate, endDate });
//     fetchPublicAndPrivateEvents();
//   }, [fetchOverview, fetchEventsByDate, fetchUsersByDate, fetchDeletedUsersByDate, fetchPublicAndPrivateEvents]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   // Sample data (in a real app, this would come from API calls)
//   const [overviewData] = useState({
//     success: true,
//     message: "Overview statistics fetched successfully",
//     content: {
//       totalUsers: 49,
//       activeUsers: 16,
//       totalDiscussionPosts: 118,
//       activeDiscussionPosts: 24,
//       totalEvents: 32,
//       deletedEvents: 14,
//       lastWeek: {
//         totalUsers: 11,
//         activeUsers: 6,
//         totalDiscussionPosts: 9,
//         activeDiscussionPosts: 2,
//         totalEvents: 11,
//         deletedEvents: 8,
//       },
//     },
//   });

//   const [eventsByDateData] = useState({
//     success: true,
//     message: "Events by date fetched successfully",
//     content: [
//       { count: 7, date: "2025-04-16" },
//       { count: 3, date: "2025-04-18" },
//       { count: 1, date: "2025-04-22" },
//       { count: 1, date: "2025-04-23" },
//       { count: 2, date: "2025-04-28" },
//       { count: 5, date: "2025-04-29" },
//       { count: 2, date: "2025-04-30" },
//       { count: 1, date: "2025-05-01" },
//       { count: 8, date: "2025-05-03" },
//       { count: 2, date: "2025-05-07" },
//     ],
//   });

//   const [rsvpTrendData] = useState({
//     success: true,
//     message: "RSVP trend fetched successfully",
//     content: [
//       { date: "2025-04-22", accepted: 0, denied: 0, pending: 0 },
//       { date: "2025-04-23", accepted: 0, denied: 0, pending: 0 },
//       { date: "2025-04-30", accepted: 0, denied: 0, pending: 0 },
//     ],
//   });

//   const [deletedUsersData] = useState({
//     success: true,
//     message: "Deleted users by date fetched successfully",
//     content: [{ count: 8, date: "2025-05-02" }],
//   });

//   // Sample data for public vs private events
//   const [eventVisibilityData] = useState({
//     publicEvents: 22,
//     privateEvents: 10,
//   });

//   // Format data for charts
//   const eventsByDateChartData = eventsByDate?.map((item) => ({
//     date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//     Events: item.count,
//   })) || [];

//   const rsvpChartData = rsvpTrendData.content.map((item) => ({
//     date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//     Accepted: item.accepted,
//     Denied: item.denied,
//     Pending: item.pending,
//   }));

//   const eventVisibilityChartData = [
//     { category: "Public Events", value: publicAndPrivateEvents?.publicEvents || 0 },
//     { category: "Private Events", value: publicAndPrivateEvents?.privateEvents || 0 },
//   ];

//   const deletedUsersChartData = deletedUsersData.content.map((item) => ({
//     name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//     value: item.count,
//   }));

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50 min-h-screen">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</span>
//         </div>
//       </div>

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList className="bg-white border">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="users">Users</TabsTrigger>
//           <TabsTrigger value="events">Events</TabsTrigger>
//           <TabsTrigger value="discussions">Discussions</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           {/* Stats Cards */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             {/* Users Card */}
//             <Card className="bg-white">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{overview?.totalUsers || 0}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {overview?.activeUsers || 0} active users (
//                   {overview?.totalUsers
//                     ? Math.round((overview.activeUsers / overview.totalUsers) * 100)
//                     : 0}
//                   %)
//                 </p>
//                 <div className="mt-3">
//                   <Progress
//                     value={(overviewData.content.activeUsers / overviewData.content.totalUsers) * 100}
//                     className="h-2"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Discussion Posts Card */}
//             <Card className="bg-white">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Discussion Posts</CardTitle>
//                 <MessageSquare className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{overviewData.content.totalDiscussionPosts}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {overviewData.content.activeDiscussionPosts} active posts (
//                   {Math.round(
//                     (overviewData.content.activeDiscussionPosts / overviewData.content.totalDiscussionPosts) * 100,
//                   )}
//                   %)
//                 </p>
//                 <div className="mt-3">
//                   <Progress
//                     value={
//                       (overviewData.content.activeDiscussionPosts / overviewData.content.totalDiscussionPosts) * 100
//                     }
//                     className="h-2"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Events Card */}
//             <Card className="bg-white">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Events</CardTitle>
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{overviewData.content.totalEvents}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {overviewData.content.deletedEvents} deleted events (
//                   {Math.round((overviewData.content.deletedEvents / overviewData.content.totalEvents) * 100)}%)
//                 </p>
//                 <div className="mt-3">
//                   <Progress
//                     value={
//                       ((overviewData.content.totalEvents - overviewData.content.deletedEvents) /
//                         overviewData.content.totalEvents) *
//                       100
//                     }
//                     className="h-2"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* New Users Card */}
//             <Card className="bg-white">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">New Users (Last Week)</CardTitle>
//                 <UserPlus className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{overviewData.content.lastWeek.totalUsers}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {overviewData.content.lastWeek.activeUsers} active new users (
//                   {Math.round(
//                     (overviewData.content.lastWeek.activeUsers / overviewData.content.lastWeek.totalUsers) * 100,
//                   )}
//                   %)
//                 </p>
//                 <div className="mt-3">
//                   <Progress
//                     value={(overviewData.content.lastWeek.activeUsers / overviewData.content.lastWeek.totalUsers) * 100}
//                     className="h-2"
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Charts Row 1 */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             {/* Events by Date Chart */}
//             <Card className="lg:col-span-4 bg-white">
//               <CardHeader>
//                 <CardTitle>Events by Date</CardTitle>
//                 <CardDescription>Number of events created per day</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <BarChart
//                   className="h-72"
//                   data={eventsByDateChartData}
//                   index="date"
//                   categories={["Events"]}
//                   colors={["blue"]}
//                   valueFormatter={(number) => `${number} events`}
//                   yAxisWidth={40}
//                 />
//               </CardContent>
//             </Card>

//             {/* Public vs Private Events */}
//             <Card className="lg:col-span-3 bg-white">
//               <CardHeader>
//                 <CardTitle>Event Visibility</CardTitle>
//                 <CardDescription>Distribution of public vs private events</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <BarChart
//                   className="h-72"
//                   data={eventVisibilityChartData}
//                   index="category"
//                   categories={["value"]}
//                   colors={["blue"]}
//                   valueFormatter={(number) => `${number} events`}
//                   yAxisWidth={40}
//                   layout="vertical"
//                 />
//                 <div className="flex justify-center mt-2 space-x-8">
//                   <div className="flex items-center">
//                     <Eye className="h-4 w-4 text-blue-500 mr-2" />
//                     <span className="text-sm">Public: {eventVisibilityData.publicEvents}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <EyeOff className="h-4 w-4 text-indigo-500 mr-2" />
//                     <span className="text-sm">Private: {eventVisibilityData.privateEvents}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Charts Row 2 */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             {/* RSVP Trends */}
//             <Card className="lg:col-span-4 bg-white">
//               <CardHeader>
//                 <CardTitle>RSVP Trends</CardTitle>
//                 <CardDescription>User responses to event invitations</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <LineChart
//                   className="h-72"
//                   data={rsvpChartData}
//                   index="date"
//                   categories={["Accepted", "Denied", "Pending"]}
//                   colors={["green", "red", "amber"]}
//                   valueFormatter={(number) => `${number} responses`}
//                   yAxisWidth={40}
//                 />
//               </CardContent>
//             </Card>

//             {/* Deleted Users */}
//             <Card className="lg:col-span-3 bg-white">
//               <CardHeader>
//                 <CardTitle>Deleted Users</CardTitle>
//                 <CardDescription>Users who have deleted their accounts</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {deletedUsersData.content.length > 0 ? (
//                   <div className="space-y-4">
//                     <BarList
//                       data={deletedUsersChartData}
//                       valueFormatter={(number) => `${number} users`}
//                       color="amber"
//                     />
//                     <div className="pt-2 space-y-2">
//                       {deletedUsersData.content.map((item, index) => (
//                         <div key={index} className="flex items-center">
//                           <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
//                           <div>
//                             <p className="text-sm font-medium">
//                               {item.count} users deleted on {new Date(item.date).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-72 flex items-center justify-center">
//                     <p className="text-sm text-muted-foreground">No deleted users in this period</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="users" className="space-y-4">
//           <Card className="bg-white">
//             <CardHeader>
//               <CardTitle>User Management</CardTitle>
//               <CardDescription>View and manage all users in the system</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px] flex items-center justify-center border rounded-md">
//                 <p className="text-muted-foreground">User management interface would go here</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="events" className="space-y-4">
//           <Card className="bg-white">
//             <CardHeader>
//               <CardTitle>Event Management</CardTitle>
//               <CardDescription>View and manage all events in the system</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px] flex items-center justify-center border rounded-md">
//                 <p className="text-muted-foreground">Event management interface would go here</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="discussions" className="space-y-4">
//           <Card className="bg-white">
//             <CardHeader>
//               <CardTitle>Discussion Management</CardTitle>
//               <CardDescription>View and manage all discussion posts</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px] flex items-center justify-center border rounded-md">
//                 <p className="text-muted-foreground">Discussion management interface would go here</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useAdminStatistics } from "@/hooks/useAdminStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, BarList, LineChart } from "@tremor/react";
import { Users, UserPlus, Calendar, MessageSquare, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const {
    overview,
    eventsByDate,
    deletedUsersByDate,
    publicAndPrivateEvents,
    fetchOverview,
    fetchEventsByDate,
    fetchDeletedUsersByDate,
    fetchPublicAndPrivateEvents,
    loading,
    error,
  } = useAdminStatistics();

  useEffect(() => {
    // Dynamic date range: last 30 days
    const endDate = new Date().toISOString().split("T")[0]; // Today
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // 30 days ago

    fetchOverview();
    fetchEventsByDate({ startDate, endDate });
    fetchDeletedUsersByDate({ startDate, endDate });
    fetchPublicAndPrivateEvents();
  }, [fetchOverview, fetchEventsByDate, fetchDeletedUsersByDate, fetchPublicAndPrivateEvents]);

  // Sample data as fallback
  const [overviewData] = useState({
    success: true,
    message: "Overview statistics fetched successfully",
    content: {
      totalUsers: 49,
      activeUsers: 16,
      totalDiscussionPosts: 118,
      activeDiscussionPosts: 24,
      totalEvents: 32,
      deletedEvents: 14,
      lastWeek: {
        totalUsers: 11,
        activeUsers: 6,
        totalDiscussionPosts: 9,
        activeDiscussionPosts: 2,
        totalEvents: 11,
        deletedEvents: 8,
      },
    },
  });

  const [eventsByDateData] = useState({
    success: true,
    message: "Events by date fetched successfully",
    content: [
      { count: 7, date: "2025-04-16" },
      { count: 3, date: "2025-04-18" },
      { count: 1, date: "2025-04-22" },
      { count: 1, date: "2025-04-23" },
      { count: 2, date: "2025-04-28" },
      { count: 5, date: "2025-04-29" },
      { count: 2, date: "2025-04-30" },
      { count: 1, date: "2025-05-01" },
      { count: 8, date: "2025-05-03" },
      { count: 2, date: "2025-05-07" },
    ],
  });

  // TODO: Replace with API call for RSVP trends
  const [rsvpTrendData] = useState({
    success: true,
    message: "RSVP trend fetched successfully",
    content: [
      { date: "2025-04-22", accepted: 0, denied: 0, pending: 0 },
      { date: "2025-04-23", accepted: 0, denied: 0, pending: 0 },
      { date: "2025-04-30", accepted: 0, denied: 0, pending: 0 },
    ],
  });

  const [deletedUsersData] = useState({
    success: true,
    message: "Deleted users by date fetched successfully",
    content: [{ count: 8, date: "2025-05-02" }],
  });

  const [eventVisibilityData] = useState({
    publicEvents: 22,
    privateEvents: 10,
  });

  // Use sample data if API fails
  const finalOverview = error ? overviewData.content : overview;
  const finalEventsByDate = error ? eventsByDateData.content : eventsByDate;
  const finalDeletedUsersByDate = error ? deletedUsersData.content : deletedUsersByDate;
  const finalPublicAndPrivateEvents = error ? eventVisibilityData : publicAndPrivateEvents;

  // Format data for charts
  const eventsByDateChartData = finalEventsByDate?.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Events: item.count,
  })) || [];

  const rsvpChartData = rsvpTrendData.content.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Accepted: item.accepted,
    Denied: item.denied,
    Pending: item.pending,
  }));

  const eventVisibilityChartData = [
    { category: "Public Events", value: finalPublicAndPrivateEvents?.publicEvents || 0 },
    { category: "Private Events", value: finalPublicAndPrivateEvents?.privateEvents || 0 },
  ];

  const deletedUsersChartData = finalDeletedUsersByDate.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.count,
  }));

  // Helper to avoid division by zero
  const safePercentage = (numerator, denominator) => {
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
  };

  if (loading) return <div>Loading...</div>;
  if (error) console.warn("API error, using sample data:", error);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Users Card */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{finalOverview?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {finalOverview?.activeUsers || 0} active users (
                  {safePercentage(finalOverview?.activeUsers, finalOverview?.totalUsers)}%)
                </p>
                <div className="mt-3">
                  <Progress
                    value={safePercentage(finalOverview?.activeUsers, finalOverview?.totalUsers)}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Discussion Posts Card */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discussion Posts</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{finalOverview?.totalDiscussionPosts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {finalOverview?.activeDiscussionPosts || 0} active posts (
                  {safePercentage(
                    finalOverview?.activeDiscussionPosts,
                    finalOverview?.totalDiscussionPosts
                  )}%)
                </p>
                <div className="mt-3">
                  <Progress
                    value={safePercentage(
                      finalOverview?.activeDiscussionPosts,
                      finalOverview?.totalDiscussionPosts
                    )}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Events Card */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{finalOverview?.totalEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {finalOverview?.deletedEvents || 0} deleted events (
                  {safePercentage(finalOverview?.deletedEvents, finalOverview?.totalEvents)}%)
                </p>
                <div className="mt-3">
                  <Progress
                    value={safePercentage(
                      finalOverview?.totalEvents - (finalOverview?.deletedEvents || 0),
                      finalOverview?.totalEvents
                    )}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* New Users Card */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users (Last Week)</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{finalOverview?.lastWeek.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {finalOverview?.lastWeek.activeUsers || 0} active new users (
                  {safePercentage(
                    finalOverview?.lastWeek.activeUsers,
                    finalOverview?.lastWeek.totalUsers
                  )}%)
                </p>
                <div className="mt-3">
                  <Progress
                    value={safePercentage(
                      finalOverview?.lastWeek.activeUsers,
                      finalOverview?.lastWeek.totalUsers
                    )}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Events by Date Chart */}
            <Card className="lg:col-span-4 bg-white">
              <CardHeader>
                <CardTitle>Events by Date</CardTitle>
                <CardDescription>Number of events created per day</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-72"
                  data={eventsByDateChartData}
                  index="date"
                  categories={["Events"]}
                  colors={["blue"]}
                  valueFormatter={(number) => `${number} events`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>

            {/* Public vs Private Events */}
            <Card className="lg:col-span-3 bg-white">
              <CardHeader>
                <CardTitle>Event Visibility</CardTitle>
                <CardDescription>Distribution of public vs private events</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-72"
                  data={eventVisibilityChartData}
                  index="category"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(number) => `${number} events`}
                  yAxisWidth={40}
                  layout="vertical"
                />
                <div className="flex justify-center mt-2 space-x-8">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">Public: {finalPublicAndPrivateEvents?.publicEvents || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <EyeOff className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm">Private: {finalPublicAndPrivateEvents?.privateEvents || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* RSVP Trends */}
            <Card className="lg:col-span-4 bg-white">
              <CardHeader>
                <CardTitle>RSVP Trends</CardTitle>
                <CardDescription>User responses to event invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  className="h-72"
                  data={rsvpChartData}
                  index="date"
                  categories={["Accepted", "Denied", "Pending"]}
                  colors={["green", "red", "amber"]}
                  valueFormatter={(number) => `${number} responses`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>

            {/* Deleted Users */}
            <Card className="lg:col-span-3 bg-white">
              <CardHeader>
                <CardTitle>Deleted Users</CardTitle>
                <CardDescription>Users who have deleted their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {finalDeletedUsersByDate.length > 0 ? (
                  <div className="space-y-4">
                    <BarList
                      data={deletedUsersChartData}
                      valueFormatter={(number) => `${number} users`}
                      color="amber"
                    />
                    <div className="pt-2 space-y-2">
                      {finalDeletedUsersByDate.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium">
                              {item.count} users deleted on {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No deleted users in this period</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">User management interface would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>View and manage all events in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Event management interface would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Discussion Management</CardTitle>
              <CardDescription>View and manage all discussion posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Discussion management interface would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
