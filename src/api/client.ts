import axios from 'axios';
import type { ApiError } from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

// Request interceptor: attach access token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Helper: to display error messages
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;

    if (apiError?.validationErrors) {
      return Object.values(apiError.validationErrors).flat().join(', ');
    }

    return apiError?.message || error.message || 'An unexpected error occurred';
  }

  return 'An unexpected error occurred';
};
