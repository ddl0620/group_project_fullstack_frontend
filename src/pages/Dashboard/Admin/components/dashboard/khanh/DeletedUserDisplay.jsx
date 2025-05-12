import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar } from 'lucide-react'

export function DeletedUsersDisplay({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white">
        <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
          <CardTitle className="text-sm sm:text-base md:text-lg">Deleted Users</CardTitle>
          <CardDescription className="text-[10px] sm:text-xs">Users who have deleted their accounts</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="h-[180px] sm:h-[200px] flex items-center justify-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground">No deleted users in this period</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate total deleted users
  const totalDeleted = data.reduce((sum, item) => sum + item.count, 0)

  // Sort by date (most recent first)
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Find day with most deletions
  const highestDeletion = [...data].sort((a, b) => b.count - a.count)[0]

  return (
    <Card className="bg-white">
      <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
        <CardTitle className="text-sm sm:text-base md:text-lg">Deleted Users</CardTitle>
        <CardDescription className="text-[10px] sm:text-xs">Users who have deleted their accounts</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Deleted Users</p>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <p className="text-lg font-bold">{totalDeleted}</p>
            </div>
          </div>

          {highestDeletion && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Highest Deletion Day</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <p className="text-sm font-medium">{new Date(highestDeletion.date).toLocaleDateString()}</p>
                <p className="text-sm font-bold text-red-500">{highestDeletion.count} users</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium">Recent Deletions</p>
            <div className="space-y-2">
              {sortedData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <p className="text-xs">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium">{item.count} users</p>
                    {item.count > 1 && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {totalDeleted > 10
                ? "Consider investigating reasons for account deletions to improve retention."
                : "Account deletion rate appears normal for this period."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

