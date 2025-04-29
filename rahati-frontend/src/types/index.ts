// User related types
export type UserRole = 'Patient' | 'Provider' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  caregiver_name?: string;
  caregiver_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  role: UserRole;
}

// Center related types
export interface Center {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Appointment related types
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: number;
  patient_id: number;
  center_id: number;
  provider_id: number;
  appointment_datetime: string;
  appointment_duration: number;
  status: AppointmentStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  patient?: User;
  provider?: User;
  center?: Center;
}

// Consultation related types
export type ConsultationStatus = 'active' | 'completed' | 'cancelled';

export interface Consultation {
  id: number;
  appointment_id: number;
  start_time: string;
  end_time?: string;
  status: ConsultationStatus;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  appointment?: Appointment;
}

// Accommodation related types
export type AccommodationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'modified';

export interface Accommodation {
  id: number;
  appointment_id: number;
  room_id: number;
  meal_option_id?: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  status: AccommodationStatus;
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
  appointment?: Appointment;
  room?: Room;
  meal_option?: MealOption;
}

// Room related types
export interface Room {
  id: number;
  center_id: number;
  room_number: string;
  type: string;
  description: string;
  price_per_night: number;
  capacity: number;
  is_accessible: boolean;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  center?: Center;
}

// Meal option related types
export interface MealOption {
  id: number;
  name: string;
  description: string;
  price: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Transportation request related types
export type TransportationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'modified';

export interface TransportationRequest {
  id: number;
  appointment_id: number;
  pickup_location: string;
  dropoff_location: string;
  pickup_time: string;
  vehicle_type: string;
  passenger_count: number;
  status: TransportationStatus;
  special_requirements?: string;
  created_at?: string;
  updated_at?: string;
  appointment?: Appointment;
}

// Payment related types
export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'insurance';

export interface Payment {
  id: number;
  appointment_id: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  status: PaymentStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  appointment?: Appointment;
}

// Feedback related types
export type RecommendationLikelihood = 'very_likely' | 'likely' | 'neutral' | 'unlikely' | 'very_unlikely';

export interface Feedback {
  id: number;
  appointment_id: number;
  rating: number;
  comment?: string;
  category: string;
  provider_rating?: number;
  facility_rating?: number;
  recommendation_likelihood: RecommendationLikelihood;
  created_at?: string;
  updated_at?: string;
  appointment?: Appointment;
}

// Notification related types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
  updated_at?: string;
}

// Service capacity related types
export interface ServiceCapacity {
  id: number;
  center_id: number;
  service_type: string;
  max_capacity: number;
  date: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  center?: Center;
}

// Pagination related types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
