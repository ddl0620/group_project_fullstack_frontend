"use client"

import { useState, useCallback } from "react"

// Mock data for demonstration
const mockNotifications = [
  {
    _id: "1",
    title: "New Event Invitation",
    content: "You've been invited to 'Summer Coding Retreat' by John Doe.",
    type: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
  },
  {
    _id: "2",
    title: "Event Reminder",
    content: "Your event 'Team Meeting' starts in 1 hour.",
    type: "WARNING",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
  },
  {
    _id: "3",
    title: "Registration Successful",
    content: "You have successfully registered for 'JavaScript Conference 2025'.",
    type: "SUCCESS",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: false,
  },
  {
    _id: "4",
    title: "Payment Failed",
    content: "Your payment for 'Premium Subscription' could not be processed. Please update your payment method.",
    type: "ERROR",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: false,
  },
  {
    _id: "5",
    title: "New Comment",
    content: "Sarah commented on your event 'Birthday Party': 'Looking forward to it!'",
    type: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: true,
  },
]

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/notifications')
      // const data = await response.json()

      // Using mock data for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      setNotifications(mockNotifications)
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' })

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )

      return true
    } catch (err) {
      console.error("Error marking notification as read:", err)
      return false
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/notifications/read-all', { method: 'PUT' })

      // Update local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))

      return true
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
      return false
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' })

      // Update local state
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId))

      return true
    } catch (err) {
      console.error("Error deleting notification:", err)
      return false
    }
  }, [])

  const clearAllNotifications = useCallback(async () => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/notifications/clear-all', { method: 'DELETE' })

      // Update local state
      setNotifications([])

      return true
    } catch (err) {
      console.error("Error clearing all notifications:", err)
      return false
    }
  }, [])

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  }
}
