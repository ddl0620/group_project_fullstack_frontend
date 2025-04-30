"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEvent } from "@/hooks/useEvent"
import { toast } from "sonner"
import {
  PlusCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  X,
  SlidersHorizontal,
  Loader2,
  Globe,
  LockIcon,
  Unlock,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { EventCard } from '@/components/shared/EventCard.jsx';

const ITEMS_PER_PAGE = 9

// Sample categories - replace with your actual categories
const EVENT_CATEGORIES = [
  "Social",
  "Education",
  "Business",
  "Entertainment",
  "Sports",
  "Technology",
  "Health",
  "Arts",
  "Other",
]

export default function BrowseEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState("all") // "all", "public", "private"
  const [selectedCategories, setSelectedCategories] = useState([])
  const [eventType, setEventType] = useState("all") // "all", "online", "in-person"
  const [sortBy, setSortBy] = useState("newest") // "newest", "oldest", "upcoming"
  const [activeFilters, setActiveFilters] = useState(0)

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
    totalEvents: 0,
  })

  const { getAllEvents } = useEvent()
  const location = useLocation()
  const navigate = useNavigate()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Count active filters
  useEffect(() => {
    let count = 0
    if (visibilityFilter !== "all") count++
    if (selectedCategories.length > 0) count++
    if (eventType !== "all") count++
    if (sortBy !== "newest") count++
    setActiveFilters(count)
  }, [visibilityFilter, selectedCategories, eventType, sortBy])

  // Fetch events with filters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)

        // Prepare filter parameters
        const params = {
          page: pagination.page,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearchTerm,
          isPublic: visibilityFilter === "all" ? undefined : visibilityFilter === "public",
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          type: eventType === "all" ? undefined : eventType.toUpperCase(),
          sortBy,
        }

        const response = await getAllEvents(params)

        setEvents(response.content.events || [])
        setPagination({
          page: response.content.pagination.page || 1,
          limit: response.content.pagination.limit || ITEMS_PER_PAGE,
          totalPages: response.content.pagination.totalPages || 1,
          totalEvents: response.content.pagination.totalEvents || 0,
        })
      } catch (err) {
        toast.error("Error fetching events: " + err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [pagination.page, debouncedSearchTerm, visibilityFilter, selectedCategories, eventType, sortBy])

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
    // Reset to first page when changing filters
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setVisibilityFilter("all")
    setSelectedCategories([])
    setEventType("all")
    setSortBy("newest")
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleShowEvent = (eventId) => {
    navigate(`/event/${eventId}`)
  }

  // Calculate pagination display values
  const startIndex = (pagination.page - 1) * pagination.limit + 1
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.totalEvents)

  // Generate page numbers for display
  const getPageNumbers = () => {
    const maxPagesToShow = 5
    const pages = []
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Add pages and ellipsis if needed
    if (startPage > 1) {
      pages.push({ type: "page", value: 1 })
      if (startPage > 2) {
        pages.push({ type: "ellipsis", value: "left" })
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push({ type: "page", value: i })
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push({ type: "ellipsis", value: "right" })
      }
      pages.push({ type: "page", value: pagination.totalPages })
    }

    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
            <p className="mt-1 text-gray-500">Discover and join exciting events</p>
          </div>

          <Link to="/event/create">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search events by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  {sortBy === "newest" && "Newest"}
                  {sortBy === "oldest" && "Oldest"}
                  {sortBy === "upcoming" && "Upcoming"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort Events</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("upcoming")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Upcoming Events
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 sm:hidden">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">{activeFilters}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filter Events</SheetTitle>
                  <SheetDescription>Apply filters to find the perfect events for you</SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-6">
                  {/* Visibility Filter */}
                  <div>
                    <h3 className="mb-2 font-medium">Event Visibility</h3>
                    <RadioGroup value={visibilityFilter} onValueChange={setVisibilityFilter}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="mobile-all" />
                        <Label htmlFor="mobile-all">All Events</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="mobile-public" />
                        <Label htmlFor="mobile-public">Public Events</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="mobile-private" />
                        <Label htmlFor="mobile-private">Private Events</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Event Type Filter */}
                  <div>
                    <h3 className="mb-2 font-medium">Event Type</h3>
                    <RadioGroup value={eventType} onValueChange={setEventType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="mobile-type-all" />
                        <Label htmlFor="mobile-type-all">All Types</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="mobile-online" />
                        <Label htmlFor="mobile-online">Online Events</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="mobile-in-person" />
                        <Label htmlFor="mobile-in-person">In-Person Events</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Categories Filter */}
                  <div>
                    <h3 className="mb-2 font-medium">Categories</h3>
                    <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
                      {EVENT_CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <Label htmlFor={`mobile-category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter className="mt-6 flex-row justify-between gap-2">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Clear Filters
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Desktop Filter Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden gap-2 sm:flex">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">{activeFilters}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Filter Events</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="p-2">
                  {/* Visibility Filter */}
                  <h4 className="mb-2 text-sm font-medium">Event Visibility</h4>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge
                      variant={visibilityFilter === "all" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setVisibilityFilter("all")}
                    >
                      All
                    </Badge>
                    <Badge
                      variant={visibilityFilter === "public" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setVisibilityFilter("public")}
                    >
                      <Unlock className="mr-1 h-3 w-3" />
                      Public
                    </Badge>
                    <Badge
                      variant={visibilityFilter === "private" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setVisibilityFilter("private")}
                    >
                      <LockIcon className="mr-1 h-3 w-3" />
                      Private
                    </Badge>
                  </div>

                  {/* Event Type Filter */}
                  <h4 className="mb-2 text-sm font-medium">Event Type</h4>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge
                      variant={eventType === "all" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setEventType("all")}
                    >
                      All Types
                    </Badge>
                    <Badge
                      variant={eventType === "online" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setEventType("online")}
                    >
                      <Globe className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                    <Badge
                      variant={eventType === "in-person" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setEventType("in-person")}
                    >
                      <MapPin className="mr-1 h-3 w-3" />
                      In-Person
                    </Badge>
                  </div>

                  {/* Categories Filter */}
                  <h4 className="mb-2 text-sm font-medium">Categories</h4>
                  <div className="mb-2 flex max-h-[150px] flex-wrap gap-2 overflow-y-auto">
                    {EVENT_CATEGORIES.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {selectedCategories.includes(category) && <Tag className="mr-1 h-3 w-3" />}
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center font-medium text-red-500 focus:text-red-500"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Active filters:</span>

            {visibilityFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {visibilityFilter === "public" ? (
                  <>
                    <Unlock className="h-3 w-3" />
                    Public Events
                  </>
                ) : (
                  <>
                    <LockIcon className="h-3 w-3" />
                    Private Events
                  </>
                )}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setVisibilityFilter("all")} />
              </Badge>
            )}

            {eventType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {eventType === "online" ? (
                  <>
                    <Globe className="h-3 w-3" />
                    Online Events
                  </>
                ) : (
                  <>
                    <MapPin className="h-3 w-3" />
                    In-Person Events
                  </>
                )}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setEventType("all")} />
              </Badge>
            )}

            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {category}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleCategoryToggle(category)} />
              </Badge>
            ))}

            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 gap-1 text-xs font-medium text-gray-500"
              >
                <X className="h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <h3 className="flex items-center gap-2 font-medium">
              <X className="h-5 w-5" />
              Error loading events
            </h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                // actions={[
                //   {
                //     button: (
                //       <Button onClick={() => handleShowEvent(event._id)} className="flex items-center gap-2">
                //         <Eye className="h-4 w-4" />
                //         View Details
                //       </Button>
                //     ),
                //     onClick: () => {},
                //   },
                // ]}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <Calendar className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No events found</h3>
            <p className="mt-1 text-center text-gray-500">
              {debouncedSearchTerm || activeFilters > 0
                ? "Try adjusting your search or filters to find events"
                : "Create your first event to get started"}
            </p>
            <Link to="/event/create" className="mt-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && events.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex}-{endIndex} of {pagination.totalEvents} events
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {getPageNumbers().map((item, index) =>
                  item.type === "page" ? (
                    <PaginationItem key={item.value}>
                      <PaginationLink
                        onClick={() => handlePageChange(item.value)}
                        isActive={pagination.page === item.value}
                        className={pagination.page === item.value ? "bg-primary text-white" : "cursor-pointer"}
                      >
                        {item.value}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`ellipsis-${item.value}-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className={
                      pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
