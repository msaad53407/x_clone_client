/**
 * Upload Service
 * Handles file uploads to the backend (Cloudinary)
 */

import { privateApi } from '@/lib/axios/axiosInstances';
import type { User } from '@/types/api.types';

interface UploadTweetImageResponse {
  url: string;
  success: boolean;
}

/**
 * Upload service object
 */
export const uploadService = {
  /**
   * Upload profile image
   * Returns updated user data
   */
  uploadProfileImage: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await privateApi.post<User>('/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Upload banner image
   * Returns updated user data
   */
  uploadBannerImage: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await privateApi.post<User>('/upload/banner-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Upload tweet image
   * Returns the URL to use when creating a tweet
   */
  uploadTweetImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await privateApi.post<UploadTweetImageResponse>('/upload/tweet-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.url;
  }
};
