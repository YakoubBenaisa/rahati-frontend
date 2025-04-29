import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../layouts';
import { Card, Button, Badge } from '../../components/ui';
import { useAuth } from '../../hooks';
import { useAppointmentStore } from '../../store/appointmentStore';
import { formatDate, formatDateTime } from '../../utils';
import { Appointment, AppointmentStatus } from '../../types';

interface PatientDashboardProps {
  onLogout?: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onLogout }) => {
  const { user } = useAuth('Patient');
  const { appointments, fetchAppointments, isLoading, error } = useAppointmentStore();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Fetch patient's appointments
    fetchAppointments({ patient_id: user?.id });
  }, [fetchAppointments, user]);

  useEffect(() => {
    // Filter upcoming appointments
    if (appointments.length > 0) {
      const upcoming = appointments
        .filter(appointment =>
          appointment.status !== 'cancelled' &&
          appointment.status !== 'completed' &&
          new Date(appointment.appointment_datetime) > new Date()
        )
        .sort((a, b) =>
          new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
        )
        .slice(0, 3); // Get only the next 3 appointments

      setUpcomingAppointments(upcoming);
    }
  }, [appointments]);

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
      title: 'Appointments',
      value: appointments.length,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Consultations',
      value: 0, // This would be fetched from the consultations store
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Accommodations',
      value: 0, // This would be fetched from the accommodations store
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Transportation',
      value: 0, // This would be fetched from the transportation store
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
          Welcome, {user?.name}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Here's an overview of your healthcare journey.
        </motion.p>
      </div>

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

      {/* Upcoming appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        ) : upcomingAppointments.length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming appointments</h3>
              <p className="text-gray-600 mb-4">Schedule your first appointment to get started.</p>
              <Button
                as={Link}
                to="/centers"
                variant="primary"
              >
                Find Healthcare Centers
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="h-full">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                    <p className="text-sm text-gray-500">{formatDate(appointment.appointment_datetime)}</p>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {appointment.center?.name || 'Healthcare Center'}
                  </h3>

                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Provider:</span> {appointment.provider?.name || 'Healthcare Provider'}
                  </p>

                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Time:</span> {formatDateTime(appointment.appointment_datetime).split(',')[1].trim()}
                  </p>

                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Duration:</span> {appointment.appointment_duration} minutes
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                    <Button
                      as={Link}
                      to={`/patient/appointments/${appointment.id}`}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>

                    <Button
                      as={Link}
                      to={`/patient/appointments/${appointment.id}/reschedule`}
                      variant="primary"
                      size="sm"
                    >
                      Reschedule
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
            <Link to="/centers" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-gray-600">Schedule a new appointment with a healthcare provider.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/patient/accommodations/new" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Book Accommodation</h3>
              <p className="text-gray-600">Find and book accommodation near your healthcare center.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/patient/transportation/new" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-accent-100 text-accent-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Transportation</h3>
              <p className="text-gray-600">Arrange transportation to and from your healthcare center.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/patient/feedback/new" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Submit Feedback</h3>
              <p className="text-gray-600">Share your experience and help us improve our services.</p>
            </Link>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default PatientDashboard;
