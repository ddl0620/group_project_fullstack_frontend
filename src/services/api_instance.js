import axios from "axios";

const API_INSTANCE = axios.create({
    baseURL: 'http://localhost:5001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

API_INSTANCE.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token from localStorage:', localStorage.getItem('token'));

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API_INSTANCE;