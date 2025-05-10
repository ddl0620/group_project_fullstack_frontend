import APIServices from '@/services/APIServices.js';

export const getMe = async () => {
  const response = await APIServices.get('/api/v1/user/me');
  return response.data;
};

export const updateUser = async (userData, userId) => {
  const response = await APIServices.put(
    `/api/v1/user/basicInfo/${userId}`,
    userData
  );
  return response.data;
};

export const updatePassword = async (userData, userId) => {
  const response = await APIServices.put(
    `/api/v1/user/password/${userId}`,
    userData
  );
  return response.data;
};

export const getUserById = async (id) => {
  const response = await APIServices.get(`/api/v1/user/${id}`);
  return response.data;
};
