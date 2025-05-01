"use client"

import { useState, useEffect } from "react"
import { CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventFilters from '@/pages/Admin/EventManagement/components/EventFilters.jsx';
import EventTable from '@/pages/Admin/EventManagement/components/EventTable.jsx';
import Pagination from '@/components/shared/Pagination.jsx';
import EventModal from '@/pages/Admin/EventManagement/components/EventModal.jsx';
import EventDetailsModal from '@/pages/Admin/EventManagement/components/EventDetailsModal.jsx';

// Import components

// Mock data for demonstration
const mockEvents = Array(50)
  .fill()
  .map((_, i) => ({
    _id: `event_${i + 1}`,
    title: `Event ${i + 1}`,
    description: `This is a description for event ${i + 1}. It contains details about what the event is about, where it will be held, and other important information.`,
    type:
      i % 5 === 0
        ? "SOCIAL"
        : i % 5 === 1
          ? "EDUCATION"
          : i % 5 === 2
            ? "BUSINESS"
            : i % 5 === 3
              ? "ENTERTAINMENT"
              : "OTHER",
    startDate: new Date(2023, i % 12, (i % 28) + 1),
    endDate: new Date(2023, i % 12, (i % 28) + 3),
    location: `Location ${i + 1}, City ${i % 10}`,
    images: i % 3 === 0 ? [`/placeholder.svg?text=Event${i + 1}`] : [],
    organizer: {
      _id: `user_${(i % 10) + 1}`,
      name: `Organizer ${(i % 10) + 1}`,
      avatar: `/placeholder.svg?text=O${(i % 10) + 1}`,
    },
    participants: Array((i % 8) + 1)
      .fill()
      .map((_, j) => ({
        userId: {
          _id: `user_${(j % 20) + 1}`,
          name: `User ${(j % 20) + 1}`,
          avatar: `/placeholder.svg?text=U${(j % 20) + 1}`,
        },
        status: j % 3 === 0 ? "GOING" : j % 3 === 1 ? "NOT_GOING" : "PENDING",
        invitedAt: new Date(2023, (i % 12) - 1, (i % 28) + 1),
        respondedAt: j % 3 === 2 ? null : new Date(2023, (i % 12) - 1, (i % 28) + 2),
        isDeleted: false,
      })),
    isPublic: i % 4 !== 0,
    createdAt: new Date(2023, (i % 12) - 1, 1),
    updatedAt: new Date(2023, i % 12, 1),
    isDeleted: i % 10 === 0,
  }))

const mockUsers = Array(10)
  .fill()
  .map((_, i) => ({
    _id: `user_${i + 1}`,
    name: `User ${i + 1}`,
    avatar: `/placeholder.svg?text=U${i + 1}`,
  }))

const EventManagement = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const eventsPerPage = 10

  // Fetch events on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents)
      setFilteredEvents(mockEvents)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter events when search term or filters change
  useEffect(() => {
    let result = [...events]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        // Active events: not deleted and not ended
        result = result.filter((event) => !event.isDeleted && new Date() <= new Date(event.endDate))
      } else if (statusFilter === "deleted") {
        // Deleted events
        result = result.filter((event) => event.isDeleted)
      } else if (statusFilter === "ended") {
        // Ended events: not deleted but end date is in the past
        result = result.filter((event) => !event.isDeleted && new Date() > new Date(event.endDate))
      }
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((event) => event.type === typeFilter)
    }

    setFilteredEvents(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, statusFilter, typeFilter, events])

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle event creation
  const handleCreateEvent = (formData) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Get organizer from form data
      const organizerId = formData.get("organizer")
      const organizer = organizerId
        ? mockUsers.find((user) => user._id === organizerId)
        : {
          _id: "user_1",
          name: "Current Admin",
          avatar: "/placeholder.svg?text=A",
        }

      // Create new event object
      const newEvent = {
        _id: `event_${events.length + 1}`,
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        startDate: new Date(formData.get("startDate")),
        endDate: new Date(formData.get("endDate")),
        location: formData.get("location"),
        isPublic: formData.get("isPublic") === "true",
        images: [],
        organizer: organizer,
        participants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      }

      // Add to events list
      setEvents([newEvent, ...events])
      setIsCreateModalOpen(false)
      setIsSubmitting(false)
      alert("Event created successfully!")
    }, 1500)
  }

  // Handle event update
  const handleUpdateEvent = (formData, eventId) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Update event in the list
      setEvents(
        events.map((event) => {
          if (event._id === eventId) {
            return {
              ...event,
              title: formData.get("title"),
              description: formData.get("description"),
              type: formData.get("type"),
              startDate: new Date(formData.get("startDate")),
              endDate: new Date(formData.get("endDate")),
              location: formData.get("location"),
              isPublic: formData.get("isPublic") === "true",
              updatedAt: new Date(),
            }
          }
          return event
        }),
      )

      setIsEditModalOpen(false)
      setIsSubmitting(false)
      alert("Event updated successfully!")
    }, 1500)
  }

  // Handle event deletion (soft delete)
  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(
        events.map((event) => (event._id === eventId ? { ...event, isDeleted: true, updatedAt: new Date() } : event)),
      )
    }
  }

  // Handle event restoration
  const handleRestoreEvent = (eventId) => {
    if (window.confirm("Are you sure you want to restore this event?")) {
      setEvents(
        events.map((event) => (event._id === eventId ? { ...event, isDeleted: false, updatedAt: new Date() } : event)),
      )
    }
  }

  // Handle view event details
  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    setIsDetailsModalOpen(true)
  }

  // Handle edit event
  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setIsEditModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Event Management</h1>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <Button className="whitespace-nowrap mt-4 md:mt-0" onClick={() => setIsCreateModalOpen(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Events Table */}
      <EventTable
        events={currentEvents}
        isLoading={isLoading}
        handleDeleteEvent={handleDeleteEvent}
        handleRestoreEvent={handleRestoreEvent}
        handleViewEvent={handleViewEvent}
        handleEditEvent={handleEditEvent}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        totalItems={filteredEvents.length}
        itemsPerPage={eventsPerPage}
        itemName="events"
      />

      {/* Modals */}
      <EventModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        onSubmit={handleCreateEvent}
        isLoading={isSubmitting}
        users={mockUsers}
      />

      <EventModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        event={selectedEvent}
        onSubmit={handleUpdateEvent}
        isLoading={isSubmitting}
        users={mockUsers}
      />

      <EventDetailsModal isOpen={isDetailsModalOpen} setIsOpen={setIsDetailsModalOpen} event={selectedEvent} />
    </div>
  )
}

export default EventManagement
