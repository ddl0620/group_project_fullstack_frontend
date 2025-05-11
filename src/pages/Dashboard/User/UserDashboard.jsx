"use client"

import { useState, useEffect, useRef } from "react"
import { subDays } from "date-fns"
import { Mail, MessageSquare, User, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./components/ui/index"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { InvitationOvertime } from "./components/InvitationOverTime"
import { RsvpDistribution } from "./components/RsvpDistribution.jsx"
import { useUserStatis } from "@/hooks/useUserStatis"

export default function UserDashboard() {
  const {
    engagementStats,
    invitationsOverTime,
    rsvpDistribution,
    recipients,
    loadingRecipients,
    loadingEngagementStats,
    loadingInvitations,
    loadingRsvpDistribution,
    errorEngagementStats,
    errorInvitations,
    errorRsvpDistribution,
    errorRecipients,
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpDistribution,
    fetchRecipients,
  } = useUserStatis()

  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const [interval] = useState("daily") // Removed setInterval as it's unused

  // Render counter for debugging
  const renderCount = useRef(0)
  useEffect(() => {
    renderCount.current += 1
    if (process.env.NODE_ENV === "development") {
      console.log(`UserDashboard Render Count: ${renderCount.current}`)
    }
  }, [])

  // Log state changes for debugging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("State Updated:", {
        engagementStats,
        invitationsOverTime,
        rsvpDistribution,
        recipients,
      })
    }
  }, [engagementStats, invitationsOverTime, rsvpDistribution, recipients])

  // Debug resize events
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const handleResize = () => {
        console.log("Window resized, render count:", renderCount.current)
      }
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Fetch all data
  useEffect(() => {
    const startDate = date.from.toISOString().split("T")[0]
    const endDate = date.to.toISOString().split("T")[0]
    Promise.all([
      fetchEngagementStats(),
      fetchInvitationsOverTime(startDate, endDate),
      fetchRsvpDistribution(),
      fetchRecipients(1, 10),
    ]).catch((err) => {
      console.error("Failed to fetch data:", err)
    })
  }, [date.from, date.to, fetchEngagementStats, fetchInvitationsOverTime, fetchRsvpDistribution, fetchRecipients])

  // Map engagement stats to numeric data
  const numericData = engagementStats && engagementStats.previousWeek
    ? [
      {
        title: "Total Invitations",
        value: engagementStats.totalInvitations || 0,
        percentage: calculatePercentageChange(
          engagementStats.totalInvitations || 0,
          engagementStats.previousWeek.totalInvitations || 0
        ),
        icon: <Mail className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "RSVP Accepted",
        value: engagementStats.acceptedRSVPs || 0,
        percentage: calculatePercentageChange(
          engagementStats.acceptedRSVPs || 0,
          engagementStats.previousWeek.acceptedRSVPs || 0
        ),
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "RSVP Pending",
        value: engagementStats.pendingRSVPs || 0,
        percentage: calculatePercentageChange(
          engagementStats.pendingRSVPs || 0,
          engagementStats.previousWeek.pendingRSVPs || 0
        ),
        icon: <User className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Response Rate",
        value: calculateResponseRate(
          engagementStats.acceptedRSVPs || 0,
          engagementStats.totalInvitations || 0
        ),
        percentage: calculatePercentageChange(
          engagementStats.acceptedRSVPs || 0,
          engagementStats.previousWeek.acceptedRSVPs || 0
        ),
        icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
      },
    ]
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {errorEngagementStats ? (
              <div className="text-red-500">Error loading engagement stats: {errorEngagementStats}</div>
            ) : loadingEngagementStats ? (
              <div>Loading engagement stats...</div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {numericData.map((data, index) => (
                  <div key={index}>
                    <Card className="hover:shadow-xl transition-shadow duration-500">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
                        {data.icon}
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{data.value}</div>
                        <p
                          className={`text-xs font-medium ${
                            data.percentage >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {data.percentage >= 0 ? "+" : ""}
                          {data.percentage}% from last month
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              {errorInvitations ? (
                <div className="text-red-500">Error loading invitations: {errorInvitations}</div>
              ) : loadingInvitations ? (
                <div>Loading invitations...</div>
              ) : (
                <div className="col-span-1 lg:col-span-4">
                  <Card className="hover:shadow-xl transition-shadow duration-50">
                    <CardHeader>
                      <CardTitle>Invitations Over Time</CardTitle>
                      <CardDescription>
                        Number of invitations sent {interval === "daily" ? "per day" : "per week"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <InvitationOvertime data={invitationsOverTime} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {errorRsvpDistribution ? (
                <div className="text-red-500">Error loading RSVP distribution: {errorRsvpDistribution}</div>
              ) : loadingRsvpDistribution ? (
                <div>Loading RSVP distribution...</div>
              ) : (
                <div className="col-span-1 lg:col-span-3">
                  <Card className="hover:shadow-xl transition-shadow duration-50">
                    <CardHeader>
                      <CardTitle>RSVP Distribution</CardTitle>
                      <CardDescription>Distribution of RSVP responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RsvpDistribution data={rsvpDistribution} />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>


          </TabsContent>


          <TabsContent value="analytics" className="space-y-4">
            {errorInvitations ? (
              <div className="text-red-500">Error loading invitations: {errorInvitations}</div>
            ) : loadingInvitations ? (
              <div>Loading invitations...</div>
            ) : (
              <div className="hover:shadow-xl transition-shadow duration-50">
                <Card>
                  <CardHeader>
                    <CardTitle>RSVP Trend</CardTitle>
                    <CardDescription>RSVP responses over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InvitationOvertime data={invitationsOverTime} />
                  </CardContent>
                </Card>
              </div>
            )}
            {errorRsvpDistribution ? (
              <div className="text-red-500">Error loading RSVP distribution: {errorRsvpDistribution}</div>
            ) : loadingRsvpDistribution ? (
              <div>Loading RSVP distribution...</div>
            ) : (
              <div className="col-span-1 lg:col-span-3 hover:shadow-xl transition-shadow duration-50">
                <Card>
                  <CardHeader>
                    <CardTitle>RSVP Distribution</CardTitle>
                    <CardDescription>Distribution of RSVP responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RsvpDistribution data={rsvpDistribution} />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Helper functions
function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0
  return (((current - previous) / previous) * 100).toFixed(1)
}

function calculateResponseRate(accepted, total) {
  if (total === 0) return "0%"
  return `${((accepted / total) * 100).toFixed(1)}%`
}