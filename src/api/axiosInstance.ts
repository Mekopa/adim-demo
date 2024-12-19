// src/api/axiosInstance.ts

import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_LOCAL : import.meta.env.VITE_API_BASE_DEPLOY;

const axiosInstance = axios.create({
  baseURL: myBaseUrl,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to unauthorized access and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${myBaseUrl}/token/refresh/`, { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
