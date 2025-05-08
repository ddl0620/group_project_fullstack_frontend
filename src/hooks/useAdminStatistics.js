import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  setOverview,
  setEventsByDate,
  setUsersByDate,
  setDeletedUsersByDate,
  setPublicAndPrivateEvents,
  setLoading,
  setError,
} from '@/store/slices/adminStatisticsSlice';
import {
  getOverviewAPI,
  getEventsByDateAPI,
  getUsersByDateAPI,
  getDeletedUsersByDateAPI,
  getPublicAndPrivateEventsAPI,
} from '@/services/AdminStatisticsService';

export const useAdminStatistics = () => {
  const dispatch = useDispatch();
  const {
    overview,
    eventsByDate,
    usersByDate,
    deletedUsersByDate,
    publicAndPrivateEvents,
    loading,
    error,
  } = useSelector((state) => state.adminStatistics);

  const fetchOverview = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getOverviewAPI();
      if (!response.success) throw new Error(response.message || 'Failed to fetch overview statistics');
      dispatch(setOverview(response.content));
    } catch (err) {
      console.error('Failed to fetch overview:', err);
      dispatch(setError(err.message || 'Unable to load overview data. Please try again later.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchEventsByDate = useCallback(async ({ startDate, endDate }) => {
    try {
      dispatch(setLoading(true));
      console.log('Fetching events by date with params:', { startDate, endDate });
      const response = await getEventsByDateAPI({ startDate, endDate });
      if (!response.success) throw new Error(response.message || 'Failed to fetch events by date');
      dispatch(setEventsByDate(response.content));
    } catch (err) {
      console.error('Failed to fetch events by date:', err);
      dispatch(setError(err.message || 'Unable to load events data. Please try again later.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchUsersByDate = useCallback(async ({ startDate, endDate }) => {
    try {
      dispatch(setLoading(true));
      console.log('Fetching users by date with params:', { startDate, endDate });
      const response = await getUsersByDateAPI({ startDate, endDate });
      if (!response.success) throw new Error(response.message || 'Failed to fetch users by date');
      dispatch(setUsersByDate(response.content));
    } catch (err) {
      console.error('Failed to fetch users by date:', err);
      dispatch(setError(err.message || 'Unable to load users data. Please try again later.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchDeletedUsersByDate = useCallback(async ({ startDate, endDate }) => {
    try {
      dispatch(setLoading(true));
      console.log('Fetching deleted users by date with params:', { startDate, endDate });
      const response = await getDeletedUsersByDateAPI({ startDate, endDate });
      if (!response.success) throw new Error(response.message || 'Failed to fetch deleted users by date');
      dispatch(setDeletedUsersByDate(response.content));
    } catch (err) {
      console.error('Failed to fetch deleted users by date:', err);
      dispatch(setError(err.message || 'Unable to load deleted users data. Please try again later.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchPublicAndPrivateEvents = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getPublicAndPrivateEventsAPI();
      if (!response.success) throw new Error(response.message || 'Failed to fetch public and private events');
      dispatch(setPublicAndPrivateEvents(response.content));
    } catch (err) {
      console.error('Failed to fetch public and private events:', err);
      dispatch(setError(err.message || 'Unable to load event visibility data. Please try again later.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    overview,
    eventsByDate,
    usersByDate,
    deletedUsersByDate,
    publicAndPrivateEvents,
    loading,
    error,
    fetchOverview,
    fetchEventsByDate,
    fetchUsersByDate,
    fetchDeletedUsersByDate,
    fetchPublicAndPrivateEvents,
  };
};