"use client"

import { useState, useEffect, useMemo } from "react"

export default function useEventFiltering(events = []) {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState("all") // "all", "public", "private"
  const [selectedTypes, setSelectedTypes] = useState([])
  const [sortBy, setSortBy] = useState("newest") // "newest", "oldest", "upcoming"
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Apply filters and search to the events
  const filteredEvents = useMemo(() => {
    if (!events.length) return []

    return events
      .filter((event) => {
        // Apply search filter - safely check if name exists and is a string
        if (debouncedSearchTerm) {
          // Check if event has a name property that's a string
          const eventName = event.name || event.title || ""
          const searchableText = typeof eventName === "string" ? eventName.toLowerCase() : ""

          // If searchable text doesn't include the search term, filter it out
          if (!searchableText.includes(debouncedSearchTerm.toLowerCase())) {
            return false
          }
        }

        // Apply visibility filter
        if (visibilityFilter !== "all") {
          const isPublic = visibilityFilter === "public"
          if (event.isPublic !== isPublic) {
            return false
          }
        }

        // Apply event type filter
        if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        // Apply sorting
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          case "oldest":
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          case "upcoming":
            return new Date(a.startDate || 0) - new Date(b.startDate || 0)
          default:
            return 0
        }
      })
  }, [events, debouncedSearchTerm, visibilityFilter, selectedTypes, sortBy])

  const clearFilters = () => {
    setVisibilityFilter("all")
    setSelectedTypes([])
    setSortBy("newest")
    setCurrentPage(1)
  }

  return {
    searchTerm,
    setSearchTerm,
    visibilityFilter,
    setVisibilityFilter,
    selectedTypes,
    setSelectedTypes,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    filteredEvents,
    clearFilters,
  }
}
