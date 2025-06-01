import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../layouts';
import { Card, Button, Badge, Alert } from '../../components/ui';
import { useAuth } from '../../hooks';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useCenterStore } from '../../store/centerStore';
import { useDashboardStore } from '../../store';
import { formatDateTime } from '../../utils';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const { user } = useAuth('Admin');
  const { appointments, fetchAppointments, isLoading: appointmentsLoading } = useAppointmentStore();
  const { centers, fetchCenters, isLoading: centersLoading } = useCenterStore();
  const { adminStats, fetchAdminStats, isLoading: statsLoading, error: statsError } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set loading state
    setIsLoading(true);
    setError(null);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        await fetchAdminStats();

        // Fetch centers and appointments for display
        await fetchCenters();
        await fetchAppointments();

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data'+statsLoading);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [fetchAdminStats, fetchAppointments, fetchCenters]);

  // Set error from stats if it exists
  useEffect(() => {
    if (statsError) {
      setError(statsError);
    }
  }, [statsError]);

  // Dashboard stats
  const stats = [
    {
      title: 'Total Centers',
      value: adminStats?.totalCenters || centers.length,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Total Appointments',
      value: adminStats?.totalAppointments || appointments.length,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Completed Appointments',
      value: adminStats?.completedAppointments || appointments.filter(a => a.status === 'completed').length,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Cancellation Rate',
      value: adminStats?.totalAppointments
        ? `${Math.round((adminStats.cancelledAppointments / adminStats.totalAppointments) * 100)}%`
        : appointments.length
          ? `${Math.round((appointments.filter(a => a.status === 'cancelled').length / appointments.length) * 100)}%`
          : '0%',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-red-500',
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
          Admin Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Welcome, {user?.name}. Here's an overview of the platform.
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

      {/* Centers overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Healthcare Centers</h2>
          <Link to="/admin/centers" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Manage Centers
          </Link>
        </div>

        {centersLoading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : centers.length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No healthcare centers found</h3>
              <p className="text-gray-600 mb-4">Add your first healthcare center to get started.</p>
              <Button
                as={Link}
                to="/admin/centers/new"
                variant="primary"
              >
                Add Healthcare Center
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.slice(0, 6).map((center) => (
              <Card key={center.id} className="h-full">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={center.is_active ? 'success' : 'danger'}>
                      {center.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {center.name}
                  </h3>

                  <p className="text-gray-600 mb-2 line-clamp-2">
                    {center.description}
                  </p>

                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Address:</span> {center.address}
                  </p>

                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Contact:</span> {center.phone}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                    <Button
                      as={Link}
                      to={`/admin/centers/${center.id}`}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>

                    <Button
                      as={Link}
                      to={`/admin/centers/${center.id}/edit`}
                      variant="primary"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
          <Link to="/admin/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All Appointments
          </Link>
        </div>

        {appointmentsLoading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : appointments.length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
              <p className="text-gray-600">There are no appointments in the system yet.</p>
            </div>
          </Card>
        ) : (
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {appointments.slice(0, 5).map((appointment) => (
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
                        <Badge
                          variant={
                            appointment.status === 'scheduled' ? 'primary' :
                            appointment.status === 'completed' ? 'success' :
                            appointment.status === 'cancelled' ? 'danger' :
                            'warning'
                          }
                          className="mr-4"
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                        <Button
                          as={Link}
                          to={`/admin/appointments/${appointment.id}`}
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
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          Provider: {appointment.provider?.name || 'Provider Name'}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {appointment.center?.name || 'Healthcare Center'}
                        </p>
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
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/admin/users" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Users</h3>
              <p className="text-gray-600">Add, edit, or remove users from the platform.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/admin/centers/new" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add Center</h3>
              <p className="text-gray-600">Add a new healthcare center to the platform.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/admin/rooms" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-accent-100 text-accent-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Rooms</h3>
              <p className="text-gray-600">Add, edit, or remove rooms from healthcare centers.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/admin/service-capacity" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Service Capacity</h3>
              <p className="text-gray-600">Manage service capacity for healthcare centers.</p>
            </Link>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;
