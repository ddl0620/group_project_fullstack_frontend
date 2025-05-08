"use client"

import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import SectionTitle from "../../ProfilePage/SectionTitle.jsx"
import Button from "../../../components/shared/SubmitButton.jsx"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { SettingsIcon, Loader2 } from "lucide-react"
import Pagination from "@/components/shared/Pagination.jsx"
import { useEvent } from "@/hooks/useEvent.js"
import { AlertDialogUtils } from "@/helpers/AlertDialogUtils.jsx"
import { EventCard } from "@/components/shared/EventCard.jsx"
import EventFilters from "@/components/shared/EventFilters.jsx"
import useEventFiltering from "@/hooks/useEventFiltering.js"

const ITEMS_PER_PAGE = 9

function MyOrganizedEvents() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getMyEvents, deleteEvent, loading, error } = useEvent()
  const myEvents = useSelector((state) => state.event.myEvents)
  const [selectedEvent, setSelectedEvent] = useState(null)

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
        await getMyEvents({
          page: 1,
          limit: 1000,
          isAcs: sortBy === "oldest",
        })
      } catch (err) {
        console.error("Error fetching events:", err)
      }
    }
    fetchEvents()
  }, [])

  const handleEventSelect = (event) => {
    setSelectedEvent(event)
  }

  const handleEditButton = (eventId) => {
    navigate(`/event/update/${eventId}`)
  }

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

  const handleLinkClick = (e) => {
    if (location.pathname === "/events") {
      e.preventDefault()
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top of page
  }

  // Calculate pagination
  const paginatedEvents = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredEvents.slice(startIndex, endIndex)
  }, [filteredEvents, currentPage])

  // Calculate total pages
  const totalPages = React.useMemo(() => {
    return Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
  }, [filteredEvents])

  return (
    <div className="h-auto min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="my-5">
            <SectionTitle title={"Organized Events"} subtitle={"List of events you have created"} />
          </div>
          <Link to="/event/create" onClick={handleLinkClick}>
            <Button className={"bg-black text-white"}>
              <PlusCircleIcon className="h-5 w-5" />
              Create new
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
          showVisibilityFilter={false} // Hide visibility filter for own events
        />

        {loading && (
          <div className="flex justify-center py-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500">Loading events...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              actions={[
                {
                  button: (
                    <Button className="flex items-center gap-2 border border-green-500 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white">
                      <SettingsIcon className="h-5 w-5 text-green-700" />
                      Manage
                    </Button>
                  ),
                  onClick: () => navigate("/event/" + event._id),
                },
              ]}
            />
          ))}
        </div>

        {!loading && filteredEvents.length === 0 && (
          <div className="mt-8 rounded-lg bg-white py-16 text-center shadow-sm">
            <PlusCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-500">
              {searchTerm || selectedTypes.length > 0
                ? "No events found matching your filters"
                : "No events found. Create your first event!"}
            </p>
            <Link to="/event/create" onClick={handleLinkClick} className="mt-4 inline-block">
              <Button className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700">
                <PlusCircleIcon className="h-5 w-5" />
                <span>Create New Event</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredEvents.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredEvents.length}
              itemsPerPage={ITEMS_PER_PAGE}
              itemName="events"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(MyOrganizedEvents)
