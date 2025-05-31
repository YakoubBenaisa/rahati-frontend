import { create } from 'zustand';
import { User } from '../types';
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
    case 'Superuser':
      return '/admin/dashboard'; // Superuser uses the admin dashboard
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
        console.log('Attempting login with:', { email, password });

        // If not using hardcoded credentials, try the real API
        const response = await authAPI.login(email, password);
        console.log('Login response:', response.data);

        // Extract data from response
        // The API might return data directly or nested in a data property
        const responseData = response.data.data || response.data;
        const { token: apiToken, role } = responseData;

        if (!apiToken) {
          throw new Error('No token received from server');
        }

        // Save token to localStorage immediately
        localStorage.setItem('token', apiToken);
        console.log('Token saved to localStorage:', apiToken);

        try {
          // Get user details
          console.log('Fetching user details with token');
          const userResponse = await authAPI.getCurrentUser();
          console.log('User response:', userResponse.data);

          // The API might return user data directly or nested in a data property
          const userData = userResponse.data.data || userResponse.data;

          // Save user to localStorage
          localStorage.setItem('user', JSON.stringify(userData));

          set({
            token: apiToken,
            user: userData,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (userError) {
          console.error('Error fetching user details:', userError);
          // Even if getting user details fails, we're still authenticated with the token
          set({
            token: apiToken,
            isAuthenticated: true,
            isLoading: false
          });
        }

        // Determine redirect URL
        const { redirectUrl: storedRedirectUrl } = get();
        const targetUrl = redirectUrl || storedRedirectUrl || getDashboardUrlByRole(role);
        console.log('Redirecting to:', targetUrl);

        // Clear stored redirect URL
        set({ redirectUrl: null });

        // Redirect to appropriate page
        window.location.href = targetUrl;
      } catch (error: any) {
        console.error('Login error:', error);
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Login failed. Please check your credentials.'
        });
      }
    },

      register: async (userData: any, redirectUrl?: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting registration with:', userData);

          // If not using hardcoded registration, try the real API
          const response = await authAPI.register(userData);
          console.log('Registration response:', response.data);

          // Extract data from response
          // The API might return data directly or nested in a data property
          const responseData = response.data.data || response.data;
          const { token: apiToken, role } = responseData;

          if (!apiToken) {
            throw new Error('No token received from server');
          }

          // Save token to localStorage immediately
          localStorage.setItem('token', apiToken);
          console.log('Token saved to localStorage:', apiToken);

          try {
            // Get user details
            console.log('Fetching user details with token');
            const userResponse = await authAPI.getCurrentUser();
            console.log('User response:', userResponse.data);

            // The API might return user data directly or nested in a data property
            const userData = userResponse.data.data || userResponse.data;

            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            set({
              token: apiToken,
              user: userData,
              isAuthenticated: true,
              isLoading: false
            });
          } catch (userError) {
            console.error('Error fetching user details:', userError);
            // Even if getting user details fails, we're still authenticated with the token
            set({
              token: apiToken,
              isAuthenticated: true,
              isLoading: false
            });
          }

          // Determine redirect URL
          const { redirectUrl: storedRedirectUrl } = get();
          const targetUrl = redirectUrl || storedRedirectUrl || getDashboardUrlByRole(role);
          console.log('Redirecting to:', targetUrl);

          // Clear stored redirect URL
          set({ redirectUrl: null });

          // Redirect to appropriate page
          window.location.href = targetUrl;
        } catch (error: any) {
          console.error('Registration error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed. Please try again.'
          });
        }
      },

      logout: async (redirectUrl?: string) => {
        set({ isLoading: true });
        try {
          console.log('Attempting logout');

          // Try to call the logout API
          try {
            await authAPI.logout();
            console.log('Logout API call successful');
          } catch (error) {
            // Even if the API call fails, we still want to log out locally
            console.error('Logout API call failed', error);
          }

          // Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.log('Cleared localStorage');

          // Update state
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            redirectUrl: null
          });

          // Redirect to specified URL or login page
          const targetUrl = redirectUrl || '/login';
          console.log('Redirecting to:', targetUrl);
          window.location.href = targetUrl;
        } catch (error) {
          console.error('Logout error:', error);

          // Even if there's an error, we still want to log out locally
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            redirectUrl: null
          });

          window.location.href = redirectUrl || '/login';
        }
      },

      clearError: () => set({ error: null }),
    })
);
