import API_INSTANCE from "@/services/api_instance.js";

export const signInUser = async (userInput) => {
    const response = await API_INSTANCE.post('/api/v1/auth/sign-in', userInput);
    return response.data;
};

export const SignUpUser = async (userData) => {
    const response = await API_INSTANCE.post('/api/v1/auth/sign-up', userData);
    return response.data;
};
