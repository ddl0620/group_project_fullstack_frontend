"use client"

// src/pages/DiscussionPage.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import EventSidebar from "./components/EventSidebar.jsx"
import DiscussionThreadList from "./DiscussionPost/DiscussionThreadList.jsx"
import { useEvent } from "@/hooks/useEvent.js"
import { useSelector } from "react-redux"
import { Loader2 } from "lucide-react"

const DiscussionPage = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { getAllJoinedEvents, getMyEvents } = useEvent()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const currentUserId = useSelector((state) => state.user.id)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await getAllJoinedEvents(currentPage, 10, true)
        const tmp = await getMyEvents({ page: currentPage, limit: 10, isAcs: true })

        response.content.events = [...response.content.events, ...tmp]

        const validEvents = []
        for (const event of response.content.events) {
          if (event.organizer === currentUserId) {
            validEvents.push(event)
            continue
          }
          for (const participant of event.participants) {
            if (participant.userId === currentUserId && participant.status === "ACCEPTED") {
              validEvents.push(event)
              break
            }
          }
        }
        setEvents(validEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (eventId) {
      const event = events.find((e) => e._id === eventId)
      if (event) {
        setSelectedEvent(event)
      }
    } else if (events.length > 0) {
      setSelectedEvent(events[0])
      navigate(`/discussions/${events[0]._id}`)
    }
  }, [eventId, events, navigate])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-gray-600">Loading discussions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 rouned-full m-2">
      <EventSidebar events={events} selectedEventId={selectedEvent?._id} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedEvent ? (
          <DiscussionThreadList eventId={selectedEvent._id} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <div className="rounded-full bg-gray-100 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">No Event Selected</h2>
            <p className="max-w-md text-center text-gray-500">
              Select an event from the sidebar to view discussions or join more events to participate in conversations.
            </p>
            {events.length === 0 && (
              <button
                onClick={() => navigate("/browse-events")}
                className="mt-4 rounded-md bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90"
              >
                Browse Events
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionPage
