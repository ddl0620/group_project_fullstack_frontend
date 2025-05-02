"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function EventSummary({ formData, uploadedImages, existingImageUrls = [] }) {
  const totalImages = uploadedImages.length + existingImageUrls.length

  return (
    <Card className="mt-6 border-dashed">
      <CardContent className="pt-6">
        <h3 className="mb-4 text-lg font-medium">Event Summary</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Event Name</p>
            <p>{formData.title || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="line-clamp-2">{formData.description || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <p>{formData.category || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Date Range</p>
            <p>
              {formData.dateRange.from.toLocaleDateString()} - {formData.dateRange.to.toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p>{formData.location || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Organizer</p>
            <p>{formData.organizer ? formData.organizer.name : "Not assigned"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Settings</p>
            <p>{formData.isPublic ? "Public event" : "Private event"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Images</p>
            <p>{totalImages} images selected</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
