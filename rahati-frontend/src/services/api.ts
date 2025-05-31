import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthResponse } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // Check if the API expects the token with or without 'Bearer ' prefix
      // For this API, we'll include the 'Bearer ' prefix
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', config.url, config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      console.log('Unauthorized access, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
    console.log('Sending login request with:', { email, password });
    return api.post('/auth/login', { email, password });
  },

  register: (userData: any): Promise<AxiosResponse<AuthResponse>> => {
    console.log('Sending register request with:', userData);
    return api.post('/auth/register', userData);
  },

  logout: (): Promise<AxiosResponse<any>> => {
    console.log('Sending logout request');
    return api.post('/auth/logout');
  },

  getCurrentUser: (): Promise<AxiosResponse<any>> => {
    console.log('Fetching current user');
    return api.get('/auth/user');
  },
};

// Users API calls
export const usersAPI = {
  getUsers: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/users', { params }),

  getUserById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/users/${id}`),

  createUser: (userData: any): Promise<AxiosResponse<any>> =>
    api.post('/users', userData),

  updateUser: (id: number, userData: any): Promise<AxiosResponse<any>> =>
    api.put(`/users/${id}`, userData),

  deleteUser: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/users/${id}`),

  resetPassword: (id: number): Promise<AxiosResponse<any>> =>
    api.post(`/users/${id}/reset-password`),

  // Provider-specific routes
  getMyPatients: (): Promise<AxiosResponse<any>> =>
    api.get('/my-patients'),

  getMyPatientsDetailed: (): Promise<AxiosResponse<any>> =>
    api.get('/my-patients-detailed'),

  getPatientDetails: (patientId: number): Promise<AxiosResponse<any>> =>
    api.get(`/patient-details/${patientId}`),
};

// Centers API calls
export const centersAPI = {
  getCenters: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/centers', { params }),

  getCenterById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/centers/${id}`),

  createCenter: (centerData: any): Promise<AxiosResponse<any>> =>
    api.post('/centers', centerData),

  updateCenter: (id: number, centerData: any): Promise<AxiosResponse<any>> =>
    api.put(`/centers/${id}`, centerData),

  deleteCenter: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/centers/${id}`),
};

// Appointments API calls
export const appointmentsAPI = {
  getAppointments: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/appointments', { params }),

  getAppointmentById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/appointments/${id}`),

  createAppointment: (appointmentData: any): Promise<AxiosResponse<any>> =>
    api.post('/appointments', appointmentData),

  updateAppointment: (id: number, appointmentData: any): Promise<AxiosResponse<any>> =>
    api.put(`/appointments/${id}`, appointmentData),

  cancelAppointment: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/appointments/${id}`),
};

// Consultations API calls
export const consultationsAPI = {
  getConsultations: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/consultations', { params }),

  getConsultationById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/consultations/${id}`),

  createConsultation: (consultationData: any): Promise<AxiosResponse<any>> =>
    api.post('/consultations', consultationData),

  updateConsultation: (id: number, consultationData: any): Promise<AxiosResponse<any>> =>
    api.put(`/consultations/${id}`, consultationData),

  deleteConsultation: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/consultations/${id}`),

  // Additional methods for specific actions
  startConsultation: (id: number): Promise<AxiosResponse<any>> =>
    api.patch(`/consultations/${id}/start`),

  completeConsultation: (id: number, consultationData: any): Promise<AxiosResponse<any>> =>
    api.patch(`/consultations/${id}/complete`, consultationData),

  cancelConsultation: (id: number, reason?: string): Promise<AxiosResponse<any>> =>
    api.patch(`/consultations/${id}/cancel`, { reason }),
};

// Accommodations API calls
export const accommodationsAPI = {
  getAccommodations: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/accommodations', { params }),

  getAccommodationById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/accommodations/${id}`),

  bookAccommodation: (accommodationData: any): Promise<AxiosResponse<any>> =>
    api.post('/accommodations', accommodationData),

  updateAccommodation: (id: number, accommodationData: any): Promise<AxiosResponse<any>> =>
    api.put(`/accommodations/${id}`, accommodationData),

  cancelAccommodation: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/accommodations/${id}`),
};

