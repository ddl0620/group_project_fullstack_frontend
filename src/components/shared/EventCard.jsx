"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Calendar, MapPin, Globe, Clock, Unlock, LockIcon, Users, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const truncateDescription = (text, maxLength) => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const formatTime = (dateString) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function EventCard({ event, actions = [], className }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)

  const {
    _id,
    title = "Untitled Event",
    description = "",
    type = "ONLINE",
    startDate,
    endDate,
    location = "N/A",
    images = [],
    isPublic = true,
    participants = [],
    category,
  } = event || {}

  const isParticipant = participants.some(
    (participant) => participant.userId === user?._id && participant.status === "ACCEPTED",
  )

  const isOrganizer = user?._id === event.organizer

  const canViewDetails = isPublic || isParticipant || isOrganizer

  const handleCardClick = () => {
    navigate(`/event/${_id}`)
  }

  const getStatusBadge = () => {
    if (isOrganizer) {
      return <Badge className="bg-purple-500 hover:bg-purple-600">Organizer</Badge>
    }

    if (isParticipant) {
      return <Badge className="bg-green-500 hover:bg-green-600">Attending</Badge>
    }

    return isPublic ? (
      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
        <Unlock className="mr-1 h-3 w-3" />
        Public
      </Badge>
    ) : (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
        <LockIcon className="mr-1 h-3 w-3" />
        Private
      </Badge>
    )
  }

  const participantCount = participants.filter((p) => p.status === "ACCEPTED").length

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative cursor-pointer" onClick={handleCardClick}>
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={images[0] || "/placeholder.svg?height=192&width=384&query=event"}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex flex-wrap gap-2">
                {getStatusBadge()}

                <Badge
                  variant="outline"
                  className={cn(
                    "border-white/20 bg-black/50 text-white hover:bg-black/60",
                    type === "ONLINE" ? "border-blue-200" : "border-orange-200",
                  )}
                >
                  {type === "ONLINE" ? <Globe className="mr-1 h-3 w-3" /> : <MapPin className="mr-1 h-3 w-3" />}
                  {type === "ONLINE" ? "Online" : "In-Person"}
                </Badge>

                {category && (
                  <Badge variant="outline" className="border-white/20 bg-black/50 text-white hover:bg-black/60">
                    <Tag className="mr-1 h-3 w-3" />
                    {category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-xl font-bold text-gray-900">{title}</h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(startDate)}</span>
            <span className="text-gray-300">•</span>
            <Clock className="h-4 w-4" />
            <span>{formatTime(startDate)}</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            {type === "ONLINE" ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            <span className="truncate">{location}</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>
              {participantCount} {participantCount === 1 ? "attendee" : "attendees"}
            </span>
          </div>

          {canViewDetails ? (
            <>
              <p className={cn("mt-3 text-sm text-gray-600", expanded ? "" : "line-clamp-2")}>
                {description || "No description provided."}
              </p>

              {description && description.length > 120 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-auto p-0 text-xs font-medium text-gray-500 hover:bg-transparent hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(!expanded)
                  }}
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="ml-1 h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="ml-1 h-3 w-3" />
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm italic text-gray-500">This event is private. Request to join to see details.</p>
          )}
        </CardContent>
      </div>

      {actions.length > 0 && (
        <CardFooter className="flex justify-center gap-2 border-t bg-gray-50 p-3 bottom-0">
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick()
              }}
            >
              {action.button}
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
