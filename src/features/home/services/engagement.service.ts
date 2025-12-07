/**
 * Engagement Service
 * Handles like and bookmark operations
 */

import { privateApi } from '@/lib/axios/axiosInstances';
import type { Tweet, PaginatedResponse, PaginationParams } from '@/types/api.types';

interface MessageResponse {
  message: string;
}

/**
 * Engagement service object with like/bookmark functions
 */
export const engagementService = {
  // ==================
  // LIKES
  // ==================

  /**
   * Like a tweet
   */
  likeTweet: async (tweetId: string): Promise<MessageResponse> => {
    const response = await privateApi.post<MessageResponse>(`/tweets/${tweetId}/like`);
    return response.data;
  },

  /**
   * Unlike a tweet
   */
  unlikeTweet: async (tweetId: string): Promise<MessageResponse> => {
    const response = await privateApi.delete<MessageResponse>(`/tweets/${tweetId}/like`);
    return response.data;
  },

  // ==================
  // BOOKMARKS
  // ==================

  /**
   * Bookmark a tweet
   */
  bookmarkTweet: async (tweetId: string): Promise<MessageResponse> => {
    const response = await privateApi.post<MessageResponse>(`/tweets/${tweetId}/bookmark`);
    return response.data;
  },

  /**
   * Remove bookmark
   */
  unbookmarkTweet: async (tweetId: string): Promise<MessageResponse> => {
    const response = await privateApi.delete<MessageResponse>(`/tweets/${tweetId}/bookmark`);
    return response.data;
  },

  /**
   * Get user's bookmarked tweets
   */
  getBookmarks: async (params?: PaginationParams): Promise<PaginatedResponse<Tweet>> => {
    const response = await privateApi.get<PaginatedResponse<Tweet>>('/bookmarks', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20
      }
    });
    return response.data;
  }
};
