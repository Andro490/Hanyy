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
      // Only redirect if we are NOT on a public page
      const publicPaths = ['/login', '/register', '/', '/gallery', '/customizer'];
      const isPublic = publicPaths.some(p => window.location.pathname.startsWith(p));
      if (!isPublic) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
