import { useState, useCallback, useMemo } from "react"
import {
  getEngagementStatsAPI,
  getInvitationsOverTimeAPI,
  getRsvpDistributionAPI,
  getRecipientsAPI,
} from "@/services/UserStatisService"
import debounce from "lodash/debounce"

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
  const [errorEngagementStats, setErrorEngagementStats] = useState(null)
  const [errorInvitations, setErrorInvitations] = useState(null)
  const [errorRsvpDistribution, setErrorRsvpDistribution] = useState(null)
  const [errorRecipients, setErrorRecipients] = useState(null)

  // Debounced state setters to limit rapid updates
  const debouncedSetEngagementStats = useMemo(
    () => debounce((value) => setEngagementStats(value), 100),
    []
  )
  const debouncedSetInvitationsOverTime = useMemo(
    () => debounce((value) => setInvitationsOverTime(value), 100),
    []
  )
  const debouncedSetRsvpDistribution = useMemo(
    () => debounce((value) => setRsvpDistribution(value), 100),
    []
  )
  const debouncedSetRecipients = useMemo(
    () => debounce((value) => setRecipients(value), 100),
    []
  )
  const debouncedSetTotalRecipients = useMemo(
    () => debounce((value) => setTotalRecipients(value), 100),
    []
  )

  const fetchEngagementStats = useCallback(async () => {
    try {
      setLoadingEngagementStats(true)
      setErrorEngagementStats(null)
      const response = await getEngagementStatsAPI()
      if (!response.success) throw new Error(response.message)
      debouncedSetEngagementStats(response.content)
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch engagement stats:", error)
      }
      setErrorEngagementStats(error.message)
    } finally {
      setLoadingEngagementStats(false)
    }
  }, [debouncedSetEngagementStats])

  const fetchInvitationsOverTime = useCallback(
    async (startDate, endDate) => {
      try {
        setLoadingInvitationsOverTime(true)
        setErrorInvitations(null)
        const response = await getInvitationsOverTimeAPI({ startDate, endDate })
        if (!response.success) throw new Error(response.message)
        debouncedSetInvitationsOverTime(response.content)
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch invitations over time:", error)
        }
        setErrorInvitations(error.message)
      } finally {
        setLoadingInvitationsOverTime(false)
      }
    },
    [debouncedSetInvitationsOverTime]
  )

  const fetchRsvpDistribution = useCallback(async () => {
    try {
      setLoadingRsvpDistribution(true)
      setErrorRsvpDistribution(null)
      const response = await getRsvpDistributionAPI()
      if (!response.success) throw new Error(response.message)
      debouncedSetRsvpDistribution(response.content)
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch RSVP distribution:", error)
      }
      setErrorRsvpDistribution(error.message)
    } finally {
      setLoadingRsvpDistribution(false)
    }
  }, [debouncedSetRsvpDistribution])

  const fetchRecipients = useCallback(
    async (page = 1, limit = 10) => {
      try {
        setLoadingRecipients(true)
        setErrorRecipients(null)
        const response = await getRecipientsAPI({ page, limit })
        if (!response.success) throw new Error(response.message)
        debouncedSetRecipients(response.content.recipients || [])
        debouncedSetTotalRecipients(response.content.pagination?.total || 0)
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch recipients:", error)
        }
        setErrorRecipients(error.message)
      } finally {
        setLoadingRecipients(false)
      }
    },
    [debouncedSetRecipients, debouncedSetTotalRecipients]
  )

  return {
    engagementStats,
    setEngagementStats: debouncedSetEngagementStats,
    invitationsOverTime,
    setInvitationsOverTime: debouncedSetInvitationsOverTime,
    rsvpDistribution,
    setRsvpDistribution: debouncedSetRsvpDistribution,
    recipients,
    setRecipients: debouncedSetRecipients,
    totalRecipients,
    setTotalRecipients: debouncedSetTotalRecipients,
    loadingEngagementStats,
    loadingInvitationsOverTime,
    loadingRsvpDistribution,
    loadingRecipients,
    errorEngagementStats,
    errorInvitations,
    errorRsvpDistribution,
    errorRecipients,
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpDistribution,
    fetchRecipients,
  }
}

export default useUserStatis