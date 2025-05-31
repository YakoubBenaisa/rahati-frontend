import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import the landing page and general pages
import LandingPage from './pages/LandingPage';
import CentersPage from './pages/CentersPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Import auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Import patient pages
import {
  PatientDashboard,
  // Appointments
  PatientBookAppointment,
  // Consultations
  PatientConsultations,
  PatientConsultationDetails,
  // Accommodations
  PatientAccommodations,
  PatientAccommodationDetails,
  PatientBookAccommodation
} from './pages/patient';

// Import patient appointment pages
import PatientAppointments from './pages/patient/appointments/PatientAppointments';
import PatientAppointmentDetails from './pages/patient/appointments/PatientAppointmentDetails';
import PatientRescheduleAppointment from './pages/patient/appointments/PatientRescheduleAppointment';

// Import patient transportation pages
import PatientTransportation from './pages/patient/transportation/PatientTransportation';
import PatientTransportationDetails from './pages/patient/transportation/PatientTransportationDetails';
import PatientBookTransportation from './pages/patient/transportation/PatientBookTransportation';

// Import patient payment pages
import PatientPayments from './pages/patient/payments/PatientPayments';
import PatientPaymentDetails from './pages/patient/payments/PatientPaymentDetails';
import PatientPaymentProcess from './pages/patient/payments/PatientPaymentProcess';

// Import patient feedback pages
import PatientFeedback from './pages/patient/feedback/PatientFeedback';
import PatientFeedbackDetails from './pages/patient/feedback/PatientFeedbackDetails';
import PatientCreateFeedback from './pages/patient/feedback/PatientCreateFeedback';
import PatientEditFeedback from './pages/patient/feedback/PatientEditFeedback';

// Import patient profile, settings, and notifications pages
import PatientProfile from './pages/patient/profile/PatientProfile';
import PatientSettings from './pages/patient/settings/PatientSettings';
import PatientNotifications from './pages/patient/notifications/PatientNotifications';

// Import provider pages
import {
  ProviderDashboard,
  ProviderSchedulePage,
  ProviderPatientsPage,
  ProviderPatientDetailsPage,
  ProviderAppointmentsPage,
  ProviderConsultationsPage,
  ProviderConsultationDetailsPage,
  ProviderNewConsultationPage
} from './pages/provider';

// Import admin pages
import {
  AdminDashboard,
  // User management
  AdminUsersPage,
  AdminUserDetailsPage,
  AdminCreateUserPage,
  AdminEditUserPage,
  // Center management
  AdminCentersPage,
  AdminCenterDetailsPage,
  AdminCreateCenterPage,
  AdminEditCenterPage
} from './pages/admin';

// Import superuser pages
import {
  SuperuserDashboard
} from './pages/superuser';

// Import new admin pages
import AdminAppointmentsPage from './pages/admin/appointments/AdminAppointmentsPage';
import AdminAppointmentDetailsPage from './pages/admin/appointments/AdminAppointmentDetailsPage';
import AdminAppointmentFormPage from './pages/admin/appointments/AdminAppointmentFormPage';
import AdminRoomsPage from './pages/admin/rooms/AdminRoomsPage';
import AdminRoomDetailsPage from './pages/admin/rooms/AdminRoomDetailsPage';
import AdminRoomFormPage from './pages/admin/rooms/AdminRoomFormPage';
import AdminMealOptionsPage from './pages/admin/meal-options/AdminMealOptionsPage';
import AdminMealOptionDetailsPage from './pages/admin/meal-options/AdminMealOptionDetailsPage';
import AdminMealOptionFormPage from './pages/admin/meal-options/AdminMealOptionFormPage';
import AdminServiceCapacityPage from './pages/admin/service-capacity/AdminServiceCapacityPage';
import AdminServiceCapacityDetailsPage from './pages/admin/service-capacity/AdminServiceCapacityDetailsPage';
import AdminServiceCapacityFormPage from './pages/admin/service-capacity/AdminServiceCapacityFormPage';

// Import store
import { useAuthStore } from './store/authStore';

// Import theme provider
import { ThemeProvider } from './context/ThemeContext';

// App component with routing
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

