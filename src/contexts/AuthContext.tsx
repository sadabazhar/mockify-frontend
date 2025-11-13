import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authApi } from '@/api/auth';
import type { User, AuthResponse } from '@/api/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveAuthData = useCallback((data: AuthResponse) => {
    localStorage.setItem('accessToken', data.access_token);
    setUser(data.user);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await authApi.login({ email, password });
      saveAuthData(data);
    },
    [saveAuthData],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await authApi.register({ name, email, password });
      saveAuthData(data);
    },
    [saveAuthData],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuthData();
    }
  }, [clearAuthData]);

  // Load user on mount
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        if (mounted) setIsLoading(false);
        return;
      }

      // Optimistic local cache
      const cachedUser = localStorage.getItem('user');
      if (cachedUser && mounted) {
        setUser(JSON.parse(cachedUser));
      }

      try {
        const userData = await authApi.getCurrentUser();
        if (mounted) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('[Auth] Failed to fetch user:', error);
        if (mounted) clearAuthData();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadUser();
    return () => {
      mounted = false;
    };
  }, [clearAuthData]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
