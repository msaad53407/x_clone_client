/**
 * API Type Definitions
 * Types matching the FastAPI backend schemas
 */

import { AxiosError } from 'axios';

// ================================
// User Types
// ================================

export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface UserPublic {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  created_at: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  is_verified?: boolean;
}

// ================================
// Auth Types
// ================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  display_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

// ================================
// Tweet Types
// ================================

export interface TweetAuthor {
  id: string;
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
}

export interface QuotedTweet {
  id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  author: TweetAuthor;
}

export interface Tweet {
  id: string;
  content: string | null;
  image_url: string | null;
  views_count: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  author: TweetAuthor;
  quoted_tweet: QuotedTweet | null;
  // Engagement counts
  likes_count: number;
  comments_count: number;
  // Current user interaction status
  is_liked: boolean;
  is_bookmarked: boolean;
}

export interface TweetCreateRequest {
  content?: string;
  image_url?: string;
  quote_tweet_id?: string;
}

// ================================
// Comment Types
// ================================

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: TweetAuthor;
}

// ================================
// Pagination Types
// ================================

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ================================
// API Error Types
// ================================

export interface ApiErrorDetail {
  detail: string;
}

export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorDetail | undefined;
    return data?.detail || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * API Error Response (for backward compatibility)
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode?: number;
    details?: Record<string, unknown>;
  };
}

/**
 * Type guard to check if response is an error response
 */
export const isApiErrorResponse = (response: unknown): response is ApiErrorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as ApiErrorResponse).success === false &&
    'error' in response
  );
};
