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
import EventBasicInfoForm from '@/pages/Event/CreateEvent/EventBasicInforForm.jsx';
import EventDateForm from '@/pages/Event/CreateEvent/EventDateForm.jsx';
import EventLocationForm from '@/pages/Event/CreateEvent/EventLocationForm.jsx';
import EventImagesForm from '@/pages/Event/CreateEvent/EventImagesForm.jsx';
import EventSummary from '@/pages/Event/CreateEvent/EventSummary.jsx';
import EventProgressIndicator from '@/pages/Event/CreateEvent/EventProcessIndicator.jsx';

// Import form components


export default function CreateEventPage() {
  const navigate = useNavigate()
  const { createEvent, getEventById, updateEvent } = useEvent()
  const { eventId } = useParams() // Get eventId from URL for update mode

  // Determine mode (create or update)
  const isUpdateMode = !!eventId

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
    isPublic: true,
  })
  const [loading, setLoading] = useState(isUpdateMode)
  const [error, setError] = useState(null)

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
            })
            // Populate existing images if any
            if (event.images && event.images.length > 0) {
              setExistingImageUrls(event.images.map((url) => ({ url, type: "url" })))
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
  }, [eventId, isUpdateMode])

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
        toast.error("Tên sự kiện là bắt buộc")
        return
      }
      if (!formData.description) {
        toast.error("Mô tả sự kiện là bắt buộc")
        return
      }
      if (!formData.category) {
        toast.error("Danh mục sự kiện là bắt buộc")
        return
      }
      if (!formData.location) {
        toast.error("Địa điểm sự kiện là bắt buộc")
        return
      }
      if (!formData.dateRange?.from || !formData.dateRange?.to) {
        toast.error("Vui lòng chọn khoảng thời gian hợp lệ")
        return
      }
      if (!(formData.dateRange.from instanceof Date) || !(formData.dateRange.to instanceof Date)) {
        toast.error("Ngày bắt đầu hoặc kết thúc không hợp lệ")
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

      // Append existing image URLs as a JSON string
      const imageUrls = uploadedImages.filter((image) => image.type === "url").map((image) => image.url)
      if (imageUrls.length > 0) {
        postData.append("existingImages", JSON.stringify(imageUrls))
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
        ( error.response.data.message || "Lỗi không xác định"),
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
