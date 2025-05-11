import { Bell } from "lucide-react"

export function EmptyState({ title = "No notifications", description = "You don't have any notifications yet" }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 sm:py-12">
      <div className="rounded-full bg-gray-100 p-4">
        <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
      </div>
      <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium">{title}</h3>
      <p className="mt-1 sm:mt-2 text-center text-xs sm:text-sm text-gray-500">{description}</p>
    </div>
  )
}
