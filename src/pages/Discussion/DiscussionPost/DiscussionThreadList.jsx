"use client"

// src/components/DiscussionThreadList.jsx
import { useState, useEffect } from "react"
import { MessageSquare, Filter, PlusCircle, Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import { useDiscussionPost } from "@/hooks/useDiscussionPost.js"
import { DiscussionPost } from "@/pages/Discussion/DiscussionPost/DiscussionPost.jsx"
import { CreateEditDiscussionPost } from "@/pages/Discussion/DiscussionPost/CreateEditDiscusisonPost.jsx"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const DiscussionThreadList = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const { fetchPosts, pagination, loading, error } = useDiscussionPost()
  const me = useSelector((state) => state.user.user)
  const posts = useSelector((state) => state.discussionPost.posts) || []
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(10)

  useEffect(() => {
    if (eventId) {
      fetchPosts(eventId, currentPage, postsPerPage)
    }
  }, [eventId, fetchPosts, currentPage, postsPerPage])

  const filteredDiscussions = Array.isArray(posts)
    ? posts
      .filter((discussion) => {
        if (activeTab === "all") return true
        if (activeTab === "mine") {
          return discussion.creator_id._id === me._id
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at) - new Date(a.created_at)
        } else if (sortBy === "oldest") {
          return new Date(a.created_at) - new Date(b.created_at)
        }
        return 0
      })
    : []

  const handleCreatePost = async () => {
    await fetchPosts(eventId, 1, postsPerPage, true)
    setIsCreateModalOpen(false)
    setCurrentPage(1) // Reset to first page after creating a new post
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0) // Scroll to top when changing pages
  }

  // Calculate total pages
  const totalPages = pagination.total ? Math.ceil(pagination.total / postsPerPage) : 1

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = window.innerWidth < 375 ? 3 : 5 // Fewer pages on very small screens

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // For very small screens, show fewer pages
      if (window.innerWidth < 375) {
        if (currentPage <= 2) {
          endPage = Math.min(3, totalPages - 1)
        } else if (currentPage >= totalPages - 1) {
          startPage = Math.max(2, totalPages - 2)
        } else {
          startPage = currentPage
          endPage = currentPage
        }
      } else {
        // Adjust if we're near the beginning
        if (currentPage <= 3) {
          endPage = Math.min(4, totalPages - 1)
        }

        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
          startPage = Math.max(2, totalPages - 3)
        }
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("ellipsis1")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis2")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-3 sm:p-8 rounded-lg border border-red-200 bg-red-50 m-2 sm:m-6">
        <div className="rounded-full bg-red-100 p-2 sm:p-3 mb-2 sm:mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-red-800 mb-1 sm:mb-2">Error Loading Discussions</h3>
        <p className="text-red-600 text-center text-xs sm:text-sm mb-2 sm:mb-4">{error}</p>
        {error !== "You are not authorized to access this event" && (
          <Button
            onClick={() => fetchPosts(eventId, 1, postsPerPage, true)}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-10"
          >
            Try Again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="border-b bg-white p-2 sm:p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Event Discussions</h1>

          <div className="flex items-center gap-1 sm:gap-2">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="hidden sm:block">
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="mine">My Posts</TabsTrigger>
              </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                <DropdownMenuItem
                  onClick={() => setSortBy("newest")}
                  className={sortBy === "newest" ? "bg-primary/10" : ""}
                >
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("oldest")}
                  className={sortBy === "oldest" ? "bg-primary/10" : ""}
                >
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CreateEditDiscussionPost
              onSuccess={handleCreatePost}
              eventId={eventId}
              isModalOpen={isCreateModalOpen}
              setIsModalOpen={setIsCreateModalOpen}
              triggerButton={
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">New Post</span>
                </Button>
              }
            />
          </div>
        </div>

        <div className="mt-2 sm:mt-4 sm:hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="text-xs py-1">
                All Posts
              </TabsTrigger>
              <TabsTrigger value="mine" className="text-xs py-1">
                My Posts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary mb-2 sm:mb-4" />
            <p className="text-gray-500 text-xs sm:text-sm">Loading discussions...</p>
          </div>
        ) : filteredDiscussions.length > 0 ? (
          <div className="space-y-3 sm:space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-gray-100 text-xs sm:text-sm">
                {typeof pagination.total === "number" ? pagination.total : filteredDiscussions.length} posts
              </Badge>

              {activeTab === "mine" && filteredDiscussions.length === 0 && (
                <p className="text-xs sm:text-sm text-gray-500">You haven't created any posts yet</p>
              )}
            </div>

            <div className="space-y-3 sm:space-y-6 flex flex-col items-center justify-start w-full">
              {filteredDiscussions.map((discussion) => (
                <div key={discussion._id} className="w-full">
                  <DiscussionPost postData={discussion} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4 sm:mt-8">
                <PaginationContent className="gap-1 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} h-8 w-8 sm:h-10 sm:w-10 p-0 sm:p-2 text-xs sm:text-sm`}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === "ellipsis1" || page === "ellipsis2" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="h-8 w-8 sm:h-10 sm:w-10" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                          className="h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} h-8 w-8 sm:h-10 sm:w-10 p-0 sm:p-2 text-xs sm:text-sm`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4 sm:p-6 mb-2 sm:mb-4">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">No discussions yet</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-4 sm:mb-6 px-2">
              Be the first to start a discussion for this event. Share your thoughts, ask questions, or post updates.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="h-8 sm:h-10 text-xs sm:text-sm">
              <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Create New Post
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionThreadList
