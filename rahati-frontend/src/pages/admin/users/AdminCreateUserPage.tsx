import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Input, Select, Alert, Spinner } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks';
import { isValidEmail, isValidPassword, isValidPhone } from '../../../utils/validationUtils';
import { motion } from 'framer-motion';
import { usersAPI, centersAPI } from '../../../services/api';
import { Center } from '../../../types';

interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'Patient' | 'Provider' | 'Admin' | 'Superuser';
  phone: string;
  address: string;
  center_id?: number;
  caregiver_name?: string;
  caregiver_phone?: string;
}

const AdminCreateUserPage: React.FC = () => {
  const { user } = useAuth(['Admin', 'Superuser']);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch centers for admin users
  useEffect(() => {
    const fetchCenters = async () => {
      setIsLoadingCenters(true);
      try {
        const response = await centersAPI.getCenters();
        const centersData = response.data.data || response.data;
        setCenters(centersData);

        // If the user is an admin, automatically set their center_id
        if (user?.role === 'Admin' && user?.center_id) {
          // Find the user's center in the list
          const userCenter = centersData.find((center: Center) => center.id === user.center_id);

          if (userCenter) {
            // Set the center_id in the form
            handleChange({
              target: {
                name: 'center_id',
                value: user.center_id
              }
            } as unknown as React.ChangeEvent<HTMLSelectElement>);
          }
        }
      } catch (err) {
        console.error('Error fetching centers:', err);
        setError('Failed to load centers. Please try again.');
      } finally {
        setIsLoadingCenters(false);
      }
    };

    fetchCenters();
  }, [user]);

  // Form validation
  const validateForm = (values: CreateUserFormValues) => {
    const errors: Partial<Record<keyof CreateUserFormValues, string>> = {};

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

    if (!values.role) {
      errors.role = 'Role is required';
    }

    if (values.phone && !isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if ((values.role === 'Admin' || values.role === 'Provider') && !values.center_id) {
      errors.center_id = 'Center is required for Admin and Provider users';
    }

    if (values.caregiver_phone && !isValidPhone(values.caregiver_phone)) {
      errors.caregiver_phone = 'Invalid caregiver phone number format';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values: CreateUserFormValues, resetForm: () => void) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Prepare data for API based on role
      let userData: any;

      if (values.role === 'Patient') {
        // For Patient role, include caregiver fields
        userData = {
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
          role: values.role,
          phone: values.phone || '',
          address: values.address || '',
          caregiver_name: values.caregiver_name || '',
          caregiver_phone: values.caregiver_phone || ''
        };
      } else {
        // For non-Patient roles, exclude caregiver fields completely
        userData = {
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
          role: values.role,
          phone: values.phone || '',
          address: values.address || ''
        };
      }

      // Handle center_id based on user role
      if (user?.role === 'Admin' && user?.center_id) {
        // Admin users can only assign to their center
        userData.center_id = user.center_id;
      } else {
        // Superusers can assign to any center
        if (values.role === 'Admin' || values.role === 'Provider') {
          userData.center_id = values.center_id || null;
        } else {
          // For patients, center_id is not required
          userData.center_id = null;
        }
      }

      // Validate that providers and admins have a center assigned
      if ((values.role === 'Provider' || values.role === 'Admin') && !userData.center_id) {
        setError('Healthcare providers and administrators must be assigned to a center.');
        setIsSubmitting(false);
        return;
      }

      // Log the data being sent to the API
      console.log('Sending user data to API:', userData);

      // Send to API
      const response = await usersAPI.createUser(userData);

      console.log('User created:', response.data);
      setSuccess(`User ${values.name} created successfully with role ${values.role}`);

      // Reset form
      resetForm();

      // If the user is an admin, reset the center_id to their center
      if (user?.role === 'Admin' && user?.center_id) {
        handleChange({
          target: {
            name: 'center_id',
            value: user.center_id
          }
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }

      // Redirect to users list after 2 seconds
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create user. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize form with default values
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm } = useForm<CreateUserFormValues>(
    {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'Patient',
      phone: '',
      address: '',
      center_id: centers.length > 0 ? centers[0].id : undefined,
      caregiver_name: '',
      caregiver_phone: ''
    },
    handleSubmit,
    validateForm
  );

  // Role options based on user's role
  const roleOptions = [
    { value: 'Patient', label: 'Patient' },
    { value: 'Provider', label: 'Healthcare Provider' },
    ...(user?.role === 'Superuser' ? [
      { value: 'Admin', label: 'Administrator' },
      { value: 'Superuser', label: 'Superuser' }
    ] : [])
  ];

  // If the user is not a Superuser and tries to access this page directly,
  // redirect them to the users list page
  useEffect(() => {
    if (user?.role !== 'Superuser' && values.role === 'Admin') {
      // Use setFieldValue from useForm hook
      handleChange({
        target: {
          name: 'role',
          value: 'Patient'
        }
      } as unknown as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [user?.role]);

  // Redirect to users list if user doesn't have permission to create users
  useEffect(() => {
    if (user?.role !== 'Superuser' && user?.role !== 'Admin') {
      navigate('/admin/users');
    }
  }, [user?.role, navigate]);

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
              <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
              <p className="mt-2 text-gray-600">
                Add a new user to the platform.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/admin/users"
                className="inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-4 py-2 text-base border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Users
              </Link>
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
                      error={touched.name && errors.name ? errors.name : undefined}
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
                      error={touched.email && errors.email ? errors.email : undefined}
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
                      error={touched.password && errors.password ? errors.password : undefined}
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
                      error={touched.password_confirmation && errors.password_confirmation ? errors.password_confirmation : undefined}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <Select
                      id="role"
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={roleOptions}
                      error={touched.role && errors.role ? errors.role : undefined}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {user?.role === 'Superuser'
                        ? 'As a Superuser, you can create users with any role.'
                        : 'As an Admin, you can only create Patients and Providers.'}
                    </p>
                  </div>

                  {(values.role === 'Admin' || values.role === 'Provider') && (
                    <div>
                      <label htmlFor="center_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Center *
                      </label>
                      {isLoadingCenters ? (
                        <div className="flex items-center">
                          <Spinner size="sm" />
                          <span className="ml-2 text-sm text-gray-500">Loading centers...</span>
                        </div>
                      ) : (
                        <>
                          {user?.role === 'Admin' && user?.center_id ? (
                            // For admin users, show their assigned center as disabled
                            <div>
                              <Input
                                id="center_id_display"
                                value={centers.find(c => c.id === user.center_id)?.name || 'Your assigned center'}
                                disabled
                              />
                              <input
                                type="hidden"
                                name="center_id"
                                value={user.center_id}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                As an admin, you can only assign users to your center.
                              </p>
                            </div>
                          ) : (
                            // For superusers, show the center dropdown
                            <Select
                              id="center_id"
                              name="center_id"
                              value={values.center_id?.toString() || ''}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                handleChange({
                                  target: {
                                    name: 'center_id',
                                    value
                                  }
                                } as unknown as React.ChangeEvent<HTMLSelectElement>);
                              }}
                              onBlur={handleBlur}
                              error={touched.center_id && errors.center_id ? errors.center_id : undefined}
                            >
                              <option value="">Select a center</option>
                              {centers.map(center => (
                                <option key={center.id} value={center.id}>
                                  {center.name}
                                </option>
                              ))}
                            </Select>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      error={touched.phone && errors.phone ? errors.phone : undefined}
                    />
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
                      error={touched.address && errors.address ? errors.address : undefined}
                    />
                  </div>
                </div>

                {values.role === 'Patient' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="caregiver_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Caregiver Name
                      </label>
                      <Input
                        id="caregiver_name"
                        name="caregiver_name"
                        value={values.caregiver_name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter caregiver name"
                        error={touched.caregiver_name && errors.caregiver_name ? errors.caregiver_name : undefined}
                      />
                    </div>
                    <div>
                      <label htmlFor="caregiver_phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Caregiver Phone
                      </label>
                      <Input
                        id="caregiver_phone"
                        name="caregiver_phone"
                        value={values.caregiver_phone || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter caregiver phone"
                        error={touched.caregiver_phone && errors.caregiver_phone ? errors.caregiver_phone : undefined}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Link
                    to="/admin/users"
                    className="inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-4 py-2 text-base border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className={`inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-4 py-2 text-base bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    Create User
                  </button>
                </div>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminCreateUserPage;
