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
      if (!response.success) throw new Error(response.message);
      dispatch(setOverview(response.content));
    } catch (err) {
      console.error('Failed to fetch overview:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchEventsByDate = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getEventsByDateAPI();
      if (!response.success) throw new Error(response.message);
      dispatch(setEventsByDate(response.content));
    } catch (err) {
      console.error('Failed to fetch events by date:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchUsersByDate = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getUsersByDateAPI();
      if (!response.success) throw new Error(response.message);
      dispatch(setUsersByDate(response.content));
    } catch (err) {
      console.error('Failed to fetch users by date:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchDeletedUsersByDate = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getDeletedUsersByDateAPI();
      if (!response.success) throw new Error(response.message);
      dispatch(setDeletedUsersByDate(response.content));
    } catch (err) {
      console.error('Failed to fetch deleted users by date:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchPublicAndPrivateEvents = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getPublicAndPrivateEventsAPI();
      if (!response.success) throw new Error(response.message);
      dispatch(setPublicAndPrivateEvents(response.content));
    } catch (err) {
      console.error('Failed to fetch public and private events:', err);
      dispatch(setError(err.message));
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