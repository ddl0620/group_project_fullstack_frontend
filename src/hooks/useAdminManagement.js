"use client"

import { useDispatch, useSelector } from "react-redux"
import { useCallback, useRef } from "react"
import {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  reactivateUser,
  setUserActivities,
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setLoading,
  setError,
} from "@/store/slices/adminManagementSlice.js"
import {
  getAllUsersAPI,
  updateUserAPI,
  deleteUserAPI,
  getAllEventsAPI,
  getAllEventsByUserIdAPI,
  updateEventAPI,
  deleteEventAPI, createNewUserAPI,
} from '@/services/AdminManagementService.js';
import { checkToken } from "@/helpers/checkToken.js"
import { Toast } from "@/helpers/toastService.js"
import APIServices from "@/services/APIServices.js"

export const useAdminManagement = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.adminManagement.loading)
  const error = useSelector((state) => state.adminManagement.error)
  const users = useSelector((state) => state.adminManagement.users)
  const events = useSelector((state) => state.adminManagement.events)
  const userActivities = useSelector((state) => state.adminManagement.userActivities)
  const eventDetails = useSelector((state) => state.adminManagement.eventDetails)
  const pagination = useSelector((state) => state.adminManagement.pagination)

  // Cache to store fetched data
  const cache = useRef({})

  // Helper to clear cache for a specific pattern
  const clearCache = (pattern) => {
    Object.keys(cache.current).forEach((key) => {
      if (key.includes(pattern)) {
        delete cache.current[key]
      }
    })
  }

  // User Management Functions
  const createUser = useCallback(
    async (userData) => {
      const toastId = Toast.loading("Creating user...")
      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await createNewUserAPI(userData);
        if (!response.success) {
          throw new Error(response.message || "Failed to create user")
        }
        console.log(response.content.user)
        dispatch(addUser(response.content.user))
        // Clear users cache to force refresh on next fetch
        clearCache("users-")
        Toast.success("User created successfully")
        return response.content.user
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to create user: ${errorMessage}`)
        throw error
      } finally {
        Toast.dismiss(toastId)
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const fetchUsers = useCallback(
    async (page = 1, limit = 10, isAcs = true, forceRefresh = false) => {
      const cacheKey = `users-${page}-${limit}-${isAcs}`
      if (!forceRefresh && cache.current[cacheKey]) {
        dispatch(setUsers(cache.current[cacheKey]))
        return cache.current[cacheKey]
      }

      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await getAllUsersAPI(page, limit, isAcs)
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch users")
        }

        const result = {
          users: Array.isArray(response.content.users) ? response.content.users : [],
          pagination: response.content.pagination || { page, limit, total: response.content.users.length },
        }

        cache.current[cacheKey] = result
        dispatch(setUsers(result))
        return result
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to fetch users: ${errorMessage}`)
        throw error
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const updateUserInfo = useCallback(
    async (userId, userData) => {
      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await updateUserAPI(userId, userData)
        if (!response.success) {
          throw new Error(response.message || "Failed to update user")
        }

        // Dispatch the complete user object to Redux
        dispatch(updateUser(response.content.user))
        Toast.success("User updated successfully")
        return response.content.user
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to update user: ${errorMessage}`)
        throw error
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const softDeleteUser = useCallback(
    async (userId) => {
      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await deleteUserAPI(userId)
        if (!response.success) {
          throw new Error(response.message || "Failed to delete user")
        }

        dispatch(deleteUser({ userId }))
        // Clear users cache to force refresh on next fetch
        clearCache("users-")
        Toast.success("User deleted successfully")
        return response.content
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to delete user: ${errorMessage}`)
        throw error
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const reactivateUserAccount = useCallback(
    async (userId) => {
      const toastId = Toast.loading("Reactivating user...")
      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await APIServices.patch(`/api/v1/admin/user-management/${userId}/reactivate`)
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to reactivate user")
        }

        dispatch(reactivateUser({ userId }))
        // Clear users cache to force refresh on next fetch
        clearCache("users-")
        Toast.success("User reactivated successfully")
        return response.data.content
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to reactivate user: ${errorMessage}`)
        throw error
      } finally {
        Toast.dismiss(toastId)
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const fetchUserActivities = useCallback(
    async (userId, page = 1, limit = 10, isAcs = true) => {
      const cacheKey = `user-activities-${userId}-${page}-${limit}-${isAcs}`
      if (cache.current[cacheKey]) {
        dispatch(setUserActivities(cache.current[cacheKey]))
        return cache.current[cacheKey]
      }

      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await getAllEventsByUserIdAPI(userId, page, limit, isAcs)
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch user activities")
        }
        const events = Array.isArray(response.content.events) ? response.content.events : []
        const organizedEvents = [];
        const joiningEvents = [];
        if (events && events.length > 0) {
          events.forEach((event) => {
            if (event.organizer === userId) {
              organizedEvents.push(event)
            }
          })
          events.forEach((event) => {
            event.participants.forEach((participant) => {
              if (participant.userId === userId && participant.status === "ACCEPTED") {
                joiningEvents.push(event)
              }
            })
          })
        }

        const result = {
          joiningEvents: joiningEvents || [],
          organizedEvents: organizedEvents || [],
          // discussionPosts: postsRes.data.content.posts || []
        }

        cache.current[cacheKey] = result
        dispatch(setUserActivities(result))
        return result
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to fetch user activities: ${errorMessage}`)
        throw error
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  // Note: didnt impl
  const createEvent = useCallback(
    async (eventData) => {
      const toastId = Toast.loading("Creating event...")
      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await APIServices.post("/api/v1/admin/event-management", eventData)
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create event")
        }

        dispatch(addEvent(response.data.content.event))
        // Clear events cache
        clearCache("events-")
        Toast.success("Event created successfully")
        return response.data.content.event
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to create event: ${errorMessage}`)
        throw error
      } finally {
        Toast.dismiss(toastId)
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const fetchEvents = useCallback(
    async (page = 1, limit = 10, isAcs = true, forceRefresh = false) => {
      const cacheKey = `events-${page}-${limit}-${isAcs}`
      if (!forceRefresh && cache.current[cacheKey]) {
        dispatch(setEvents(cache.current[cacheKey]))
        return cache.current[cacheKey]
      }

      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await getAllEventsAPI(page, limit, isAcs)
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch events")
        }

        const result = {
          events: Array.isArray(response.content.events) ? response.content.events : [],
          pagination: response.content.pagination || { page, limit, total: response.content.events.length },
        }

        cache.current[cacheKey] = result
        dispatch(setEvents(result))
        return result
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to fetch events: ${errorMessage}`)
        throw error
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const updateEventInfo = useCallback(
    async (eventId, eventData) => {
      const toastId = Toast.loading("Updating event...")
      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await updateEventAPI(eventId, eventData)
        if (!response.success) {
          throw new Error(response.message || "Failed to update event")
        }

        dispatch(updateEvent(response.content.event))
        // Clear events cache
        clearCache("events-")
        Toast.success("Event updated successfully")
        return response.content.event
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to update event: ${errorMessage}`)
        throw error
      } finally {
        Toast.dismiss(toastId)
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  const softDeleteEvent = useCallback(
    async (eventId) => {
      const toastId = Toast.loading("Deleting event...")
      try {
        dispatch(setError(null))
        dispatch(setLoading(true))
        checkToken()
        const response = await deleteEventAPI(eventId)
        if (!response.success) {
          throw new Error(response.message || "Failed to delete event")
        }

        dispatch(deleteEvent({ eventId }))
        // Clear events cache
        clearCache("events-")
        Toast.success("Event deleted successfully")
        return response.content
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(setError(errorMessage))
        Toast.error(`Failed to delete event: ${errorMessage}`)
        throw error
      } finally {
        Toast.dismiss(toastId)
        dispatch(setLoading(false))
      }
    },
    [dispatch],
  )

  return {
    // User Management
    createUser,
    fetchUsers,
    updateUserInfo,
    softDeleteUser,
    reactivateUserAccount,
    fetchUserActivities,
    // Event Management
    createEvent,
    fetchEvents,
    updateEventInfo,
    softDeleteEvent,
    // State
    users,
    events,
    userActivities,
    eventDetails,
    pagination,
    loading,
    error,
  }
}

export default useAdminManagement
