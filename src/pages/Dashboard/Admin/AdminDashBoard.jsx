"use client"

import { useState } from "react"
import { subDays } from "date-fns"
import { Mail, MessageSquare, Search, User, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/chart"
import { Input } from "./components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

// Import custom components
import { DatePickerWithRange } from "./components/DateRangePicker"
import { MainNav } from "./components/MainNav"
import { Overview } from "./components/Overview"
import { RecentRecipients } from "./components/RecentRecipients"
import { RsvpDistribution } from "./components/RsvpDistribution"
import { UserNav } from "./components/UserNav"

export default function AdminDashboard() {
    const [date, setDate] = useState({
        from: subDays(new Date(), 30),
        to: new Date(),
    })

    const [interval, setInterval] = useState("daily")

    return (
        <div className="flex min-h-screen flex-col">
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
                <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search recipients..." className="pl-8" />
                </div>
                <UserNav />
            </div>
            </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
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
            <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recipients">Recipients</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">RSVP Accepted</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">842</div>
                    <p className="text-xs text-muted-foreground">+18.2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">RSVP Pending</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">329</div>
                    <p className="text-xs text-muted-foreground">-4.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">73.8%</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                    </CardContent>
                </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
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
                <Card className="col-span-3">
                    <CardHeader>
                    <CardTitle>RSVP Distribution</CardTitle>
                    <CardDescription>Distribution of RSVP responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <RsvpDistribution />
                    </CardContent>
                </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                    <CardHeader>
                    <CardTitle>Recent Recipients</CardTitle>
                    <CardDescription>Recently invited recipients and their RSVP status</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <RecentRecipients />
                    </CardContent>
                </Card>
                </div>
            </TabsContent>
            <TabsContent value="recipients" className="space-y-4">
                <Card>
                <CardHeader>
                    <CardTitle>All Recipients</CardTitle>
                    <CardDescription>Manage all your event recipients</CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentRecipients fullTable={true} />
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
                <Card>
                <CardHeader>
                    <CardTitle>RSVP Trend</CardTitle>
                    <CardDescription>RSVP responses over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <Overview interval={interval} isRsvpTrend={true} />
                </CardContent>
                </Card>
            </TabsContent>
            </Tabs>
        </div>
        </div>
    )
}
