import API_INSTANCE from "@/services/api_instance.js";

export const getMe = async () => {
    const response = await API_INSTANCE.get('/api/v1/auth/me');
    return response.data;
}

export const updateUser = async (userData, userId) => {
    const response = await API_INSTANCE.put(`/api/v1/user/${userId}`, userData);
    return response;
}