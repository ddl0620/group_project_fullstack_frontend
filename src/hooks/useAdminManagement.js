import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';
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
  setEventDetails,
  setLoading,
  setError,
} from '@/store/slices/adminManagementSlice.js';
import {
  getAllUsersAPI,
  updateUserAPI,
  deleteUserAPI,
  getAllEventsAPI,
  getAllEventsByUserIdAPI,
  updateEventAPI,
  deleteEventAPI,
} from '@/services/AdminManagementService.js';
import { checkToken } from '@/helpers/checkToken.js';
import { Toast } from '@/helpers/toastService.js';
import APIServices from '@/services/APIServices.js';

export const useAdminManagement = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.adminManagement.loading);
  const error = useSelector((state) => state.adminManagement.error);
  const users = useSelector((state) => state.adminManagement.users);
  const events = useSelector((state) => state.adminManagement.events);
  const userActivities = useSelector((state) => state.adminManagement.userActivities);
  const eventDetails = useSelector((state) => state.adminManagement.eventDetails);
  const pagination = useSelector((state) => state.adminManagement.pagination);

  // Cache to store fetched data
  const cache = useRef({});

  // User Management Functions
  const createUser = useCallback(
    async (userData) => {
      const toastId = Toast.loading('Creating user...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await APIServices.post('/api/v1/admin/user-management', userData);
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to create user');
        }

        dispatch(addUser(response.data.content.user));
        Toast.success('User created successfully');
        return response.data.content.user;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to create user: ${errorMessage}`);
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchUsers = useCallback(
    async (page = 1, limit = 10, isAcs = true, forceRefresh = false) => {
      const cacheKey = `users-${page}-${limit}-${isAcs}`;
      if (!forceRefresh && cache.current[cacheKey]) {
        dispatch(setUsers(cache.current[cacheKey]));
        return cache.current[cacheKey];
      }

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await getAllUsersAPI(page, limit, isAcs);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch users');
        }

        const result = {
          users: Array.isArray(response.content.users) ? response.content.users : [],
          pagination: response.content.pagination || { page, limit, total: response.content.users.length }
        };

        console.log(result);

        cache.current[cacheKey] = result;
        dispatch(setUsers(result));
        return result;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to fetch users: ${errorMessage}`);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updateUserInfo = useCallback(
    async (userId, userData) => {
      const toastId = Toast.loading('Updating user...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await updateUserAPI(userId, userData);
        if (!response.success) {
          throw new Error(response.message || 'Failed to update user');
        }

        dispatch(updateUser(response.content.user));
        Toast.success('User updated successfully');
        return response.content.user;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to update user: ${errorMessage}`);
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const softDeleteUser = useCallback(
    async (userId) => {
      const toastId = Toast.loading('Deleting user...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await deleteUserAPI(userId);
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete user');
        }

        dispatch(deleteUser({ userId }));
        Toast.success('User deleted successfully');
        return response.content;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to delete user: ${errorMessage}`);
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const reactivateUserAccount = useCallback(
    async (userId) => {
      const toastId = Toast.loading('Reactivating user...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await APIServices.patch(`/api/v1/admin/user-management/${userId}/reactivate`);
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to reactivate user');
        }

        dispatch(reactivateUser({ userId }));
        Toast.success('User reactivated successfully');
        return response.data.content;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to reactivate user: ${errorMessage}`);
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchUserActivities = useCallback(
    async (userId, page = 1, limit = 10, isAcs = true) => {
      const cacheKey = `user-activities-${userId}-${page}-${limit}-${isAcs}`;
      if (cache.current[cacheKey]) {
        dispatch(setUserActivities(cache.current[cacheKey]));
        return cache.current[cacheKey];
      }

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const events = await getAllEventsByUserIdAPI(userId, page, limit, isAcs);

        const organizedEvents = events.filter(event => event.organizer === userId);
        const joiningEvents = events.filter(event => {
          event.participants.forEach(participant => {
            if (participant.userId === userId) {
              return participant.status === 'ACCEPTED';
            }
          })
        });
        const result = {
          joiningEvents: joiningEvents || [],
          organizedEvents: joiningEvents || [],
          // discussionPosts: postsRes.data.content.posts || []
        };

        cache.current[cacheKey] = result;
        dispatch(setUserActivities(result));
        return result;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to fetch user activities: ${errorMessage}`);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Note: didnt impl
  const createEvent = useCallback(
    async (eventData) => {
      const toastId = Toast.loading('Creating event...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await APIServices.post('/api/v1/admin/event-management', eventData);
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to create event');
        }

        dispatch(addEvent(response.data.content.event));
        Toast.success('Event created successfully');
        return response.data.content.event;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to create event: ${errorMessage}`);
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchEvents = useCallback(
    async (page = 1, limit = 10, isAcs = true, forceRefresh = false) => {
      const cacheKey = `events-${page}-${limit}-${isAcs}`;
      if (!forceRefresh && cache.current[cacheKey]) {
        dispatch(setEvents(cache.current[cacheKey]));
        return cache.current[cacheKey];
      }

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await getAllEventsAPI(page, limit, isAcs);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch events');
        }

        const result = {
          events: Array.isArray(response.content.events) ? response.content.events : [],
          pagination: response.content.pagination || { page, limit, total: response.content.events.length }
        };

        cache.current[cacheKey] = result;
        dispatch(setEvents(result));
        return result;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to fetch events: ${errorMessage}`);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updateEventInfo = useCallback(
    async (eventId, eventData) => {
      const toastId = Toast.loading('Updating event...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await updateEventAPI(eventId, eventData);
        if (!response.success) {
          throw new Error(response.message || 'Failed to update event');
        }

        dispatch(updateEvent(response.content.event));
        Toast.success('Event updated successfully');
        return response.content.event;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to update event: ${errorMessage}`);
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const softDeleteEvent = useCallback(
    async (eventId) => {
      const toastId = Toast.loading('Deleting event...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await deleteEventAPI(eventId);
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete event');
        }

        dispatch(deleteEvent({ eventId }));
        Toast.success('Event deleted successfully');
        return response.content;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to delete event: ${errorMessage}`);
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );
  //
  // const fetchEventDetails = useCallback(
  //   async (eventId) => {
  //     const cacheKey = `event-details-${eventId}`;
  //     if (cache.current[cacheKey]) {
  //       dispatch(setEventDetails(cache.current[cacheKey]));
  //       return cache.current[cacheKey];
  //     }
  //
  //     try {
  //       dispatch(setError(null));
  //       dispatch(setLoading(true));
  //       checkToken();
  //       const response = await APIServices.get(`/api/v1/admin/event-management/${eventId}/details`);
  //       if (!response.data.success) {
  //         throw new Error(response.data.message || 'Failed to fetch event details');
  //       }
  //
  //       const participants = {
  //         accepted: response.data.content.participants.filter(p => p.status === 'ACCEPTED'),
  //         pending: response.data.content.participants.filter(p => p.status === 'PENDING'),
  //         denied: response.data.content.participants.filter(p => p.status === 'DENIED')
  //       };
  //
  //       const result = {
  //         event: response.data.content.event,
  //         participants,
  //         invitations: response.data.content.invitations || []
  //       };
  //
  //       cache.current[cacheKey] = result;
  //       dispatch(setEventDetails(result));
  //       return result;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || error.message;
  //       dispatch(setError(errorMessage));
  //       Toast.error(`Failed to fetch event details: ${errorMessage}`);
  //       throw error;
  //     } finally {
  //       dispatch(setLoading(false));
  //     }
  //   },
  //   [dispatch]
  // );

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
    // fetchEventDetails,
    // State
    users,
    events,
    userActivities,
    eventDetails,
    pagination,
    loading,
    error
  };
};

export default useAdminManagement;