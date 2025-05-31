import { create } from 'zustand';
import { Appointment } from '../types';
import { appointmentsAPI } from '../services/api';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  fetchAppointments: (params?: any) => Promise<void>;
  fetchAppointmentById: (id: number) => Promise<void>;
  createAppointment: (appointmentData: any) => Promise<void>;
  updateAppointment: (id: number, appointmentData: any) => Promise<void>;
  cancelAppointment: (id: number) => Promise<void>;
  clearSelectedAppointment: () => void;
  clearError: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,

  fetchAppointments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentsAPI.getAppointments(params);
      const appointments = response.data.data || response.data;
      set({ appointments, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch appointments.' 
      });
    }
  },

  fetchAppointmentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentsAPI.getAppointmentById(id);
      set({ selectedAppointment: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch appointment details.' 
      });
    }
  },

  createAppointment: async (appointmentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentsAPI.createAppointment(appointmentData);
      const newAppointment = response.data;
      set(state => ({ 
        appointments: [...state.appointments, newAppointment],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create appointment.' 
      });
    }
  },

  updateAppointment: async (id, appointmentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentsAPI.updateAppointment(id, appointmentData);
      const updatedAppointment = response.data;
      
      set(state => ({ 
        appointments: state.appointments.map(appointment => 
          appointment.id === id ? updatedAppointment : appointment
        ),
        selectedAppointment: updatedAppointment,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update appointment.' 
      });
    }
  },

  cancelAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentsAPI.cancelAppointment(id);
      
      set(state => {
        // Find the appointment to update its status
        const updatedAppointments = state.appointments.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'cancelled' as const } 
            : appointment
        );
        
        // Update selected appointment if it's the one being cancelled
        const updatedSelectedAppointment = state.selectedAppointment?.id === id
          ? { ...state.selectedAppointment, status: 'cancelled' as const }
          : state.selectedAppointment;
        
        return { 
          appointments: updatedAppointments,
          selectedAppointment: updatedSelectedAppointment,
          isLoading: false 
        };
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to cancel appointment.' 
      });
    }
  },

  clearSelectedAppointment: () => set({ selectedAppointment: null }),
  clearError: () => set({ error: null }),
}));
