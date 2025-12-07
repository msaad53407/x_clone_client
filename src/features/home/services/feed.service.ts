/**
 * Feed Service
 * Handles home feed and explore feed
 */

import { privateApi, publicApi } from '@/lib/axios/axiosInstances';
import type { Tweet, PaginatedResponse, PaginationParams } from '@/types/api.types';

/**
 * Feed service object
 */
export const feedService = {
  /**
   * Get personalized home feed (requires auth)
   */
  getHomeFeed: async (params?: PaginationParams): Promise<PaginatedResponse<Tweet>> => {
    const response = await privateApi.get<PaginatedResponse<Tweet>>('/feed/home', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20
      }
    });
    return response.data;
  },

  /**
   * Get explore feed (public)
   */
  getExploreFeed: async (params?: PaginationParams): Promise<PaginatedResponse<Tweet>> => {
    const response = await publicApi.get<PaginatedResponse<Tweet>>('/feed/explore', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20
      }
    });
    return response.data;
  }
};
