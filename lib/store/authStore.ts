import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

// Helpers for cookie management
const setAuthCookie = (token: string) => {
  if (typeof document === 'undefined') return;
  // Expire in 7 days
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
};

const clearAuthCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax; Secure';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
        setAuthCookie(token);
      },
      setToken: (token) => {
        set({ token });
        setAuthCookie(token);
      },
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        clearAuthCookie();
      },
    }),
    {
      name: 'hoalang-auth',
    }
  )
);

