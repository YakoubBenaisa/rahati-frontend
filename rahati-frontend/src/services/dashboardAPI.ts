import api from './api';
import { AxiosResponse } from 'axios';

// Dashboard API calls
export const dashboardAPI = {
  // Admin dashboard statistics
  getAdminStats: (): Promise<AxiosResponse<any>> => 
    api.get('/dashboard/admin/stats'),
  
  // Provider dashboard statistics
  getProviderStats: (providerId: number): Promise<AxiosResponse<any>> => 
    api.get(`/dashboard/provider/${providerId}/stats`),
  
  // Get today's appointments for provider
  getProviderTodayAppointments: (providerId: number): Promise<AxiosResponse<any>> => 
    api.get(`/dashboard/provider/${providerId}/today-appointments`),
  
  // Get upcoming appointments for provider
  getProviderUpcomingAppointments: (providerId: number): Promise<AxiosResponse<any>> => 
    api.get(`/dashboard/provider/${providerId}/upcoming-appointments`),
  
  // Get patient count for provider
  getProviderPatientCount: (providerId: number): Promise<AxiosResponse<any>> => 
    api.get(`/dashboard/provider/${providerId}/patient-count`),
  
  // Get consultation count for provider
  getProviderConsultationCount: (providerId: number): Promise<AxiosResponse<any>> => 
    api.get(`/dashboard/provider/${providerId}/consultation-count`),
};
