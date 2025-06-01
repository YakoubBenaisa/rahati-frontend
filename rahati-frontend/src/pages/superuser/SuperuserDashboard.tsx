import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../layouts';
import { Card, Button, Alert, Input, Select, Spinner } from '../../components/ui';
import { useAuth } from '../../hooks';
import { useForm } from '../../hooks';
import { useDashboardStore } from '../../store';
import { usersAPI, centersAPI } from '../../services/api';
import { isValidEmail, isValidPassword, isValidPhone } from '../../utils/validationUtils';
import { Center } from '../../types';

interface CreateAdminFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address: string;
  center_id: number;
}

const SuperuserDashboard: React.FC = () => {
  const { user } = useAuth('Superuser');
  const { adminStats, fetchAdminStats, error: statsError } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Set loading state
    setIsLoading(true);
    setError(null);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        await fetchAdminStats();
        
        // Fetch centers for the admin creation form
        await fetchCenters();

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [fetchAdminStats]);

  // Fetch centers for admin users
  const fetchCenters = async () => {
    setIsLoadingCenters(true);
    try {
      const response = await centersAPI.getCenters();
      setCenters(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching centers:', err);
      setError('Failed to load centers. Please try again.');
    } finally {
      setIsLoadingCenters(false);
    }
  };

  // Set error from stats if it exists
  useEffect(() => {
    if (statsError) {
      setError(statsError);
    }
  }, [statsError]);

  // Form validation
  const validateForm = (values: CreateAdminFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Password must be at least 8 characters with at least one number, one uppercase and one lowercase letter';
    }

    if (values.password !== values.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }

    if (!values.center_id) {
      errors.center_id = 'Center is required for Admin users';
    }

    if (values.phone && !isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values: CreateAdminFormValues, resetForm: () => void) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        role: 'Admin', // Always create Admin users from this form
        phone: values.phone || null,
        address: values.address || null,
        center_id: values.center_id
      };

      // Send to API
      const response = await usersAPI.createUser(userData);

      console.log('Admin user created:', response.data);
      setSuccess('Admin user created successfully and assigned to center');

      // Reset form
      resetForm();
    } catch (err: any) {
      console.error('Error creating admin user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create admin user. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize form with default values
  const { values, handleChange, handleBlur, handleSubmit: submitForm } = useForm<CreateAdminFormValues>(
    {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      address: '',
      center_id: centers.length > 0 ? centers[0].id : 0
    },
    handleSubmit,
    validateForm
  );

  // Dashboard stats
  const stats = [
    {
      title: 'Total Centers',
      value: adminStats?.totalCenters || 0,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: adminStats?.totalUsers || 0,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Total Patients',
      value: adminStats?.totalPatients || 0,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Total Providers',
      value: adminStats?.totalProviders || 0,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          Superuser Dashboard
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

      {/* Success message */}
      {success && (
        <Alert
          variant="success"
          className="mb-6"
          dismissible
          onDismiss={() => setSuccess(null)}
        >
          {success}
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

      {/* Create Admin User Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Admin User</h2>
          <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All Users
          </Link>
        </div>

        <Card>
          <form onSubmit={submitForm}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter full name"
                    //error={touched.name && errors.name}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter email address"
                    //error={touched.email && errors.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter password"
                    //error={touched.password && errors.password}
                  />
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={values.password_confirmation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm password"
                    //error={touched.password_confirmation && errors.password_confirmation}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="center_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Center *
                  </label>
                  {isLoadingCenters ? (
                    <div className="flex items-center">
                      <Spinner size="sm" />
                      <span className="ml-2 text-sm text-gray-500">Loading centers...</span>
                    </div>
                  ) : (
                    <Select
                      id="center_id"
                      name="center_id"
                      value={values.center_id?.toString() || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : 0;
                        handleChange({
                          target: {
                            name: 'center_id',
                            value
                          }
                        } as unknown as React.ChangeEvent<HTMLSelectElement>);
                      }}
                      onBlur={handleBlur}
                      //error={touched.center_id && errors.center_id}
                    >
                      <option value="">Select a center</option>
                      {centers.map(center => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                    </Select>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    The admin user will be assigned to manage this healthcare center.
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    //error={touched.phone && errors.phone}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter address"
                  //error={touched.address && errors.address}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Create Admin User
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/admin/users" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Users</h3>
              <p className="text-gray-600">View and manage all users in the system.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/admin/centers/new" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add Healthcare Center</h3>
              <p className="text-gray-600">Create a new healthcare center in the system.</p>
            </Link>
          </Card>

          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Link to="/admin/centers" className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-accent-100 text-accent-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Centers</h3>
              <p className="text-gray-600">View and manage all healthcare centers.</p>
            </Link>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default SuperuserDashboard;
