import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URL } from '../constants';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastTokenRefresh: null,
      
      setUser: (user) => {
        if (import.meta.env.DEV) {
          console.log("🔐 ZUSTAND: Setting user", user);
        }
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false,
          lastTokenRefresh: Date.now()
        });
      },
      
      clearUser: () => {
        if (import.meta.env.DEV) {
          console.log("🔐 ZUSTAND: Clearing user");
        }
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          lastTokenRefresh: null
        });
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Token refresh method
      refreshToken: async () => {
        try {
          const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include', // Required for cookies
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data = await response.json();
          if (data.success) {
            set({ 
              user: data.user,
              isAuthenticated: true,
              lastTokenRefresh: Date.now()
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Clear user on refresh failure
          get().clearUser();
          return false;
        }
      },

      // Check if token needs refresh (older than 6 days)
      needsTokenRefresh: () => {
        const lastRefresh = get().lastTokenRefresh;
        if (!lastRefresh) return true;
        const SIX_DAYS = 6 * 24 * 60 * 60 * 1000;
        return Date.now() - lastRefresh > SIX_DAYS;
      },

      // Computed getters
      get isOnboarded() {
        return get().user?.isOnboarded || false;
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastTokenRefresh: state.lastTokenRefresh
      }),
    }
  )
);

export default useAuthStore;
