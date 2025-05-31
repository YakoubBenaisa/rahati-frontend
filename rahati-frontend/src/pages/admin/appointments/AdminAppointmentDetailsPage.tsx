import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge } from '../../../components/ui';
import { motion } from 'framer-motion';
import { appointmentsAPI, usersAPI, centersAPI } from '../../../services/api';
import { Appointment, User, Center, AppointmentStatus } from '../../../types';
import { formatDate } from '../../../utils/dateUtils';

const AdminAppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<User | null>(null);
  const [provider, setProvider] = useState<User | null>(null);
  const [center, setCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Fetch appointment data
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!id) return;
        
        // Fetch appointment details
        const response = await appointmentsAPI.getAppointmentById(Number(id));
        const appointmentData = response.data.data || response.data;
        setAppointment(appointmentData);
        
        // Fetch patient details
        if (appointmentData.patient_id) {
          try {
            const patientResponse = await usersAPI.getUserById(appointmentData.patient_id);
            setPatient(patientResponse.data.data || patientResponse.data);
          } catch (err) {
            console.error('Error fetching patient details:', err);
          }
        }
        
        // Fetch provider details
        if (appointmentData.provider_id) {
          try {
            const providerResponse = await usersAPI.getUserById(appointmentData.provider_id);
            setProvider(providerResponse.data.data || providerResponse.data);
          } catch (err) {
            console.error('Error fetching provider details:', err);
          }
        }
        
        // Fetch center details
        if (appointmentData.center_id) {
          try {
            const centerResponse = await centersAPI.getCenterById(appointmentData.center_id);
            setCenter(centerResponse.data.data || centerResponse.data);
          } catch (err) {
            console.error('Error fetching center details:', err);
          }
        }
      } catch (err: any) {
        console.error('Error fetching appointment data:', err);
        setError(err.response?.data?.message || 'Failed to load appointment data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointmentData();
  }, [id]);

  // Handle appointment cancellation
  const handleCancelAppointment = async () => {
    if (!appointment) return;
    
    if (window.confirm(`Are you sure you want to cancel this appointment?`)) {
      setIsCancelling(true);
      setError(null);
      
      try {
        // Update appointment status to cancelled
        await appointmentsAPI.updateAppointment(appointment.id, {
          status: 'cancelled'
        });
        
        setSuccess('Appointment cancelled successfully');
        
        // Update local state
        setAppointment({
          ...appointment,
          status: 'cancelled'
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        console.error('Error cancelling appointment:', err);
        setError(err.response?.data?.message || 'Failed to cancel appointment. Please try again.');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'rescheduled':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Format status text
  const formatStatus = (status: AppointmentStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading appointment details...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!appointment && !isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert
            variant="error"
            message="Appointment not found."
            className="mb-6"
          />
          <Button
            onClick={() => navigate('/admin/appointments')}
            variant="primary"
          >
            Back to Appointments
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Appointment Details
              </h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                View and manage appointment information.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                onClick={() => navigate('/admin/appointments')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back
              </Button>
              {appointment && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <>
                  <Button
                    onClick={() => navigate(`/admin/appointments/${id}/edit`)}
                    variant="outline"
                    leftIcon={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleCancelAppointment}
                    variant="danger"
                    isLoading={isCancelling}
                    leftIcon={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    }
                  >
                    Cancel Appointment
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {error && (
          <Alert
            variant="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        {appointment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      Appointment #{appointment.id}
                    </h2>
                    <p className="text-[var(--color-text-secondary)]">
                      Created on {formatDate(appointment.created_at || '')}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {formatStatus(appointment.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">
                      Appointment Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Date & Time:</span>
                        <p className="mt-1 text-[var(--color-text-primary)]">
                          {formatDate(appointment.appointment_datetime)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Duration:</span>
                        <p className="mt-1 text-[var(--color-text-primary)]">
                          {appointment.appointment_duration} minutes
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Healthcare Center:</span>
                        <p className="mt-1 text-[var(--color-text-primary)]">
                          {center ? (
                            <Link to={`/admin/centers/${center.id}`} className="text-blue-600 hover:underline">
                              {center.name}
                            </Link>
                          ) : (
                            `Center #${appointment.center_id}`
                          )}
                        </p>
                      </div>
                      {appointment.notes && (
                        <div>
                          <span className="text-sm font-medium text-[var(--color-text-secondary)]">Notes:</span>
                          <p className="mt-1 text-[var(--color-text-primary)]">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">
                      People
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Patient:</span>
                        <div className="mt-1 flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                            {patient?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            {patient ? (
                              <Link to={`/admin/users/${patient.id}`} className="text-blue-600 hover:underline">
                                {patient.name}
                              </Link>
                            ) : (
                              `Patient #${appointment.patient_id}`
                            )}
                            {patient?.phone && (
                              <p className="text-sm text-[var(--color-text-secondary)]">
                                {patient.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Provider:</span>
                        {provider ? (
                          <div className="mt-1 flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                              {provider.name.charAt(0)}
                            </div>
                            <div>
                              <Link to={`/admin/users/${provider.id}`} className="text-blue-600 hover:underline">
                                {provider.name}
                              </Link>
                              {provider.phone && (
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                  {provider.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center">
                            <p className="text-[var(--color-text-primary)]">
                              {appointment.provider_id ? `Provider #${appointment.provider_id}` : 'Not assigned'}
                            </p>
                            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="ml-3"
                                onClick={() => navigate(`/admin/appointments/${id}/edit?assign_provider=true`)}
                              >
                                Assign Provider
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminAppointmentDetailsPage;
