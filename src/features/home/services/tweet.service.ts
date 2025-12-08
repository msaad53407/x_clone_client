/**
 * Tweet Service
 * Handles all tweet-related API calls
 */

import { privateApi } from '@/lib/axios/axiosInstances';
import type { PaginatedResponse, PaginationParams, Tweet, TweetCreateRequest } from '@/types/api.types';

/**
 * Tweet service object with all tweet-related functions
 */
export const tweetService = {
  /**
   * Create a new tweet
   */
  create: async (data: TweetCreateRequest): Promise<Tweet> => {
    const response = await privateApi.post<Tweet>('/tweets', data);
    return response.data;
  },

  /**
   * Get a tweet by ID
   */
  getById: async (tweetId: string): Promise<Tweet> => {
    const response = await privateApi.get<Tweet>(`/tweets/${tweetId}`);
    return response.data;
  },

  /**
   * Get paginated list of tweets
   */
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Tweet>> => {
    const response = await privateApi.get<PaginatedResponse<Tweet>>('/tweets', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20
      }
    });
    return response.data;
  },

  /**
   * Update a tweet
   */
  update: async (tweetId: string, data: { content?: string; image_url?: string }): Promise<Tweet> => {
    const response = await privateApi.patch<Tweet>(`/tweets/${tweetId}`, data);
    return response.data;
  },

  /**
   * Delete a tweet
   */
  delete: async (tweetId: string): Promise<void> => {
    await privateApi.delete(`/tweets/${tweetId}`);
  }
};
