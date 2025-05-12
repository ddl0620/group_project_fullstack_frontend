import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js"
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function EventsByDateDisplay({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white">
        <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
          <CardTitle className="text-sm sm:text-base md:text-lg">Events by Date</CardTitle>
          <CardDescription className="text-[10px] sm:text-xs">Number of events created per day</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="h-[180px] sm:h-[200px] flex items-center justify-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground">No event data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort data by date (most recent first)
  const sortedData = [...data].sort((a, b) => new Date(b.name) - new Date(a.name))

  // Take only the most recent entries
  const recentData = sortedData.slice(0, 7)

  // Calculate total and average
  const total = data.reduce((sum, item) => sum + item.total, 0)
  const average = Math.round(total / data.length)

  // Find highest and lowest days
  const highest = [...data].sort((a, b) => b.total - a.total)[0]
  const lowest = [...data].sort((a, b) => a.total - b.total)[0]

  return (
    <Card className="bg-white">
      <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
        <CardTitle className="text-sm sm:text-base md:text-lg">Events by Date</CardTitle>
        <CardDescription className="text-[10px] sm:text-xs">Number of events created per day</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Events</p>
              <p className="text-lg font-bold">{total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Daily Average</p>
              <p className="text-lg font-bold">{average}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Most Active Day</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium">{highest?.name || "N/A"}</p>
              <p className="text-sm font-bold text-blue-500">{highest?.total || 0} events</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Least Active Day</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium">{lowest?.name || "N/A"}</p>
              <p className="text-sm font-bold text-gray-500">{lowest?.total || 0} events</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Recent Activity</p>
            <div className="space-y-2">
              {recentData.map((item, index) => {
                // Determine trend compared to average
                let TrendIcon = Minus
                let trendColor = "text-gray-500"

                if (item.total > average) {
                  TrendIcon = TrendingUp
                  trendColor = "text-green-500"
                } else if (item.total < average) {
                  TrendIcon = TrendingDown
                  trendColor = "text-red-500"
                }

                return (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <p className="text-xs">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-medium">{item.total} events</p>
                      <TrendIcon className={`h-3 w-3 ${trendColor}`} />
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

