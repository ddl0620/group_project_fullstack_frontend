"use client"

import { useState, useEffect } from "react"
import { useAdminStatistics } from "@/hooks/useAdminStatistics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, UserPlus, Calendar, MessageSquare, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { BarChart, LineChart, PieChart } from '@/pages/Dashboard/Admin/components/dashboard/charts/index.js';
import {
  DiscussionsTable,
  EventsTable,
  UsersTable,
} from '@/pages/Dashboard/Admin/components/dashboard/tables/index.js';


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
  } = useAdminStatistics()

  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    isMobile: false,
    isExtraSmall: false,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreenSize({
        width,
        isMobile: width < 640,
        isExtraSmall: width < 375,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Dynamic date range: last 30 days
    const endDate = new Date().toISOString().split("T")[0] // Today
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 30 days ago

    fetchOverview()
    fetchEventsByDate({ startDate, endDate })
    fetchDeletedUsersByDate({ startDate, endDate })
    fetchPublicAndPrivateEvents()
  }, [fetchOverview, fetchEventsByDate, fetchDeletedUsersByDate, fetchPublicAndPrivateEvents])

  // Sample data as fallback
  const [overviewData] = useState({
    success: true,
    message: "Overview statistics fetched successfully",
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
  })

  const [eventsByDateData] = useState({
    success: true,
    message: "Events by date fetched successfully",
    content: [],
  })

  // Sample RSVP trend data
  const [rsvpTrendData] = useState({
    success: true,
    message: "RSVP trend fetched successfully",
    content: [],
  })

  const [deletedUsersData] = useState({
    success: true,
    message: "Deleted users by date fetched successfully",
    content: [],
  })

  const [eventVisibilityData] = useState({
    publicEvents: 0,
    privateEvents: 0,
  })


  // Use sample data if API fails
  const finalOverview = error ? overviewData.content : overview
  const finalEventsByDate = error ? eventsByDateData.content : eventsByDate
  const finalDeletedUsersByDate = error ? deletedUsersData.content : deletedUsersByDate
  const finalPublicAndPrivateEvents = error ? eventVisibilityData : publicAndPrivateEvents

  // Format data for charts - ensure proper formatting for small screens
  const eventsByDateChartData =
    finalEventsByDate?.map((item) => {
      // For small screens, use shorter date format
      const dateFormat = screenSize.isExtraSmall
        ? { month: "short", day: "numeric" }
        : { month: "short", day: "numeric" }

      return {
        name: new Date(item.date).toLocaleDateString("en-US", dateFormat),
        total: item.count,
      }
    }) || []

  // Limit the number of data points for small screens
  const limitedEventsByDateChartData = screenSize.isExtraSmall
    ? eventsByDateChartData.slice(-6) // Show only the last 6 data points on very small screens
    : eventsByDateChartData

  const rsvpChartData = rsvpTrendData.content.map((item) => {
    const dateFormat = screenSize.isExtraSmall ? { month: "short", day: "numeric" } : { month: "short", day: "numeric" }

    return {
      name: new Date(item.date).toLocaleDateString("en-US", dateFormat),
      accepted: item.accepted,
      denied: item.denied,
      pending: item.pending,
    }
  })

  const eventVisibilityChartData = [
    { name: "Public", value: finalPublicAndPrivateEvents?.publicEvents || 0 },
    { name: "Private", value: finalPublicAndPrivateEvents?.privateEvents || 0 },
  ]

  // Helper to avoid division by zero
  const safePercentage = (numerator, denominator) => {
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) console.warn("API error, using sample data:", error)

  return (
    <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-8 pt-6 bg-gray-50 min-h-screen overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      <div className={"space-y-4"}>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {/* Users Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Users</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{finalOverview?.totalUsers || 0}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {finalOverview?.activeUsers || 0} active users (
                {safePercentage(finalOverview?.activeUsers, finalOverview?.totalUsers)}%)
              </p>
              <div className="mt-2 sm:mt-3">
                <Progress
                  value={safePercentage(finalOverview?.activeUsers, finalOverview?.totalUsers)}
                  className="h-1 sm:h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Discussion Posts Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Discussion Posts</CardTitle>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {finalOverview?.totalDiscussionPosts || 0}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {finalOverview?.activeDiscussionPosts || 0} active posts (
                {safePercentage(finalOverview?.activeDiscussionPosts, finalOverview?.totalDiscussionPosts)}%)
              </p>
              <div className="mt-2 sm:mt-3">
                <Progress
                  value={safePercentage(finalOverview?.activeDiscussionPosts, finalOverview?.totalDiscussionPosts)}
                  className="h-1 sm:h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Events Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Events</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{finalOverview?.totalEvents || 0}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {finalOverview?.deletedEvents || 0} deleted events (
                {safePercentage(finalOverview?.deletedEvents, finalOverview?.totalEvents)}%)
              </p>
              <div className="mt-2 sm:mt-3">
                <Progress
                  value={safePercentage(
                    finalOverview?.totalEvents - (finalOverview?.deletedEvents || 0),
                    finalOverview?.totalEvents,
                  )}
                  className="h-1 sm:h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* New Users Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">New Users (Last Week)</CardTitle>
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {finalOverview?.lastWeek?.totalUsers || 0}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {finalOverview?.lastWeek?.activeUsers || 0} active new users (
                {safePercentage(finalOverview?.lastWeek?.activeUsers, finalOverview?.lastWeek?.totalUsers)}%)
              </p>
              <div className="mt-2 sm:mt-3">
                <Progress
                  value={safePercentage(finalOverview?.lastWeek?.activeUsers, finalOverview?.lastWeek?.totalUsers)}
                  className="h-1 sm:h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          {/* Events by Date Chart */}
          <Card className="bg-white lg:col-span-4">
            <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
              <CardTitle className="text-sm sm:text-base md:text-lg">Events by Date</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">Number of events created per day</CardDescription>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4">
              <BarChart
                data={limitedEventsByDateChartData}
                // height={screenSize.isExtraSmall ? 180 : screenSize.isMobile ? 200 : 300}
                // valueFormatter={(value) => `${value} events`}
              />
            </CardContent>
          </Card>

          {/* Public vs Private Events */}
          <Card className="bg-white lg:col-span-3">
            <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
              <CardTitle className="text-sm sm:text-base md:text-lg">Event Visibility</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">
                Distribution of public vs private events
              </CardDescription>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4">
              <PieChart
                data={eventVisibilityChartData}
                // height={screenSize.isExtraSmall ? 180 : screenSize.isMobile ? 200 : 300}
                // valueFormatter={(value) => `${value} events`}
              />
              <div className="flex flex-col xs:flex-row justify-center mt-2 space-y-2 xs:space-y-0 xs:space-x-8">
                <div className="flex items-center justify-center">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1 sm:mr-2" />
                  <span className="text-[10px] sm:text-xs">
                      Public: {finalPublicAndPrivateEvents?.publicEvents || 0}
                    </span>
                </div>
                <div className="flex items-center justify-center">
                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500 mr-1 sm:mr-2" />
                  <span className="text-[10px] sm:text-xs">
                      Private: {finalPublicAndPrivateEvents?.privateEvents || 0}
                    </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          {/* RSVP Trends */}
          <Card className="bg-white lg:col-span-4">
            <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
              <CardTitle className="text-sm sm:text-base md:text-lg">RSVP Trends</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">
                User responses to event invitations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4">
              <LineChart
                data={rsvpChartData}
                height={screenSize.isExtraSmall ? 180 : screenSize.isMobile ? 200 : 300}
                series={[
                  { dataKey: "accepted", color: "#4ade80" },
                  { dataKey: "denied", color: "#f87171" },
                  { dataKey: "pending", color: "#facc15" },
                ]}
                valueFormatter={(value) => `${value} responses`}
              />
            </CardContent>
          </Card>

          {/* Deleted Users */}
          <Card className="bg-white lg:col-span-3">
            <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
              <CardTitle className="text-sm sm:text-base md:text-lg">Deleted Users</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">
                Users who have deleted their accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              {finalDeletedUsersByDate.length > 0 ? (
                <div className="space-y-2 sm:space-y-4">
                  <div className="pt-1 sm:pt-2 space-y-1 sm:space-y-2">
                    {finalDeletedUsersByDate.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 mr-1 sm:mr-2" />
                        <div>
                          <p className="text-[10px] sm:text-xs md:text-sm font-medium">
                            {item.count} users deleted on {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[180px] sm:h-[200px] flex items-center justify-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">No deleted users in this period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
