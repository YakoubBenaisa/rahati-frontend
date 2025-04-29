import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert } from '../../../components/ui';
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
  role: 'Patient' | 'Provider' | 'Admin';
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  notes: string;
  center_id?: number; // Optional center ID for providers
}

const AdminCreateUserPage: React.FC = () => {
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState<boolean>(false);

  // Fetch centers for provider assignment
  useEffect(() => {
    const fetchCenters = async () => {
      setIsLoadingCenters(true);
      try {
        const response = await centersAPI.getCenters({ is_active: true });
        setCenters(response.data.data || response.data);
      } catch (err) {
        console.error('Failed to fetch centers:', err);
        setError('Failed to load healthcare centers. Please try again.');
      } finally {
        setIsLoadingCenters(false);
      }
    };

    fetchCenters();
  }, []);

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

    // Require center_id for providers
    if (values.role === 'Provider' && !values.center_id) {
      errors.center_id = 'Healthcare center assignment is required for providers';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values: CreateUserFormValues, resetForm: () => void) => {
    setError(null);

    try {
      // Create the user with the API
      await usersAPI.createUser(values);

      setSuccess('User created successfully');

      // Reset form
      resetForm();

      // Redirect to users list after 2 seconds
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
    }
  };

  // Initialize form with default values
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting } = useForm<CreateUserFormValues>(
    {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'Patient',
      phone: '',
      address: '',
      status: 'active',
      notes: '',
      center_id: undefined
    },
    handleSubmit,
    validateForm
  );

  // Role options
  const roleOptions = [
    { value: 'Patient', label: 'Patient' },
    { value: 'Provider', label: 'Healthcare Provider' },
    { value: 'Admin', label: 'Administrator' }
  ];

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

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
              <Button
                onClick={() => navigate('/admin/users')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Users
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
                      error={touched.name && errors.name}
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
                      error={touched.email && errors.email}
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
                      error={touched.password && errors.password}
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
                      error={touched.password_confirmation && errors.password_confirmation}
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
                      error={touched.role && errors.role}
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <Select
                      id="status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={statusOptions}
                      error={touched.status && errors.status}
                    />
                  </div>
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
                      error={touched.phone && errors.phone}
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
                      error={touched.address && errors.address}
                    />
                  </div>
                </div>

                {/* Center selection for providers */}
                {values.role === 'Provider' && (
                  <div>
                    <label htmlFor="center_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Assign to Healthcare Center *
                    </label>
                    <Select
                      id="center_id"
                      name="center_id"
                      value={values.center_id?.toString() || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange({
                          target: {
                            name: 'center_id',
                            value: value ? parseInt(value, 10) : undefined
                          }
                        } as React.ChangeEvent<HTMLSelectElement>);
                      }}
                      onBlur={handleBlur}
                      options={[
                        { value: '', label: 'Select a healthcare center' },
                        ...centers.map(center => ({
                          value: center.id.toString(),
                          label: center.name
                        }))
                      ]}
                      error={touched.center_id && errors.center_id}
                      isLoading={isLoadingCenters}
                    />
                    {isLoadingCenters && (
                      <p className="mt-1 text-sm text-gray-500">Loading centers...</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter any additional notes"
                    rows={4}
                    error={touched.notes && errors.notes}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/users')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                  >
                    Create User
                  </Button>
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
