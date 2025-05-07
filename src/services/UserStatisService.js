// src/services/UserStatisService.js
import APIServices from '@/services/APIServices.js';

export const getEngagementStatsAPI = async (params = {}) => {
  const response = await APIServices.get(
    '/api/v1/userstatis/statis/engagement-stats',
    {
      params,
    }
  );
  return response.data;
};

export const getInvitationsOverTimeAPI = async ({ startDate, endDate }) => {
  const response = await APIServices.get('/api/v1/userstatis/statis/invitations-over-time', {
    params: {
      startDate,
      endDate,
    },
  })
  return response.data
}

export const getRsvpTrendAPI = async (params) => {
  const response = await APIServices.get(
    '/api/v1/userstatis/statis/rsvp-trend',
    {
      params,
    }
  );
  return response.data;
};

export const getRsvpDistributionAPI = async (params = {}) => {
  const response = await APIServices.get(
    '/api/v1/userstatis/statis/rsvp-distribution',
    {
      params,
    }
  );
  return response.data;
};

export const getRecipientsAPI = async ({ page = 1, limit = 10 }) => {
  const response = await APIServices.get('/api/v1/userstatis/statis/recipients', {
    params: { page, limit },
  })
  return response.data
}
