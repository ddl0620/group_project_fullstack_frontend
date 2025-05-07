"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Globe, ImageIcon, Lock, MapPin, Users } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageCarousel from "@/components/ImageCarousel"
import Pagination from "@/components/shared/Pagination.jsx"

export default function EventDetailsModal({ isOpen, setIsOpen, event }) {
  const [activeTab, setActiveTab] = useState("details")
  const [participantsPage, setParticipantsPage] = useState(1)
  const [participantFilter, setParticipantFilter] = useState("all")
  const participantsPerPage = 5

  const [isParticipantsFilterChanged, setIsParticipantsFilterChanged] = useState(false)

  useEffect(() => {
    if (isParticipantsFilterChanged) {
      setParticipantsPage(1)
      setIsParticipantsFilterChanged(false)
    }
  }, [isParticipantsFilterChanged])

  // Use the event directly since it should already have complete user data
  const displayEvent = event

  if (!displayEvent) return null

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

  // Filter participants by status
  const acceptedParticipants = displayEvent.participants?.filter((p) => p.status === "ACCEPTED") || []
  const pendingParticipants = displayEvent.participants?.filter((p) => p.status === "PENDING") || []
  const declinedParticipants = displayEvent.participants?.filter((p) => p.status === "DENIED") || []

  // Filter participants based on selected filter
  const filteredParticipants =
    participantFilter === "all"
      ? displayEvent.participants || []
      : displayEvent.participants?.filter((p) => p.status === participantFilter) || []

  // Pagination for participants
  const totalParticipants = filteredParticipants.length
  const totalPages = Math.ceil(totalParticipants / participantsPerPage)
  const currentParticipants = filteredParticipants.slice(
    (participantsPage - 1) * participantsPerPage,
    participantsPage * participantsPerPage,
  )

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

  // Get participation status display
  const getStatusDisplay = (status) => {
    const statusMap = {
      GOING: { label: "Going", color: "bg-green-100 text-green-800" },
      ACCEPTED: { label: "Going", color: "bg-green-100 text-green-800" },
      NOT_GOING: { label: "Declined", color: "bg-red-100 text-red-800" },
      DENIED: { label: "Declined", color: "bg-red-100 text-red-800" },
      PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      MAYBE: { label: "Maybe", color: "bg-blue-100 text-blue-800" },
    }
    return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
  }

  const handleParticipantFilterChange = (filter) => {
    setParticipantFilter(filter)
    setIsParticipantsFilterChanged(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-[800px] sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{displayEvent.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">
              Participants
              <Badge variant="secondary" className="ml-2">
                {totalParticipants}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="rounded-lg border p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <Badge className="mb-2">{getEventTypeDisplay(displayEvent.type)}</Badge>
                  <div className="flex items-center">
                    {displayEvent.isPublic ? (
                      <Globe className="mr-1 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Lock className="mr-1 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {displayEvent.isPublic ? "Public Event" : "Private Event"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Created: {formatDate(displayEvent.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Description</h3>
                <p className="whitespace-pre-line">{displayEvent.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Date</h3>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>
                      {formatDate(displayEvent.startDate)} - {formatDate(displayEvent.endDate)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Location</h3>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>{displayEvent.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Organizer</h3>
                <div className="flex items-center">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage
                      src={displayEvent.organizer?.avatar || "/placeholder.svg"}
                      alt={displayEvent.organizer?.name || "Organizer"}
                    />
                    <AvatarFallback>{getInitials(displayEvent.organizer?.name || "Organizer")}</AvatarFallback>
                  </Avatar>
                  <p>{displayEvent.organizer?.name || "Unknown Organizer"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border p-3">
                <h4 className="text-lg font-bold text-green-600">{acceptedParticipants.length}</h4>
                <p className="text-sm text-muted-foreground">Going</p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-lg font-bold text-yellow-600">{pendingParticipants.length}</h4>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-lg font-bold text-red-600">{declinedParticipants.length}</h4>
                <p className="text-sm text-muted-foreground">Declined</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="mb-2 text-lg font-medium sm:mb-0">Participants</h3>
              <div className="flex space-x-2">
                <Button
                  variant={participantFilter === "ACCEPTED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleParticipantFilterChange("ACCEPTED")}
                >
                  Going ({acceptedParticipants.length})
                </Button>
                <Button
                  variant={participantFilter === "PENDING" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleParticipantFilterChange("PENDING")}
                >
                  Pending ({pendingParticipants.length})
                </Button>
                <Button
                  variant={participantFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleParticipantFilterChange("all")}
                >
                  All
                </Button>
              </div>
            </div>

            <div className="max-h-[40vh] overflow-y-auto rounded-lg border">
              {currentParticipants.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No participants found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {currentParticipants.map((participant, index) => {
                    const status = getStatusDisplay(participant.status)
                    return (
                      <div
                        key={`${participant.userId._id || participant.userId}-${index}`}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex items-center">
                          <Avatar className="mr-3 h-10 w-10">
                            <AvatarImage
                              src={participant.userId.avatar || "/placeholder.svg"}
                              alt={participant.userId.name || "User"}
                            />
                            <AvatarFallback>{getInitials(participant.userId.name || "User")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.userId.name || "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground">
                              Invited: {formatDate(participant.invitedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`rounded-full px-2 py-1 text-xs ${status.color}`}>{status.label}</span>
                          {participant.respondedAt && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              Responded: {formatDate(participant.respondedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {totalParticipants > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={participantsPage}
                  totalPages={totalPages}
                  onPageChange={setParticipantsPage}
                  totalItems={totalParticipants}
                  itemsPerPage={participantsPerPage}
                  itemName="participants"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="images" className="mt-4">
            {!displayEvent.images || displayEvent.images.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No images available</p>
              </div>
            ) : (
              <ImageCarousel images={displayEvent.images} />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