// Rooms API calls
export const roomsAPI = {
  getRooms: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/rooms', { params }),

  getRoomById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/rooms/${id}`),

  createRoom: (roomData: any): Promise<AxiosResponse<any>> =>
    api.post('/rooms', roomData),

  updateRoom: (id: number, roomData: any): Promise<AxiosResponse<any>> =>
    api.put(`/rooms/${id}`, roomData),

  deleteRoom: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/rooms/${id}`),
};

// Meal options API calls
export const mealOptionsAPI = {
  getMealOptions: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/meal-options', { params }),

  getMealOptionById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/meal-options/${id}`),

  createMealOption: (mealOptionData: any): Promise<AxiosResponse<any>> =>
    api.post('/meal-options', mealOptionData),

  updateMealOption: (id: number, mealOptionData: any): Promise<AxiosResponse<any>> =>
    api.put(`/meal-options/${id}`, mealOptionData),

  deleteMealOption: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/meal-options/${id}`),
};

// Transportation requests API calls
export const transportationAPI = {
  getTransportationRequests: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/transportation-requests', { params }),

  getTransportationRequestById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/transportation-requests/${id}`),

  createTransportationRequest: (transportationData: any): Promise<AxiosResponse<any>> =>
    api.post('/transportation-requests', transportationData),

  updateTransportationRequest: (id: number, transportationData: any): Promise<AxiosResponse<any>> =>
    api.put(`/transportation-requests/${id}`, transportationData),

  cancelTransportationRequest: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/transportation-requests/${id}`),
};

// Payments API calls
export const paymentsAPI = {
  getPayments: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/payments', { params }),

  getPaymentById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/payments/${id}`),

  processPayment: (paymentData: any): Promise<AxiosResponse<any>> =>
    api.post('/payments', paymentData),

  updatePayment: (id: number, paymentData: any): Promise<AxiosResponse<any>> =>
    api.put(`/payments/${id}`, paymentData),

  deletePayment: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/payments/${id}`),
};

// Feedback API calls
export const feedbackAPI = {
  getFeedback: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/feedback', { params }),

  getFeedbackById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/feedback/${id}`),

  submitFeedback: (feedbackData: any): Promise<AxiosResponse<any>> =>
    api.post('/feedback', feedbackData),

  updateFeedback: (id: number, feedbackData: any): Promise<AxiosResponse<any>> =>
    api.put(`/feedback/${id}`, feedbackData),

  deleteFeedback: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/feedback/${id}`),
};



// Service capacity API calls
export const serviceCapacityAPI = {
  getServiceCapacities: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/service-capacity', { params }),

  getServiceCapacityById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/service-capacity/${id}`),

  createServiceCapacity: (capacityData: any): Promise<AxiosResponse<any>> =>
    api.post('/service-capacity', capacityData),

  updateServiceCapacity: (id: number, capacityData: any): Promise<AxiosResponse<any>> =>
    api.put(`/service-capacity/${id}`, capacityData),

  deleteServiceCapacity: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/service-capacity/${id}`),
};

// Provider schedule API calls
export const scheduleAPI = {
  getProviderSchedule: (providerId: number): Promise<AxiosResponse<any>> =>
    api.get(`/providers/${providerId}/schedule`),

  updateProviderSchedule: (providerId: number, scheduleData: any): Promise<AxiosResponse<any>> =>
    api.put(`/providers/${providerId}/schedule`, scheduleData),

  updateProviderAvailability: (providerId: number, day: string, availabilityData: any): Promise<AxiosResponse<any>> =>
    api.patch(`/providers/${providerId}/schedule/${day}`, availabilityData),
};

// Notifications API calls
export const notificationsAPI = {
  getNotifications: (params?: any): Promise<AxiosResponse<any>> =>
    api.get('/notifications', { params }),

  getNotificationById: (id: number): Promise<AxiosResponse<any>> =>
    api.get(`/notifications/${id}`),

  markNotificationAsRead: (id: number): Promise<AxiosResponse<any>> =>
    api.patch(`/notifications/${id}/read`, {}),

  deleteNotification: (id: number): Promise<AxiosResponse<any>> =>
    api.delete(`/notifications/${id}`),

  markAllAsRead: (): Promise<AxiosResponse<any>> =>
    api.patch('/notifications/mark-all-read', {})
};

export default api;
