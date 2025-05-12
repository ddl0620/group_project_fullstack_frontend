"use client"

import { useState, useEffect, useRef } from "react"
import { subDays } from "date-fns"
import { Mail, MessageSquare, User, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { useUserStatis } from "@/hooks/useUserStatis"
import { InvitationTrend } from '@/pages/Dashboard/User/components/InvitationTrend.jsx';
import { RsvpSummary } from '@/pages/Dashboard/User/components/RsvpSummary.jsx';

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

  const [interval] = useState("daily")

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

  // Map rsvp distribution data to numeric data
  const numericData =
    rsvpDistribution && Array.isArray(rsvpDistribution) && rsvpDistribution.length > 0
      ? (() => {
        // Calculate total responses
        const totalResponses = rsvpDistribution.reduce((sum, item) => sum + (item.value || 0), 0)

        // Find specific RSVP types
        const findRsvpValue = (status) => {
          const item = rsvpDistribution.find((item) => item.status === status || item.name === status)
          return item ? item.value : 0
        }

        const acceptedCount = findRsvpValue("Accepted")
        const declinedCount = findRsvpValue("Denied")
        const pendingCount = findRsvpValue("Pending")

        // Calculate response rate
        const responseRate = totalResponses > 0 ? `${Math.round((acceptedCount / totalResponses) * 100)}%` : "0%"

        return [
          {
            title: "Total Responses",
            value: totalResponses,
            percentage: 0, // We don't have previous data for comparison
            icon: <Mail className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Accepted",
            value: acceptedCount,
            percentage: totalResponses > 0 ? Math.round((acceptedCount / totalResponses) * 100) : 0,
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Declined",
            value: declinedCount,
            percentage: totalResponses > 0 ? Math.round((declinedCount / totalResponses) * 100) : 0,
            icon: <User className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Pending",
            value: pendingCount,
            percentage: totalResponses > 0 ? Math.round((pendingCount / totalResponses) * 100) : 0,
            icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
          },
        ]
      })()
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
                            data.title === "Declined" ? "text-red-500" : "text-blue-500"
                          }`}
                        >
                          {data.title !== "Total Responses" ? `${data.percentage}% of total` : "Total responses"}
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
                  <InvitationTrend data={invitationsOverTime} />
                </div>
              )}

              {errorRsvpDistribution ? (
                <div className="text-red-500">Error loading RSVP distribution: {errorRsvpDistribution}</div>
              ) : loadingRsvpDistribution ? (
                <div>Loading RSVP distribution...</div>
              ) : (
                <div className="col-span-1 lg:col-span-3">
                  <RsvpSummary data={rsvpDistribution} />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {errorInvitations ? (
                <div className="text-red-500">Error loading invitations: {errorInvitations}</div>
              ) : loadingInvitations ? (
                <div>Loading invitations...</div>
              ) : (
                <div className="hover:shadow-xl transition-shadow duration-500">
                  <Card>
                    <CardHeader>
                      <CardTitle>RSVP Trend</CardTitle>
                      <CardDescription>RSVP responses over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {invitationsOverTime &&
                          invitationsOverTime.slice(0, 7).map((item, index) => {
                            const date = new Date(item.date)
                            const formattedDate = date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })

                            return (
                              <div key={index} className="flex flex-col space-y-2 p-3 border rounded-md">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{formattedDate}</span>
                                  <span className="text-sm text-muted-foreground">{item.invitations} invitations</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{
                                      width: `${Math.min(100, (item.invitations / 10) * 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {errorRsvpDistribution ? (
                <div className="text-red-500">Error loading RSVP distribution: {errorRsvpDistribution}</div>
              ) : loadingRsvpDistribution ? (
                <div>Loading RSVP distribution...</div>
              ) : (
                <div className="hover:shadow-xl transition-shadow duration-500">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Details</CardTitle>
                      <CardDescription>Detailed breakdown of responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {rsvpDistribution &&
                          rsvpDistribution.map((item, index) => {
                            const status = item.status || item.name
                            let bgColor = "bg-gray-100"
                            let textColor = "text-gray-800"

                            if (status === "Accepted") {
                              bgColor = "bg-green-100"
                              textColor = "text-green-800"
                            } else if (status === "Declined") {
                              bgColor = "bg-red-100"
                              textColor = "text-red-800"
                            } else if (status === "Pending") {
                              bgColor = "bg-yellow-100"
                              textColor = "text-yellow-800"
                            }

                            return (
                              <div key={index} className={`p-4 rounded-lg ${bgColor}`}>
                                <h4 className={`text-lg font-semibold ${textColor}`}>{status}</h4>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Count</p>
                                    <p className="text-xl font-bold">{item.value}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Details</p>
                                    <p className="text-sm">
                                      {status === "Accepted"
                                        ? "Ready to attend"
                                        : status === "Declined"
                                          ? "Cannot attend"
                                          : "Awaiting response"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <Card className="hover:shadow-xl transition-shadow duration-500">
              <CardHeader>
                <CardTitle>Invitation Summary</CardTitle>
                <CardDescription>Overview of all invitation activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Total Sent</h4>
                      <p className="text-2xl font-bold">{engagementStats?.totalInvitations || 0}</p>
                      <p className="text-xs text-muted-foreground mt-1">Across all events</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Response Rate</h4>
                      <p className="text-2xl font-bold">
                        {calculateResponseRate(
                          (engagementStats?.acceptedRSVPs || 0) + (engagementStats?.deniedRSVPs || 0),
                          engagementStats?.totalInvitations || 0,
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Of all invitations</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Acceptance Rate</h4>
                      <p className="text-2xl font-bold">
                        {calculateResponseRate(
                          engagementStats?.acceptedRSVPs || 0,
                          (engagementStats?.acceptedRSVPs || 0) + (engagementStats?.deniedRSVPs || 0),
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Of all responses</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium mb-3">Invitation Timeline</h4>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                            Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-800">
                            {calculateResponseRate(
                              (engagementStats?.acceptedRSVPs || 0) + (engagementStats?.deniedRSVPs || 0),
                              engagementStats?.totalInvitations || 0,
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                          style={{
                            width:
                              calculateResponseRateNumeric(
                                (engagementStats?.acceptedRSVPs || 0) + (engagementStats?.deniedRSVPs || 0),
                                engagementStats?.totalInvitations || 0,
                              ) + "%",
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

function calculateResponseRateNumeric(accepted, total) {
  if (total === 0) return 0
  return ((accepted / total) * 100).toFixed(1)
}
