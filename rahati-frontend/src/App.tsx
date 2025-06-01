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
           <PatientDashboard />}
           
      />

      {/* Patient appointment routes */}
      <Route
        path="/patient/appointments"
        element={<PatientAppointments />}
            
      />
        

      <Route
        path="/patient/appointments/:id"
        element={<PatientAppointmentDetails />}
            
      />

      <Route
        path="/patient/appointments/:id/reschedule"
        element={<PatientRescheduleAppointment />}
           
      />

      <Route
        path="/patient/book-appointment"
        element={<PatientBookAppointment />}
           
        
      />

      {/* Patient consultation routes */}
      <Route
        path="/patient/consultations"
        element={
          <PatientConsultations />}
      />

      <Route
        path="/patient/consultations/:id"
        element={
         <PatientConsultationDetails />}
           
      />

      {/* Patient accommodation routes */}
      <Route
        path="/patient/accommodations"
        element={
         <PatientAccommodations />}
      />

      <Route
        path="/patient/accommodations/:id"
        element={
         <PatientAccommodationDetails />}
           
      />

      <Route
        path="/patient/accommodations/book"
        element={
         <PatientBookAccommodation />}
           
      />

      {/* Patient transportation routes */}
      <Route
        path="/patient/transportation"
        element={
           <PatientTransportation />}
           
      />

      <Route
        path="/patient/transportation/new"
        element={
          <PatientBookTransportation />}
           
      />

      <Route
        path="/patient/transportation/:id/edit"
        element={
          <PatientBookTransportation />}
           
      />

      <Route
        path="/patient/transportation/:id"
        element={
          <PatientTransportationDetails />}
           
      />

      {/* Patient payment routes */}
      <Route
        path="/patient/payments"
        element={
           <PatientPayments />}
           
      />

      <Route
        path="/patient/payments/:id"
        element={
           <PatientPaymentDetails />}
           
      />

      <Route
        path="/patient/payments/:id/pay"
        element={
           <PatientPaymentProcess />}
           
      />

      {/* Patient feedback routes */}
      <Route
        path="/patient/feedback"
        element={
           <PatientFeedback />}
           
      />

      <Route
        path="/patient/feedback/new"
        element={
           <PatientCreateFeedback />}
           
      />

      <Route
        path="/patient/feedback/:id"
        element={
           <PatientFeedbackDetails />}
           
      />

      <Route
        path="/patient/feedback/:id/edit"
        element={
           <PatientEditFeedback />}
           
      />

      {/* Patient profile and settings */}
      <Route
        path="/patient/profile"
        element={
           <PatientProfile />}
           
      />

      <Route
        path="/patient/settings"
        element={
           <PatientSettings />}
           
      />

      <Route
        path="/patient/notifications"
        element={
           <PatientNotifications />}
           
      />

      {/* Provider routes */}
      <Route
        path="/provider/dashboard"
        element={
           <ProviderDashboard onLogout={logout} />}
           
      />

      {/* Provider schedule routes */}
      <Route
        path="/provider/schedule"
        element={
           <ProviderSchedulePage />}
           
      />

      {/* Provider patients routes */}
      <Route
        path="/provider/patients"
        element={
           <ProviderPatientsPage />}
           
      />

      <Route
        path="/provider/patients/:id"
        element={
           <ProviderPatientDetailsPage />}
           
      />

      {/* Provider appointments routes */}
      <Route
        path="/provider/appointments"
        element={
           <ProviderAppointmentsPage />}
           
      />

      {/* Provider consultation routes */}
      <Route
        path="/provider/consultations"
        element={
           <ProviderConsultationsPage />}
           
      />

      <Route
        path="/provider/consultations/:id"
        element={
           <ProviderConsultationDetailsPage />}
           
      />

      <Route
        path="/provider/consultations/new"
        element={
           <ProviderNewConsultationPage />}
           
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
           <AdminDashboard onLogout={logout} />}
          
      />

      {/* Superuser routes */}
      <Route
        path="/superuser/dashboard"
        element={
           <SuperuserDashboard />}
           
      />

      {/* Admin users routes */}
      <Route
        path="/admin/users"
        element={
           <AdminUsersPage />}
           
      />

      <Route
        path="/admin/users/new"
        element={
           <AdminCreateUserPage />}
           
      />

      <Route
        path="/admin/users/:id"
        element={
           <AdminUserDetailsPage />}
           
      />

      <Route
        path="/admin/users/:id/edit"
        element={
           <AdminEditUserPage />}
           
      />

      {/* Admin centers routes */}
      <Route
        path="/admin/centers"
        element={
           <AdminCentersPage />}
           
      />

      <Route
        path="/admin/centers/new"
        element={
           <AdminCreateCenterPage />}
           
      />

      <Route
        path="/admin/centers/:id"
        element={
           <AdminCenterDetailsPage />}
           
      />

      <Route
        path="/admin/centers/:id/edit"
        element={
           <AdminEditCenterPage />}
           
      />

      {/* Removed duplicate route for /admin/centers */}

      <Route
        path="/admin/appointments"
        element={
           <AdminAppointmentsPage />}
           
      />

      <Route
        path="/admin/appointments/new"
        element={
           <AdminAppointmentFormPage />}
           
      />

      <Route
        path="/admin/appointments/:id"
        element={
           <AdminAppointmentDetailsPage />}
           
      />

      <Route
        path="/admin/appointments/:id/edit"
        element={
           <AdminAppointmentFormPage />}
           
      />

      <Route
        path="/admin/rooms"
        element={
           <AdminRoomsPage />}
           
      />

      <Route
        path="/admin/rooms/new"
        element={
           <AdminRoomFormPage />}
           
      />

      <Route
        path="/admin/rooms/:id"
        element={
           <AdminRoomDetailsPage />}
           
      />

      <Route
        path="/admin/rooms/:id/edit"
        element={
           <AdminRoomFormPage />}
           
      />

      <Route
        path="/admin/meal-options"
        element={
           <AdminMealOptionsPage />}
           
      />

      <Route
        path="/admin/meal-options/new"
        element={
           <AdminMealOptionFormPage />}
           
      />

      <Route
        path="/admin/meal-options/:id"
        element={
           <AdminMealOptionDetailsPage />}
           
      />

      <Route
        path="/admin/meal-options/:id/edit"
        element={
           <AdminMealOptionFormPage />}
           
      />

      <Route
        path="/admin/service-capacity"
        element={
           <AdminServiceCapacityPage />}
           
      />

      <Route
        path="/admin/service-capacity/new"
        element={
           <AdminServiceCapacityFormPage />}
           
      />

      <Route
        path="/admin/service-capacity/:id"
        element={
           <AdminServiceCapacityDetailsPage />}
           
      />

      <Route
        path="/admin/service-capacity/:id/edit"
        element={
           <AdminServiceCapacityFormPage />}
           
      />

      {/* Common protected routes */}
      <Route
        path="/profile"
        element={
           <Navigate to={getDashboardRoute()} replace />}
           
      />

      <Route
        path="/settings"
        element={
           <Navigate to={getDashboardRoute()} replace />}
           
      />

      <Route
        path="/notifications"
        element={
           <Navigate to={getDashboardRoute()} replace />}
           
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
