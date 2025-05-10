"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BellRing } from "lucide-react"

// Notification options enum
export const NOTIFY_WHEN = {
  ONE_HOUR_BEFORE: "ONE_HOUR_BEFORE",
  ONE_DAY_BEFORE: "ONE_DAY_BEFORE",
  ONE_WEEK_BEFORE: "ONE_WEEK_BEFORE",
  TWELVE_HOURS_BEFORE: "TWELVE_HOURS_BEFORE",
  THREE_DAY_BEFORE: "THREE_HOURS_BEFORE",
  NONE: "NONE",
}

export default function EventBasicInfoForm({ formData, handleChange, handleCheckboxChange }) {
  const [titleCount, setTitleCount] = useState(formData.title?.length || 0)
  const [descriptionCount, setDescriptionCount] = useState(formData.description?.length || 0)

  const TITLE_LIMIT = 100
  const DESCRIPTION_LIMIT = 500

  // Handle title input with word limit
  const handleTitleChange = (e) => {
    const value = e.target.value
    if (value.length <= TITLE_LIMIT) {
      handleChange("title", value)
      setTitleCount(value.length)
    }
  }

  // Handle description input with word limit
  const handleDescriptionChange = (e) => {
    const value = e.target.value
    if (value.length <= DESCRIPTION_LIMIT) {
      handleChange("description", value)
      setDescriptionCount(value.length)
    }
  }

  // Update counts when formData changes externally
  useEffect(() => {
    setTitleCount(formData.title?.length || 0)
    setDescriptionCount(formData.description?.length || 0)
  }, [formData.title, formData.description])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Name</Label>
        <Input id="title" placeholder="Enter event name" value={formData.title} onChange={handleTitleChange} />
        <p className="text-xs text-muted-foreground text-right">
          {titleCount}/{TITLE_LIMIT} characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your event"
          className="min-h-[120px]"
          value={formData.description}
          onChange={handleDescriptionChange}
        />
        <p className="text-xs text-muted-foreground text-right">
          {descriptionCount}/{DESCRIPTION_LIMIT} characters
        </p>
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

      <div className="space-y-2">
        <div className="flex items-center">
          <BellRing className="mr-2 h-4 w-4 text-muted-foreground" />
          <Label htmlFor="notifyWhen">Notify participants</Label>
        </div>
        <Select
          value={formData.notifyWhen || NOTIFY_WHEN.NONE}
          onValueChange={(value) => handleChange("notifyWhen", value)}
        >
          <SelectTrigger id="notifyWhen">
            <SelectValue placeholder="Select when to notify" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NOTIFY_WHEN.ONE_HOUR_BEFORE}>1 hour before</SelectItem>
            <SelectItem value={NOTIFY_WHEN.TWELVE_HOURS_BEFORE}>12 hours before</SelectItem>
            <SelectItem value={NOTIFY_WHEN.ONE_DAY_BEFORE}>1 day before</SelectItem>
            <SelectItem value={NOTIFY_WHEN.THREE_DAY_BEFORE}>3 days before</SelectItem>
            <SelectItem value={NOTIFY_WHEN.ONE_WEEK_BEFORE}>1 week before</SelectItem>
            <SelectItem value={NOTIFY_WHEN.NONE}>Don't notify</SelectItem>
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
