/**
 * Centralized Error Handling Utilities
 */

import { AxiosError } from 'axios';
import { type ApiErrorResponse, isAxiosError, isApiErrorResponse } from '@/types/api.types';

/**
 * User-friendly error messages for common HTTP status codes
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'You are not authenticated. Please log in.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  408: 'Request timeout. Please try again.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'Validation failed. Please check your input.',
  429: 'Too many requests. Please slow down and try again later.',
  500: 'An internal server error occurred. Please try again later.',
  502: 'Bad gateway. The server is temporarily unavailable.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. The server took too long to respond.'
};

/**
 * Default fallback error message
 */
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

/**
 * Extract a user-friendly error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle null/undefined
  if (!error) {
    return DEFAULT_ERROR_MESSAGE;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Check for API error response
    if (axiosError.response?.data && isApiErrorResponse(axiosError.response.data)) {
      return axiosError.response.data.error.message;
    }

    // Check for HTTP status code message
    if (axiosError.response?.status) {
      const statusMessage = ERROR_MESSAGES[axiosError.response.status];
      if (statusMessage) {
        return statusMessage;
      }
    }

    // Network errors
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }

    // Timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    // Canceled requests
    if (axiosError.code === 'ERR_CANCELED') {
      return 'Request was canceled.';
    }

    // Generic axios error message
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle objects with message property
  if (typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === 'string') {
      return msg;
    }
  }

  return DEFAULT_ERROR_MESSAGE;
};

/**
 * Log error for debugging (only in development)
 */
export const logError = (error: unknown, context?: string): void => {
  if (import.meta.env.MODE === 'development') {
    console.group(`🔴 Error${context ? ` - ${context}` : ''}`);
    console.error(error);
    if (isAxiosError(error)) {
      console.log('Request:', error.config);
      console.log('Response:', error.response);
    }
    console.groupEnd();
  }
};

/**
 * Check if error is a specific HTTP status code
 */
export const isErrorStatus = (error: unknown, statusCode: number): boolean => {
  if (isAxiosError(error)) {
    return error.response?.status === statusCode;
  }
  return false;
};

/**
 * Check if error is unauthorized (401)
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  return isErrorStatus(error, 401);
};

/**
 * Check if error is forbidden (403)
 */
export const isForbiddenError = (error: unknown): boolean => {
  return isErrorStatus(error, 403);
};

/**
 * Check if error is not found (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
  return isErrorStatus(error, 404);
};

/**
 * Get error status code
 */
export const getErrorStatusCode = (error: unknown): number | null => {
  if (isAxiosError(error)) {
    return error.response?.status || null;
  }
  return null;
};
