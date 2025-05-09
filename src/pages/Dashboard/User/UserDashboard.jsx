"use client"

import { useState, useEffect, useRef } from "react"
import { subDays } from "date-fns"
import { Mail, MessageSquare, Search, User, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Input } from "./components/ui/index"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select"
import { DatePickerWithRange } from "./components/DatePickerWithRange"
import { Overview } from "./components/Overview"
import { RsvpDistribution } from "./components/RsvpDistribution"
import { InvitationOvertime } from "./components/InvitationOverTime"
import { motion } from "framer-motion"
import { useUserStatis } from "@/hooks/useUserStatis"
import RecentRecipients from '@/pages/Dashboard/User/components/RecentRecipents.jsx';

export default function UserDashboard() {
  const {
    engagementStats,
    invitationsOverTime,
    rsvpDistribution,
    recipients,
    loadingRecipients,
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpDistribution,
    fetchRecipients,
  } = useUserStatis()

  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const [interval, setInterval] = useState("daily")

  // Render counter for debugging
  const renderCount = useRef(0)
  useEffect(() => {
    renderCount.current += 1
    console.log(`UserDashboard Render Count: ${renderCount.current}`)
  })

  // Log state changes to identify re-render causes
  useEffect(() => {
    console.log("Engagement Stats Updated:", engagementStats)
  }, [engagementStats])

  useEffect(() => {
    console.log("Invitations Over Time Updated:", invitationsOverTime)
  }, [invitationsOverTime])

  useEffect(() => {
    console.log("RSVP Distribution Updated:", rsvpDistribution)
  }, [rsvpDistribution])

  useEffect(() => {
    console.log("Recipients State Updated:", recipients)
  }, [recipients])

  // Fetch engagement stats on mount
  useEffect(() => {
    fetchEngagementStats()
  }, [fetchEngagementStats])

  // Fetch invitations over time on mount
  useEffect(() => {
    const startDate = date.from.toISOString().split("T")[0]
    const endDate = date.to.toISOString().split("T")[0]
    fetchInvitationsOverTime(startDate, endDate)
  }, [fetchInvitationsOverTime])

  // Fetch RSVP distribution on mount
  useEffect(() => {
    fetchRsvpDistribution()
  }, [fetchRsvpDistribution])

  // Fetch recipients on mount
  useEffect(() => {
    fetchRecipients(1, 10)
  }, [fetchRecipients])

  // Map engagement stats to numeric data
  const numericData = engagementStats
    ? [
      {
        title: "Total Invitations",
        value: engagementStats.totalInvitations,
        percentage: calculatePercentageChange(
          engagementStats.totalInvitations,
          engagementStats.previousWeek.totalInvitations
        ),
        icon: <Mail className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "RSVP Accepted",
        value: engagementStats.acceptedRSVPs,
        percentage: calculatePercentageChange(
          engagementStats.acceptedRSVPs,
          engagementStats.previousWeek.acceptedRSVPs
        ),
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "RSVP Pending",
        value: engagementStats.pendingRSVPs,
        percentage: calculatePercentageChange(
          engagementStats.pendingRSVPs,
          engagementStats.previousWeek.pendingRSVPs
        ),
        icon: <User className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Response Rate",
        value: calculateResponseRate(
          engagementStats.acceptedRSVPs,
          engagementStats.totalInvitations
        ),
        percentage: calculatePercentageChange(
          engagementStats.acceptedRSVPs,
          engagementStats.previousWeek.acceptedRSVPs
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
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {numericData.map((data, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                  }}
                >
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
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="col-span-1 lg:col-span-4"
              >
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
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="col-span-1 lg:col-span-3"
              >
                <Card className="hover:shadow-xl transition-shadow duration-50">
                  <CardHeader>
                    <CardTitle>RSVP Distribution</CardTitle>
                    <CardDescription>Distribution of RSVP responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RsvpDistribution data={rsvpDistribution} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {loadingRecipients ? (
              <div>Loading recipients...</div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="grid gap-4 grid-cols-1 lg:grid-cols-7 hover:shadow-xl transition-shadow duration-50"
              >
                <Card className="col-span-1 lg:col-span-7">
                  <CardHeader>
                    <CardTitle>Recent Recipients</CardTitle>
                    <CardDescription>Recently invited recipients and their RSVP status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentRecipients data={recipients} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4">
            {loadingRecipients ? (
              <div>Loading recipients...</div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="hover:shadow-xl transition-shadow duration-50"
              >
                <Card >
                  <CardHeader>
                    <CardTitle>All Recipients</CardTitle>
                    <CardDescription>Manage all your event recipients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentRecipients data={recipients}/>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="hover:shadow-xl transition-shadow duration-50"
            >
              <Card>
                <CardHeader>
                  <CardTitle>RSVP Trend</CardTitle>
                  <CardDescription>RSVP responses over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <InvitationOvertime data={invitationsOverTime} />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="col-span-1 lg:col-span-3 hover:shadow-xl transition-shadow duration-50"
            >
              <Card>
                <CardHeader>
                  <CardTitle>RSVP Distribution</CardTitle>
                  <CardDescription>Distribution of RSVP responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <RsvpDistribution data={rsvpDistribution} />
                </CardContent>
              </Card>
            </motion.div>
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