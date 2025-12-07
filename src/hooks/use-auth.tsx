/**
 * Auth Context & Hook
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '@/features/auth/services/auth.service';
import { getAccessToken, removeAccessToken } from '@/lib/axios/interceptors';
import type { User, LoginRequest, RegisterRequest } from '@/types/api.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  /**
   * Fetch current user from API
   */
  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      removeAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login and fetch user data
   */
  const login = useCallback(
    async (data: LoginRequest) => {
      await authService.login(data);
      await refreshUser();
    },
    [refreshUser]
  );

  /**
   * Register new user (still need to verify email before login)
   */
  const register = useCallback(async (data: RegisterRequest): Promise<User> => {
    return await authService.register(data);
  }, []);

  /**
   * Logout and clear state
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  // Check for existing auth on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
