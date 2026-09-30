import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://swachhta-compliance-backend.onrender.com/api';
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor to add JWT Auth Token to headers
API.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('swachhta_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing token from localStorage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
