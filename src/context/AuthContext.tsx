import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, TOKEN_STORAGE_KEY } from '../api/client';
import type { Niche, User } from '../types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  niche: Niche;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get<{ user: User }>('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginPayload): Promise<User> => {
    const { data } = await api.post<{ token: string; user: User }>('/auth/login', payload);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<User> => {
    const { data } = await api.post<{ token: string; user: User }>('/auth/register', payload);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout network error and clear local session
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
