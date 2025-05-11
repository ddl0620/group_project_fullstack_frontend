"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Bell,
  Info,
  ExternalLink,
  WandSparkles,
  AtSign,
  MessageCircleMore,
  MessageCirclePlus,
  CalendarHeart,
  BadgeX,
  CircleCheckBig,
  X,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useNotifications } from "@/hooks/useNotification.js"

export function NotificationDropdown() {
  const navigate = useNavigate()
  const { notifications, loading, error, fetchNotifications, markAsRead } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, fetchNotifications])

  // Get the 5 most recent notifications
  const latestNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const getTypeIcon = (notification) => {
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

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id)
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "COMMENT":
      case "REPLY":
      case "NEW_POST":
        navigate(`/discussion`)
        break
      case "UPDATE_EVENT":
      case "DELETE_EVENT":
      case "INVITATION":
      case "RSVP_ACCEPT":
      case "RSVP_DENIED":
      case "REQUEST_JOIN":
      case "REQUEST_ACCEPT":
      case "REQUEST_DENIED":
        navigate(`/event/joined`)
        break
      default:
        // Just close the popover for other types
        break
    }

    setIsOpen(false)
  }

  const handleViewAll = () => {
    setIsOpen(false)
    navigate("/notifications")
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size="icon"
          className="relative h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-white/10 hover:text-white"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full p-0 text-[8px] sm:text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-40px)] max-w-[280px] sm:w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b p-2 sm:p-3">
          <h3 className="text-sm sm:text-base font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-[10px] sm:text-xs h-5 sm:h-6">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <div className="max-h-[300px] sm:max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="p-1">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2">
                  <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                  <div className="flex-1 space-y-1 sm:space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-3/4" />
                    <Skeleton className="h-2 sm:h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-red-500">Failed to load notifications</div>
          ) : latestNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center">
              <Bell className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/50" />
              <p className="text-xs sm:text-sm font-medium">No notifications yet</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div>
              {latestNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "flex cursor-pointer items-start gap-2 sm:gap-3 border-b p-2 sm:p-3 transition-colors hover:bg-muted/50",
                    !notification.isRead && "bg-blue-50/50",
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border bg-background">
                    {getTypeIcon(notification)}
                  </div>
                  <div className="flex-1 space-y-0.5 sm:space-y-1">
                    <p className={cn("text-xs sm:text-sm", !notification.isRead && "font-medium")}>
                      {notification.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{notification.content}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="mt-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-1 sm:p-2">
          <Button
            variant="ghost"
            className="w-full justify-center text-xs sm:text-sm h-8 sm:h-10"
            onClick={handleViewAll}
          >
            View all notifications
            <ExternalLink className="ml-1 sm:ml-2 h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
