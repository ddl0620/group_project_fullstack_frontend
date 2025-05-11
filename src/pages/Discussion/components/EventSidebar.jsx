"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Calendar, MapPin, Users, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx'

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
        isCollapsed ? "w-12 sm:w-16" : "w-64 sm:w-80"
      }`}
    >
      <div className={`relative border-b border-gray-200 ${isCollapsed ? "p-1 sm:p-2" : "p-2 sm:p-4"}`}>
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-1 sm:gap-2">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold text-gray-800">Discussions</h2>
            </div>
            <div className="relative mt-2 sm:mt-4">
              <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                className="w-full h-7 sm:h-9 text-xs sm:text-sm pl-7 sm:pl-9"
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 sm:h-10 sm:w-10 p-1 sm:p-2"
                    onClick={() => setIsCollapsed(false)}
                  >
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs sm:text-sm">Expand Sidebar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white shadow-sm h-6 w-6 sm:h-8 sm:w-8 p-0.5 sm:p-1"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {currentEvents.length > 0 ? (
          <ul className={`${isCollapsed ? "space-y-1 sm:space-y-2 p-1 sm:p-2" : "divide-y divide-gray-200"}`}>
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
                        <div className="p-1 sm:p-2 flex justify-center">
                          <CustomAvatar
                            src={event.images[0]}
                            fallbackText={event.title}
                            alt={event.title}
                            className="h-8 w-8 sm:h-10 sm:w-10"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs text-xs sm:text-sm">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-[10px] sm:text-xs flex items-center mt-1">
                            <Calendar className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            {new Date(event.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] sm:text-xs flex items-center mt-1">
                            <MapPin className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            {event.location || "No location"}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="p-2 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CustomAvatar
                          src={event.images[0]}
                          fallbackText={event.title}
                          alt={event.title}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        />

                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1 text-xs sm:text-sm">{event.title}</h3>
                          <p className="text-[10px] sm:text-xs text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {selectedEventId === event._id && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] sm:text-xs px-1 sm:px-2 h-4 sm:h-5">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 sm:mt-2 ml-10 sm:ml-12 flex flex-wrap gap-1 sm:gap-2">
                      <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
                        <MapPin className="mr-0.5 sm:mr-1 h-2 w-2 sm:h-3 sm:w-3" />
                        <span className="truncate max-w-[100px] sm:max-w-[150px]">{event.location || "No location"}</span>
                      </div>
                      <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
                        <Users className="mr-0.5 sm:mr-1 h-2 w-2 sm:h-3 sm:w-3" />
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
          <div className="flex flex-col items-center justify-center h-40 p-2 sm:p-4 text-center text-gray-500">
            <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mb-1 sm:mb-2" />
            {searchTerm ? (
              <>
                <p className="font-medium text-xs sm:text-sm">No events found</p>
                <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="font-medium text-xs sm:text-sm">No events available</p>
                <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Join events to see discussions</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination for sidebar */}
      {!isCollapsed && totalPages > 1 && (
        <div className="border-t border-gray-200 p-1 sm:p-2">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-[10px] sm:text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed pagination */}
      {isCollapsed && totalPages > 1 && (
        <div className="border-t border-gray-200 p-1 sm:p-2 flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 mb-0.5 sm:mb-1"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs sm:text-sm">Previous Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-[10px] sm:text-xs text-gray-500 py-0.5 sm:py-1">
            {currentPage}/{totalPages}
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 mt-0.5 sm:mt-1"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs sm:text-sm">Next Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}

export default EventSidebar
