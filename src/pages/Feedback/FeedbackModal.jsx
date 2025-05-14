"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clipboard, MessageSquare } from "lucide-react"

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if the modal has been shown before in this session
    const hasSeenModal = sessionStorage.getItem("feedbackModalShown")

    if (!hasSeenModal) {
      // Wait a moment before showing the modal for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
        // Mark that the modal has been shown
        // sessionStorage.setItem("feedbackModalShown", "true")
      }, 3) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleGoToFeedback = () => {
    setIsOpen(false)
    navigate("/feedback")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            We Need Your Feedback!
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-gray-600">
            Hello from Group 5 at RMIT University in Hanoi Campus!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4 text-sm text-gray-700">
            We're working on our Fullstack Web Development course project and would greatly appreciate your feedback on
            our website.
          </p>
          <p className="mb-4 text-sm text-gray-700">
            Please take some time to explore all the features of our website, and when you're ready, visit our Feedback
            page to share your thoughts.
          </p>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">
              Your feedback is invaluable to us and will help us improve our project. Thank you for your support!
            </p>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={handleClose} className="sm:mt-0">
            Explore First
          </Button>
          <Button onClick={handleGoToFeedback} className="gap-2">
            <Clipboard className="h-4 w-4" />
            Go to Feedback Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
