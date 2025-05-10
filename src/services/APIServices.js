import axios from 'axios';
const api = import.meta.env.VITE_API_URL;

const APIServices = axios.create({
  baseURL: api,
  timeout: 10000,
  withCredentials: true, // Bật gửi cookie trong mọi request
  headers: {
    Accept: 'application/json',
  },
});

APIServices.interceptors.request.use(
  (config) => {
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
    return Promise.reject(error.response?.data || error);
  }
);

export default APIServices;