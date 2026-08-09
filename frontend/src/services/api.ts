import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://hanyy-production-166a.up.railway.app/api' : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally redirect to login or clear auth state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
