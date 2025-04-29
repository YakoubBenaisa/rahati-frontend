import api from './api';
import { AxiosResponse } from 'axios';
import { Appointment, Center, User } from '../types';

// Dashboard API calls
export const dashboardAPI = {
  // Admin dashboard statistics - using existing endpoints to aggregate data
  getAdminStats: async (): Promise<AxiosResponse<any>> => {
    try {
      // Fetch data from multiple endpoints
      const [centersRes, usersRes, appointmentsRes] = await Promise.all([
        api.get('/centers'),
        api.get('/users'),
        api.get('/appointments')
      ]);

      const centers = centersRes.data.data || centersRes.data;
      const users = usersRes.data.data || usersRes.data;
      const appointments = appointmentsRes.data.data || appointmentsRes.data;

      // Calculate statistics
      const totalCenters = centers.length;
      const totalUsers = users.length;
      const totalPatients = users.filter((user: User) => user.role === 'Patient').length;
      const totalProviders = users.filter((user: User) => user.role === 'Provider').length;
      const totalAppointments = appointments.length;
      const scheduledAppointments = appointments.filter((a: Appointment) => a.status === 'scheduled').length;
      const completedAppointments = appointments.filter((a: Appointment) => a.status === 'completed').length;
      const cancelledAppointments = appointments.filter((a: Appointment) => a.status === 'cancelled').length;

      // Get recent appointments
      const recentAppointments = [...appointments]
        .sort((a: Appointment, b: Appointment) =>
          new Date(b.appointment_datetime).getTime() - new Date(a.appointment_datetime).getTime()
        )
        .slice(0, 5);

      // Construct response in the expected format
      return {
        data: {
          totalCenters,
          totalUsers,
          totalPatients,
          totalProviders,
          totalAppointments,
          scheduledAppointments,
          completedAppointments,
          cancelledAppointments,
          totalConsultations: 0, // This would need a separate endpoint
          recentAppointments
        }
      } as any;
    } catch (error) {
      throw error;
    }
  },

  // Provider dashboard statistics
  getProviderStats: async (providerId: number): Promise<AxiosResponse<any>> => {
    try {
      // Fetch appointments for this provider
      const appointmentsRes = await api.get('/appointments', {
        params: { provider_id: providerId }
      });

      const appointments = appointmentsRes.data.data || appointmentsRes.data;

      // Get today's date for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Calculate statistics
      const totalAppointments = appointments.length;

      const todayAppointmentsList = appointments.filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.appointment_datetime);
        return appointmentDate >= today && appointmentDate < tomorrow;
      }).sort((a: Appointment, b: Appointment) =>
        new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
      );

      const todayAppointments = todayAppointmentsList.length;

      const upcomingAppointments = appointments.filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.appointment_datetime);
        return appointmentDate >= tomorrow && appointment.status === 'scheduled';
      }).length;

      const completedAppointments = appointments.filter((a: Appointment) => a.status === 'completed').length;
      const cancelledAppointments = appointments.filter((a: Appointment) => a.status === 'cancelled').length;

      // Get unique patient count
      const patientIds = new Set(appointments.map((a: Appointment) => a.patient_id));
      const totalPatients = patientIds.size;

      // Construct response in the expected format
      return {
        data: {
          totalAppointments,
          todayAppointments,
          upcomingAppointments,
          completedAppointments,
          cancelledAppointments,
          totalPatients,
          activeConsultations: 0, // This would need a separate endpoint
          todayAppointmentsList
        }
      } as any;
    } catch (error) {
      throw error;
    }
  },

  // Get today's appointments for provider
  getProviderTodayAppointments: async (providerId: number): Promise<AxiosResponse<any>> => {
    try {
      const appointmentsRes = await api.get('/appointments', {
        params: { provider_id: providerId }
      });

      const appointments = appointmentsRes.data.data || appointmentsRes.data;

      // Get today's date for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Filter today's appointments
      const todayAppointments = appointments.filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.appointment_datetime);
        return appointmentDate >= today && appointmentDate < tomorrow;
      }).sort((a: Appointment, b: Appointment) =>
        new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
      );

      return { data: todayAppointments } as any;
    } catch (error) {
      throw error;
    }
  },

  // Get upcoming appointments for provider
  getProviderUpcomingAppointments: async (providerId: number): Promise<AxiosResponse<any>> => {
    try {
      const appointmentsRes = await api.get('/appointments', {
        params: { provider_id: providerId, status: 'scheduled' }
      });

      const appointments = appointmentsRes.data.data || appointmentsRes.data;

      // Get tomorrow's date for filtering
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Filter upcoming appointments
      const upcomingAppointments = appointments.filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.appointment_datetime);
        return appointmentDate >= tomorrow;
      }).sort((a: Appointment, b: Appointment) =>
        new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
      );

      return { data: upcomingAppointments } as any;
    } catch (error) {
      throw error;
    }
  },

  // Get patient count for provider
  getProviderPatientCount: async (providerId: number): Promise<AxiosResponse<any>> => {
    try {
      const appointmentsRes = await api.get('/appointments', {
        params: { provider_id: providerId }
      });

      const appointments = appointmentsRes.data.data || appointmentsRes.data;

      // Get unique patient count
      const patientIds = new Set(appointments.map((a: Appointment) => a.patient_id));

      return { data: { count: patientIds.size } } as any;
    } catch (error) {
      throw error;
    }
  },

  // Get consultation count for provider
  getProviderConsultationCount: async (providerId: number): Promise<AxiosResponse<any>> => {
    try {
      // This would ideally use a consultations endpoint
      // For now, we'll use completed appointments as a proxy
      const appointmentsRes = await api.get('/appointments', {
        params: { provider_id: providerId, status: 'completed' }
      });

      const completedAppointments = appointmentsRes.data.data || appointmentsRes.data;

      return { data: { count: completedAppointments.length } } as any;
    } catch (error) {
      throw error;
    }
  },
};
