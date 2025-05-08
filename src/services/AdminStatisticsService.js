import APIServices from '@/services/APIServices.js';

export const getOverviewAPI = async () => {
    const response = await APIServices.get('/api/v1/statistics/overview');
    return response.data;
};

export const getEventsByDateAPI = async ({ startDate, endDate }) => {
    const response = await APIServices.get('/api/v1/statistics/events-by-date', {
        params: { startDate, endDate },
    });
    return response.data;
};

export const getUsersByDateAPI = async ({ startDate, endDate }) => {
    const response = await APIServices.get('/api/v1/statistics/users-by-date', {
        params: { startDate, endDate },
    });
    return response.data;
};

export const getDeletedUsersByDateAPI = async ({ startDate, endDate }) => {
    const response = await APIServices.get('/api/v1/statistics/deleted-users-by-date', {
        params: { startDate, endDate },
    });
    return response.data;
};

export const getPublicAndPrivateEventsAPI = async () => {
    const response = await APIServices.get('/api/v1/statistics/public-private-events');
    return response.data;
};