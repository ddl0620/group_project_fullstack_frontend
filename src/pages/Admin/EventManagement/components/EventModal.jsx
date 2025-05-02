"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { addDays } from "date-fns"
import { useImageUploader } from "@/components/ImageUploader"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import EventBasicInfoForm from '@/pages/Event/CreateEvent/EventBasicInforForm.jsx';
import EventDateForm from '@/pages/Event/CreateEvent/EventDateForm.jsx';
import EventLocationForm from '@/pages/Event/CreateEvent/EventLocationForm.jsx';
import EventOrganizerForm from '@/pages/Event/CreateEvent/EventOrganizerForm.jsx';
import EventImagesForm from '@/pages/Event/CreateEvent/EventImagesForm.jsx';
import EventProgressIndicator from '@/pages/Event/CreateEvent/EventProcessIndicator.jsx';
import EventSummary from '@/pages/Event/CreateEvent/EventSummary.jsx';

// Import form components


export default function EventModal({ isOpen, setIsOpen, event = null, onSubmit, isLoading = false, users = [] }) {
  const isUpdateMode = !!event?._id

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
  const totalStages = 5

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
    isPublic: true,
    organizer: null,
  })

  // Populate form data if in update mode
  useEffect(() => {
    if (isUpdateMode && event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        category: event.type || "",
        location: event.location || "",
        dateRange: {
          from: new Date(event.startDate),
          to: new Date(event.endDate),
        },
        isPublic: event.isPublic !== undefined ? event.isPublic : true,
        organizer: event.organizer || null,
      })

      // Populate existing images if any
      if (event.images && event.images.length > 0) {
        setExistingImageUrls(event.images.map((url) => ({ url, type: "url" })))
      }
    }
  }, [event, isUpdateMode])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(1)
      if (!isUpdateMode) {
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          dateRange: {
            from: new Date(),
            to: addDays(new Date(), 1),
          },
          isPublic: true,
          organizer: null,
        })
        setUploadedImages([])
        setExistingImageUrls([])
      }
    }
  }, [isOpen, isUpdateMode])

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
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title) {
      alert("Event name is required")
      return
    }
    if (!formData.description) {
      alert("Event description is required")
      return
    }
    if (!formData.category) {
      alert("Event category is required")
      return
    }
    if (!formData.location) {
      alert("Event location is required")
      return
    }
    if (!formData.dateRange?.from || !formData.dateRange?.to) {
      alert("Please select a valid date range")
      return
    }

    // Create FormData
    const postData = new FormData()

    // Append fields
    postData.append("title", String(formData.title))
    postData.append("description", String(formData.description))
    postData.append("startDate", formData.dateRange.from.toISOString())
    postData.append("endDate", formData.dateRange.to.toISOString())
    postData.append("isPublic", String(formData.isPublic))
    postData.append("location", String(formData.location))
    postData.append("type", String(formData.category))

    // Append organizer if selected
    if (formData.organizer) {
      postData.append("organizer", formData.organizer._id)
    }

    // Append existing image URLs as a JSON string
    const imageUrls = existingImageUrls.map((image) => image.url)
    if (imageUrls.length > 0) {
      postData.append("existingImages", JSON.stringify(imageUrls))
    }

    // Append new file uploads
    uploadedImages.forEach((image) => {
      if (image.file && image.file instanceof File) {
        postData.append("images", image.file)
      }
    })

    // Call the onSubmit callback with the form data and event ID if in update mode
    onSubmit(postData, isUpdateMode ? event._id : null)
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
        return <EventOrganizerForm formData={formData} handleChange={handleChange} users={users} />
      case 5:
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{isUpdateMode ? "Update Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {isUpdateMode ? "Update the details of your event" : "Fill in the information to create your event"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <EventProgressIndicator currentStage={currentStage} totalStages={totalStages} />

          <Card>
            <CardContent className="pt-6">
              {renderFormStage()}
              {currentStage === totalStages && (
                <EventSummary
                  formData={formData}
                  uploadedImages={uploadedImages}
                  existingImageUrls={existingImageUrls}
                />
              )}

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStage} disabled={currentStage === 1}>
                  {currentStage === 1 ? "Cancel" : "Back"}
                </Button>

                <Button onClick={currentStage === totalStages ? handleSubmit : nextStage} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : currentStage === totalStages ? (
                    isUpdateMode ? (
                      "Update Event"
                    ) : (
                      "Create Event"
                    )
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
