import { Calendar, MapPin, User, FileText, ImageIcon, Settings, Clock, Bell, AlarmClock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function EventSummary({ formData, uploadedImages, existingImageUrls = [] }) {
  const totalImages = uploadedImages.length + existingImageUrls.length

  // Ensure dates are properly formatted
  formData.dateRange = {
    from: new Date(formData.dateRange.from),
    to: formData.dateRange.to ? new Date(formData.dateRange.to) : new Date(formData.dateRange.from),
  }

  // Format dates in a more readable way
  const formatDate = (date) => {
    return format(date, "MMM dd, yyyy")
  }

  // Calculate event duration in days
  const calculateDuration = () => {
    const diffTime = Math.abs(formData.dateRange.to - formData.dateRange.from)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + (diffDays === 1 ? " day" : " days")
  }

  return (
    <Card className="mt-6 overflow-hidden border shadow-sm">
      <CardHeader className="bg-primary/5 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-primary">Event Summary</h3>
          <Badge variant={formData.isPublic ? "default" : "outline"}>
            {formData.isPublic ? "Public Event" : "Private Event"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Title */}
          <div className="col-span-full">
            <h2 className="mb-1 text-2xl font-bold text-gray-900">{formData.title || "Untitled Event"}</h2>
            {formData.category && (
              <Badge variant="secondary" className="mt-1">
                {formData.category}
              </Badge>
            )}
          </div>

          {/* Description */}
          <div className="col-span-full rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">Description</span>
            </div>
            <p className="text-gray-700">{formData.description || "No description provided"}</p>
          </div>

          {/* Date and Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Date</span>
            </div>
            <p className="text-gray-700">
              {formatDate(formData.dateRange.from)}
              {formData.dateRange.from.getTime() !== formData.dateRange.to.getTime() &&
                ` - ${formatDate(formData.dateRange.to)}`}
            </p>
            {formData.dateRange.from.getTime() !== formData.dateRange.to.getTime() && (
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-500">Duration: {calculateDuration()}</span>
              </div>
            )}
          </div>

          {/* Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlarmClock className="h-4 w-4 text-primary" />
              <span className="font-medium">Time</span>
            </div>
            <div className="flex flex-col gap-1">
              {formData.startTime && (
                <p className="text-gray-700">
                  <span className="text-sm text-gray-500 mr-2">Start:</span>
                  {formData.startTime}
                </p>
              )}
              {formData.endTime && (
                <p className="text-gray-700">
                  <span className="text-sm text-gray-500 mr-2">End:</span>
                  {formData.endTime}
                </p>
              )}
              {!formData.startTime && !formData.endTime && <p className="text-gray-500 italic">No specific time set</p>}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Location</span>
            </div>
            <p className="text-gray-700">{formData.location || "Location not specified"}</p>
          </div>

          {/* Organizer */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">Organizer</span>
            </div>
            <p className="text-gray-700">{formData.organizer ? formData.organizer.name : "You"}</p>
          </div>

          {/* Images */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">Images</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-700">
                {totalImages} image{totalImages !== 1 ? "s" : ""} selected
              </p>
              {totalImages > 0 && (
                <Badge variant="outline" className="bg-primary/10">
                  {uploadedImages.length} new, {existingImageUrls.length} existing
                </Badge>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <span className="font-medium">Settings</span>
            </div>
            <p className="text-gray-700">
              {formData.isPublic ? "This event is visible to everyone" : "This event is only visible to invited guests"}
            </p>
          </div>

          {/* Notifications */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="font-medium">Notify Before</span>
            </div>
            {formData.notifyWhen ? (
              <div className="flex items-center gap-2">
                <p className="text-gray-700">
                  {typeof formData.notifyWhen === "string"
                    ? formData.notifyWhen
                    : Array.isArray(formData.notifyWhen)
                      ? formData.notifyWhen.join(", ")
                      : "Enabled"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No notifications set</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
