import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks';
import { isValidEmail, isValidPhone } from '../../../utils/validationUtils';
import { motion } from 'framer-motion';

interface EditUserFormValues {
  name: string;
  email: string;
  role: 'Patient' | 'Provider' | 'Admin';
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  notes: string;
}

const AdminEditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<EditUserFormValues>({
    name: '',
    email: '',
    role: 'Patient',
    phone: '',
    address: '',
    status: 'active',
    notes: ''
  });

  // Mock fetch user data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock user data
      const mockUser: EditUserFormValues = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Patient',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, CA 12345',
        status: 'active',
        notes: 'Regular patient with good compliance to treatment.'
      };

      setInitialValues(mockUser);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Form validation
  const validateForm = (values: EditUserFormValues) => {
    const errors: Partial<Record<keyof EditUserFormValues, string>> = {};

    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }

    if (!values.role) {
      errors.role = 'Role is required';
    }

    if (values.phone && !isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (values: EditUserFormValues, resetForm: () => void) => {
    setError(null);

    // Simulate API call
    setTimeout(() => {
      try {
        console.log('Updating user:', values);

        // Mock successful response
        setSuccess('User updated successfully');

        // Redirect to user details after 2 seconds
        setTimeout(() => {
          navigate(`/admin/users/${id}`);
        }, 2000);
      } catch (err) {
        setError('Failed to update user. Please try again.');
      }
    }, 1000);
  };

  // Initialize form with fetched values
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting, setMultipleFields } = useForm<EditUserFormValues>(
    initialValues,
    handleSubmit,
    validateForm
  );

  // Update form values when initialValues change
  useEffect(() => {
    if (!isLoading) {
      setMultipleFields(initialValues);
    }
  }, [initialValues, isLoading, setMultipleFields]);

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
              <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
              <p className="mt-2 text-gray-600">
                Update user information for {initialValues.name}.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate(`/admin/users/${id}`)}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to User Details
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
                    onClick={() => navigate(`/admin/users/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
              <p className="text-gray-600">
                Use this option to reset the user's password. A temporary password will be generated and sent to the user's email address.
              </p>
              <div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    // Simulate password reset
                    setTimeout(() => {
                      setSuccess('Password reset email sent to the user');
                    }, 1000);
                  }}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminEditUserPage;
