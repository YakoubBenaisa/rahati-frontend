import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge, Table, Pagination } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { appointmentsAPI } from '../../../services/api';
import { Appointment } from '../../../types';
import { formatDate } from '../../../utils/dateUtils';

const AdminAppointmentsPage: React.FC = () => {
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await appointmentsAPI.getAppointments({
          page: currentPage,
          per_page: itemsPerPage
        });
        
        const data = response.data;
        setAppointments(data.data || data);
        
        // Handle pagination if available
        if (data.meta) {
          setTotalPages(data.meta.last_page);
          setTotalItems(data.meta.total);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Appointments</h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Manage all appointments across healthcare centers.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/admin/appointments/new')}
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Create Appointment
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
                <span className="ml-3 text-[var(--color-text-secondary)]">Loading appointments...</span>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-[var(--color-text-primary)]">No appointments found</h3>
                <p className="mt-1 text-[var(--color-text-secondary)]">Get started by creating a new appointment.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => navigate('/admin/appointments/new')}
                    variant="primary"
                  >
                    Create Appointment
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Patient</Table.HeaderCell>
                      <Table.HeaderCell>Provider</Table.HeaderCell>
                      <Table.HeaderCell>Center</Table.HeaderCell>
                      <Table.HeaderCell>Date & Time</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {appointments.map((appointment) => (
                      <Table.Row key={appointment.id}>
                        <Table.Cell>{appointment.id}</Table.Cell>
                        <Table.Cell>{appointment.patient?.name || `Patient #${appointment.patient_id}`}</Table.Cell>
                        <Table.Cell>{appointment.provider?.name || `Provider #${appointment.provider_id}`}</Table.Cell>
                        <Table.Cell>{appointment.center?.name || `Center #${appointment.center_id}`}</Table.Cell>
                        <Table.Cell>{formatDate(appointment.appointment_datetime)}</Table.Cell>
                        <Table.Cell>
                          <Badge variant={getStatusBadgeVariant(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/appointments/${appointment.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/appointments/${appointment.id}/edit`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                
                {totalPages > 1 && (
                  <div className="py-4 px-6 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminAppointmentsPage;
