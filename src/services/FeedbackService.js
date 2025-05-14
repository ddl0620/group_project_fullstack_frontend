// src/services/EventService.js
import APIServices from '@/services/APIServices.js';

export const submitFeedbackAPI = async (data) => {
  const response = await APIServices.post(`/api/v1/feedback/`, data );
  return response.data;
};

export const getAllFeedbackAPI = async () => {
  const response = await APIServices.get(`/api/v1/feedback/` );
  return response.data;
};
