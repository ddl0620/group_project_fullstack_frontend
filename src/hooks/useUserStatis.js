// src/hooks/useUserStatis.js
import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  setEngagementStats,
  setInvitationsOverTime,
  setRsvpDistribution,
  setRecipients,
  setError,
  setLoading,
} from "@/store/slices/userStatisSlice"
import {
  getEngagementStatsAPI,
  getInvitationsOverTimeAPI,
  getRsvpDistributionAPI,
  getRecipientsAPI,
} from "@/services/UserStatisService"

export const useUserStatis = () => {
  const dispatch = useDispatch()
  const engagementStats = useSelector((state) => state.userStatis.engagementStats)
  const invitationsOverTime = useSelector((state) => state.userStatis.invitationsOverTime)
  const rsvpDistribution = useSelector((state) => state.userStatis.rsvpDistribution)
  const recipients = useSelector((state) => state.userStatis.recipients)

  const fetchEngagementStats = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      const response = await getEngagementStatsAPI()
      if (!response.success) throw new Error(response.message)
      dispatch(setEngagementStats(response.content))
    } catch (error) {
      console.error("Failed to fetch engagement stats:", error)
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const fetchInvitationsOverTime = useCallback(async (startDate, endDate) => {
    try {
      dispatch(setLoading(true))
      const response = await getInvitationsOverTimeAPI({ startDate, endDate })
      if (!response.success) throw new Error(response.message)
      dispatch(setInvitationsOverTime(response.content))
    } catch (error) {
      console.error("Failed to fetch invitations over time:", error)
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const fetchRsvpDistribution = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      const response = await getRsvpDistributionAPI()
      if (!response.success) throw new Error(response.message)
      dispatch(setRsvpDistribution(response.content))
    } catch (error) {
      console.error("Failed to fetch RSVP distribution:", error)
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const fetchRecipients = useCallback(async (page = 1, limit = 10) => {
    try {
      dispatch(setLoading(true))
      const response = await getRecipientsAPI({ page, limit })
      console.log("Recipients API Response:", response) // Kiểm tra dữ liệu trả về từ API
      if (!response.success) throw new Error(response.message)
      const formattedData = {
        recipients: response.content.recipients || [],
        total: response.content.pagination?.total || 0,
      }
      console.log("Formatted Recipients Data:", formattedData) // Kiểm tra dữ liệu đã format
      dispatch(setRecipients(formattedData))
    } catch (error) {
      console.error("Failed to fetch recipients:", error)
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch]) // Dependency chỉ chứa `dispatch`

  return {
    engagementStats,
    invitationsOverTime,
    rsvpDistribution,
    recipients,
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpDistribution,
    fetchRecipients,
  }
}

export default useUserStatis
