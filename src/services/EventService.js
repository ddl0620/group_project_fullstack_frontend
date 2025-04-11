import API_INSTANCE from '@/services/api_instance.js';

export const fetchAllEvent = async ({ page, limit, isAcs }) => {
    const sort = isAcs ? 'asc' : 'desc';
    const response = await API_INSTANCE.get(
        `/api/v1/event/all-event?page=${page}&limit=${limit}&sortBy=${sort}`
    );
    return response.data.data.events;
};

export const fetchMyEvent = async ({ page, limit, isAcs }) => {
    const sort = isAcs ? 'asc' : 'desc';
    const response = await API_INSTANCE.get(
        `/api/v1/event/my?page=${page}&limit=${limit}&sortBy=${sort}`
    );
    return response.data.data.events;
};

// Fetch a single event by ID
export const fetchEventById = async (id) => {
    const response = await API_INSTANCE.get(`/api/v1/event/${id}`);
    return response.data; // Adjust this based on your API response structure
};

// Update an event by ID
export const updateEventById = async (id, eventData) => {
    const response = await API_INSTANCE.put(`/api/v1/event/${id}`, eventData);
    return response.data; // Adjust this based on your API response structure
};

export const DELETEEventById = async (id) => {
    return await API_INSTANCE.delete(`/api/v1/event/${id}`);
}

export const POSTCreateEvent = async (eventData) => {
    const response = await API_INSTANCE.post(`/api/v1/event/add-event`, eventData);
    return response.data; // Adjust this based on your API response structure
}
