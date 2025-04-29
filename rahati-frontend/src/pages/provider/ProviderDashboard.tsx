import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../layouts';
import { Card, Button, Badge, Alert } from '../../components/ui';
import { useAuth } from '../../hooks';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useDashboardStore } from '../../store';
import { formatDate, formatDateTime } from '../../utils';
import { Appointment, AppointmentStatus } from '../../types';

interface ProviderDashboardProps {
  onLogout?: () => void;
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = () => {
  const { user } = useAuth('Provider');
  const { appointments, fetchAppointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointmentStore();
  const { providerStats, fetchProviderStats, isLoading: statsLoading, error: statsError } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        await fetchProviderStats(user.id);

        // Fetch appointments for display
        await fetchAppointments({ provider_id: user.id });

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [fetchProviderStats, fetchAppointments, user]);

  // Set error from stats or appointments if it exists
  useEffect(() => {
    if (statsError) {
      setError(statsError);
    } else if (appointmentsError) {
      setError(appointmentsError);
    }
  }, [statsError, appointmentsError]);

  useEffect(() => {
    // Use today's appointments from provider stats if available, otherwise filter from appointments
    if (providerStats?.todayAppointmentsList) {
      setTodayAppointments(providerStats.todayAppointmentsList);
    } else if (appointments.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaysAppointments = appointments
        .filter(appointment => {
          const appointmentDate = new Date(appointment.appointment_datetime);
          return appointmentDate >= today && appointmentDate < tomorrow && appointment.status !== 'cancelled';
        })
        .sort((a, b) =>
          new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
        );

      setTodayAppointments(todaysAppointments);
    }
  }, [providerStats, appointments]);

  // Status badge color mapping
  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'rescheduled':
        return 'warning';
      default:
        return 'gray';
    }
  };

  // Dashboard stats
  const stats = [
    {
      title: 'Today\'s Appointments',
      value: providerStats?.todayAppointments || todayAppointments.length,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Active Consultations',
      value: providerStats?.activeConsultations || 0,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Total Patients',
      value: providerStats?.totalPatients || 0,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Upcoming Appointments',
      value: providerStats?.upcomingAppointments || 0,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Welcome, Dr. {user?.name}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Here's your schedule and patient overview for today.
        </motion.p>
      </div>

      {/* Error message */}
      {error && (
        <Alert
          variant="error"
          className="mb-6"
          dismissible
          onDismiss={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Today's appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
          <Link to="/provider/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all appointments
          </Link>
        </div>

        {!isLoading && todayAppointments.length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments scheduled for today</h3>
              <p className="text-gray-600 mb-4">Enjoy your day off or check your upcoming appointments.</p>
              <Button
                as={Link}
                to="/provider/appointments"
                variant="primary"
              >
                View Upcoming Appointments
              </Button>
            </div>
          </Card>
        ) : (
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {todayAppointments.map((appointment) => (
                <li key={appointment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            {appointment.patient?.name?.charAt(0).toUpperCase() || 'P'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.patient?.name || 'Patient Name'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(appointment.appointment_datetime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={getStatusBadgeVariant(appointment.status)} className="mr-4">
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                        <Button
                          as={Link}
                          to={`/provider/appointments/${appointment.id}`}
                          variant="primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Duration: {appointment.appointment_duration} minutes
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {appointment.center?.name || 'Healthcare Center'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {appointment.status === 'scheduled' && (
                          <Button
                            as={Link}
                            to={`/provider/consultations/start/${appointment.id}`}
                            variant="secondary"
                            size="sm"
                          >
                            Start Consultation
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/provider/schedule" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Schedule</h3>
              <p className="text-gray-600">View and update your availability and appointments.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/provider/patients" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Records</h3>
              <p className="text-gray-600">Access and manage your patient records and history.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/provider/consultations" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-accent-100 text-accent-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consultations</h3>
              <p className="text-gray-600">View and manage your consultation records.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/provider/profile" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Update Profile</h3>
              <p className="text-gray-600">Update your professional profile and specialties.</p>
            </Link>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ProviderDashboard;
