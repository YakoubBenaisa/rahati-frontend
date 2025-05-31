import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert, Modal } from '../../../components/ui';
import { useAppointmentStore } from '../../../store';

const PatientAppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    selectedAppointment: appointment,
    fetchAppointmentById,
    cancelAppointment,
    isLoading,
    error
  } = useAppointmentStore();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAppointmentById(Number(id));
    }
  }, [id, fetchAppointmentById]);

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

  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary-100 text-primary-700';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelAppointment = async () => {
    if (!id) return;

    setIsCancelling(true);
    try {
      await cancelAppointment(Number(id));
      setCancelSuccess(true);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            to="/patient/appointments"
            className="inline-flex items-center text-gray-600 hover:text-primary-600"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Appointments
          </Link>
        </div>

        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            className="mb-6"
          />
        )}

        {cancelSuccess && (
          <Alert
            variant="success"
            title="Appointment Cancelled"
            message="Your appointment has been successfully cancelled."
            onClose={() => setCancelSuccess(false)}
            className="mb-6"
          />
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : appointment ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Appointment header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Appointment Details
                    </h1>
                    <p className="mt-1 text-gray-600">
                      {formatDate(appointment.appointment_datetime)} at {formatTime(appointment.appointment_datetime)}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Provider information */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider</h2>
                    <div className="flex items-start">
                      <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-medium">
                          {appointment.provider?.name || 'Provider not specified'}
                        </h3>
                        <p className="text-gray-600">
                          {appointment.provider?.role === 'Provider' ? 'Healthcare Provider' : 'Staff'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center information */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-medium">
                          {appointment.center?.name || 'Center not specified'}
                        </h3>
                        <p className="text-gray-600">
                          {appointment.center?.address || 'Address not available'}
                        </p>
                        {appointment.center?.address && (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(appointment.center.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                          >
                            Get Directions
                            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment duration */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Duration</h2>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                    {appointment.appointment_duration} minutes
                  </p>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                      {appointment.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  {appointment.status === 'scheduled' && (
                    <>
                      <Button
                        as={Link}
                        to={`/patient/appointments/${appointment.id}/reschedule`}
                        variant="primary"
                      >
                        Reschedule Appointment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelConfirm(true)}
                      >
                        Cancel Appointment
                      </Button>
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <Button
                      as={Link}
                      to={`/patient/feedback/new?appointmentId=${appointment.id}`}
                      variant="primary"
                    >
                      Leave Feedback
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Cancel confirmation modal */}
            <Modal
              isOpen={showCancelConfirm}
              onClose={() => setShowCancelConfirm(false)}
              title="Cancel Appointment"
            >
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel your appointment on {formatDate(appointment.appointment_datetime)} at {formatTime(appointment.appointment_datetime)}?
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={isCancelling}
                  >
                    No, Keep It
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCancelAppointment}
                    isLoading={isCancelling}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
            <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Appointment Not Found</h4>
            <p className="text-gray-600 mb-4">
              The appointment you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              as={Link}
              to="/patient/appointments"
              variant="primary"
            >
              Back to Appointments
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PatientAppointmentDetails;
