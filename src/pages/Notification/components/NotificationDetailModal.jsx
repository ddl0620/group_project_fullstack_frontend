"use client"

import { format } from "date-fns"
import { Info, AlertCircle, CheckCircle, AlertTriangle, X, Check, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function NotificationDetailModal({ notification, isOpen, onClose, onMarkAsRead, onDelete }) {
  if (!notification) return null

  const getTypeIcon = () => {
    switch (notification.type) {
      case "INFO":
        return <Info className="h-5 w-5" />
      case "SUCCESS":
        return <CheckCircle className="h-5 w-5" />
      case "WARNING":
        return <AlertTriangle className="h-5 w-5" />
      case "ERROR":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getTypeColor = () => {
    switch (notification.type) {
      case "INFO":
        return "bg-blue-500 text-white"
      case "SUCCESS":
        return "bg-green-500 text-white"
      case "WARNING":
        return "bg-amber-500 text-white"
      case "ERROR":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeName = () => {
    switch (notification.type) {
      case "INFO":
        return "Information"
      case "SUCCESS":
        return "Success"
      case "WARNING":
        return "Warning"
      case "ERROR":
        return "Error"
      default:
        return notification.type
    }
  }

  const formattedDate = notification.createdAt ? format(new Date(notification.createdAt), "PPpp") : "Unknown date"

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead(notification._id)
    }
    onClose()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification._id)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge className={cn("px-2 py-1", getTypeColor())}>
              <span className="flex items-center gap-1">
                {getTypeIcon()}
                <span>{getTypeName()}</span>
              </span>
            </Badge>
            {!notification.isRead && (
              <Badge variant="outline" className="bg-blue-50">
                New
              </Badge>
            )}
          </div>
          <DialogTitle className="mt-4 text-xl">{notification.title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">Received {formattedDate}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <div className="rounded-md bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm">{notification.content}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">Type:</span>
              <span>{getTypeName()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">Status:</span>
              <span>{notification.isRead ? "Read" : "Unread"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">Received:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">Notification ID:</span>
              <span className="font-mono text-xs">{notification._id}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            {!notification.isRead && (
              <Button size="sm" onClick={handleMarkAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark as read
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
