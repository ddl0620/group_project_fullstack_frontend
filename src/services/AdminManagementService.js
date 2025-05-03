import APIServices from '@/services/APIServices.js';

export const getAllUsersAPI = async (page, limit, isAcs) => {
  const sort = isAcs ? 'asc' : 'desc';
  const response = await APIServices.get(
    `/api/v1/admin/user-management/?page=${page}&limit=${limit}&sortBy=${sort}`);
  return response.data;
}

export const createNewUserAPI = async (data) => {
  const response = await APIServices.post(
    `/api/v1/admin/user-management`, data);
  return response.data;
}

export const updateUserAPI = async (userId, data) => {
  const response = await APIServices.put(
    `/api/v1/admin/user-management/${userId}`, data);
  return response.data;
}

export const deleteUserAPI = async (userId) => {
  const response = await APIServices.delete(
    `/api/v1/admin/user-management/${userId}`);
  return response.data;
}

// -------------------------------------------------------------------

export const getAllEventsAPI = async (page, limit, isAcs) => {
  const sort = isAcs ? 'asc' : 'desc';
  const response = await APIServices.get(
    `/api/v1/admin/event-management/?page=${page}&limit=${limit}&sortBy=${sort}`);
  return response.data;
}

export const getAllEventsByUserIdAPI = async (userId, page, limit, isAcs) => {
  const sort = isAcs ? 'asc' : 'desc';

  const response = await APIServices.get(
    `/api/v1/admin/event-management/${userId}?page=${page}&limit=${limit}&sortBy=${sort}`);
  return response.data;
}

export const createEventAdminAPI = async (userId, data) => {
  const response = await APIServices.post(
    `/api/v1/admin/event-management/${userId}`, data);
  return response.data;
}

export const updateEventAdminAPI = async (eventId, data) => {
  const response = await APIServices.put(
    `/api/v1/admin/event-management/${eventId}`, data);
  return response.data;
}

export const deleteEventAPI = async (eventId) => {
  const response = await APIServices.delete(
    `/api/v1/admin/event-management/${eventId}`);
  return response.data;
}

