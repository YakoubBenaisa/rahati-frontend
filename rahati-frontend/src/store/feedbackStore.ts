import { create } from 'zustand';
import { Feedback } from '../types';
import { feedbackAPI } from '../services/api';

interface FeedbackState {
  feedbackList: Feedback[];
  selectedFeedback: Feedback | null;
  isLoading: boolean;
  error: string | null;
  fetchFeedback: (params?: any) => Promise<void>;
  fetchFeedbackById: (id: number) => Promise<void>;
  submitFeedback: (feedbackData: any) => Promise<void>;
  updateFeedback: (id: number, feedbackData: any) => Promise<void>;
  deleteFeedback: (id: number) => Promise<void>;
  clearSelectedFeedback: () => void;
  clearError: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  feedbackList: [],
  selectedFeedback: null,
  isLoading: false,
  error: null,

  fetchFeedback: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feedbackAPI.getFeedback(params);
      const feedbackList = response.data.data || response.data;
      set({ feedbackList, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch feedback.' 
      });
    }
  },

  fetchFeedbackById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feedbackAPI.getFeedbackById(id);
      const feedback = response.data.data || response.data;
      set({ selectedFeedback: feedback, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch feedback details.' 
      });
    }
  },

  submitFeedback: async (feedbackData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feedbackAPI.submitFeedback(feedbackData);
      const newFeedback = response.data.data || response.data;
      set(state => ({ 
        feedbackList: [...state.feedbackList, newFeedback],
        isLoading: false 
      }));
      return newFeedback;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to submit feedback.' 
      });
      throw error;
    }
  },

  updateFeedback: async (id, feedbackData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feedbackAPI.updateFeedback(id, feedbackData);
      const updatedFeedback = response.data.data || response.data;
      
      // Update both the list and the selected feedback
      set(state => ({ 
        feedbackList: state.feedbackList.map(feedback => 
          feedback.id === id ? updatedFeedback : feedback
        ),
        selectedFeedback: state.selectedFeedback?.id === id 
          ? updatedFeedback 
          : state.selectedFeedback,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update feedback.' 
      });
      throw error;
    }
  },

  deleteFeedback: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await feedbackAPI.deleteFeedback(id);
      
      // Remove the feedback from the local state
      set(state => ({ 
        feedbackList: state.feedbackList.filter(feedback => feedback.id !== id),
        selectedFeedback: state.selectedFeedback?.id === id 
          ? null 
          : state.selectedFeedback,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete feedback.' 
      });
      throw error;
    }
  },

  clearSelectedFeedback: () => set({ selectedFeedback: null }),
  
  clearError: () => set({ error: null }),
}));
