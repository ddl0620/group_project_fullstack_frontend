// src/services/EventService.js
import APIServices from '@/services/APIServices.js';

export const getAllEvents = async ({ page, limit, isAcs }) => {
  const sort = isAcs ? 'asc' : 'desc';
  const response = await APIServices.get(
    `/api/v1/event/all-event?page=${page}&limit=${limit}&sortBy=${sort}`
  );
  return response.data;
};

export const getJoinedEvents = async ({ page, limit, isAcs }) => {
  const sort = isAcs ? 'asc' : 'desc';
  const response = await APIServices.get(
    `/api/v1/event/joined?page=${page}&limit=${limit}&sortBy=${sort}`
  );
  return response.data;
};

export const getMyOrganizedEvents = async ({ page, limit, isAcs }) => {
  const sort = isAcs ? 'asc' : 'desc';
  const response = await APIServices.get(
    `/api/v1/event/my?page=${page}&limit=${limit}&sortBy=${sort}`
  );
  return response.data.content.events;
};

export const getEventById = async (id) => {
  const response = await APIServices.get(`/api/v1/event/${id}`);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await APIServices.put(`/api/v1/event/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await APIServices.delete(`/api/v1/event/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await APIServices.post(`/api/v1/event/add-event`, eventData);
  return response.data;
};

export const requestJoinEvent = async (eventId, userData) => {
  const response = await APIServices.post(
    `/api/v1/event/${eventId}/join`,
    userData
  );
  return response.data;
};

export const respondJoinEvent = async (eventId, userData) => {
  const response = await APIServices.post(
    `/api/v1/event/${eventId}/respond-join`,
    userData
  );
  return response.data;
};
