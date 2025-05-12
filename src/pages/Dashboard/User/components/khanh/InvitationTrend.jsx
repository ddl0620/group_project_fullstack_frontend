import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

export function InvitationTrend({ data }) {
  // Ensure data exists and has the expected format
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invitations Over Time</CardTitle>
          <CardDescription>Recent invitation activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort data by date (most recent first)
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Take only the most recent 5 entries
  const recentData = sortedData.slice(0, 5)

  // Calculate total invitations
  const totalInvitations = data.reduce((sum, item) => sum + item.invitations, 0)

  // Calculate average invitations per day
  const avgInvitations = Math.round(totalInvitations / data.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations Over Time</CardTitle>
        <CardDescription>Recent invitation activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total Invitations</p>
              <p className="text-2xl font-bold">{totalInvitations}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Daily Average</p>
              <p className="text-2xl font-bold">{avgInvitations}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium">Recent Activity</h4>
            <div className="space-y-3">
              {recentData.map((item, index) => {
                const date = new Date(item.date)
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })

                // Determine if this day had more or fewer invitations than average
                let icon = <Minus className="h-4 w-4 text-gray-500" />
                let textColor = "text-gray-500"

                if (item.invitations > avgInvitations) {
                  icon = <ArrowUp className="h-4 w-4 text-green-500" />
                  textColor = "text-green-500"
                } else if (item.invitations < avgInvitations) {
                  icon = <ArrowDown className="h-4 w-4 text-red-500" />
                  textColor = "text-red-500"
                }

                return (
                  <div key={index} className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">{formattedDate}</span>
                    <div className="flex items-center gap-1">
                      {icon}
                      <span className={`text-sm font-medium ${textColor}`}>{item.invitations} invitations</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
