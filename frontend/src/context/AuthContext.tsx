import { createContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import * as authApi from '../services/api/auth.api';
import type { AuthUser } from '../types/auth.types';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, user: loggedInUser } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    setUser(loggedInUser);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
}
