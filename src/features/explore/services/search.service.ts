/**
 * Search Service
 * Handles user and tweet search operations
 */

import privateApi from '@/lib/axios/axiosInstances';
import type { PaginatedResponse, PaginationParams, Tweet, UserPublic } from '@/types/api.types';

interface SearchParams extends PaginationParams {
  q: string;
}

/**
 * Search service object
 */
export const searchService = {
  /**
   * Search users by username or display name
   */
  searchUsers: async (params: SearchParams): Promise<PaginatedResponse<UserPublic>> => {
    const response = await privateApi.get<PaginatedResponse<UserPublic>>('/search/users', {
      params: {
        q: params.q,
        page: params.page || 1,
        limit: params.limit || 20
      }
    });
    return response.data;
  },

  /**
   * Search tweets by content
   */
  searchTweets: async (params: SearchParams): Promise<PaginatedResponse<Tweet>> => {
    const response = await privateApi.get<PaginatedResponse<Tweet>>('/search/tweets', {
      params: {
        q: params.q,
        page: params.page || 1,
        limit: params.limit || 20
      }
    });
    return response.data;
  }
};
