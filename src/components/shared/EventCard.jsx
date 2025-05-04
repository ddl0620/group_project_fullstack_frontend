"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // Commented out as requested
import { useSelector } from "react-redux"
import { Calendar, MapPin, Globe, Clock, Unlock, LockIcon, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
  const navigate = useNavigate() // Commented out as requested
  // const navigate = (path) => console.log(`Navigating to: ${path}`) // Temporary replacement
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

  const isOrganizer = user?._id === event?.organizer

  const canViewDetails = isPublic || isParticipant || isOrganizer

  const handleCardClick = () => {
    navigate(`/event/${_id}`)
  }

  // Get category color based on category name
  const getCategoryColor = () => {
    const categoryColors = {
      Technology: "bg-blue-500",
      BUSINESS: "bg-amber-500",
      ENTERTAINMENT: "bg-purple-500",
      EDUCATION: "bg-emerald-500",
      SPORT: "bg-red-500",
      SOCIAL: "bg-indigo-500",
      OTHER: "bg-gray-500",
    }

    return categoryColors[type] || "bg-gray-500"
  }

  // Get type badge color
  const getTypeBadgeColor = () => {
    return type === "ONLINE" ? "bg-blue-500" : "bg-orange-500"
  }

  const getStatusBadge = () => {
    if (isOrganizer) {
      return <Badge className="bg-[#0071e3] text-white hover:bg-[#0077ed]">Organizer</Badge>
    }

    if (isParticipant) {
      return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Attending</Badge>
    }

    return isPublic ? (
      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
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
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
      onClick={handleCardClick}
    >
      {/* Image section - full width with no padding */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* Category badge */}
        {type && (
          <div
            className={`absolute left-4 top-4 z-10 rounded-full ${getCategoryColor()} px-3 py-1 text-xs font-medium text-white`}
          >
            {type}
          </div>
        )}

        {/* Type badge */}
        {/*<div*/}
        {/*  className={`absolute right-4 top-4 z-10 rounded-full ${getTypeBadgeColor()} px-3 py-1 text-xs font-medium text-white`}*/}
        {/*>*/}
        {/*  {type === "ONLINE" ? "Online" : "In-Person"}*/}
        {/*</div>*/}

        <img
          src={images[0] || "/placeholder.svg?height=192&width=384&query=event"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-wrap gap-2">
            {getStatusBadge()}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h3>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 text-[#0071e3]" />
            <span>{formatDate(startDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            {type === "ONLINE" ? (
              <Globe className="h-4 w-4 text-[#0071e3]" />
            ) : (
              <MapPin className="h-4 w-4 text-[#0071e3]" />
            )}
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 text-[#0071e3]" />
            <span>
              {participantCount} {participantCount === 1 ? "attendee" : "attendees"}
            </span>
          </div>
        </div>

        {canViewDetails && description && (
          <>
            <div className="mt-4">
              <motion.div
                initial={false}
                animate={{ height: expanded ? "auto" : "2.5rem" }}
                className="overflow-hidden"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {description || "No description provided."}
                </p>
              </motion.div>

              {description && description.length > 120 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-auto p-0 text-xs font-medium text-[#0071e3] hover:bg-transparent hover:text-[#0077ed] dark:text-blue-400 dark:hover:text-blue-300"
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
            </div>
          </>
        )}

        {!canViewDetails && (
          <p className="mt-4 text-sm italic text-gray-500 dark:text-gray-400">
            This event is private. Request to join to see details.
          </p>
        )}
      </CardContent>

      {actions.length > 0 && (
        <CardFooter className="flex justify-center gap-2 border-t border-gray-100 bg-gray-50/80 p-3 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/50">
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
