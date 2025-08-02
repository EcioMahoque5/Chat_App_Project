import axios from 'axios';
import { getToken, logout } from '../utils/helpers';

const baseURL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_BASE_URL_LIVE;

// Create Axios instance
const AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach access token to each request
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['x-access-token'] = token;
    }

    // Ensure Content-Type is always set
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);


AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.warn('Unauthorized or forbidden. Logging out...');
      logout(() => window.location.reload());
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
