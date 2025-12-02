/**
 * Axios Request and Response Interceptors
 */

import { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { logError, getErrorMessage } from '@/utils/errorHandler';
import { env } from '@/config/env';

/**
 * Storage keys for tokens
 */
export const TOKEN_STORAGE_KEY = 'auth_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Set access token in localStorage
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/**
 * Remove access token from localStorage
 */
export const removeAccessToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Request interceptor for adding auth token and logging
 */
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Add timestamp for request tracking in development
  if (env.isDevelopment) {
    (config as InternalAxiosRequestConfig & { metadata: { startTime: number } }).metadata = {
      startTime: new Date().getTime()
    };
  }

  // Log request in development
  if (env.isDevelopment) {
    console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params
    });
  }

  return config;
};

/**
 * Request error interceptor
 */
const requestErrorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  logError(error, 'Request Error');
  return Promise.reject(error);
};

/**
 * Response interceptor for logging and data extraction
 */
const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Calculate request duration in development
  if (env.isDevelopment) {
    const config = response.config as InternalAxiosRequestConfig & {
      metadata?: { startTime: number };
    };
    if (config.metadata?.startTime) {
      const duration = new Date().getTime() - config.metadata.startTime;
      console.log(`🟢 ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`, {
        status: response.status,
        data: response.data
      });
    }
  }

  return response;
};

/**
 * Response error interceptor for centralized error handling
 */
const responseErrorInterceptor = async (error: AxiosError): Promise<AxiosError> => {
  // Log error
  logError(error, 'Response Error');

  // Handle specific error statuses
  if (error.response) {
    const status = error.response.status;

    switch (status) {
      case 401:
        // Unauthorized - clear tokens and redirect to login
        // You can dispatch a logout action here or emit an event
        removeAccessToken();
        // Optional: redirect to login page
        // window.location.href = '/login';
        break;

      case 403:
        // Forbidden - user doesn't have permission
        console.warn('Access forbidden:', getErrorMessage(error));
        break;

      case 404:
        // Not found
        console.warn('Resource not found:', error.config?.url);
        break;

      case 429:
        // Too many requests - rate limiting
        console.warn('Rate limit exceeded. Please slow down.');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        console.error('Server error:', getErrorMessage(error));
        break;
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('No response from server. Please check your internet connection.');
  } else {
    // Something happened in setting up the request
    console.error('Request setup error:', error.message);
  }

  return Promise.reject(error);
};

/**
 * Private request interceptor - adds auth token
 */
const privateRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Add auth token to headers
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return requestInterceptor(config);
};

/**
 * Setup interceptors for public axios instance
 */
export const setupPublicInterceptors = (instance: AxiosInstance): void => {
  // Request interceptors
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

  // Response interceptors
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
};

/**
 * Setup interceptors for private axios instance
 */
export const setupPrivateInterceptors = (instance: AxiosInstance): void => {
  // Request interceptors (with auth)
  instance.interceptors.request.use(privateRequestInterceptor, requestErrorInterceptor);

  // Response interceptors
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
};
