"use client"

import { useState, useCallback } from "react"
import { getAllNotifications } from '@/services/NotificationService.js';
import { Toast } from '@/helpers/toastService.js';
import { checkToken } from '@/helpers/checkToken.js';

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setLoading(true)
      setError(null)
      checkToken();
      const response = await getAllNotifications();
      if(!response.success) {
        throw new Error(response.message);
      }
      const sortedNotifications = [...response.content.notifications].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications)
      return response;
    } catch (err) {
      Toast.error(err.message || err.response?.data?.message);
      setError("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId) => {
    try {
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
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))

      return true
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
      return false
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId))

      return true
    } catch (err) {
      console.error("Error deleting notification:", err)
      return false
    }
  }, [])

  const clearAllNotifications = useCallback(async () => {
    try {
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
