"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';

const EventSidebar = ({ events, selectedEventId }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage, setEventsPerPage] = useState(5)

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))

  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  // Function to get initials from event title
  const getInitials = (title) => {
    return title
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  // Function to get a color based on event id (for consistent colors)
  const getAvatarColor = (id) => {
    const colors = [
      "bg-rose-500",
      "bg-sky-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-violet-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]

    // Use the sum of char codes to determine color
    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[sum % colors.length]
  }

  const handleEventClick = (eventId) => {
    navigate(`/discussions/${eventId}`)
    if (window.innerWidth < 768) {
      setIsCollapsed(true)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div
      className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-80"
      }`}
    >
      <div className={`relative border-b border-gray-200 ${isCollapsed ? "p-2" : "p-4"}`}>
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-800">Discussions</h2>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsCollapsed(false)}>
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand Sidebar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {currentEvents.length > 0 ? (
          <ul className={`${isCollapsed ? "space-y-2 p-2" : "divide-y divide-gray-200"}`}>
            {currentEvents.map((event) => (
              <li
                key={event._id}
                className={`cursor-pointer transition-colors ${isCollapsed ? "rounded-md" : ""} ${
                  selectedEventId === event._id
                    ? isCollapsed
                      ? "bg-primary/10"
                      : "bg-primary/5"
                    : isCollapsed
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-50"
                }`}
                onClick={() => handleEventClick(event._id)}
              >
                {isCollapsed ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-2 flex justify-center">
                          <CustomAvatar src={event.images[0]} fallbackText={event.title} alt={event.title} className="h-10 w-10" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-xs flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(event.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location || "No location"}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CustomAvatar src={event.images[0]} fallbackText={event.title} alt={event.title} className="h-10 w-10" />

                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1">{event.title}</h3>
                          <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {selectedEventId === event._id && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 ml-12 flex flex-wrap gap-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span className="truncate max-w-[150px]">{event.location || "No location"}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="mr-1 h-3 w-3" />
                        <span>
                          {event.participants?.filter((p) => p.status === "ACCEPTED").length || 0} participants
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 p-4 text-center text-gray-500">
            <Search className="h-8 w-8 text-gray-300 mb-2" />
            {searchTerm ? (
              <>
                <p className="font-medium">No events found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="font-medium">No events available</p>
                <p className="text-sm mt-1">Join events to see discussions</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination for sidebar */}
      {!isCollapsed && totalPages > 1 && (
        <div className="border-t border-gray-200 p-2">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed pagination */}
      {isCollapsed && totalPages > 1 && (
        <div className="border-t border-gray-200 p-2 flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mb-1"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Previous Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-xs text-gray-500 py-1">
            {currentPage}/{totalPages}
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mt-1"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Next Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}

export default EventSidebar
