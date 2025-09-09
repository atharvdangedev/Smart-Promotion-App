import axios from 'axios';
import { BASE_URL, API_KEY } from '@env';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-App-Secret': API_KEY,
  },
});

api.interceptors.request.use(
  async config => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
