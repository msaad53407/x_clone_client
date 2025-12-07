/**
 * Comment Service
 * Handles comment operations for tweets
 */

import { privateApi, publicApi } from '@/lib/axios/axiosInstances';
import type { Comment, PaginatedResponse } from '@/types/api.types';

interface CreateCommentRequest {
  content: string;
}

interface UpdateCommentRequest {
  content: string;
}

interface MessageResponse {
  message: string;
}

/**
 * Comment service object
 */
export const commentService = {
  /**
   * Get comments for a tweet
   */
  getComments: async (tweetId: string, page = 1, limit = 20): Promise<PaginatedResponse<Comment>> => {
    const response = await publicApi.get<PaginatedResponse<Comment>>(`/tweets/${tweetId}/comments`, {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * Create a comment on a tweet
   */
  createComment: async (tweetId: string, data: CreateCommentRequest): Promise<Comment> => {
    const response = await privateApi.post<Comment>(`/tweets/${tweetId}/comments`, data);
    return response.data;
  },

  /**
   * Update a comment
   */
  updateComment: async (commentId: string, data: UpdateCommentRequest): Promise<Comment> => {
    const response = await privateApi.patch<Comment>(`/comments/${commentId}`, data);
    return response.data;
  },

  /**
   * Delete a comment
   */
  deleteComment: async (tweetId: string, commentId: string): Promise<MessageResponse> => {
    const response = await privateApi.delete<MessageResponse>(`/tweets/${tweetId}/comments/${commentId}`);
    return response.data;
  }
};
