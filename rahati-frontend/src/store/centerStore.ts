import { create } from 'zustand';
import { Center } from '../types';
import { centersAPI } from '../services/api';

interface CenterState {
  centers: Center[];
  selectedCenter: Center | null;
  isLoading: boolean;
  error: string | null;
  fetchCenters: (params?: any) => Promise<void>;
  fetchCenterById: (id: number) => Promise<void>;
  createCenter: (centerData: any) => Promise<void>;
  updateCenter: (id: number, centerData: any) => Promise<void>;
  deleteCenter: (id: number) => Promise<void>;
  clearSelectedCenter: () => void;
  clearError: () => void;
}

export const useCenterStore = create<CenterState>((set) => ({
  centers: [],
  selectedCenter: null,
  isLoading: false,
  error: null,

  fetchCenters: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await centersAPI.getCenters(params);
      const centers = response.data.data || response.data;
      set({ centers, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch centers.' 
      });
    }
  },

  fetchCenterById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await centersAPI.getCenterById(id);
      set({ selectedCenter: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch center details.' 
      });
    }
  },

  createCenter: async (centerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await centersAPI.createCenter(centerData);
      const newCenter = response.data;
      set(state => ({ 
        centers: [...state.centers, newCenter],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create center.' 
      });
    }
  },

  updateCenter: async (id, centerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await centersAPI.updateCenter(id, centerData);
      const updatedCenter = response.data;
      
      set(state => ({ 
        centers: state.centers.map(center => 
          center.id === id ? updatedCenter : center
        ),
        selectedCenter: updatedCenter,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update center.' 
      });
    }
  },

  deleteCenter: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await centersAPI.deleteCenter(id);
      
      set(state => ({ 
        centers: state.centers.filter(center => center.id !== id),
        selectedCenter: state.selectedCenter?.id === id ? null : state.selectedCenter,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete center.' 
      });
    }
  },

  clearSelectedCenter: () => set({ selectedCenter: null }),
  clearError: () => set({ error: null }),
}));
