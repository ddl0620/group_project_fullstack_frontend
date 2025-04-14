// src/services/EventService.js
import API_INSTANCE from '@/services/api_instance.js';

export const getAllEvents = async ({ page, limit, isAcs }) => {
    const sort = isAcs ? 'asc' : 'desc';
    const response = await API_INSTANCE.get(
        `/api/v1/event/all-event?page=${page}&limit=${limit}&sortBy=${sort}`
    );
    return response.data.data.events;
};

export const getMyEvents = async ({ page, limit, isAcs }) => {
    const sort = isAcs ? 'asc' : 'desc';
    const response = await API_INSTANCE.get(
        `/api/v1/event/my?page=${page}&limit=${limit}&sortBy=${sort}`
    );
    return response.data.data.events;
};

export const getEventById = async (id) => {
    const response = await API_INSTANCE.get(`/api/v1/event/${id}`);
    return response.data;
};

export const updateEvent = async (id, eventData) => {
    const response = await API_INSTANCE.put(`/api/v1/event/${id}`, eventData);
    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await API_INSTANCE.delete(`/api/v1/event/${id}`);
    return response.data;
};

export const createEvent = async (eventData) => {
    const response = await API_INSTANCE.post(`/api/v1/event/add-event`, eventData);
    return response.data;
};