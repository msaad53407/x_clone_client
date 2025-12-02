/**
 * API Type Definitions
 * Common types used across API services
 */

import { AxiosError } from 'axios';

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode?: number;
    details?: Record<string, unknown>;
  };
  timestamp?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated API Response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard to check if error is an AxiosError
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true;
};

/**
 * Type guard to check if response is an error response
 */
export const isApiErrorResponse = (response: unknown): response is ApiErrorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
};

/**
 * Extract error message from various error types
 */
export type ErrorMessage = string;

/**
 * Authentication token payload
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
  retryAttempts?: number;
}
