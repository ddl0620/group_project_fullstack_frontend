"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useEvent } from "@/hooks/useEvent.js"
import { Button } from "@/components/ui/button.js"
import { Card, CardContent } from "@/components/ui/card.js"
import { addDays } from "date-fns"
import { useImageUploader } from "@/components/ImageUploader.jsx"
import { AlertDialogUtils } from "@/helpers/AlertDialogUtils.jsx"
import EventBasicInfoForm from "@/pages/Event/CreateEvent/EventBasicInforForm.jsx"
import EventDateForm from "@/pages/Event/CreateEvent/EventDateForm.jsx"
import EventLocationForm from "@/pages/Event/CreateEvent/EventLocationForm.jsx"
import EventImagesForm from "@/pages/Event/CreateEvent/EventImagesForm.jsx"
import EventSummary from "@/pages/Event/CreateEvent/EventSummary.jsx"
import EventProgressIndicator from "@/pages/Event/CreateEvent/EventProcessIndicator.jsx"
import { useSelector } from "react-redux"
import { TicketIcon } from "lucide-react"

// Import form components

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { createEvent, getEventById, updateEvent } = useEvent()
  const { eventId } = useParams() // Get eventId from URL for update mode

  // Determine mode (create or update)
  const isUpdateMode = !!eventId
  const user = useSelector((state) => state.user.user)
  // Image uploader hook
  const {
    fileInputRef,
    uploadedImages,
    setUploadedImages,
    existingImageUrls,
    setExistingImageUrls,
    handleFileChange,
    handleRemoveImage,
  } = useImageUploader()

  // Form stages
  const [currentStage, setCurrentStage] = useState(1)
  const totalStages = 4

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    dateRange: {
      from: new Date(),
      to: addDays(new Date(), 1),
    },
    startTime: "09:00",
    endTime: "17:00",
    notifyWhen: "NONE",
    isPublic: true,
  })
  const [loading, setLoading] = useState(isUpdateMode)
  const [error, setError] = useState(null)
  const [event, setEvent] = useState(null)
  const [isOrganizer, setIsOrganizer] = useState(true)

  // Fetch event data if in update mode
  useEffect(() => {
    if (isUpdateMode) {
      const fetchEvent = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await getEventById(eventId)
          if (response.success) {
            const event = response.content.event
            setEvent(event)

            // Check if current user is the organizer
            if (user?._id !== event.organizer) {
              setIsOrganizer(false)
            } else {
              setFormData({
                title: event.title || "",
                description: event.description || "",
                category: event.type || "",
                location: event.location || "",
                dateRange: {
                  from: new Date(event.startDate),
                  to: new Date(event.endDate),
                },
                startTime: event.startTime || "09:00",
                endTime: event.endTime || "17:00",
                notifyWhen: event.notifyWhen || "NONE",
                isPublic: event.isPublic !== undefined ? event.isPublic : true,
              })
              // Populate existing images if any
              if (event.images && event.images.length > 0) {
                setExistingImageUrls(event.images.map((url) => ({ url, type: "url" })))
              }
            }
          } else {
            toast.error("Failed to load event data.")
            setError("Failed to load event data.")
          }
        } catch (error) {
          toast.error("Error loading event: " + error.message)
          setError(error.message)
        } finally {
          setLoading(false)
        }
      }
      fetchEvent()
    }
  }, [eventId, isUpdateMode, user])

  useEffect(() => {}, [event])

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
      setFormData((prev) => ({
        ...prev,
        isPublic: false,
      }))
    } else if (field === "isPublic" && checked === true) {
      setFormData((prev) => ({
        ...prev,
        isPublic: true,
        requiresApproval: false,
      }))
    } else if (field === "requiresApproval" && checked === true) {
      setFormData((prev) => ({
        ...prev,
        isPublic: false,
        requiresApproval: true,
      }))
    } else if (field === "requiresApproval" && checked === false) {
      setFormData((prev) => ({
        ...prev,
        requiresApproval: false,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title) {
        toast.error("Title is required")
        return
      }
      if (!formData.description) {
        toast.error("Description is required")
        return
      }
      if (!formData.category) {
        toast.error("Category is required")
        return
      }
      if (!formData.location) {
        toast.error("Location is required")
        return
      }
      if (!formData.dateRange?.from || !formData.dateRange?.to) {
        toast.error("Please select a valid date range")
        return
      }
      if (!(formData.dateRange.from instanceof Date) || !(formData.dateRange.to instanceof Date)) {
        toast.error("Please select a valid date range")
        return
      }

      // Create FormData
      const postData = new FormData()

      // Append time fields separately
      postData.append("startTime", formData.startTime)
      postData.append("endTime", formData.endTime)

      // Append fields
      postData.append("title", String(formData.title))
      postData.append("description", String(formData.description))

      // Combine date and time for start and end dates
      const startDate = new Date(formData.dateRange.from)
      const endDate = new Date(formData.dateRange.to)

      // Parse time strings in HH:mm format
      const [startHours, startMinutes] = formData.startTime.split(":").map(Number)
      const [endHours, endMinutes] = formData.endTime.split(":").map(Number)

      // Set hours and minutes to the date objects
      startDate.setHours(startHours, startMinutes, 0, 0)
      endDate.setHours(endHours, endMinutes, 0, 0)

      // Append the ISO string dates
      postData.append("startDate", startDate.toISOString())
      postData.append("endDate", endDate.toISOString())
      postData.append("isPublic", String(formData.isPublic))
      postData.append("location", String(formData.location))
      postData.append("type", String(formData.category))
      postData.append("notifyWhen", String(formData.notifyWhen))

      // Append existing image URLs as a JSON string
      if (existingImageUrls.length > 0) {
        postData.append("existingImages", JSON.stringify(existingImageUrls.map((image) => image.url)))
      }

      // Append new file uploads
      uploadedImages.forEach((image) => {
        if (image.type === "file" && image.file && image.file instanceof File) {
          postData.append("images", image.file)
        }
      })

      // Log FormData contents for debugging
      console.log("FormData contents:")
      for (const [key, value] of postData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`)
      }

      let response
      if (isUpdateMode) {
        // Update mode: Confirm before updating
        const confirmed = await AlertDialogUtils.info({
          title: "Update Event?",
          description: "Are you sure you want to update this event? This action cannot be undone.",
          confirmText: "Update",
          cancelText: "Cancel",
        })
        if (!confirmed) return

        response = await updateEvent(eventId, postData)
      } else {
        // Create mode
        response = await createEvent(postData)
      }

      console.log("Backend Response:", response)

      if (response.success) {
        toast.success(isUpdateMode ? "Event updated successfully!" : "Sự kiện được tạo thành công!")
        // Reset form state after successful submission
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          dateRange: {
            from: new Date(),
            to: addDays(new Date(), 1),
          },
          startTime: "09:00",
          endTime: "17:00",
          notifyWhen: "NONE",
          isPublic: true,
        })
        setUploadedImages([])
        setCurrentStage(1)
        navigate("/event")
      } else {
        toast.error(
          "Không thể " +
          (isUpdateMode ? "cập nhật" : "tạo") +
          " sự kiện: " +
          (response.message || "Lỗi không xác định"),
        )
      }
    } catch (error) {
      console.error("Lỗi khi " + (isUpdateMode ? "cập nhật" : "tạo") + " sự kiện:", error)
      toast.error(
        "Đã xảy ra lỗi khi " +
        (isUpdateMode ? "cập nhật" : "tạo") +
        " sự kiện: " +
        (error.response.data.message || "Lỗi không xác định"),
      )
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

  // Render form stages
  const renderFormStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <EventBasicInfoForm
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        )
      case 2:
        return <EventDateForm formData={formData} handleChange={handleChange} />
      case 3:
        return <EventLocationForm formData={formData} handleChange={handleChange} />
      case 4:
        return (
          <EventImagesForm
            fileInputRef={fileInputRef}
            uploadedImages={uploadedImages}
            existingImageUrls={existingImageUrls}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
          />
        )
      default:
        return null
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  // If user is not the organizer, show permission denied UI
  if (isUpdateMode && !isOrganizer && !loading) {
    return (
      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Button variant="outline" onClick={() => navigate("/event")} className="mb-6 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            Back
          </Button>

          <Card className="bg-blue-50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-blue-100 p-3">
                <TicketIcon className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">You don't have permission to edit this event</h2>
              <p className="mb-6 text-gray-600">Only the event organizer can make changes to this event</p>
              <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate(`/event/${eventId}`)}>
                View Event Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{isUpdateMode ? "Update Event" : "Create New Event"}</h1>
          <p className="text-muted-foreground">
            {isUpdateMode ? "Update the details of your event" : "Điền thông tin để tạo sự kiện của bạn"}
          </p>
        </div>

        <EventProgressIndicator currentStage={currentStage} totalStages={totalStages} />

        <Card>
          <CardContent className="pt-6">
            {renderFormStage()}
            {currentStage === totalStages && (
              <EventSummary formData={formData} uploadedImages={uploadedImages} existingImageUrls={existingImageUrls} />
            )}

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={currentStage === 1 ? () => navigate("/event") : prevStage}>
                {currentStage === 1 ? "Hủy" : "Quay lại"}
              </Button>

              <Button onClick={currentStage === totalStages ? handleSubmit : nextStage}>
                {currentStage === totalStages ? (isUpdateMode ? "Update Event" : "Create Event") : "Tiếp theo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
