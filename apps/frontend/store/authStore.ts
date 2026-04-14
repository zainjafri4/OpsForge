import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthResponse, User } from '@/types';
import { storeAuth, clearAuth, getStoredAuth } from '@/lib/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (auth: AuthResponse) => {
        storeAuth(auth);
        set({
          user: auth.user,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        clearAuth();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Sync with localStorage on mount
        const stored = getStoredAuth();
        if (stored.accessToken && stored.user) {
          state?.setAuth({
            accessToken: stored.accessToken,
            refreshToken: stored.refreshToken!,
            user: stored.user,
          });
        }
      },
    }
  )
);
