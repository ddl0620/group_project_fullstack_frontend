"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

export default function EventLocationForm({ formData, handleChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <Label htmlFor="location">Location Name</Label>
        </div>
        <Input
          id="location"
          placeholder="Example: Central Park, Conference Center"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>

      <div className="border border-dashed rounded-md p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <MapPin className="h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Map integration will be added in the future</p>
        </div>
      </div>
    </div>
  )
}
