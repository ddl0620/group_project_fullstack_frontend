"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useEvent } from "@/hooks/useEvent"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { addDays } from "date-fns"
import { CalendarIcon, Clock, MapPin, Info, ImageIcon, CheckCircle2 } from "lucide-react"
import {ImageUploader, useImageUploader} from "@/components/ImageUploader.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.js";

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { createEvent } = useEvent()

  // Image uploader hook
  const imageUploader = useImageUploader()

  // Form stages
  const [currentStage, setCurrentStage] = useState(1)
  const totalStages = 4

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "", // Commented out as requested
    location: "",
    // address: "",
    dateRange: {
      from: new Date(),
      to: addDays(new Date(), 1),
    },
    // startTime: "18:00",
    // endTime: "21:00",
    // maxAttendees: "", // Commented out as requested
    isPublic: true, // Changed from isPrivate to isPublic with default true
    // requiresApproval: false,
  })

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle checkbox changes with mutual exclusivity
  const handleCheckboxChange = (field, checked) => {
    if (field === "isPublic" && checked === false) {
      // If making event private (isPublic = false), allow requiresApproval
      setFormData((prev) => ({
        ...prev,
        isPublic: false,
      }))
    } else if (field === "isPublic" && checked === true) {
      // If making event public, disable requiresApproval
      setFormData((prev) => ({
        ...prev,
        isPublic: true,
        requiresApproval: false,
      }))
    } else if (field === "requiresApproval" && checked === true) {
      // If enabling requiresApproval, make event private
      setFormData((prev) => ({
        ...prev,
        isPublic: false,
        requiresApproval: true,
      }))
    } else if (field === "requiresApproval" && checked === false) {
      // If disabling requiresApproval, keep event private
      setFormData((prev) => ({
        ...prev,
        requiresApproval: false,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Prepare images for submission
      const images = [
        ...imageUploader.uploadedImages.map((img) => img.file),
        ...imageUploader.existingImageUrls.map((img) => img.url),
      ]

      // Prepare event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.dateRange.from,
        endDate: formData.dateRange.to,
        isPublic: formData.isPublic,
        location: formData.location,
        type: formData.category,
        images,
      }

      const response = await createEvent(eventData)

      if (response.success) {
        toast.success("Event created successfully!")
        navigate("/event")
      } else {
        toast.error("Failed to create event")
      }
    } catch (error) {
      toast.error("An error occurred while creating the event")
      console.error(error)
    }
  }

  // Navigation between stages
  const nextStage = () => {
    if (currentStage < totalStages) {
      setCurrentStage(currentStage + 1)
    }
  }

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1)
    }
  }

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
        <div className="mb-8">
          <div className="flex justify-between">
            {Array.from({ length: totalStages }, (_, i) => i + 1).map((stage) => (
                <div
                    key={stage}
                    className={`flex flex-col items-center ${stage <= currentStage ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          stage < currentStage
                              ? "border-primary bg-primary text-white"
                              : stage === currentStage
                                  ? "border-primary text-primary"
                                  : "border-muted-foreground"
                      }`}
                  >
                    {stage < currentStage ? <CheckCircle2 className="h-5 w-5" /> : <span>{stage}</span>}
                  </div>
                  <span className="mt-2 text-xs font-medium">
                {stage === 1 && "Basic Info"}
                    {stage === 2 && "Date & Time"}
                    {stage === 3 && "Location"}
                    {stage === 4 && "Media"}
              </span>
                </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 h-1 w-full bg-muted"></div>
            <div
                className="absolute top-0 h-1 bg-primary transition-all duration-300"
                style={{ width: `${((currentStage - 1) / (totalStages - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
    )
  }

  // Render form stages
  const renderFormStage = () => {
    switch (currentStage) {
      case 1:
        return (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                    id="title"
                    placeholder="Enter event title"
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
              {/*Category field commented out as requested*/}
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


              {/* Maximum Attendees field commented out as requested
            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Maximum Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.maxAttendees}
                onChange={(e) => handleChange("maxAttendees", e.target.value)}
              />
            </div>
            */}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleCheckboxChange("isPublic", checked)}
                  />
                  <Label htmlFor="isPublic">Public Event</Label>
                </div>

                {/*<div className="flex items-center space-x-2">*/}
                {/*  <Checkbox*/}
                {/*      id="requiresApproval"*/}
                {/*      checked={formData.requiresApproval}*/}
                {/*      onCheckedChange={(checked) => handleCheckboxChange("requiresApproval", checked)}*/}
                {/*  />*/}
                {/*  <Label htmlFor="requiresApproval">Require Approval for Attendees</Label>*/}
                {/*</div>*/}
                <p className="text-xs text-muted-foreground">
                  Note: Public events are visible to everyone. Events requiring approval are automatically private.
                </p>
              </div>
            </div>
        )

      case 2:
        return (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Label>Event Date Range</Label>
                </div>
                <DateRangePicker date={formData.dateRange} onDateChange={(range) => handleChange("dateRange", range)} />
              </div>

              {/*<div className="grid grid-cols-2 gap-4">*/}
              {/*  <div className="space-y-2">*/}
              {/*    <div className="flex items-center">*/}
              {/*      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />*/}
              {/*      <Label htmlFor="startTime">Start Time</Label>*/}
              {/*    </div>*/}
              {/*    <TimePicker value={formData.startTime} onChange={(time) => handleChange("startTime", time)} />*/}
              {/*  </div>*/}

              {/*  <div className="space-y-2">*/}
              {/*    <div className="flex items-center">*/}
              {/*      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />*/}
              {/*      <Label htmlFor="endTime">End Time</Label>*/}
              {/*    </div>*/}
              {/*    <TimePicker value={formData.endTime} onChange={(time) => handleChange("endTime", time)} />*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
        )

      case 3:
        return (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="location">Location Name</Label>
                </div>
                <Input
                    id="location"
                    placeholder="e.g., Central Park, Conference Center"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>

              {/*<div className="space-y-2">*/}
              {/*  <div className="flex items-center">*/}
              {/*    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />*/}
              {/*    <Label htmlFor="address">Full Address</Label>*/}
              {/*  </div>*/}
              {/*  <Textarea*/}
              {/*      id="address"*/}
              {/*      placeholder="Enter the complete address"*/}
              {/*      value={formData.address}*/}
              {/*      onChange={(e) => handleChange("address", e.target.value)}*/}
              {/*  />*/}
              {/*</div>*/}

              <div className="rounded-md border border-dashed p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <MapPin className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Map integration will be available in the future</p>
                </div>
              </div>
            </div>
        )

      case 4:
        return (
            <div className="space-y-6">
              <div className="flex items-center">
                <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label>Event Images</Label>
              </div>
              <ImageUploader
                  fileInputRef={imageUploader.fileInputRef}
                  uploadedImages={imageUploader.uploadedImages}
                  existingImageUrls={imageUploader.existingImageUrls}
                  handleFileChange={imageUploader.handleFileChange}
                  handleRemoveImage={imageUploader.handleRemoveImage}
              />

              <div className="rounded-md bg-muted p-4">
                <div className="flex items-start">
                  <Info className="mr-2 h-5 w-5 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <p>Add images to make your event stand out.</p>
                    <p>Recommended image size: 1200 x 630 pixels.</p>
                  </div>
                </div>
              </div>
            </div>
        )

      default:
        return null
    }
  }

  // Render form summary for final review
  const renderSummary = () => {
    if (currentStage !== totalStages) return null

    return (
        <Card className="mt-6 border-dashed">
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Event Summary</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Title</p>
                <p>{formData.title || "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="line-clamp-2">{formData.description || "Not specified"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Range</p>
                  <p>
                    {formData.dateRange.from.toLocaleDateString()} - {formData.dateRange.to.toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p>
                    {formData.startTime} - {formData.endTime}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{formData.location || "Not specified"}</p>
                <p className="text-sm text-muted-foreground">{formData.address || "No address provided"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Settings</p>
                <p>
                  {formData.isPublic ? "Public event" : "Private event"}
                  {formData.requiresApproval ? ", Requires approval" : ""}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                <p>{imageUploader.uploadedImages.length + imageUploader.existingImageUrls.length} images selected</p>
              </div>
            </div>
          </CardContent>
        </Card>
    )
  }

  return (
      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details to create your event</p>
          </div>

          {renderProgressIndicator()}

          <Card>
            <CardContent className="pt-6">
              {renderFormStage()}
              {renderSummary()}

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={currentStage === 1 ? () => navigate("/event") : prevStage}>
                  {currentStage === 1 ? "Cancel" : "Previous"}
                </Button>

                <Button onClick={currentStage === totalStages ? handleSubmit : nextStage}>
                  {currentStage === totalStages ? "Create Event" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
