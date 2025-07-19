import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network Error:', error);
      error.message = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);