import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor for adding the x-user-id header
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling 401s
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Optional: Global logout or redirect to login
    localStorage.removeItem('userId');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
