"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useInvitation } from "@/hooks/useInvitation"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Users,
  Timer,
  Edit,
  Trash2,
  MessageSquare,
  Heart,
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomAvatar } from "@/components/shared/CustomAvatar"
import ImageCarousel from "@/components/ImageCarousel"
import EventRequestManagement from "@/pages/Event/MyOrganizedEvents/EventRequestManagement"
import EventInvitationManagement from "@/pages/Event/MyOrganizedEvents/EventInvitationManagement"
import EventRSVP from "@/pages/Event/MyOrganizedEvents/EventRSVP"
import { AlertDialogUtils } from "@/helpers/AlertDialogUtils.jsx"
import { useEvent } from "@/hooks/useEvent.js"
import { formatDay } from "@/helpers/format.js"
import { UpdateIcon } from "@radix-ui/react-icons"
import { useSelector } from "react-redux"
import EmailInvite from '@/pages/Event/MyOrganizedEvents/EmailInvite.jsx';

export default function EventDetailsForOrganizer({ event }) {
  const navigate = useNavigate()
  const { fetchInvitationsByEventId } = useInvitation()
  const [activeTab, setActiveTab] = useState("details")
  const [pendingRequests, setPendingRequests] = useState(0)
  const { deleteEvent } = useEvent()
  const user = useSelector((state) => state.user.user)
  useEffect(() => {
    if (event?._id) {
      fetchInvitationsByEventId(event._id, 1, 10)

      // Calculate pending requests
      const pending = event.participants?.filter((participant) => participant.status === "PENDING").length || 0
      setPendingRequests(pending)
    }
  }, [event, fetchInvitationsByEventId])

  const handleEditEvent = () => {
    navigate(`/event/update/${event._id}`)
  }

  const handleDeleteEvent = async () => {
    const confirmed = await AlertDialogUtils.warning({
      title: "Delete Event?",
      description: "Are you sure you want to delete this event? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (!confirmed) return
    await deleteEvent(event._id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/discussions/${event._id}`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Discussions
            </Button>
            <Button onClick={handleEditEvent} variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button onClick={handleDeleteEvent} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <Badge className="bg-blue-500">Organizer</Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              {formatDay(event.startDate)} - {formatDay(event.endDate)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" />
              {event.location || "No location specified"}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-1 h-4 w-4" />
              {event.participants?.filter((p) => p.status === "ACCEPTED").length || 0} attendees
            </div>
          </div>
        </div>

        <div className="mb-6">
          <ImageCarousel images={event.images} />
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-5">
            <TabsTrigger value="details" className="text-base">
              Event Details
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-base">
              Requests
              {pendingRequests > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingRequests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="invitations" className="text-base">
              Invitations
            </TabsTrigger>
            <TabsTrigger value="rsvp" className="text-base">
              RSVP
            </TabsTrigger>
            <TabsTrigger value="email-invite" className="text-base">
              Email Invite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="mt-2 flex flex-wrap gap-2">
                    {event.isPublic ? (
                      <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700">
                        <Unlock className="h-3 w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700">
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    )}

                    <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700">
                      {event.type === "OTHERS" ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Online
                        </>
                      ) : (
                        <>
                          <Heart className="h-3 w-3" />
                          {event.type}
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="mb-2 text-lg font-semibold text-gray-800">About this event</h2>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                <div className="mb-6 flex items-center gap-3">
                  <CustomAvatar
                    src={user.avatar || ""}
                    fallbackText={user.avatar || "You"}
                    alt="Organizer"
                    className="h-10 w-10"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Hosted by</p>
                    <p className="font-medium">{user.name || "You"}</p>
                  </div>
                </div>
                <div className="mb-6 flex items-center gap-3 rounded-lg border bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-500">Notify user when:</p>
                    <p className="font-medium">{event.notifyWhen}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Date and Time */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">Date and Time</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">
                            {formatDay(event.startDate)} - {formatDay(event.endDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Timer className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(event.endDate) - new Date(event.startDate) > 86400000
                              ? `${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24))} days`
                              : `${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60))} hours`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">Location</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium">{event.location || "No location specified"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {event.isPublic ? (
                          <>
                            <Unlock className="h-5 w-5 text-green-500" />
                            <p className="text-sm">Public event - Anyone can join</p>
                          </>
                        ) : (
                          <>
                            <Lock className="h-5 w-5 text-amber-500" />
                            <p className="text-sm">Private event - Requires approval to join</p>
                          </>
                        )}
                      </div>

                      {event.type === "ONLINE" && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-purple-500" />
                          <p className="text-sm">Online event - link will be provided to participants</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">Participants</h3>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">
                          {event.participants?.filter((p) => p.status === "ACCEPTED").length || 0} Attending
                        </p>
                        {event.maxParticipants && (
                          <p className="text-sm text-gray-500">
                            {event.maxParticipants -
                              (event.participants?.filter((p) => p.status === "ACCEPTED").length || 0)}{" "}
                            spots left
                          </p>
                        )}
                      </div>
                    </div>

                    {event.participants && event.participants.length > 0 && (
                      <div className="mt-3 flex -space-x-2">
                        {event.participants
                          .filter((p) => p.status === "ACCEPTED")
                          .slice(0, 5)
                          .map((participant, index) => (
                            <CustomAvatar
                              key={index}
                              src={""}
                              fallbackText={`P${index + 1}`}
                              alt={`Participant ${index + 1}`}
                              className="h-8 w-8 border-2 border-white"
                            />
                          ))}
                        {event.participants.filter((p) => p.status === "ACCEPTED").length > 5 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium">
                            +{event.participants.filter((p) => p.status === "ACCEPTED").length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Event Settings */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">Event Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <UpdateIcon className="h-5 w-5 text-purple-500" />
                        <p className="text-sm">Update: {format(new Date(event.updatedAt), "MMMM d, yyyy")}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <p className="text-sm">Created: {format(new Date(event.createdAt), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <EventRequestManagement event={event} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <EventInvitationManagement event={event} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rsvp" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <EventRSVP event={event} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-invite" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <EmailInvite event={event} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
