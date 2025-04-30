"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEvent } from "@/hooks/useEvent"
import { toast } from "sonner"
import { PlusCircle, Eye, Calendar, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { EventCard } from '@/components/shared/EventCard.jsx';

const itemPerPage = 9

export default function MyJoinedEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: itemPerPage,
    totalPages: 1,
    totalEvents: 0,
  })

  const { getAllJoinedEvents } = useEvent()
  const location = useLocation()
  const navigate = useNavigate()

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getAllJoinedEvents({
          page: currentPage,
          limit: itemPerPage,
          isAcs: true,
        })
        setEvents(response.content.events || [])
        setPagination({
          page: response.content.pagination.page || 1,
          limit: response.content.pagination.limit || itemPerPage,
          totalPages: response.content.pagination.totalPages || 1,
          totalEvents: response.content.pagination.totalEvents || 0,
        })
      } catch (err) {
        toast.error("Error fetching events: " + err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [currentPage])

  const handleChangeCurrentPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleShowEvent = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  const handleLinkClick = (e) => {
    if (location.pathname === "/events") {
      e.preventDefault()
    }
  }

  // Calculate pagination display values
  const startIndex = (pagination.page - 1) * pagination.limit + 1
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.totalEvents)

  // Generate page numbers for display
  const getPageNumbers = () => {
    const maxPagesToShow = 5
    const pages = []
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Add pages and ellipsis if needed
    if (startPage > 1) {
      pages.push({ type: "page", value: 1 })
      if (startPage > 2) {
        pages.push({ type: "ellipsis", value: "left" })
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push({ type: "page", value: i })
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push({ type: "ellipsis", value: "right" })
      }
      pages.push({ type: "page", value: pagination.totalPages })
    }

    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Joined Events</h1>
            <p className="mt-1 text-gray-500">Events you have joined and are participating in</p>
          </div>

          <Link to="/event/create">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <h3 className="flex items-center gap-2 font-medium">Error loading events</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                actions={[
                  {
                    button: (
                      <Button onClick={() => handleShowEvent(event._id)} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    ),
                    onClick: () => {},
                  },
                ]}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <Calendar className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No joined events found</h3>
            <p className="mt-1 text-center text-gray-500">You haven't joined any events yet</p>
            <Link to="/browse-events" className="mt-4">
              <Button>Browse Events</Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && events.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex}-{endIndex} of {pagination.totalEvents} events
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handleChangeCurrentPage(pagination.page - 1)}
                    className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {getPageNumbers().map((item, index) =>
                  item.type === "page" ? (
                    <PaginationItem key={item.value}>
                      <PaginationLink
                        onClick={() => handleChangeCurrentPage(item.value)}
                        isActive={pagination.page === item.value}
                        className={pagination.page === item.value ? "bg-primary text-white" : "cursor-pointer"}
                      >
                        {item.value}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`ellipsis-${item.value}-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handleChangeCurrentPage(pagination.page + 1)}
                    className={
                      pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
