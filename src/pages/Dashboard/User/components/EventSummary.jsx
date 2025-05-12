import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.js"
import { CalendarIcon, Users, Clock, CheckCircle, XCircle } from "lucide-react"

export function EventSummary({ data }) {
  // Sample data structure if real data is not available
  const eventData = data || {
    upcomingEvents: 3,
    totalAttendees: 127,
    averageResponseTime: "2.5 days",
    acceptanceRate: "78%",
    declineRate: "22%",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Summary</CardTitle>
        <CardDescription>Overview of your events and attendees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 rounded-md border p-3">
              <div className="rounded-full bg-blue-50 p-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-lg font-bold">{eventData.upcomingEvents}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-md border p-3">
              <div className="rounded-full bg-green-50 p-2">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
                <p className="text-lg font-bold">{eventData.totalAttendees}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 rounded-md border p-3">
            <div className="rounded-full bg-amber-50 p-2">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Response Time</p>
              <p className="text-lg font-bold">{eventData.averageResponseTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 rounded-md border p-3">
              <div className="rounded-full bg-green-50 p-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                <p className="text-lg font-bold">{eventData.acceptanceRate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-md border p-3">
              <div className="rounded-full bg-red-50 p-2">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Decline Rate</p>
                <p className="text-lg font-bold">{eventData.declineRate}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
