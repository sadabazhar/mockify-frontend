import React, { createContext } from 'react';
import type { User, AuthResponse } from '@/api/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
} from '@/hooks/use-auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthResponse>;
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
  const { data: user, isLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const value = {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,

    login: async (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),

    register: async (name: string, email: string, password: string) =>
      registerMutation.mutateAsync({ name, email, password }),

    logout: async () => logoutMutation.mutateAsync(),
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
