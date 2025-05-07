"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { subDays } from "date-fns"
import { Mail, MessageSquare, Search, User, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Input } from "./components/ui/index"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select"
import { DatePickerWithRange } from "./components/DatePickerWithRange"
import { Overview } from "./components/Overview"
import { RsvpDistribution } from "./components/RsvpDistribution"
import { RecentRecipients } from "./components/RecentRecipents"
import { motion } from "framer-motion"
import { getEngagementStatsAPI, getInvitationsOverTimeAPI, getRsvpDistributionAPI } from "@/services/UserStatisService"
import { setEngagementStats, setInvitationsOverTime, setRsvpDistribution } from "@/store/slices/userStatisSlice"
import { InvitationOvertime } from "./components/InvitationOverTime"

export default function UserDashboard() {
  const dispatch = useDispatch()
  const engagementStats = useSelector((state) => state.userStatis.engagementStats)
  const invitationsOverTime = useSelector((state) => state.userStatis.invitationsOverTime)
  const rsvpDistribution = useSelector((state) => state.userStatis.rsvpDistribution)

  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const [interval, setInterval] = useState("daily")

  // Fetch engagement stats on mount
  useEffect(() => {
    const fetchEngagementStats = async () => {
      try {
        const data = await getEngagementStatsAPI()
        dispatch(setEngagementStats(data.content))
      } catch (error) {
        console.error("Failed to fetch engagement stats:", error)
      }
    }
    fetchEngagementStats()
  }, [dispatch])

  // Fetch invitations over time on date change
  useEffect(() => {
    const fetchInvitationsOverTime = async () => {
      try {
        const startDate = date.from.toISOString().split("T")[0] // Chuyển đổi sang định dạng YYYY-MM-DD
        const endDate = date.to.toISOString().split("T")[0]
        console.log("Fetching invitations over time with dates:", { startDate, endDate }) // Kiểm tra tham số ngày
        const data = await getInvitationsOverTimeAPI({ startDate, endDate })
        console.log("Invitations Over Time Data:", data.content) // Kiểm tra dữ liệu trả về
        dispatch(setInvitationsOverTime(data.content))
      } catch (error) {
        console.error("Failed to fetch invitations over time:", error)
      }
    }
    fetchInvitationsOverTime()
  }, [date, dispatch]) // Thêm `date` vào dependency để gọi lại API khi ngày thay đổi

  useEffect(() => {
    const fetchRsvpDistribution = async () => {
      try {
        const data = await getRsvpDistributionAPI()
        console.log("RSVP Distribution Data:", data.content) // Kiểm tra dữ liệu trả về
        dispatch(setRsvpDistribution(data.content))
      } catch (error) {
        console.error("Failed to fetch RSVP distribution:", error)
      }
    }
    fetchRsvpDistribution()
  }, [dispatch])

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
      {/* First Section */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search recipients..." className="pl-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Date Picking and interval select section */}
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange date={date} setDate={setDate} />
            <Select value={interval} onValueChange={(value) => setInterval(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          {/* Tabs List selection Menu */}
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4">
            {/* Cards for numeric information */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                      <div className="text-2xl font-bold">{data.value}</div>
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

            {/* Tabs for graph information */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Invitation overtime chart */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="col-span-4"
              >
                <Card className="hover:shadow-xl transition-shadow duration-50">
                  <CardHeader>
                    <CardTitle>Invitations Over Time</CardTitle>
                    <CardDescription>
                      Number of invitations sent {interval === "daily" ? "per day" : "per week"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/* <Overview data={invitationsOverTime.map(item => ({
                      date: item.date,
                      invitations: item.invitations,
                    }))} /> */}
                    {/* <Overview data={invitationsOverTime isRSVPTrend={true}}/> */}
                    <InvitationOvertime data={invitationsOverTime} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* RSVP overtimer chart */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="col-span-3"
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
            
            {/* Recipent table section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 hover:shadow-xl transition-shadow duration-50"
            >
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Recent Recipients</CardTitle>
                  <CardDescription>Recently invited recipients and their RSVP status</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentRecipients />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* RECIPENTS TAB */}
          <TabsContent value="recipients" className="space-y-4">
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
                  <CardTitle>All Recipients</CardTitle>
                  <CardDescription>Manage all your event recipients</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentRecipients fullTable={true} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ANALYTICS TAB */}
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
                  <Overview interval={interval} isRsvpTrend={true} />
                </CardContent>
              </Card>
            </motion.div>
            {/* RSVP overtimer chart */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="col-span-3 hover:shadow-xl transition-shadow duration-50"
            >
              <Card>
                <CardHeader>
                  <CardTitle>RSVP Distribution</CardTitle>
                  <CardDescription>Distribution of RSVP responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <RsvpDistribution />
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