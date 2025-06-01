import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Textarea, Alert } from '../../../components/ui';
//import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks';
import { useCenterStore } from '../../../store/centerStore';
import { isValidEmail, isValidPhone, isValidUrl } from '../../../utils/validationUtils';
import { motion } from 'framer-motion';

interface EditCenterFormValues {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
}

const AdminEditCenterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //const { user } = useAuth('Admin');
  const navigate = useNavigate();
  const { selectedCenter, fetchCenterById, updateCenter, isLoading, error: storeError, clearError } = useCenterStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<EditCenterFormValues>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    latitude: '',
    longitude: '',
    is_active: true
  });

  // Fetch center data
  useEffect(() => {
    if (id) {
      fetchCenterById(Number(id));
    }
  }, [id, fetchCenterById]);

  // Set initial form values when center data is loaded
  useEffect(() => {
    if (selectedCenter) {
      setInitialValues({
        name: selectedCenter.name,
        description: selectedCenter.description,
        address: selectedCenter.address,
        phone: selectedCenter.phone,
        email: selectedCenter.email,
        website: selectedCenter.website || '',
        latitude: selectedCenter.latitude ? String(selectedCenter.latitude) : '',
        longitude: selectedCenter.longitude ? String(selectedCenter.longitude) : '',
        is_active: selectedCenter.is_active
      });
    }
  }, [selectedCenter]);

  // Form validation
  const validateForm = (values: EditCenterFormValues) => {
    const errors: Partial<Record<keyof EditCenterFormValues, string>> = {};

    if (!values.name.trim()) {
      errors.name = 'Center name is required';
    }

    if (!values.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!values.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!values.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }

    if (values.website && !isValidUrl(values.website)) {
      errors.website = 'Invalid website URL';
    }

    if (values.latitude && isNaN(parseFloat(values.latitude))) {
      errors.latitude = 'Latitude must be a valid number';
    }

    if (values.longitude && isNaN(parseFloat(values.longitude))) {
      errors.longitude = 'Longitude must be a valid number';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values: EditCenterFormValues, resetForm: () => void) => {
    if (!id) return;

    setError(null);
    clearError();

    try {
      // Convert string values to appropriate types
      const centerData = {
        ...values,
        latitude: values.latitude ? parseFloat(values.latitude) : undefined,
        longitude: values.longitude ? parseFloat(values.longitude) : undefined,
      };

      await updateCenter(Number(id), centerData);
      setSuccess('Healthcare center updated successfully');

      // Redirect to center details after 2 seconds
      setTimeout(() => {
        navigate(`/admin/centers/${id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to update healthcare center. Please try again.');
    }
  };

  // Initialize form with fetched values
  const { values, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting, setFieldValue, setMultipleFields } = useForm<EditCenterFormValues>(
    initialValues,
    handleSubmit,
    validateForm
  );

  // Update form values when initialValues change
  useEffect(() => {
    if (selectedCenter) {
      setMultipleFields(initialValues);
    }
  }, [initialValues, selectedCenter, setMultipleFields]);

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('is_active', e.target.checked);
  };

  if (isLoading && !selectedCenter) {
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

  if (!selectedCenter) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Center not found</h3>
              <p className="mt-1 text-sm text-gray-500">The healthcare center you're looking for doesn't exist or you don't have access.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/admin/centers')}
                  variant="primary"
                >
                  Back to Centers
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Healthcare Center</h1>
              <p className="mt-2 text-gray-600">
                Update information for {selectedCenter.name}.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate(`/admin/centers/${id}`)}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Center Details
              </Button>
            </div>
          </div>
        </motion.div>

        {(error || storeError) && (
          <Alert
            variant="error"
            message={error || storeError || ''}
            onClose={() => {
              setError(null);
              clearError();
            }}
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
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Center Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter center name"
                    //error={touched.name && errors.name}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter center description"
                    rows={4}
                    //error={touched.description && errors.description}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter full address"
                    //error={touched.address && errors.address}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
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

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter website URL"
                    //error={touched.website && errors.website}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <Input
                      id="latitude"
                      name="latitude"
                      value={values.latitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter latitude"
                      //error={touched.latitude && errors.latitude}
                    />
                  </div>

                  <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <Input
                      id="longitude"
                      name="longitude"
                      value={values.longitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter longitude"
                      //error={touched.longitude && errors.longitude}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={values.is_active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/admin/centers/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting || isLoading}
                  >
                    Save Changes
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

export default AdminEditCenterPage;
