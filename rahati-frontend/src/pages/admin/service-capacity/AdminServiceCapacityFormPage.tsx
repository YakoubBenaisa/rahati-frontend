import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Textarea, Alert, Switch, Spinner, Select } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { serviceCapacityAPI, centersAPI } from '../../../services/api';
import { ServiceCapacity, Center } from '../../../types';

const AdminServiceCapacityFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { user } = useAuth('Admin');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<ServiceCapacity>>({
    center_id: 0,
    service_type: '',
    max_capacity: 0,
    date: '',
    start_time: '',
    end_time: '',
    is_active: true,
    notes: ''
  });

  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Service types
  const serviceTypes = [
    'General Consultation',
    'Specialist Consultation',
    'Physical Therapy',
    'Occupational Therapy',
    'Speech Therapy',
    'Mental Health',
    'Dental',
    'Vision',
    'Diagnostic Imaging',
    'Laboratory Services',
    'Pharmacy',
    'Nutrition Counseling',
    'Other'
  ];

  // Fetch centers for dropdown
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await centersAPI.getCenters();
        const data = response.data.data || response.data;
        setCenters(data);

        // Set default center if not in edit mode and centers are available
        if (!isEditMode && data.length > 0 && !formData.center_id) {
          // For admin users, use their assigned center
          if (user && user.center_id) {
            setFormData(prev => ({ ...prev, center_id: user.center_id }));
          } else if (data.length > 0) {
            setFormData(prev => ({ ...prev, center_id: data[0].id }));
          }
        }
      } catch (err) {
        console.error('Error fetching centers:', err);
        setError('Failed to load centers. Please try again.');
      }
    };

    fetchCenters();
  }, []);

  // Fetch service capacity data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchServiceCapacity = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await serviceCapacityAPI.getServiceCapacityById(Number(id));
          const data = response.data.data || response.data;

          // Format date for input field
          const formattedDate = data.date ? data.date.split('T')[0] : '';

          setFormData({
            center_id: data.center_id,
            service_type: data.service_type,
            max_capacity: data.max_capacity,
            date: formattedDate,
            start_time: data.start_time || '',
            end_time: data.end_time || '',
            is_active: data.is_active,
            notes: data.notes || ''
          });
        } catch (err) {
          console.error('Error fetching service capacity:', err);
          setError('Failed to load service capacity. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchServiceCapacity();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle time input changes - format as H:i:s for API
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Add seconds to the time value (HTML time inputs are in HH:MM format)
    const timeWithSeconds = value ? `${value}:00` : '';
    setFormData(prev => ({ ...prev, [name]: timeWithSeconds }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle numeric input
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const value = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, [fieldName]: isNaN(value) ? 0 : value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!formData.service_type?.trim()) {
        throw new Error('Service type is required');
      }

      if (!formData.date?.trim()) {
        throw new Error('Date is required');
      }

      if (!formData.start_time?.trim()) {
        throw new Error('Start time is required');
      }

      if (!formData.end_time?.trim()) {
        throw new Error('End time is required');
      }

      if (formData.max_capacity === undefined || formData.max_capacity < 1) {
        throw new Error('Maximum capacity must be at least 1');
      }

      if (!formData.center_id) {
        throw new Error('Please select a center');
      }

      // Create or update service capacity
      if (isEditMode) {
        await serviceCapacityAPI.updateServiceCapacity(Number(id), formData);
        setSuccess('Service capacity updated successfully');
      } else {
        await serviceCapacityAPI.createServiceCapacity(formData);
        setSuccess('Service capacity created successfully');

        // Reset form after successful creation
        if (!isEditMode) {
          setFormData({
            center_id: centers.length > 0 ? centers[0].id : 0,
            service_type: '',
            max_capacity: 0,
            date: '',
            start_time: '',
            end_time: '',
            is_active: true,
            notes: ''
          });
        }
      }

      // Navigate back to service capacity list after a short delay
      setTimeout(() => {
        navigate('/admin/service-capacity');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving service capacity:', err);
      setError(err.message || 'Failed to save service capacity. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading service capacity...</span>
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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                {isEditMode ? 'Edit Service Capacity' : 'Create Service Capacity'}
              </h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                {isEditMode ? 'Update the details of an existing service capacity.' : 'Add a new service capacity to the system.'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/admin/service-capacity')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Service Capacity
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Select
                    label="Center"
                    name="center_id"
                    value={formData.center_id?.toString() || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, center_id: Number(e.target.value) }))}
                    required
                    disabled={user?.role === 'Admin' && user?.center_id}
                  >
                    <option value="">Select a center</option>
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </Select>
                  {user?.role === 'Admin' && user?.center_id && (
                    <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                      As an admin, you can only manage service capacity for your assigned center.
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    label="Service Type"
                    name="service_type"
                    value={formData.service_type || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a service type</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Start Time"
                    name="start_time"
                    type="time"
                    value={formData.start_time ? formData.start_time.substring(0, 5) : ''}
                    onChange={handleTimeChange}
                    required
                  />
                  <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                    Format: HH:MM (24-hour format)
                  </p>
                </div>
                <div>
                  <Input
                    label="End Time"
                    name="end_time"
                    type="time"
                    value={formData.end_time ? formData.end_time.substring(0, 5) : ''}
                    onChange={handleTimeChange}
                    required
                  />
                  <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                    Format: HH:MM (24-hour format)
                  </p>
                </div>
              </div>

              <div>
                <Input
                  label="Maximum Capacity"
                  name="max_capacity"
                  type="number"
                  min="1"
                  value={formData.max_capacity?.toString() || '0'}
                  onChange={(e) => handleNumericChange(e, 'max_capacity')}
                  required
                  placeholder="Enter maximum capacity"
                />
              </div>

              <div>
                <Textarea
                  label="Notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes"
                  rows={4}
                />
              </div>

              <div>
                <Switch
                  label="Active"
                  checked={formData.is_active || false}
                  onChange={(checked) => handleSwitchChange('is_active', checked)}
                />
                <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                  Inactive service capacities will not be available for booking.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/service-capacity')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                >
                  {isEditMode ? 'Update Service Capacity' : 'Create Service Capacity'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminServiceCapacityFormPage;
