import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert, Spinner } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks';
import { isValidEmail, isValidPhone } from '../../../utils/validationUtils';
import { motion } from 'framer-motion';
import { usersAPI, centersAPI } from '../../../services/api';
import { User, Center, UserRole } from '../../../types';

interface EditUserFormValues {
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  is_active: boolean;
  center_id?: number;
  caregiver_name?: string;
  caregiver_phone?: string;
  notes?: string;
}

const AdminEditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [initialValues, setInitialValues] = useState<EditUserFormValues>({
    name: '',
    email: '',
    role: 'Patient',
    phone: '',
    address: '',
    is_active: true,
    center_id: undefined,
    caregiver_name: '',
    caregiver_phone: '',
    notes: ''
  });

  // Fetch centers for dropdown
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await centersAPI.getCenters();
        setCenters(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching centers:', err);
      }
    };

    fetchCenters();
  }, []);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) return;

        const response = await usersAPI.getUserById(Number(id));
        const userData = response.data.data || response.data;

        // Map API response to form values
        const formValues: EditUserFormValues = {
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role as UserRole,
          phone: userData.phone || '',
          address: userData.address || '',
          is_active: userData.is_active !== undefined ? userData.is_active : true,
          center_id: userData.center_id,
          caregiver_name: userData.caregiver_name || '',
          caregiver_phone: userData.caregiver_phone || '',
          notes: userData.notes || ''
        };

        setInitialValues(formValues);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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

    if (values.caregiver_phone && !isValidPhone(values.caregiver_phone)) {
      errors.caregiver_phone = 'Invalid caregiver phone number format';
    }

    if ((values.role === 'Admin' || values.role === 'Provider') && !values.center_id) {
      errors.center_id = 'Center is required for Admin and Provider users';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values: EditUserFormValues, resetForm: () => void) => {
    setError(null);
    setIsSaving(true);

    try {
      if (!id) return;

      // Prepare data for API
      const userData = {
        name: values.name,
        email: values.email,
        role: values.role,
        phone: values.phone || null,
        address: values.address || null,
        is_active: values.is_active,
        center_id: (values.role === 'Admin' || values.role === 'Provider') ? values.center_id : null,
        caregiver_name: values.role === 'Patient' ? values.caregiver_name : null,
        caregiver_phone: values.role === 'Patient' ? values.caregiver_phone : null,
        notes: values.notes || null
      };

      // Call API to update user
      await usersAPI.updateUser(Number(id), userData);

      setSuccess('User updated successfully');

      // Redirect to user details after 2 seconds
      setTimeout(() => {
        navigate(`/admin/users/${id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

  // Role options - only superusers can create other superusers
  const roleOptions = [
    { value: 'Patient', label: 'Patient' },
    { value: 'Provider', label: 'Healthcare Provider' },
    { value: 'Admin', label: 'Administrator' },
    ...(user?.role === 'Superuser' ? [{ value: 'Superuser', label: 'Superuser' }] : [])
  ];

  // Status options
  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading user data...</span>
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
                      error={touched.role && errors.role}
                    >
                      {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <Select
                      id="is_active"
                      name="is_active"
                      value={values.is_active.toString()}
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: 'is_active',
                            value: e.target.value === 'true'
                          }
                        } as React.ChangeEvent<HTMLSelectElement>);
                      }}
                      onBlur={handleBlur}
                      error={touched.is_active && errors.is_active}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Select>
                  </div>
                </div>

                {(values.role === 'Admin' || values.role === 'Provider') && (
                  <div>
                    <label htmlFor="center_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Healthcare Center *
                    </label>
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
                        } as React.ChangeEvent<HTMLSelectElement>);
                      }}
                      onBlur={handleBlur}
                      error={touched.center_id && errors.center_id}
                    >
                      <option value="">Select a center</option>
                      {centers.map(center => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}

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
                        error={touched.caregiver_name && errors.caregiver_name}
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
                        error={touched.caregiver_phone && errors.caregiver_phone}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={values.notes || ''}
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
                    isLoading={isSaving}
                    disabled={isSaving}
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
                  onClick={async () => {
                    try {
                      setIsSaving(true);
                      setError(null);

                      // Call API to reset password
                      await usersAPI.resetPassword(Number(id));

                      setSuccess('Password reset email sent to the user');
                    } catch (err: any) {
                      console.error('Error resetting password:', err);
                      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  isLoading={isSaving}
                  disabled={isSaving}
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
