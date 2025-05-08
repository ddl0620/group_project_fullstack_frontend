// src/hooks/useEvent.js
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from '@/helpers/toastService.js';
import {
  setMyEvents,
  setCurrentEvent,
  addEvent,
  updateEvent as updateEventRedux,
  removeEvent,
  setLoading,
  setError,
} from '@/store/slices/eventSlice.js';
import {
  getAllEvents as getAllEventsAPI,
  getMyOrganizedEvents as getMyOrganizedEventsAPI,
  getEventById as getEventByIdAPI,
  updateEvent as updateEventAPI,
  deleteEvent as deleteEventAPI,
  createEvent as createEventAPI,
  getJoinedEvents as getJoinedEventsAPI,
  requestJoinEvent as requestJoinEventAPI,
  respondJoinEvent as respondJoinEventAPI,
} from '@/services/EventService.js';
import { checkToken } from '@/helpers/checkToken.js';

export const useEvent = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.event.loading);
  const error = useSelector((state) => state.event.error);

  const getAllEvents = async ({ page, limit, isAcs }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await getAllEventsAPI({
        page: page,
        limit: limit,
        isAcs: isAcs,
      });
      // Dispatch để lưu vào Redux store
      // dispatch(setEvents(data));
      if (response.success) Toast.success('Events fetched successfully');
      else Toast.error(response.message);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      Toast.error('Failed to fetch events: ' + error.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getAllJoinedEvents = async ({ page, limit, isAcs }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await getJoinedEventsAPI({
        page: page,
        limit: limit,
        isAcs: isAcs,
      });

      if (response.success) Toast.success('Events fetched successfully');
      else Toast.error(response.message);

      // Dispatch để lưu vào Redux store
      // dispatch(setEvents(data));
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      Toast.error('Failed to fetch events: ' + error.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getMyOrganizedEvents = async ({ page, limit, isAcs }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const data = await getMyOrganizedEventsAPI({
        page: page,
        limit: limit,
        isAcs: isAcs,
      });
      dispatch(setMyEvents(data)); // Lưu vào Redux store
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      Toast.error('Failed to fetch your events: ' + error.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getEventById = async (id) => {
    if (!id) {
      Toast.info('No ID found. Please check the event ID');
      throw new Error('No ID found');
    }
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await getEventByIdAPI(id);
      dispatch(setCurrentEvent(response));
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      // Toast.error('Failed to fetch event: ' + error.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateEvent = async (id, eventData) => {
    if (!id) {
      Toast.info('No ID found. Please check the event ID');
      throw new Error('No ID found');
    }
    if (!eventData) {
      Toast.info('No data found. Please check the event data');
      throw new Error('No data found');
    }
    const toastId = Toast.loading("Updating event...");
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await updateEventAPI(id, eventData);
      console.log(response);
      await dispatch(updateEventRedux(response));
      Toast.success('Event updated successfully');
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      Toast.error('Failed to update event: ' + error.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
      Toast.dismiss(toastId);
    }
  };

  const deleteEvent = async (id) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await deleteEventAPI(id);
      dispatch(removeEvent(id));
      Toast.success('Event deleted successfully');
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      Toast.error('Failed to delete event: ' + error.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createEvent = async (eventData) => {
    const toastId = Toast.loading("Creating event...");
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      console.log(eventData.getAll("images"));

      const response = await createEventAPI(eventData);
      dispatch(addEvent(response));
      Toast.success('Event created successfully');
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      Toast.error('Failed to create event: ' + error.response.data.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
      Toast.dismiss(toastId);
    }
  };

  const requestJoinEvent = async (eventId, userData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await requestJoinEventAPI(eventId, userData);
      if (response.success) Toast.success(response.message);
      else Toast.error(response.message);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      console.log(error);
      Toast.error(error.response.data.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const respondJoinEvent = async (eventId, userData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await respondJoinEventAPI(eventId, userData);
      if (response.success) Toast.success(response.message);
      else Toast.error(response.message);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      console.log(error);
      Toast.error(error.response.data.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    respondJoinEvent,
    requestJoinEvent,
    getAllJoinedEvents,
    getAllEvents,
    getMyEvents: getMyOrganizedEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    createEvent,
    loading,
    error,
  };
};
