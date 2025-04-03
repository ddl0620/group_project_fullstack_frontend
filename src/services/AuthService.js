import axios from 'axios';

// This is the setup for the axios instance.
const API_INSTANCE = axios.create({
    baseURL: 'http://localhost:5001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

API_INSTANCE.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) config.headers.Authorization = `Bearer ${token}`;
        return config;

    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signInUser = async (userInput) => {
    const response = await API_INSTANCE.post('/api/v1/auth/sign-in', userInput);
    return response.data;
}

export const SignUpUser = async (userData) => {
    const response = await API_INSTANCE.post('/api/v1/auth/sign-up', userData);
    return response.data;
}

export const getEvents = async () => {
    const response = await API_INSTANCE.get('/api/v1/events');
    return response.data;
}

export default API_INSTANCE;

