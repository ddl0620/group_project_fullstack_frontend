// src/services/UserStatisService.js
import APIServices from '@/services/APIServices.js';

/* Gọi lấy dữ liệu thống kê từ back-end */
export const getEngagementStatsAPI = async (params = {}) => {
  const response = await APIServices.get(
    '/api/v1/userstatis/statis/engagement-stats',
    {
      params,
    }
  );
  return response.data;
};

export const getInvitationsOverTimeAPI = async (params) => {
  const response = await APIServices.get(
    '/api/v1/userstatis/statis/invitations-over-time',
    {
      params,
    }
  );
  return response.data;
};

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

export const getRecipientsAPI = async (params = {}) => {
  const response = await APIServices.get(
    '/api/v1/userstatis/statis/recipients',
    {
      params,
    }
  );
  return response.data;
};


