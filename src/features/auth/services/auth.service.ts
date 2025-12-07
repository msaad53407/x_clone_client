/**
 * Auth Service
 * Handles all authentication API calls
 */

import { publicApi, privateApi } from '@/lib/axios/axiosInstances';
import { setAccessToken, removeAccessToken, REFRESH_TOKEN_STORAGE_KEY } from '@/lib/axios/interceptors';
import type { LoginRequest, RegisterRequest, TokenResponse, User, MessageResponse } from '@/types/api.types';

/**
 * Auth service object with all authentication functions
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await publicApi.post<TokenResponse>('/auth/login', data);

    // Store tokens
    setAccessToken(response.data.access_token);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.data.refresh_token);

    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await publicApi.post<User>('/auth/register', data);
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<User> => {
    const response = await publicApi.post<User>('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<MessageResponse> => {
    const response = await publicApi.post<MessageResponse>('/auth/resend-verification', { email });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await publicApi.post<MessageResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<MessageResponse> => {
    const response = await publicApi.post<MessageResponse>('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<TokenResponse> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await publicApi.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken
    });

    // Update stored tokens
    setAccessToken(response.data.access_token);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.data.refresh_token);

    return response.data;
  },

  /**
   * Logout - revoke refresh token
   */
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

    try {
      if (refreshToken) {
        await privateApi.post('/auth/logout', { refresh_token: refreshToken });
      }
    } finally {
      // Always clear local tokens
      removeAccessToken();
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await privateApi.get<User>('/users/me');
    return response.data;
  }
};
