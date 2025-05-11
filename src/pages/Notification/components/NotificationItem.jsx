"use client"

import { useEffect, useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import {
  Info,
  AtSign,
  MessageCircleMore,
  WandSparkles,
  BadgeX,
  MessageCirclePlus,
  CircleCheckBig,
  X,
  CalendarHeart,
  UserPlus,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function NotificationItem({ notification, onDelete, onMarkAsRead, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTodaysDate, setIsTodaysDate] = useState(false)

  useEffect(() => {
    setIsTodaysDate(new Date(notification.createdAt).toDateString() === new Date().toDateString())
  }, [notification.createdAt])
  const getTypeIcon = () => {
    switch (notification.type) {
      case "UPDATE_EVENT":
        return <WandSparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      case "REPLY":
        return <AtSign className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
      case "COMMENT":
        return <MessageCircleMore className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      case "NEW_POST":
        return <MessageCirclePlus className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
      case "INVITATION":
        return <CalendarHeart className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
      case "DELETE_EVENT":
        return <BadgeX className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
      case "RSVP_ACCEPT":
        return <CircleCheckBig className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
      case "RSVP_DENIED":
        return <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
      case "REQUEST_JOIN":
        return <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      case "REQUEST_ACCEPT":
        return <CircleCheckBig className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
      case "REQUEST_DENIED":
        return <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
      default:
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
    }
  }

  const getTypeColor = () => {
    switch (notification.type) {
      case "INFO":
        return "border-blue-100 bg-blue-50"
      case "SUCCESS":
        return "border-green-100 bg-green-50"
      case "WARNING":
        return "border-amber-100 bg-amber-50"
      case "ERROR":
        return "border-red-100 bg-red-50"
      default:
        return "border-gray-100 bg-gray-50"
    }
  }

  const formattedDate = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "Unknown date"

  const exactDate = notification.createdAt ? format(new Date(notification.createdAt), "PPpp") : "Unknown date"

  const handleClick = (e) => {
    // Only trigger onClick if not clicking on action buttons
    if (!e.target.closest("button")) {
      onClick && onClick(notification)
    }
  }

  return (
    <div
      className={cn(
        "group flex cursor-pointer items-start gap-2 sm:gap-4 border-b p-3 sm:p-4 transition-colors hover:bg-gray-50",
        !notification.isRead && "bg-blue-50/30",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className={cn("rounded-full border p-1.5 sm:p-2", getTypeColor())}>{getTypeIcon()}</div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className={cn("font-medium", !notification.isRead && "font-semibold")}>{notification.title}</h3>

          <div className="flex items-center gap-1">
            {isTodaysDate && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}

            {/*{!notification.isRead && (*/}
            {/*  <div className="h-2 w-2 rounded-full bg-blue-500"></div>*/}
            {/*)}*/}

            <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
              {!notification.isRead && (
                <TooltipProvider>
                  <Tooltip>
                    {/*<TooltipTrigger asChild>*/}
                    {/*  <Button*/}
                    {/*    variant="ghost"*/}
                    {/*    size="icon"*/}
                    {/*    className="h-8 w-8"*/}
                    {/*    onClick={(e) => {*/}
                    {/*      e.stopPropagation()*/}
                    {/*      onMarkAsRead && onMarkAsRead(notification._id)*/}
                    {/*    }}*/}
                    {/*  >*/}
                    {/*    <Check className="h-4 w-4" />*/}
                    {/*    <span className="sr-only">Mark as read</span>*/}
                    {/*  </Button>*/}
                    {/*</TooltipTrigger>*/}
                    <TooltipContent>
                      <p>Mark as read</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/*<Button*/}
                    {/*  variant="ghost"*/}
                    {/*  size="icon"*/}
                    {/*  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"*/}
                    {/*  onClick={(e) => {*/}
                    {/*    e.stopPropagation()*/}
                    {/*    onDelete && onDelete(notification._id)*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  <Trash2 className="h-4 w-4" />*/}
                    {/*  <span className="sr-only">Delete</span>*/}
                    {/*</Button>*/}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete notification</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-gray-600">{notification.content}</p>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">{formattedDate}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{exactDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
