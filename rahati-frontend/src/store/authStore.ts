import { create } from 'zustand';
import { User, UserRole, AuthResponse } from '../types';
import { authAPI } from '../services/api';

// Helper function to get dashboard URL based on user role
const getDashboardUrlByRole = (role?: string): string => {
  switch (role) {
    case 'Patient':
      return '/patient/dashboard';
    case 'Provider':
      return '/provider/dashboard';
    case 'Admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  redirectUrl: string | null;
  login: (email: string, password: string, redirectUrl?: string) => Promise<void>;
  register: (userData: any, redirectUrl?: string) => Promise<void>;
  logout: (redirectUrl?: string) => Promise<void>;
  clearError: () => void;
  initializeFromStorage: () => void;
  setRedirectUrl: (url: string | null) => void;
}

// Initialize state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
  }

  return {
    token,
    user,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
    redirectUrl: null
  };
};

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    ...getInitialState(),

    initializeFromStorage: () => {
      const initialState = getInitialState();
      set(initialState);
    },

    setRedirectUrl: (url: string | null) => {
      set({ redirectUrl: url });
    },

    login: async (email: string, password: string, redirectUrl?: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authAPI.login(email, password);
        const { token, userId, role } = response.data;

        // Save token to localStorage immediately
        localStorage.setItem('token', token);

        // Get user details
        const userResponse = await authAPI.getCurrentUser();
        const user = userResponse.data;

        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(user));

        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false
        });

        // Determine redirect URL
        const { redirectUrl: storedRedirectUrl } = get();
        const targetUrl = redirectUrl || storedRedirectUrl || getDashboardUrlByRole(user?.role);

        // Clear stored redirect URL
        set({ redirectUrl: null });

        // Redirect to appropriate page
        window.location.href = targetUrl;
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Login failed. Please check your credentials.'
        });
      }
    },

      register: async (userData: any, redirectUrl?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { token, userId, role } = response.data;

          // Save token to localStorage immediately
          localStorage.setItem('token', token);

          // Get user details
          const userResponse = await authAPI.getCurrentUser();
          const user = userResponse.data;

          // Save user to localStorage
          localStorage.setItem('user', JSON.stringify(user));

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false
          });

          // Determine redirect URL
          const { redirectUrl: storedRedirectUrl } = get();
          const targetUrl = redirectUrl || storedRedirectUrl || getDashboardUrlByRole(user?.role);

          // Clear stored redirect URL
          set({ redirectUrl: null });

          // Redirect to appropriate page
          window.location.href = targetUrl;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed. Please try again.'
          });
        }
      },

      logout: async (redirectUrl?: string) => {
        set({ isLoading: true });
        try {
          await authAPI.logout();
        } catch (error) {
          // Even if the API call fails, we still want to log out locally
          console.error('Logout API call failed', error);
        } finally {
          // Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            redirectUrl: null
          });

          // Redirect to specified URL or login page
          window.location.href = redirectUrl || '/login';
        }
      },

      clearError: () => set({ error: null }),
    })
);
