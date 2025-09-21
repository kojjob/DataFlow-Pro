import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Temporarily disabled for development without auth
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
  get: <T = any>(url: string, config?: any): Promise<{ data: T }> => api.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> => api.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> => api.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: any): Promise<{ data: T }> => api.delete<T>(url, config),
  patch: <T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> => api.patch<T>(url, data, config),
};

export default api;