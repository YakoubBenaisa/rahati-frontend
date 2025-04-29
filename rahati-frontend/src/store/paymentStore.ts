import { create } from 'zustand';
import { Payment } from '../types';
import { paymentsAPI } from '../services/api';

interface PaymentState {
  payments: Payment[];
  selectedPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  fetchPayments: (params?: any) => Promise<void>;
  fetchPaymentById: (id: number) => Promise<void>;
  processPayment: (paymentData: any) => Promise<void>;
  updatePayment: (id: number, paymentData: any) => Promise<void>;
  deletePayment: (id: number) => Promise<void>;
  clearSelectedPayment: () => void;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  selectedPayment: null,
  isLoading: false,
  error: null,

  fetchPayments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsAPI.getPayments(params);
      const payments = response.data.data || response.data;
      set({ payments, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch payments.' 
      });
    }
  },

  fetchPaymentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsAPI.getPaymentById(id);
      const payment = response.data.data || response.data;
      set({ selectedPayment: payment, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch payment details.' 
      });
    }
  },

  processPayment: async (paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsAPI.processPayment(paymentData);
      const newPayment = response.data.data || response.data;
      set(state => ({ 
        payments: [...state.payments, newPayment],
        isLoading: false 
      }));
      return newPayment;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to process payment.' 
      });
      throw error;
    }
  },

  updatePayment: async (id, paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsAPI.updatePayment(id, paymentData);
      const updatedPayment = response.data.data || response.data;
      
      // Update both the list and the selected payment
      set(state => ({ 
        payments: state.payments.map(payment => 
          payment.id === id ? updatedPayment : payment
        ),
        selectedPayment: state.selectedPayment?.id === id 
          ? updatedPayment 
          : state.selectedPayment,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update payment.' 
      });
      throw error;
    }
  },

  deletePayment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await paymentsAPI.deletePayment(id);
      
      // Remove the payment from the local state
      set(state => ({ 
        payments: state.payments.filter(payment => payment.id !== id),
        selectedPayment: state.selectedPayment?.id === id 
          ? null 
          : state.selectedPayment,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete payment.' 
      });
      throw error;
    }
  },

  clearSelectedPayment: () => set({ selectedPayment: null }),
  
  clearError: () => set({ error: null }),
}));
