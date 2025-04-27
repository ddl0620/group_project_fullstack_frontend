import axios from 'axios';

const APIServices = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

APIServices.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token from localStorage:', localStorage.getItem('token'));

    return config;
  },
  (error) => {
    console.log('🚨 Error in request:', error);
    return Promise.reject(error.response.data);
  }
);

export default APIServices;
