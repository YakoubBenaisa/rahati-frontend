import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { UserRole } from '../types';

/**
 * Custom hook for authentication-related functionality
 * @param requiredRole - Optional role required to access a page
 * @returns Authentication state and functions
 */
export const useAuth = (requiredRole?: UserRole) => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  } = useAuthStore();

  const navigate = useNavigate();

  // Check if user is authenticated and has the required role
  useEffect(() => {
    if (!isLoading && requiredRole) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated and a role is required
        navigate('/login');
      } else if (user?.role !== requiredRole) {
        // Redirect to dashboard if authenticated but doesn't have the required role
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate]);

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // Check if user is a patient
  const isPatient = (): boolean => {
    return hasRole('Patient');
  };

  // Check if user is a provider
  const isProvider = (): boolean => {
    return hasRole('Provider');
  };

  // Check if user is an admin
  const isAdmin = (): boolean => {
    return hasRole('Admin');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    hasRole,
    isPatient,
    isProvider,
    isAdmin,
  };
};

export default useAuth;
