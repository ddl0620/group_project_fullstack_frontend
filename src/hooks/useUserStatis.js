import { useState, useCallback } from "react"
import {
  getEngagementStatsAPI,
  getInvitationsOverTimeAPI,
  getRsvpDistributionAPI,
  getRecipientsAPI,
} from "@/services/UserStatisService"

export const useUserStatis = () => {
  const [engagementStats, setEngagementStats] = useState(null)
  const [invitationsOverTime, setInvitationsOverTime] = useState([])
  const [rsvpDistribution, setRsvpDistribution] = useState([])
  const [recipients, setRecipients] = useState([])
  const [totalRecipients, setTotalRecipients] = useState(0)
  const [loadingEngagementStats, setLoadingEngagementStats] = useState(false)
  const [loadingInvitationsOverTime, setLoadingInvitationsOverTime] = useState(false)
  const [loadingRsvpDistribution, setLoadingRsvpDistribution] = useState(false)
  const [loadingRecipients, setLoadingRecipients] = useState(false)
  const [error, setError] = useState(null)

  const fetchEngagementStats = useCallback(async () => {
    try {
      setLoadingEngagementStats(true)
      const response = await getEngagementStatsAPI()
      if (!response.success) throw new Error(response.message)
      setEngagementStats(response.content)
    } catch (error) {
      console.error("Failed to fetch engagement stats:", error)
      setError(error.message)
    } finally {
      setLoadingEngagementStats(false)
    }
  }, [])

  const fetchInvitationsOverTime = useCallback(async (startDate, endDate) => {
    try {
      setLoadingInvitationsOverTime(true)
      const response = await getInvitationsOverTimeAPI({ startDate, endDate })
      if (!response.success) throw new Error(response.message)
      setInvitationsOverTime(response.content)
    } catch (error) {
      console.error("Failed to fetch invitations over time:", error)
      setError(error.message)
    } finally {
      setLoadingInvitationsOverTime(false)
    }
  }, [])

  const fetchRsvpDistribution = useCallback(async () => {
    try {
      setLoadingRsvpDistribution(true)
      const response = await getRsvpDistributionAPI()
      if (!response.success) throw new Error(response.message)
      setRsvpDistribution(response.content)
    } catch (error) {
      console.error("Failed to fetch RSVP distribution:", error)
      setError(error.message)
    } finally {
      setLoadingRsvpDistribution(false)
    }
  }, [])

  const fetchRecipients = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoadingRecipients(true)
      const response = await getRecipientsAPI({ page, limit })
      console.log("Recipients API Response:", response)
      console.log("Recipients Content:", response.content)
      console.log("Recipients Array:", response.content?.recipients)
      if (!response.success) throw new Error(response.message)
      setRecipients(response.content.recipients || [])
      setTotalRecipients(response.content.pagination?.total || 0)
    } catch (error) {
      console.error("Failed to fetch recipients:", error)
      setError(error.message)
    } finally {
      setLoadingRecipients(false)
    }
  }, [])

  return {
    engagementStats,
    setEngagementStats,
    invitationsOverTime,
    setInvitationsOverTime,
    rsvpDistribution,
    setRsvpDistribution,
    recipients,
    setRecipients,
    totalRecipients,
    setTotalRecipients,
    loadingEngagementStats,
    loadingInvitationsOverTime,
    loadingRsvpDistribution,
    loadingRecipients,
    error,
    setError,
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpDistribution,
    fetchRecipients,
  }
}

export default useUserStatis