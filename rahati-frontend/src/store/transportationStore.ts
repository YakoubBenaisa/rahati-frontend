import { create } from 'zustand';
import { TransportationRequest } from '../types';
import { transportationAPI } from '../services/api';

interface TransportationState {
  transportationRequests: TransportationRequest[];
  selectedTransportationRequest: TransportationRequest | null;
  isLoading: boolean;
  error: string | null;
  fetchTransportationRequests: (params?: any) => Promise<void>;
  fetchTransportationRequestById: (id: number) => Promise<void>;
  createTransportationRequest: (transportationData: any) => Promise<void>;
  updateTransportationRequest: (id: number, transportationData: any) => Promise<void>;
  cancelTransportationRequest: (id: number) => Promise<void>;
  clearSelectedTransportationRequest: () => void;
  clearError: () => void;
}

export const useTransportationStore = create<TransportationState>((set) => ({
  transportationRequests: [],
  selectedTransportationRequest: null,
  isLoading: false,
  error: null,

  fetchTransportationRequests: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await transportationAPI.getTransportationRequests(params);
      const transportationRequests = response.data.data || response.data;
      set({ transportationRequests, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch transportation requests.' 
      });
    }
  },

  fetchTransportationRequestById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await transportationAPI.getTransportationRequestById(id);
      const transportationRequest = response.data.data || response.data;
      set({ selectedTransportationRequest: transportationRequest, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch transportation request details.' 
      });
    }
  },

  createTransportationRequest: async (transportationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await transportationAPI.createTransportationRequest(transportationData);
      const newTransportationRequest = response.data.data || response.data;
      set(state => ({ 
        transportationRequests: [...state.transportationRequests, newTransportationRequest],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create transportation request.' 
      });
      throw error;
    }
  },

  updateTransportationRequest: async (id, transportationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await transportationAPI.updateTransportationRequest(id, transportationData);
      const updatedTransportationRequest = response.data.data || response.data;
      
      // Update both the list and the selected transportation request
      set(state => ({ 
        transportationRequests: state.transportationRequests.map(tr => 
          tr.id === id ? updatedTransportationRequest : tr
        ),
        selectedTransportationRequest: state.selectedTransportationRequest?.id === id 
          ? updatedTransportationRequest 
          : state.selectedTransportationRequest,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update transportation request.' 
      });
      throw error;
    }
  },

  cancelTransportationRequest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await transportationAPI.cancelTransportationRequest(id);
      
      // Update the status in the local state
      set(state => ({ 
        transportationRequests: state.transportationRequests.map(tr => 
          tr.id === id ? { ...tr, status: 'cancelled' } : tr
        ),
        selectedTransportationRequest: state.selectedTransportationRequest?.id === id 
          ? { ...state.selectedTransportationRequest, status: 'cancelled' } 
          : state.selectedTransportationRequest,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to cancel transportation request.' 
      });
      throw error;
    }
  },

  clearSelectedTransportationRequest: () => set({ selectedTransportationRequest: null }),
  
  clearError: () => set({ error: null }),
}));
