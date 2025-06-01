import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Badge, Select, Spinner, Alert, Pagination } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { appointmentsAPI } from '../../../services/api';
import { formatDate, formatTime } from '../../../utils/dateUtils';
import { Appointment, AppointmentStatus } from '../../../types';

const ProviderAppointmentsPage: React.FC = () => {
  const { user } = useAuth('Provider');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch appointments data from API
  useEffect(() => {
    if (!user?.id) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get appointments for the provider
        const response = await appointmentsAPI.getAppointments({
          provider_id: user.id,
          page: currentPage,
          per_page: itemsPerPage
        });

        const data = response.data;
        const appointmentsData = data.data || data;

        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);

        // Handle pagination if available
        if (data.meta) {
          setTotalPages(data.meta.last_page || 1);
        } else {
          // If no pagination info, calculate based on array length
          setTotalPages(Math.ceil(appointmentsData.length / itemsPerPage) || 1);
        }
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
        setError(err.response?.data?.message || 'Failed to load appointments. Please try again.');
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, currentPage]);

  // Filter appointments based on search term and status
  useEffect(() => {
    if (!appointments.length) {
      setFilteredAppointments([]);
      return;
    }

    let filtered = [...appointments];

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'no-show') {
        // Special case for no-show (cancelled with specific note)
        filtered = filtered.filter(appointment =>
          appointment.status === 'cancelled' &&
          appointment.notes?.includes('did not show up')
        );
      } else {
        filtered = filtered.filter(appointment => appointment.status === statusFilter);
      }
    }

    // Filter by search term (patient name)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment =>
        appointment.patient?.name?.toLowerCase().includes(term) ||
        appointment.notes?.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter]);

  // Handle starting a consultation from an appointment
  const handleStartConsultation = (appointmentId: number, patientId: number) => {
    navigate(`/provider/consultations/new?appointment=${appointmentId}&patient=${patientId}`);
  };

  // Get status badge color
  /*const getStatusBadgeColor = (status: AppointmentStatus, notes?: string) => {
    // Check if this is a no-show (cancelled with specific note)
    if (status === 'cancelled' && notes && notes.includes('did not show up')) {
      return 'warning';
    }

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
        return 'default';
    }
  };*/

  // Handle appointment cancellation
  const handleCancelAppointment = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await appointmentsAPI.cancelAppointment(id);

      // Update local state
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === id
          ? { ...appointment, status: 'cancelled' as AppointmentStatus }
          : appointment
      );

      setAppointments(updatedAppointments);
      setFilteredAppointments(
        filteredAppointments.map(appointment =>
          appointment.id === id
            ? { ...appointment, status: 'cancelled' as AppointmentStatus }
            : appointment
        )
      );

      setSuccess('Appointment cancelled successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      setError(err.response?.data?.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marking appointment as completed
  const handleCompleteAppointment = async (id: number) => {
    if (!window.confirm('Are you sure you want to mark this appointment as completed?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await appointmentsAPI.updateAppointment(id, { status: 'completed' });

      // Update local state
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === id
          ? { ...appointment, status: 'completed' as AppointmentStatus }
          : appointment
      );

      setAppointments(updatedAppointments);
      setFilteredAppointments(
        filteredAppointments.map(appointment =>
          appointment.id === id
            ? { ...appointment, status: 'completed' as AppointmentStatus }
            : appointment
        )
      );

      setSuccess('Appointment marked as completed');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setError(err.response?.data?.message || 'Failed to update appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marking appointment as cancelled with no-show reason
  const handleNoShowAppointment = async (id: number) => {
    if (!window.confirm('Are you sure you want to mark this appointment as no-show?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use 'cancelled' status with a note indicating it was a no-show
      await appointmentsAPI.updateAppointment(id, {
        status: 'cancelled',
        notes: 'Patient did not show up for the appointment.'
      });

      // Update local state
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === id
          ? {
              ...appointment,
              status: 'cancelled' as AppointmentStatus,
              notes: appointment.notes ? `${appointment.notes}\nPatient did not show up for the appointment.` : 'Patient did not show up for the appointment.'
            }
          : appointment
      );

      setAppointments(updatedAppointments);
      setFilteredAppointments(
        filteredAppointments.map(appointment =>
          appointment.id === id
            ? {
                ...appointment,
                status: 'cancelled' as AppointmentStatus,
                notes: appointment.notes ? `${appointment.notes}\nPatient did not show up for the appointment.` : 'Patient did not show up for the appointment.'
              }
            : appointment
        )
      );

      setSuccess('Appointment marked as no-show (cancelled)');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setError(err.response?.data?.message || 'Failed to update appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="mt-2 text-gray-600">
                View and manage your scheduled appointments.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                as={Link}
                to="/provider/schedule"
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              >
                Manage Schedule
              </Button>
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

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <div className="w-full md:w-1/4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="no-show">No Show</option>
              </Select>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-2 text-gray-500">Loading appointments...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You have no appointments scheduled.'}
              </p>
            </div>
          </Card>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => {
                  const appointmentDate = new Date(appointment.appointment_datetime);
                  //const isUpcoming = appointmentDate > new Date();
                  const isToday = new Date().toDateString() === appointmentDate.toDateString();

                  return (
                    <li key={appointment.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                {appointment.patient?.name?.charAt(0).toUpperCase() || 'P'}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patient?.name || 'Unknown Patient'}
                              </div>
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">{formatDate(appointmentDate.toISOString())}</span> at <span className="font-medium">{formatTime(appointmentDate.toISOString())}</span>
                                {isToday && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Today</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              //variant={getStatusBadgeColor(appointment.status, appointment.notes)}
                              className="mr-4"
                            >
                              {appointment.status === 'cancelled' && appointment.notes?.includes('did not show up')
                                ? 'No Show'
                                : appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                            <div className="flex space-x-2">
                              {appointment.status === 'scheduled' && (
                                <>
                                  <Button
                                    size="sm"
                                   // variant="success"
                                    onClick={() => handleStartConsultation(appointment.id, appointment.patient_id)}
                                  >
                                    Start Consultation
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleCompleteAppointment(appointment.id)}
                                  >
                                    Mark Completed
                                  </Button>
                                  <Button
                                    size="sm"
                                   // variant="warning"
                                    onClick={() => handleNoShowAppointment(appointment.id)}
                                  >
                                    No Show
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {appointment.status === 'completed' && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleStartConsultation(appointment.id, appointment.patient_id)}
                                >
                                  View/Edit Consultation
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ProviderAppointmentsPage;
