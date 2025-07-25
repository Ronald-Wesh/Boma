import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';



const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add Authorization header if token exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Handle auth errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  // Auth API
export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    getMe: () => API.get('/auth/me'),
   
  };
  

export default API;
