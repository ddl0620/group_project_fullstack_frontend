import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from 'lucide-react'

export function EventVisibilityDisplay({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white">
        <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
          <CardTitle className="text-sm sm:text-base md:text-lg">Event Visibility</CardTitle>
          <CardDescription className="text-[10px] sm:text-xs">
            Distribution of public vs private events
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="h-[180px] sm:h-[200px] flex items-center justify-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground">No event visibility data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.total, 0)

  // Find public and private counts
  const publicEvents = data.find(item => item.name.toLowerCase() === "public")?.total || 0
  const privateEvents = data.find(item => item.name.toLowerCase() === "private")?.total || 0

  // Calculate percentages
  const publicPercentage = total > 0 ? Math.round((publicEvents / total) * 100) : 0
  const privatePercentage = total > 0 ? Math.round((privateEvents / total) * 100) : 0

  return (
    <Card className="bg-white">
      <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
        <CardTitle className="text-sm sm:text-base md:text-lg">Event Visibility</CardTitle>
        <CardDescription className="text-[10px] sm:text-xs">
          Distribution of public vs private events
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="text-lg font-bold">{total}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Public Events</p>
                  <p className="text-xs text-muted-foreground">Visible to all users</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{publicEvents}</p>
                <p className="text-xs text-blue-500">{publicPercentage}% of total</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Private Events</p>
                  <p className="text-xs text-muted-foreground">Visible to invited users only</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{privateEvents}</p>
                <p className="text-xs text-indigo-500">{privatePercentage}% of total</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {publicPercentage > privatePercentage
                ? `Most events (${publicPercentage}%) are public, allowing broader participation.`
                : `Most events (${privatePercentage}%) are private, suggesting more exclusive gatherings.`
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

