"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, BarList, LineChart } from "@tremor/react"
import { Users, UserPlus, Calendar, MessageSquare, AlertTriangle, Eye, EyeOff } from "lucide-react"

export default function AdminDashboard() {
  // Sample data (in a real app, this would come from API calls)
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
  })

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
  })

  const [rsvpTrendData] = useState({
    success: true,
    message: "RSVP trend fetched successfully",
    content: [
      { date: "2025-04-22", accepted: 0, denied: 0, pending: 0 },
      { date: "2025-04-23", accepted: 0, denied: 0, pending: 0 },
      { date: "2025-04-30", accepted: 0, denied: 0, pending: 0 },
    ],
  })

  const [deletedUsersData] = useState({
    success: true,
    message: "Deleted users by date fetched successfully",
    content: [{ count: 8, date: "2025-05-02" }],
  })

  // Sample data for public vs private events
  const [eventVisibilityData] = useState({
    publicEvents: 22,
    privateEvents: 10,
  })

  // Format data for charts
  const eventsByDateChartData = eventsByDateData.content.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Events: item.count,
  }))

  const rsvpChartData = rsvpTrendData.content.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Accepted: item.accepted,
    Denied: item.denied,
    Pending: item.pending,
  }))

  const eventVisibilityChartData = [
    { category: "Public Events", value: eventVisibilityData.publicEvents },
    { category: "Private Events", value: eventVisibilityData.privateEvents },
  ]

  const deletedUsersChartData = deletedUsersData.content.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.count,
  }))

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
                <div className="text-2xl font-bold">{overviewData.content.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewData.content.activeUsers} active users (
                  {Math.round((overviewData.content.activeUsers / overviewData.content.totalUsers) * 100)}%)
                </p>
                <div className="mt-3">
                  <Progress
                    value={(overviewData.content.activeUsers / overviewData.content.totalUsers) * 100}
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
                <div className="text-2xl font-bold">{overviewData.content.totalDiscussionPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewData.content.activeDiscussionPosts} active posts (
                  {Math.round(
                    (overviewData.content.activeDiscussionPosts / overviewData.content.totalDiscussionPosts) * 100,
                  )}
                  %)
                </p>
                <div className="mt-3">
                  <Progress
                    value={
                      (overviewData.content.activeDiscussionPosts / overviewData.content.totalDiscussionPosts) * 100
                    }
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
                <div className="text-2xl font-bold">{overviewData.content.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewData.content.deletedEvents} deleted events (
                  {Math.round((overviewData.content.deletedEvents / overviewData.content.totalEvents) * 100)}%)
                </p>
                <div className="mt-3">
                  <Progress
                    value={
                      ((overviewData.content.totalEvents - overviewData.content.deletedEvents) /
                        overviewData.content.totalEvents) *
                      100
                    }
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
                <div className="text-2xl font-bold">{overviewData.content.lastWeek.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewData.content.lastWeek.activeUsers} active new users (
                  {Math.round(
                    (overviewData.content.lastWeek.activeUsers / overviewData.content.lastWeek.totalUsers) * 100,
                  )}
                  %)
                </p>
                <div className="mt-3">
                  <Progress
                    value={(overviewData.content.lastWeek.activeUsers / overviewData.content.lastWeek.totalUsers) * 100}
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
                    <span className="text-sm">Public: {eventVisibilityData.publicEvents}</span>
                  </div>
                  <div className="flex items-center">
                    <EyeOff className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm">Private: {eventVisibilityData.privateEvents}</span>
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
                {deletedUsersData.content.length > 0 ? (
                  <div className="space-y-4">
                    <BarList
                      data={deletedUsersChartData}
                      valueFormatter={(number) => `${number} users`}
                      color="amber"
                    />
                    <div className="pt-2 space-y-2">
                      {deletedUsersData.content.map((item, index) => (
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
  )
}
