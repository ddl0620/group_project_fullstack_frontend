// src/hooks/useUserStatis.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';
import {
    setEngagementStats,
    setInvitationsOverTime,
    setRsvpTrend,
    setRsvpDistribution,
    setRecipients,
    setLoading,
    setError,
} from '@/store/slices/userStatisSlice.js';
import {
    getEngagementStatsAPI,
    getInvitationsOverTimeAPI,
    getRsvpTrendAPI,
    getRsvpDistributionAPI,
    getRecipientsAPI,
} from '@/services/UserStatisService.js';
import { checkToken } from '@/helpers/checkToken.js';
import { Toast } from '@/helpers/toastService.js';

export const useUserStatis = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.userStatis.loading);
    const error = useSelector((state) => state.userStatis.error);
    const engagementStats = useSelector((state) => state.userStatis.engagementStats);
    const invitationsOverTime = useSelector((state) => state.userStatis.invitationsOverTime);
    const rsvpTrend = useSelector((state) => state.userStatis.rsvpTrend);
    const rsvpDistribution = useSelector((state) => state.userStatis.rsvpDistribution);
    const recipients = useSelector((state) => state.userStatis.recipients);
    const totalRecipients = useSelector((state) => state.userStatis.totalRecipients);

    // Cache to store fetched data
    const cache = useRef({
        engagementStats: null,
        invitationsOverTime: {},
        rsvpTrend: {},
        rsvpDistribution: null,
        recipients: {},
    });

    const fetchEngagementStats = useCallback(
        async (params = {}, forceRefresh = false) => {
            const cacheKey = JSON.stringify(params);
            if (!forceRefresh && cache.current.engagementStats && cache.current.engagementStats.cacheKey === cacheKey) {
                console.log('Using cached engagement stats:', cacheKey);
                dispatch(setEngagementStats(cache.current.engagementStats.data));
                return cache.current.engagementStats.data;
            }

            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response = await getEngagementStatsAPI(params);

                if (!response.success) {
                    throw new Error('Failed to fetch engagement stats');
                }

                console.log('Fetched engagement stats:', response.content);
                cache.current.engagementStats = { data: response.content, cacheKey };
                dispatch(setEngagementStats(response.content));
                return response.content;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to fetch engagement stats: ' +
                    (error.response?.content?.message || error.message)
                );
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    const fetchInvitationsOverTime = useCallback(
        async (params, forceRefresh = false) => {
            const cacheKey  = JSON.stringify(params);
            if (!forceRefresh && cache.current.invitationsOverTime[cacheKey]) {
                console.log('Using cached invitations over time:', cacheKey);
                dispatch(setInvitationsOverTime(cache.current.invitationsOverTime[cacheKey]));
                return cache.current.invitationsOverTime[cacheKey];
            }

            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response = await getInvitationsOverTimeAPI(params);

                if (!response.success) {
                    throw new Error('Failed to fetch invitations over time');
                }

                console.log('Fetched invitations over time:', response.content);
                cache.current.invitationsOverTime[cacheKey] = response.content;
                dispatch(setInvitationsOverTime(response.content));
                return response.content;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to fetch invitations over time: ' +
                    (error.response?.data?.message || error.message)
                );
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    const fetchRsvpTrend = useCallback(
        async (params, forceRefresh = false) => {
            const cacheKey = JSON.stringify(params);
            if (!forceRefresh && cache.current.rsvpTrend[cacheKey]) {
                console.log('Using cached RSVP trend:', cacheKey);
                dispatch(setRsvpTrend(cache.current.rsvpTrend[cacheKey]));
                return cache.current.rsvpTrend[cacheKey];
            }

            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response = await getRsvpTrendAPI(params);

                if (!response.success) {
                    throw new Error('Failed to fetch RSVP trend');
                }

                console.log('Fetched RSVP trend:', response.content);
                cache.current.rsvpTrend[cacheKey] = response.content;
                dispatch(setRsvpTrend(response.data));
                return response.content;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to fetch RSVP trend: ' +
                    (error.response?.content?.message || error.message)
                );
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    const fetchRsvpDistribution = useCallback(
        async (params = {}, forceRefresh = false) => {
            const cacheKey = JSON.stringify(params);
            if (!forceRefresh && cache.current.rsvpDistribution && cache.current.rsvpDistribution.cacheKey === cacheKey) {
                console.log('Using cached RSVP distribution:', cacheKey);
                dispatch(setRsvpDistribution(cache.current.rsvpDistribution.data));
                return cache.current.rsvpDistribution.data;
            }

            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response = await getRsvpDistributionAPI(params);

                if (!response.success) {
                    throw new Error('Failed to fetch RSVP distribution');
                }

                console.log('Fetched RSVP distribution:', response.content);
                cache.current.rsvpDistribution = { data: response.content, cacheKey };
                dispatch(setRsvpDistribution(response.data));
                return response.data;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to fetch RSVP distribution: ' +
                    (error.response?.content?.message || error.message)
                );
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    const fetchRecipients = useCallback(
        async (params = {}, forceRefresh = false) => {
            const cacheKey = JSON.stringify(params);
            if (!forceRefresh && cache.current.recipients[cacheKey]) {
                console.log('Using cached recipients:', cacheKey);
                dispatch(setRecipients(cache.current.recipients[cacheKey]));
                return cache.current.recipients[cacheKey];
            }

            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response = await getRecipientsAPI(params);

                if (!response.success) {
                    throw new Error('Failed to fetch recipients');
                }

                console.log('Fetched recipients:', response.content);
                const result = {
                    recipients: response.content.recipients || [],
                    total: response.content.total || 0,
                };
                cache.current.recipients[cacheKey] = result;
                dispatch(setRecipients(result));
                return result;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to fetch recipients: ' +
                    (error.response?.content?.message || error.message)
                );
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    return {
        fetchEngagementStats,
        fetchInvitationsOverTime,
        fetchRsvpTrend,
        fetchRsvpDistribution,
        fetchRecipients,
        engagementStats,
        invitationsOverTime,
        rsvpTrend,
        rsvpDistribution,
        recipients,
        totalRecipients,
        loading,
        error,
    };
};

export default useUserStatis;