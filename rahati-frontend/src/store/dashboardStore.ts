import { create } from 'zustand';
import { dashboardAPI } from '../services/dashboardAPI';
import { Appointment } from '../types';

interface AdminStats {
  totalCenters: number;
  totalUsers: number;
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  totalProviders: number;
  totalConsultations: number;
  recentAppointments: Appointment[];
}

interface ProviderStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  activeConsultations: number;
  todayAppointmentsList: Appointment[];
}

interface DashboardState {
  adminStats: AdminStats | null;
  providerStats: ProviderStats | null;
  isLoading: boolean;
  error: string | null;
  fetchAdminStats: () => Promise<void>;
  fetchProviderStats: (providerId: number) => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  adminStats: null,
  providerStats: null,
  isLoading: false,
  error: null,

  fetchAdminStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getAdminStats();
      const stats = response.data.data || response.data;
      set({ adminStats: stats, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch admin dashboard statistics.' 
      });
    }
  },

  fetchProviderStats: async (providerId) => {
    set({ isLoading: true, error: null });
    try {
      // Get provider stats
      const statsResponse = await dashboardAPI.getProviderStats(providerId);
      const stats = statsResponse.data.data || statsResponse.data;
      
      // Get today's appointments
      const todayAppointmentsResponse = await dashboardAPI.getProviderTodayAppointments(providerId);
      const todayAppointmentsList = todayAppointmentsResponse.data.data || todayAppointmentsResponse.data;
      
      // Combine the data
      const providerStats = {
        ...stats,
        todayAppointmentsList
      };
      
      set({ providerStats, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch provider dashboard statistics.' 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
