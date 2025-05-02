"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventBasicInfoForm({ formData, handleChange, handleCheckboxChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Name</Label>
        <Input
          id="title"
          placeholder="Enter event name"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your event"
          className="min-h-[120px]"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOCIAL">Social</SelectItem>
            <SelectItem value="EDUCATION">Education</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
            <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) => handleCheckboxChange("isPublic", checked)}
          />
          <Label htmlFor="isPublic">Public Event</Label>
        </div>

        <p className="text-xs text-muted-foreground">Note: Public events will be visible to everyone.</p>
      </div>
    </div>
  )
}
