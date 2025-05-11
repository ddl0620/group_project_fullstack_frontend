"use client"

// src/components/DiscussionHeader.jsx
import { useState } from "react"
import { Calendar, MapPin, Users, PlusIcon, FileIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useDiscussionPost } from "@/hooks/useDiscussionPost.js"

const DiscussionHeader = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createPost } = useDiscussionPost()

  const handleCreatePost = async (postData) => {
    try {
      await createPost(event.id, postData)
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  return (
    <div className="border-b border-gray-200 bg-white p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{event.title}</h1>
          <div className="mt-1 sm:mt-2 flex flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Users className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{event.participants.length} attendees</span>
            </div>
          </div>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="primary"
              size="sm"
              className="mt-2 sm:mt-0 h-8 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
            >
              <PlusIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="text-black max-w-[95vw] sm:max-w-md p-3 sm:p-6">
            <DialogHeader>
              <DialogTitle className="font-bold text-base sm:text-lg">New Discussion</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">Create a new thread for this event.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-6">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="discussionTitle" className="text-xs sm:text-sm">
                  Your title of discussion
                </Label>
                <Input
                  id="discussionTitle"
                  placeholder="Enter a title for your discussion"
                  className="h-8 sm:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="discussionTopic" className="text-xs sm:text-sm">
                  What is the topic of your discussion?
                </Label>
                <Textarea
                  id="discussionTopic"
                  placeholder="Describe your discussion topic"
                  className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="questionsFile" className="text-xs sm:text-sm">
                  Upload your image
                </Label>
                <Card>
                  <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                    <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gray-200 p-3 sm:p-6">
                      <FileIcon className="h-8 w-8 sm:h-12 sm:w-12" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500 text-center">
                        Drag and drop an image or click to browse
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500">Up to 2MB</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2 text-sm">
                      <Label htmlFor="file" className="text-xs sm:text-sm font-medium">
                        Choose an image
                      </Label>
                      <Input id="file" type="file" placeholder="File" accept="image/*" className="text-xs sm:text-sm" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter className="flex flex-col xs:flex-row gap-2 xs:gap-0 mt-3 sm:mt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full xs:w-auto h-8 sm:h-10 text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePost} className="w-full xs:w-auto h-8 sm:h-10 text-xs sm:text-sm">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default DiscussionHeader
