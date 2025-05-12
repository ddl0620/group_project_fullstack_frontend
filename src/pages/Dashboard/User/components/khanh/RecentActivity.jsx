import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentActivity({ recipients }) {
  // Ensure data exists and has the expected format
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest RSVP responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort by responded date (most recent first)
  const sortedRecipients = [...recipients]
    .filter((r) => r.respondedAt) // Only include those who have responded
    .sort((a, b) => new Date(b.respondedAt) - new Date(a.respondedAt))
    .slice(0, 5) // Take only the 5 most recent

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest RSVP responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedRecipients.length > 0 ? (
            sortedRecipients.map((recipient, index) => {
              // Determine badge color based on RSVP status
              let badgeVariant = "default"
              let badgeClass = ""

              if (recipient.rsvp === "Accepted") {
                badgeVariant = "success"
                badgeClass = "bg-green-600 text-white"
              } else if (recipient.rsvp === "Declined") {
                badgeVariant = "destructive"
                badgeClass = "bg-red-600 text-white"
              } else if (recipient.rsvp === "Pending") {
                badgeVariant = "warning"
                badgeClass = "bg-yellow-300 text-gray-800"
              }

              return (
                <div key={index} className="flex items-center space-x-4 rounded-md border p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={recipient.avatar || "/placeholder.svg"} alt={recipient.name} />
                    <AvatarFallback>
                      {recipient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{recipient.name}</p>
                    <p className="text-xs text-muted-foreground">{recipient.email}</p>
                  </div>
                  <Badge variant={badgeVariant} className={badgeClass}>
                    {recipient.rsvp}
                  </Badge>
                </div>
              )
            })
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No recent responses</p>
            </div>
          )}

          {sortedRecipients.length > 0 && (
            <div className="pt-2 text-center">
              <button className="text-sm text-blue-500 hover:text-blue-700 font-medium">View all activity</button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
