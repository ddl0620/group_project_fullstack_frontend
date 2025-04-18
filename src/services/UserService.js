import APIServices from "@/services/APIServices.js";

export const getMe = async () => {
    const response = await APIServices.get('/api/v1/auth/me');
    return response.data;
}

export const updateUser = async (userData, userId) => {
    const response = await APIServices.put(`/api/v1/user/${userId}`, userData);
    return response;
}

export const getUserById = async (id) => {
    const response = await APIServices.get(`/api/v1/user/${id}`);
    return response.data;
}