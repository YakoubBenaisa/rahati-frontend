import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Card, Badge, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useAppointmentStore } from '../../../store';

import { Appointment } from '../../../types';

const PatientAppointments: React.FC = () => {
  const { user } = useAuth('Patient');
  const {
    appointments,
    fetchAppointments,
    isLoading,
    error,
    cancelAppointment
  } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments({ patient_id: user.id });
    }
  }, [fetchAppointments, user]);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time from datetime string
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (id: number) => {
    setCancellingId(id);
    try {
      await cancelAppointment(id);
      setSuccessMessage('Appointment cancelled successfully');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    } finally {
      setCancellingId(null);
    }
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointment_datetime);
    const today = new Date();

    if (activeTab === 'upcoming') {
      return appointmentDate >= today && appointment.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return appointmentDate < today || appointment.status === 'completed' || appointment.status === 'cancelled';
    }

    return true; // 'all' tab
  });

  // Sort appointments by date (newest first for past, oldest first for upcoming)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.appointment_datetime);
    const dateB = new Date(b.appointment_datetime);

    if (activeTab === 'past') {
      return dateB.getTime() - dateA.getTime();
    }

    return dateA.getTime() - dateB.getTime();
  });

  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]';
      case 'completed':
        return 'bg-[var(--color-success-light)] text-[var(--color-success)]';
      case 'cancelled':
        return 'bg-[var(--color-error-light)] text-[var(--color-error)]';
      case 'rescheduled':
        return 'bg-[var(--color-warning-light)] text-[var(--color-warning)]';
      default:
        return 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success message */}
        {successMessage && (
          <Alert
            variant="success"
            message={successMessage}
            className="mb-4"
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {/* Error message */}
        {error && (
          <Alert
            variant="error"
            message={error}
            className="mb-4"
            onClose={() => {}}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">
            View and manage your healthcare appointments.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex justify-end"
        >
          <Button
            as={Link}
            to="/patient/book-appointment"
            variant="primary"
            className="flex items-center"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Book New Appointment
          </Button>
        </motion.div>

        {/* Appointments list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
              <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h4>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming appointments."
                  : activeTab === 'past'
                  ? "You don't have any past appointments."
                  : "You don't have any appointments."}
              </p>
              {activeTab !== 'upcoming' && (
                <Button
                  as={Link}
                  to="/patient/book-appointment"
                  variant="primary"
                >
                  Book an Appointment
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-gray-900">
                          {formatDate(appointment.appointment_datetime)} at {formatTime(appointment.appointment_datetime)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900">
                          {appointment.provider?.name || 'Provider not specified'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.center?.name || 'Center not specified'}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <div className="ml-4 flex space-x-2">
                        <Button
                          as={Link}
                          to={`/patient/appointments/${appointment.id}`}
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button
                              as={Link}
                              to={`/patient/appointments/${appointment.id}/reschedule`}
                              variant="outline"
                              size="sm"
                              className="text-primary-600 border-primary-600 hover:bg-primary-50"
                            >
                              Reschedule
                            </Button>
                            <Button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              isLoading={cancellingId === appointment.id}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PatientAppointments;
