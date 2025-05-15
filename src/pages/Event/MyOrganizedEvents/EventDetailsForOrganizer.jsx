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
  MoreHorizontal,
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
import EmailInvite from "@/pages/Event/MyOrganizedEvents/EmailInvite.jsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
      <div className="container mx-auto max-w-5xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
        {/* Header with Back Button and Actions */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-8 px-2 sm:h-10 sm:px-4"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Back</span>
          </Button>

          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2">
            <Button
              onClick={() => navigate(`/discussions/${event._id}`)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Discussions
            </Button>
            <Button onClick={handleEditEvent} variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button onClick={handleDeleteEvent} variant="destructive" size="sm" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          {/* Mobile Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => navigate(`/discussions/${event._id}`)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Discussions</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditEvent}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteEvent} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Event Title and Badge */}
        <div className="mb-3 sm:mb-6">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">{event.title}</h1>
            <Badge className="bg-blue-500 text-xs">Organizer</Badge>
          </div>

          {/* Event Meta Info */}
          <div className="mt-2 space-y-1 sm:space-y-0 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                {formatDay(event.startDate)} - {formatDay(event.endDate)}
              </span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{event.location || "No location specified"}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Users className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                {event.participants?.filter((p) => p.status === "ACCEPTED").length || 0} attendees
              </span>
            </div>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mb-4 sm:mb-6">
          <ImageCarousel images={event.images} />
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <div className="relative mb-4 sm:mb-6">
            {/* Remove the bottom border line */}
            <TabsList className="relative w-full flex sm:grid sm:grid-cols-5 gap-1 sm:gap-2 h-12 sm:h-12">
              <TabsTrigger
                value="details"
                className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-4 h-full"
              >
                Event Details
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-4 h-full"
              >
                Requests
                {pendingRequests > 0 && (
                  <Badge variant="destructive" className="ml-1 text-[8px] sm:text-xs px-1 py-0 min-w-[16px] h-4">
                    {pendingRequests}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="invitations"
                className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-4 h-full"
              >
                Invitations
              </TabsTrigger>
              <TabsTrigger
                value="rsvp"
                className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-4 h-full"
              >
                RSVP
              </TabsTrigger>
              <TabsTrigger
                value="email-invite"
                className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-4 h-full"
              >
                Email Invite
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Event Details Tab */}
          <TabsContent value="details" className="mt-0">
            <Card className="border-0 sm:border shadow-none sm:shadow">
              <CardContent className="p-0 sm:p-6">
                {/* Event Badges */}
                <div className="mb-3 sm:mb-6">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {event.isPublic ? (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] sm:text-xs"
                      >
                        <Unlock className="h-2 w-2 sm:h-3 sm:w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] sm:text-xs"
                      >
                        <Lock className="h-2 w-2 sm:h-3 sm:w-3" />
                        Private
                      </Badge>
                    )}

                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-red-50 text-red-700 text-[10px] sm:text-xs"
                    >
                      {event.type === "OTHERS" ? (
                        <>
                          <Globe className="h-2 w-2 sm:h-3 sm:w-3" />
                          Online
                        </>
                      ) : (
                        <>
                          <Heart className="h-2 w-2 sm:h-3 sm:w-3" />
                          {event.type}
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* About This Event */}
                <div className="mb-3 sm:mb-6">
                  <h2 className="mb-1 sm:mb-2 text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                    About this event
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">{event.description}</p>
                </div>

                {/* Host Info */}
                <div className="mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <CustomAvatar
                    src={user.avatar || ""}
                    fallbackText={user.avatar || "You"}
                    alt="Organizer"
                    className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
                  />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Hosted by</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{user.name || "You"}</p>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3 rounded-lg border bg-gray-50 p-2 sm:p-3 md:p-4">
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Notify user when:</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{event.notifyWhen}</p>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                  {/* Date and Time */}
                  <div className="rounded-lg border bg-gray-50 p-2 sm:p-3 md:p-4">
                    <h3 className="mb-2 text-xs sm:text-sm font-semibold text-gray-700">Date and Time</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-xs sm:text-sm">
                            {formatDay(event.startDate)} - {formatDay(event.endDate)}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Timer className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {new Date(event.endDate) - new Date(event.startDate) > 86400000
                              ? `${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24))} days`
                              : `${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60))} hours`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg border bg-gray-50 p-2 sm:p-3 md:p-4">
                    <h3 className="mb-2 text-xs sm:text-sm font-semibold text-gray-700">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-xs sm:text-sm">{event.location || "No location specified"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {event.isPublic ? (
                          <>
                            <Unlock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                            <p className="text-[10px] sm:text-xs">Public event - Anyone can join</p>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-amber-500 flex-shrink-0" />
                            <p className="text-[10px] sm:text-xs">Private event - Requires approval to join</p>
                          </>
                        )}
                      </div>

                      {event.type === "ONLINE" && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                          <p className="text-[10px] sm:text-xs">Online event - link will be provided to participants</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="rounded-lg border bg-gray-50 p-2 sm:p-3 md:p-4">
                    <h3 className="mb-2 text-xs sm:text-sm font-semibold text-gray-700">Participants</h3>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-indigo-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">
                          {event.participants?.filter((p) => p.status === "ACCEPTED").length || 0} Attending
                        </p>
                        {event.maxParticipants && (
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {event.maxParticipants -
                              (event.participants?.filter((p) => p.status === "ACCEPTED").length || 0)}{" "}
                            spots left
                          </p>
                        )}
                      </div>
                    </div>

                    {event.participants && event.participants.length > 0 && (
                      <div className="mt-2 flex -space-x-1 sm:-space-x-2">
                        {event.participants
                          .filter((p) => p.status === "ACCEPTED")
                          .slice(0, 5)
                          .map((participant, index) => (
                            <CustomAvatar
                              key={index}
                              src={""}
                              fallbackText={`P${index + 1}`}
                              alt={`Participant ${index + 1}`}
                              className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 border-2 border-white"
                            />
                          ))}
                        {event.participants.filter((p) => p.status === "ACCEPTED").length > 5 && (
                          <div className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[8px] sm:text-xs font-medium">
                            +{event.participants.filter((p) => p.status === "ACCEPTED").length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Event Settings */}
                  <div className="rounded-lg border bg-gray-50 p-2 sm:p-3 md:p-4">
                    <h3 className="mb-2 text-xs sm:text-sm font-semibold text-gray-700">Event Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UpdateIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                        <p className="text-[10px] sm:text-xs">
                          Update: {format(new Date(event.updatedAt), "MMMM d, yyyy")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                        <p className="text-[10px] sm:text-xs">
                          Created: {format(new Date(event.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="requests" className="mt-0">
            <Card className="border-0 sm:border shadow-none sm:shadow">
              <CardContent className="p-0 sm:p-6">
                <EventRequestManagement event={event} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="mt-0">
            <Card className="border-0 sm:border shadow-none sm:shadow">
              <CardContent className="p-0 sm:p-6">
                <EventInvitationManagement event={event} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rsvp" className="mt-0">
            <Card className="border-0 sm:border shadow-none sm:shadow">
              <CardContent className="p-0 sm:p-6">
                <EventRSVP event={event} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-invite" className="mt-0">
            <Card className="border-0 sm:border shadow-none sm:shadow">
              <CardContent className="p-0 sm:p-6">
                <EmailInvite event={event} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
