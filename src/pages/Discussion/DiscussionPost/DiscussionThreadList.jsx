"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Filter, PlusCircle, Loader2, MessageSquare } from "lucide-react"

const DiscussionThreadList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [threads, setThreads] = useState([])

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false)
      // Simulate empty data
      setThreads([])
    }, 1500)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white p-2 sm:p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Event Discussions</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">New Post</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary mb-2 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-500">Loading discussions...</p>
          </div>
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4 sm:p-6 mb-2 sm:mb-4">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">No discussions yet</h3>
            <p className="text-gray-500 max-w-md mb-4 sm:mb-6 text-sm sm:text-base">
              Be the first to start a discussion for this event. Share your thoughts, ask questions, or post updates.
            </p>
          </div>
        ) : (
          <div>
            {/* Discussion threads will be rendered here */}
            {/* Example: {threads.map((thread) => (<div key={thread.id}>{thread.title}</div>))} */}
            Threads will go here
          </div>
        )}
      </div>

      {/* Create Modal (Conditionally rendered) */}
      {/* {isCreateModalOpen && (
        <CreateDiscussionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )} */}
    </div>
  )
}

export default DiscussionThreadList
