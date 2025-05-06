// src/services/EventService.js
import APIServices from '@/services/APIServices.js';

export const getAllNotifications = async () => {
  const response = await APIServices.get(`/api/v1/notification/`);
  return response.data;
};
