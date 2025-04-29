import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Alert, Tabs, Tab } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  role: 'Patient' | 'Provider' | 'Admin';
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  provider: string;
  center: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface ActivityLog {
  id: number;
  action: string;
  timestamp: string;
  details: string;
}

const AdminUserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth('Admin');
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Mock fetch user data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock user data
      const mockUser: UserDetails = {
        id: Number(id),
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Patient',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, CA 12345',
        status: 'active',
        createdAt: '2023-01-15T10:30:00Z',
        updatedAt: '2023-05-20T14:45:00Z',
        lastLogin: '2023-06-01T09:15:00Z'
      };

      // Mock appointments
      const mockAppointments: Appointment[] = [
        {
          id: 101,
          date: '2023-05-15',
          time: '10:00 AM',
          provider: 'Dr. Smith',
          center: 'Main Medical Center',
          status: 'completed'
        },
        {
          id: 102,
          date: '2023-06-10',
          time: '2:30 PM',
          provider: 'Dr. Johnson',
          center: 'Main Medical Center',
          status: 'scheduled'
        },
        {
          id: 103,
          date: '2023-04-02',
          time: '11:15 AM',
          provider: 'Dr. Smith',
          center: 'Downtown Clinic',
          status: 'completed'
        }
      ];

      // Mock activity logs
      const mockActivityLogs: ActivityLog[] = [
        {
          id: 201,
          action: 'Login',
          timestamp: '2023-06-01T09:15:00Z',
          details: 'User logged in from IP 192.168.1.1'
        },
        {
          id: 202,
          action: 'Profile Update',
          timestamp: '2023-05-20T14:45:00Z',
          details: 'User updated their profile information'
        },
        {
          id: 203,
          action: 'Appointment Booking',
          timestamp: '2023-05-10T11:30:00Z',
          details: 'User booked an appointment with Dr. Johnson'
        },
        {
          id: 204,
          action: 'Password Change',
          timestamp: '2023-04-15T16:20:00Z',
          details: 'User changed their password'
        },
        {
          id: 205,
          action: 'Registration',
          timestamp: '2023-01-15T10:30:00Z',
          details: 'User registered an account'
        }
      ];

      setUserDetails(mockUser);
      setAppointments(mockAppointments);
      setActivityLogs(mockActivityLogs);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Handle user deactivation
  const handleDeactivateUser = () => {
    if (!userDetails) return;
    
    setIsDeactivating(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update user status
      setUserDetails({
        ...userDetails,
        status: userDetails.status === 'active' ? 'inactive' : 'active'
      });
      
      setSuccess(`User ${userDetails.status === 'active' ? 'deactivated' : 'activated'} successfully`);
      setIsDeactivating(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (!userDetails) return;
    
    if (window.confirm(`Are you sure you want to delete the user ${userDetails.name}? This action cannot be undone.`)) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setSuccess('User deleted successfully');
        
        // Redirect to users list after 2 seconds
        setTimeout(() => {
          navigate('/admin/users');
        }, 2000);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!userDetails) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">User not found</h3>
              <p className="mt-1 text-sm text-gray-500">The user you're looking for doesn't exist or you don't have access.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/admin/users')}
                  variant="primary"
                >
                  Back to Users
                </Button>
              </div>
            </div>
          </Card>
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
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/admin/users')}
                variant="outline"
                size="sm"
                className="mr-4"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">{userDetails.name}</h1>
              <Badge
                variant={userDetails.status === 'active' ? 'success' : 'danger'}
                className="ml-4"
              >
                {userDetails.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                as={Link}
                to={`/admin/users/${userDetails.id}/edit`}
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                Edit User
              </Button>
              <Button
                onClick={handleDeactivateUser}
                variant={userDetails.status === 'active' ? 'danger' : 'success'}
                isLoading={isDeactivating}
              >
                {userDetails.status === 'active' ? 'Deactivate' : 'Activate'}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              <Tab id="overview" label="Overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="mt-1">{userDetails.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Role:</span>
                        <p className="mt-1">
                          <Badge
                            variant={
                              userDetails.role === 'Admin' ? 'primary' :
                              userDetails.role === 'Provider' ? 'secondary' :
                              'info'
                            }
                          >
                            {userDetails.role}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <p className="mt-1">{userDetails.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Address:</span>
                        <p className="mt-1">{userDetails.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Account Status:</span>
                        <p className="mt-1">
                          <Badge
                            variant={userDetails.status === 'active' ? 'success' : 'danger'}
                          >
                            {userDetails.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Created At:</span>
                        <p className="mt-1">{new Date(userDetails.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                        <p className="mt-1">{new Date(userDetails.updatedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Last Login:</span>
                        <p className="mt-1">{new Date(userDetails.lastLogin).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Delete User Account</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Permanently delete this user account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <div className="mt-4">
                          <Button
                            onClick={handleDeleteUser}
                            variant="danger"
                            size="sm"
                          >
                            Delete User
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab id="appointments" label="Appointments">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Appointment History</h3>
                    {userDetails.role === 'Patient' && (
                      <Button
                        as={Link}
                        to={`/admin/appointments/new?patient=${userDetails.id}`}
                        variant="primary"
                        size="sm"
                      >
                        Schedule New Appointment
                      </Button>
                    )}
                  </div>
                  
                  {appointments.length === 0 ? (
                    <div className="text-center py-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                      <p className="mt-1 text-sm text-gray-500">This user has no appointment history.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-white">
                      <ul className="divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                          <li key={appointment.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                    appointment.status === 'completed' 
                                      ? 'bg-green-100 text-green-600' 
                                      : appointment.status === 'scheduled'
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-red-100 text-red-600'
                                  }`}>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {appointment.provider} at {appointment.center}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge
                                  variant={
                                    appointment.status === 'completed' ? 'success' :
                                    appointment.status === 'scheduled' ? 'primary' :
                                    'danger'
                                  }
                                  className="mr-4"
                                >
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                                <Button
                                  as={Link}
                                  to={`/admin/appointments/${appointment.id}`}
                                  variant="outline"
                                  size="sm"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Tab>
              <Tab id="activity" label="Activity Log">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
                  
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No activity logs</h3>
                      <p className="mt-1 text-sm text-gray-500">There are no activity logs for this user yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-white">
                      <ul className="divide-y divide-gray-200">
                        {activityLogs.map((log) => (
                          <li key={log.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-900">{log.action}</div>
                                  <div className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                  {log.details}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminUserDetailsPage;
