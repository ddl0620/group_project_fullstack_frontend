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
    const maxVisiblePages = 5 // Maximum number of page links to show

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

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
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
      <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-red-200 bg-red-50 m-6">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Discussions</h3>
        <p className="text-red-600 text-center mb-4">{error}</p>
        {error !== "You are not authorized to access this event" && (
          <Button
            onClick={() => fetchPosts(eventId, 1, postsPerPage, true)}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="border-b bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Event Discussions</h1>

          <div className="flex items-center gap-2">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="hidden sm:block">
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="mine">My Posts</TabsTrigger>
              </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">New Post</span>
                </Button>
              }
            />

            {/*<Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">*/}
            {/*  <PlusCircle className="h-4 w-4" />*/}
            {/*  <span className="hidden sm:inline">New Post</span>*/}
            {/*</Button>*/}
          </div>
        </div>

        <div className="mt-4 sm:hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="mine">My Posts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Loading discussions...</p>
          </div>
        ) : filteredDiscussions.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-gray-100">
                {typeof pagination.total === "number" ? pagination.total : filteredDiscussions.length} posts
              </Badge>

              {activeTab === "mine" && filteredDiscussions.length === 0 && (
                <p className="text-sm text-gray-500">You haven't created any posts yet</p>
              )}
            </div>

            <div className="space-y-6 flex flex-col items-center justify-start">
              {filteredDiscussions.map((discussion) => (
                <DiscussionPost key={discussion._id} postData={discussion} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === "ellipsis1" || page === "ellipsis2" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink isActive={currentPage === page} onClick={() => handlePageChange(page)}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-500 max-w-md mb-6">
              Be the first to start a discussion for this event. Share your thoughts, ask questions, or post updates.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </div>
        )}
      </div>

      {/*<CreateEditDiscussionPost*/}
      {/*  onSuccess={handleCreatePost}*/}
      {/*  eventId={eventId}*/}
      {/*  isModalOpen={isCreateModalOpen}*/}
      {/*  setIsModalOpen={setIsCreateModalOpen}*/}
      {/*/>*/}
    </div>
  )
}

export default DiscussionThreadList
