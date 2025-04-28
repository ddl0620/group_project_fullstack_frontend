import axios from 'axios';

const APIServices = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 10000,
  headers: {
    // 'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

APIServices.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token from localStorage:', localStorage.getItem('token'));
      if (config.data instanceof FormData) {
          delete config.headers['Content-Type']; // Đảm bảo không ghi đè
      } else {
          // Nếu không phải FormData, set Content-Type: application/json
          config.headers['Content-Type'] = 'application/json';
      }
    return config;
  },
  (error) => {
    console.log('🚨 Error in request:', error);
    return Promise.reject(error.response.data);
  }
);

export default APIServices;
