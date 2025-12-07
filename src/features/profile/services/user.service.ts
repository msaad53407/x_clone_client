/**
 * User Service
 * Handles user profile, follow/unfollow, and user data operations
 */

import { privateApi, publicApi } from '@/lib/axios/axiosInstances';
import type { UserPublic, Tweet, PaginatedResponse, PaginationParams } from '@/types/api.types';

interface MessageResponse {
  message: string;
}

interface UpdateProfileRequest {
  display_name?: string;
  bio?: string;
  profile_image_url?: string;
  banner_image_url?: string;
}

/**
 * User service object
 */
export const userService = {
  /**
   * Get user profile by username
   */
  getByUsername: async (username: string): Promise<UserPublic> => {
    const response = await publicApi.get<UserPublic>(`/users/${username}`);
    return response.data;
  },

  /**
   * Get user's tweets
   */
  getUserTweets: async (username: string, params?: PaginationParams): Promise<PaginatedResponse<Tweet>> => {
    const response = await publicApi.get<PaginatedResponse<Tweet>>(`/users/${username}/tweets`, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20
      }
    });
    return response.data;
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserPublic> => {
    const response = await privateApi.patch<UserPublic>('/users/me', data);
    return response.data;
  },

  /**
   * Follow a user
   */
  follow: async (username: string): Promise<MessageResponse> => {
    const response = await privateApi.post<MessageResponse>(`/users/${username}/follow`);
    return response.data;
  },

  /**
   * Unfollow a user
   */
  unfollow: async (username: string): Promise<MessageResponse> => {
    const response = await privateApi.delete<MessageResponse>(`/users/${username}/follow`);
    return response.data;
  },

  /**
   * Get user's followers
   */
  getFollowers: async (username: string, params?: PaginationParams): Promise<PaginatedResponse<UserPublic>> => {
    const response = await publicApi.get<PaginatedResponse<UserPublic>>(`/users/${username}/followers`, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20
      }
    });
    return response.data;
  },

  /**
   * Get users that a user is following
   */
  getFollowing: async (username: string, params?: PaginationParams): Promise<PaginatedResponse<UserPublic>> => {
    const response = await publicApi.get<PaginatedResponse<UserPublic>>(`/users/${username}/following`, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20
      }
    });
    return response.data;
  },

  /**
   * Get user suggestions for "Who to follow"
   */
  getSuggestions: async (limit = 3): Promise<UserPublic[]> => {
    const response = await privateApi.get<UserPublic[]>('/users/suggestions/who-to-follow', {
      params: { limit }
    });
    return response.data;
  }
};
