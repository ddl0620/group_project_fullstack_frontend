"use client"

import { useState, useEffect, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { PlusCircle, Settings, Loader2, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Pagination from "@/components/shared/Pagination.jsx"
import { useEvent } from "@/hooks/useEvent.js"
import { AlertDialogUtils } from "@/helpers/AlertDialogUtils.jsx"
import { EventCard } from "@/components/shared/EventCard.jsx"
import EventFilters from "@/components/shared/EventFilters.jsx"
import useEventFiltering from "@/hooks/useEventFiltering.js"

const ITEMS_PER_PAGE = 9

export default function MyOrganizedEvents() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getMyEvents, deleteEvent } = useEvent()
  const myEvents = useSelector((state) => state.event.myEvents)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Use the custom hook for filtering
  const {
    searchTerm,
    setSearchTerm,
    visibilityFilter,
    setVisibilityFilter,
    selectedTypes,
    setSelectedTypes,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    filteredEvents,
    clearFilters,
  } = useEventFiltering(myEvents)

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        await getMyEvents({
          page: 1,
          limit: 1000,
          isAcs: sortBy === "oldest",
        })
      } catch (err) {
        setError(err.message || "Error fetching events")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleRemoveEvent = async (id) => {
    const confirmed = await AlertDialogUtils.warning({
      title: "Delete Event?",
      description: "Are you sure you want to delete this event? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (!confirmed) return
    await deleteEvent(id)
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top of page
  }

  // Calculate pagination
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredEvents.slice(startIndex, endIndex)
  }, [filteredEvents, currentPage])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
  }, [filteredEvents])

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-full">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Organized Events</h1>
            <p className="mt-1 text-gray-500">Events you have created and are managing</p>
          </div>

          <Link to="/event/create">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Event Filters Component */}
        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          visibilityFilter={visibilityFilter}
          setVisibilityFilter={setVisibilityFilter}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearFilters={clearFilters}
          showVisibilityFilter={true} // Show visibility filter for organized events
        />

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
            <h3 className="flex items-center gap-2 font-medium">
              <X className="h-5 w-5" />
              Error loading events
            </h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && paginatedEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                actions={[
                  {
                    button: (
                      <Button onClick={() => navigate(`/event/${event._id}`)} className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Manage
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
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <Calendar className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No organized events found</h3>
            <p className="mt-1 text-center text-gray-500">
              {searchTerm || visibilityFilter !== "all" || selectedTypes.length > 0
                ? "No events found matching your filters"
                : "You haven't created any events yet"}
            </p>
            <Link to="/event/create" className="mt-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-8 w-full">
            <div className="max-w-full overflow-hidden">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredEvents.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="events"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
