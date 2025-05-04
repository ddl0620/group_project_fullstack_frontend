"use client"

import { useState } from "react"
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

export default function AdminDashboard() {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  const [interval, setInterval] = useState("daily")

  // Sample data for numeric cards
  const numericData = [
    {
      title: "Total Invitations",
      value: 1248,
      percentage: 20.1, // Positive percentage indicates an increase
      icon: <Mail className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "RSVP Accepted",
      value: 842,
      percentage: 18.2, // Positive percentage indicates an increase
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "RSVP Pending",
      value: 329,
      percentage: -4.5, // Negative percentage indicates a decrease
      icon: <User className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Response Rate",
      value: "73.8%",
      percentage: 5.2, // Positive percentage indicates an increase
      icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
    },
  ]

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
                  variants={fadeIn}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
                      {data.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.value}</div>
                      <p
                        className={`text-xs font-medium ${
                          data.percentage >= 0
                            ? "text-green-500"
                            : "text-red-500"
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
                variants={fadeIn}
                className="col-span-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Invitations Over Time</CardTitle>
                    <CardDescription>
                      Number of invitations sent {interval === "daily" ? "per day" : "per week"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview interval={interval} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* RSVP overtimer chart */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeIn}
                className="col-span-3"
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
            </div>

            {/* Recipent table section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeIn}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
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
              variants={fadeIn}
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
              variants={fadeIn}
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
          </TabsContent>
                    {/* RECIPENTS TAB */}
          <TabsContent value="recipients" className="space-y-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeIn}
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
              variants={fadeIn}
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
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}