import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { UserRole } from '../types';

/**
 * Custom hook for authentication-related functionality
 * @param requiredRole - Optional role or array of roles required to access a page
 * @returns Authentication state and functions
 */
export const useAuth = (requiredRole?: UserRole | UserRole[]) => {
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
      } else if (Array.isArray(requiredRole)) {
        // Check if user has one of the required roles
        const hasRequiredRole = requiredRole.some(role => {
          // Special case for Superuser - allow access to Admin pages
          if (user?.role === 'Superuser' && role === 'Admin') {
            return true;
          }
          return user?.role === role;
        });

        if (!hasRequiredRole) {
          // Redirect to appropriate dashboard if authenticated but doesn't have any of the required roles
          const dashboardUrl = getDashboardUrlByRole(user?.role);
          navigate(dashboardUrl);
        }
      } else if (user?.role !== requiredRole) {
        // Special case for Superuser - allow access to Admin pages
        if (user?.role === 'Superuser' && requiredRole === 'Admin') {
          // Allow Superuser to access Admin pages
          return;
        }

        // Redirect to appropriate dashboard if authenticated but doesn't have the required role
        const dashboardUrl = getDashboardUrlByRole(user?.role);
        navigate(dashboardUrl);
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate]);

  // Helper function to get dashboard URL based on user role
  const getDashboardUrlByRole = (role?: string): string => {
    switch (role) {
      case 'Patient':
        return '/patient/dashboard';
      case 'Provider':
        return '/provider/dashboard';
      case 'Admin':
      case 'Superuser':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Check if user has a specific role or one of the roles in an array
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (Array.isArray(role)) {
      return role.some(r => {
        // Special case: Superuser can access Admin pages
        if (r === 'Admin' && user?.role === 'Superuser') {
          return true;
        }
        return user?.role === r;
      });
    }

    // Special case: Superuser can access Admin pages
    if (role === 'Admin' && user?.role === 'Superuser') {
      return true;
    }
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
    return hasRole('Admin') || user?.role === 'Superuser';
  };

  // Check if user is a superuser
  const isSuperuser = (): boolean => {
    return user?.role === 'Superuser';
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
    isSuperuser,
  };
};

export default useAuth;
