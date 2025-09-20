import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  get: <T>(url: string, config?: any) => api.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: any) => api.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) => api.put<T>(url, data, config),
  delete: <T>(url: string, config?: any) => api.delete<T>(url, config),
  patch: <T>(url: string, data?: any, config?: any) => api.patch<T>(url, data, config),
};

export default api;