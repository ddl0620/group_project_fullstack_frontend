"use client"

import { Edit, Trash2, RefreshCw, Eye, Calendar, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

export default function EventTable({
                                     events,
                                     isLoading,
                                     handleDeleteEvent,
                                     handleRestoreEvent,
                                     handleViewEvent,
                                     handleEditEvent,
                                   }) {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A"
    return format(new Date(date), "MMM d, yyyy")
  }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Get event type display name
  const getEventTypeDisplay = (type) => {
    const typeMap = {
      SOCIAL: "Social",
      EDUCATION: "Education",
      BUSINESS: "Business",
      ENTERTAINMENT: "Entertainment",
      OTHER: "Other",
    }
    return typeMap[type] || type
  }

  // Get event status
  const getEventStatus = (event) => {
    if (event.isDeleted) return { label: "Deleted", className: "bg-red-100 text-red-800" }
    if (new Date() > new Date(event.endDate)) return { label: "Ended", className: "bg-gray-100 text-gray-800" }
    return { label: "Active", className: "bg-green-100 text-green-800" }
  }

  // Render mobile card view for each event
  const renderMobileEventCard = (event) => (
    <div key={event._id} className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Badge>{getEventTypeDisplay(event.type)}</Badge>
        <div className={`flex items-center`}>
          {(() => {
            const status = getEventStatus(event)
            return (
              <>
                <div
                  className={`mr-1 h-2 w-2 rounded-full ${event.isDeleted ? "bg-red-500" : new Date() > new Date(event.endDate) ? "bg-gray-500" : "bg-green-500"}`}
                ></div>
                <span className="text-xs">{status.label}</span>
              </>
            )
          })()}
        </div>
      </div>

      <h3 className="mb-1 font-medium">{event.title}</h3>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          <span>{event.participants?.length || 0} participants</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
          <Edit className="h-4 w-4" />
        </Button>
        {event.isDeleted ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRestoreEvent(event._id)}
            className="text-green-600 hover:bg-green-50 hover:text-green-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteEvent(event._id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="mb-6">
      {/* Mobile view (cards) */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <div>{events.map(renderMobileEventCard)}</div>
        )}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Event
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Participants
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                Loading events...
              </td>
            </tr>
          ) : events.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                No events found
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event._id} className={event.isDeleted ? "bg-gray-50" : ""}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {event.images && event.images.length > 0 ? (
                        <img
                          src={event.images[0] || "/placeholder.svg"}
                          alt={event.title}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                          <Calendar className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge variant="outline">{getEventTypeDisplay(event.type)}</Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <div>{formatDate(event.startDate)}</div>
                  <div className="text-xs text-gray-400">to {formatDate(event.endDate)}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {(() => {
                    const status = getEventStatus(event)
                    return (
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${status.className}`}
                      >
                          {status.label}
                        </span>
                    )
                  })()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex -space-x-2">
                    {event.participants && event.participants.length > 0 ? (
                      <>
                        {event.participants.slice(0, 3).map((participant, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-white">
                            <AvatarImage
                              src={participant.userId.avatar || "/placeholder.svg"}
                              alt={participant.userId.name || ""}
                            />
                            <AvatarFallback>{getInitials(participant.userId.name || "")}</AvatarFallback>
                          </Avatar>
                        ))}
                        {event.participants.length > 3 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs">
                            +{event.participants.length - 3}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No participants</span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {event.isDeleted ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreEvent(event._id)}
                        className="text-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
