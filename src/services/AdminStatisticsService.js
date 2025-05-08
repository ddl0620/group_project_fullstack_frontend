import APIServices from '@/services/APIServices.js';

export const getOverviewAPI = async () => {
    const response = await APIServices.get('/api/v1/adminstatis/statistics/overview');
    return response.data;
};


export const getUsersByDateAPI = async ({ startDate, endDate }) => {
    const response = await APIServices.get('/api/v1/adminstatis/statistics/users-by-date', {
        params: { startDate, endDate },
    });
    return response.data;
};

export const getDeletedUsersByDateAPI = async ({ startDate, endDate }) => {
    const response = await APIServices.get('/api/v1/adminstatis/statistics/deleted-users-by-date', {
        params: { startDate, endDate },
    });
    return response.data;
};

export const getPublicAndPrivateEventsAPI = async () => {
    const response = await APIServices.get('/api/v1/adminstatis/statistics/public-private-events');
    return response.data;
};


export const getEventsByDateAPI = async ({ startDate, endDate }) => {
    if (!startDate || !endDate) {
      throw new Error('startDate and endDate are required');
    }
    const response = await APIServices.get('/api/v1/adminstatis/statistics/events-by-date', {
      params: { startDate, endDate },
    });
    return response.data;
  };