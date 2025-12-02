/**
 * Axios Instance Configuration
 * Provides separate instances for public and authenticated requests
 */

import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config/env';
import { setupPublicInterceptors, setupPrivateInterceptors } from './interceptors';

/**
 * Base axios configuration shared between instances
 */
const baseConfig = {
  baseURL: env.apiBaseUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: false // Set to true if using cookies
};

/**
 * Public Axios Instance
 * Use for unauthenticated requests (login, signup, public feeds, etc.)
 */
export const publicApi: AxiosInstance = axios.create(baseConfig);

/**
 * Private Axios Instance
 * Use for authenticated requests (user profile, posts, likes, etc.)
 * Automatically includes authentication token in headers
 */
export const privateApi: AxiosInstance = axios.create(baseConfig);

// Setup interceptors
setupPublicInterceptors(publicApi);
setupPrivateInterceptors(privateApi);

/**
 * Helper to check if API is reachable
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await publicApi.get('/health');
    return true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Export default as privateApi for convenience
 */
export default privateApi;