// Component that contains all the routes and uses the auth store
const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout, initializeFromStorage } = useAuthStore();

  // Initialize auth state from localStorage on app load
  React.useEffect(() => {
    initializeFromStorage();
  }, []);

  // Helper function to redirect based on user role
  const getDashboardRoute = () => {
    if (!isAuthenticated) return '/login';

    switch (user?.role) {
      case 'Patient':
        return '/patient/dashboard';
      case 'Provider':
        return '/provider/dashboard';
      case 'Admin':
        return '/admin/dashboard';
      case 'Superuser':
        return '/superuser/dashboard';
      default:
        return '/login';
    }
  };

  // Protected route component
  const ProtectedRoute: React.FC<{
    element: React.ReactNode;
    allowedRoles?: string[];
  }> = ({ element, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return <Navigate to={getDashboardRoute()} replace />;
    }

    return <>{element}</>;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/centers" element={<CentersPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Patient routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute
            element={<PatientDashboard />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Patient appointment routes */}
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute
            element={<PatientAppointments />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/appointments/:id"
        element={
          <ProtectedRoute
            element={<PatientAppointmentDetails />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/appointments/:id/reschedule"
        element={
          <ProtectedRoute
            element={<PatientRescheduleAppointment />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute
            element={<PatientBookAppointment />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Patient consultation routes */}
      <Route
        path="/patient/consultations"
        element={
          <ProtectedRoute
            element={<PatientConsultations />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/consultations/:id"
        element={
          <ProtectedRoute
            element={<PatientConsultationDetails />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Patient accommodation routes */}
      <Route
        path="/patient/accommodations"
        element={
          <ProtectedRoute
            element={<PatientAccommodations />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/accommodations/:id"
        element={
          <ProtectedRoute
            element={<PatientAccommodationDetails />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/accommodations/book"
        element={
          <ProtectedRoute
            element={<PatientBookAccommodation />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Patient transportation routes */}
      <Route
        path="/patient/transportation"
        element={
          <ProtectedRoute
            element={<PatientTransportation />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/transportation/new"
        element={
          <ProtectedRoute
            element={<PatientBookTransportation />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/transportation/:id/edit"
        element={
          <ProtectedRoute
            element={<PatientBookTransportation />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/transportation/:id"
        element={
          <ProtectedRoute
            element={<PatientTransportationDetails />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Patient payment routes */}
      <Route
        path="/patient/payments"
        element={
          <ProtectedRoute
            element={<PatientPayments />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/payments/:id"
        element={
          <ProtectedRoute
            element={<PatientPaymentDetails />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/payments/:id/pay"
        element={
          <ProtectedRoute
            element={<PatientPaymentProcess />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Patient feedback routes */}
      <Route
        path="/patient/feedback"
        element={
          <ProtectedRoute
            element={<PatientFeedback />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/feedback/new"
        element={
          <ProtectedRoute
            element={<PatientCreateFeedback />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/feedback/:id"
        element={
          <ProtectedRoute
            element={<PatientFeedbackDetails />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/feedback/:id/edit"
        element={
          <ProtectedRoute
            element={<PatientEditFeedback />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Patient profile and settings */}
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute
            element={<PatientProfile />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/settings"
        element={
          <ProtectedRoute
            element={<PatientSettings />}
            allowedRoles={['Patient']}
          />
        }
      />

      <Route
        path="/patient/notifications"
        element={
          <ProtectedRoute
            element={<PatientNotifications />}
            allowedRoles={['Patient']}
          />
        }
      />

      {/* Provider routes */}
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute
            element={<ProviderDashboard onLogout={logout} />}
            allowedRoles={['Provider']}
          />
        }
      />

      {/* Provider schedule routes */}
      <Route
        path="/provider/schedule"
        element={
          <ProtectedRoute
            element={<ProviderSchedulePage />}
            allowedRoles={['Provider']}
          />
        }
      />

      {/* Provider patients routes */}
      <Route
        path="/provider/patients"
        element={
          <ProtectedRoute
            element={<ProviderPatientsPage />}
            allowedRoles={['Provider']}
          />
        }
      />

      <Route
        path="/provider/patients/:id"
        element={
          <ProtectedRoute
            element={<ProviderPatientDetailsPage />}
            allowedRoles={['Provider']}
          />
        }
      />

      {/* Provider appointments routes */}
      <Route
        path="/provider/appointments"
        element={
          <ProtectedRoute
            element={<ProviderAppointmentsPage />}
            allowedRoles={['Provider']}
          />
        }
      />

      {/* Provider consultation routes */}
      <Route
        path="/provider/consultations"
        element={
          <ProtectedRoute
            element={<ProviderConsultationsPage />}
            allowedRoles={['Provider']}
          />
        }
      />

      <Route
        path="/provider/consultations/:id"
        element={
          <ProtectedRoute
            element={<ProviderConsultationDetailsPage />}
            allowedRoles={['Provider']}
          />
        }
      />

      <Route
        path="/provider/consultations/new"
        element={
          <ProtectedRoute
            element={<ProviderNewConsultationPage />}
            allowedRoles={['Provider']}
          />
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            element={<AdminDashboard onLogout={logout} />}
            allowedRoles={['Admin']}
          />
        }
      />

      {/* Superuser routes */}
      <Route
        path="/superuser/dashboard"
        element={
          <ProtectedRoute
            element={<SuperuserDashboard />}
            allowedRoles={['Superuser']}
          />
        }
      />

      {/* Admin users routes */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            element={<AdminUsersPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/users/new"
        element={
          <ProtectedRoute
            element={<AdminCreateUserPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute
            element={<AdminUserDetailsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/users/:id/edit"
        element={
          <ProtectedRoute
            element={<AdminEditUserPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      {/* Admin centers routes */}
      <Route
        path="/admin/centers"
        element={
          <ProtectedRoute
            element={<AdminCentersPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/centers/new"
        element={
          <ProtectedRoute
            element={<AdminCreateCenterPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/centers/:id"
        element={
          <ProtectedRoute
            element={<AdminCenterDetailsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/centers/:id/edit"
        element={
          <ProtectedRoute
            element={<AdminEditCenterPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      {/* Removed duplicate route for /admin/centers */}

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute
            element={<AdminAppointmentsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/appointments/new"
        element={
          <ProtectedRoute
            element={<AdminAppointmentFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/appointments/:id"
        element={
          <ProtectedRoute
            element={<AdminAppointmentDetailsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/appointments/:id/edit"
        element={
          <ProtectedRoute
            element={<AdminAppointmentFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute
            element={<AdminRoomsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/rooms/new"
        element={
          <ProtectedRoute
            element={<AdminRoomFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/rooms/:id"
        element={
          <ProtectedRoute
            element={<AdminRoomDetailsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/rooms/:id/edit"
        element={
          <ProtectedRoute
            element={<AdminRoomFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/meal-options"
        element={
          <ProtectedRoute
            element={<AdminMealOptionsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/meal-options/new"
        element={
          <ProtectedRoute
            element={<AdminMealOptionFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/meal-options/:id"
        element={
          <ProtectedRoute
            element={<AdminMealOptionDetailsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/meal-options/:id/edit"
        element={
          <ProtectedRoute
            element={<AdminMealOptionFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/service-capacity"
        element={
          <ProtectedRoute
            element={<AdminServiceCapacityPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/service-capacity/new"
        element={
          <ProtectedRoute
            element={<AdminServiceCapacityFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/service-capacity/:id"
        element={
          <ProtectedRoute
            element={<AdminServiceCapacityDetailsPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/admin/service-capacity/:id/edit"
        element={
          <ProtectedRoute
            element={<AdminServiceCapacityFormPage />}
            allowedRoles={['Admin', 'Superuser']}
          />
        }
      />

      {/* Common protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            element={<Navigate to={getDashboardRoute()} replace />}
            allowedRoles={['Patient', 'Provider', 'Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute
            element={<Navigate to={getDashboardRoute()} replace />}
            allowedRoles={['Patient', 'Provider', 'Admin', 'Superuser']}
          />
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            element={<Navigate to={getDashboardRoute()} replace />}
            allowedRoles={['Patient', 'Provider', 'Admin', 'Superuser']}
          />
        }
      />

      {/* Dashboard redirect */}
      <Route
        path="/dashboard"
        element={<Navigate to={getDashboardRoute()} replace />}
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
