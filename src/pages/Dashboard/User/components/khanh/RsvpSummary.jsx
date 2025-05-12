import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

export function RsvpSummary({ data }) {
  // Ensure data exists and has the expected format
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RSVP Distribution</CardTitle>
          <CardDescription>Distribution of RSVP responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate total responses
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSVP Distribution</CardTitle>
        <CardDescription>Distribution of RSVP responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0

            // Determine badge color based on status
            let badgeVariant = "default"
            let badgeClass = ""
            let icon = <Minus className="h-3 w-3" />

            if (item.status === "Accepted" || item.name === "Accepted") {
              badgeVariant = "success"
              badgeClass = "bg-green-600 text-white"
              icon = <ArrowUp className="h-3 w-3" />
            } else if (item.status === "Declined" || item.name === "Declined") {
              badgeVariant = "destructive"
              badgeClass = "bg-red-600 text-white"
              icon = <ArrowDown className="h-3 w-3" />
            } else if (item.status === "Pending" || item.name === "Pending") {
              badgeVariant = "warning"
              badgeClass = "bg-yellow-300 text-gray-800"
            }

            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={badgeVariant} className={badgeClass}>
                    {item.status || item.name}
                  </Badge>
                  <span className="text-sm font-medium">{item.value} responses</span>
                </div>
                <div className="flex items-center gap-1">
                  {icon}
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              </div>
            )
          })}

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Responses</span>
              <span className="font-bold">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
