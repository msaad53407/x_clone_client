/**
 * Environment Configuration
 * Centralizes environment variable access with type safety
 */

interface EnvConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

/**
 * Application environment configuration
 */
export const env: EnvConfig = {
  // API Base URL - defaults to localhost for development
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),

  // Environment checks
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production'
};

/**
 * Validate required environment variables
 */
export const validateEnv = (): void => {
  const required = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing environment variables: ${missing.join(', ')}\n` +
        'Using default values. Create a .env file for custom configuration.'
    );
  }
};

// Validate on import
validateEnv();
