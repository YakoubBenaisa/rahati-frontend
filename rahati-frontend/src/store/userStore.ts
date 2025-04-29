import { create } from 'zustand';
import { User } from '../types';
import { usersAPI, authAPI } from '../services/api';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  fetchCurrentUser: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  updatePassword: (passwordData: { current_password: string; password: string; password_confirmation: string }) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.getCurrentUser();
      const user = response.data.data || response.data;
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch user profile.' 
      });
      throw error;
    }
  },

  updateUserProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = get().currentUser;
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }

      const response = await usersAPI.updateUser(currentUser.id, userData);
      const updatedUser = response.data.data || response.data;
      
      set({ currentUser: updatedUser, isLoading: false });
      return updatedUser;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update user profile.' 
      });
      throw error;
    }
  },

  updatePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = get().currentUser;
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }

      await usersAPI.updateUser(currentUser.id, passwordData);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update password.' 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
