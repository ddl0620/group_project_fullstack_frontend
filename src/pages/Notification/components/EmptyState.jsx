import { Bell } from "lucide-react"

export function EmptyState({ title = "No notifications", description = "You don't have any notifications yet" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-gray-100 p-4">
        <Bell className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-center text-sm text-gray-500">{description}</p>
    </div>
  )
}
