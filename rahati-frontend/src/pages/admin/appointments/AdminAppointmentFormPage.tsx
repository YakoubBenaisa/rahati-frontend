import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert, Spinner } from '../../../components/ui';
//import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { appointmentsAPI, usersAPI, centersAPI } from '../../../services/api';
import {  User, Center, AppointmentStatus } from '../../../types';

interface AppointmentFormValues {
  patient_id: number | null;
  provider_id: number | null;
  center_id: number | null;
  appointment_date: string;
  appointment_time: string;
  appointment_duration: number;
  status: AppointmentStatus;
  notes: string;
}

const AdminAppointmentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //const { user } = useAuth(['Admin', 'Superuser']);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientIdParam = searchParams.get('patient');
  const assignProviderMode = searchParams.get('assign_provider') === 'true';

  const isEditMode = !!id;
  const pageTitle = isEditMode
    ? assignProviderMode ? 'Assign Provider to Appointment' : 'Edit Appointment'
    : 'Create Appointment';

  const [formValues, setFormValues] = useState<AppointmentFormValues>({
    patient_id: patientIdParam ? Number(patientIdParam) : null,
    provider_id: null,
    center_id: null,
    appointment_date: '',
    appointment_time: '',
    appointment_duration: 30,
    status: 'scheduled',
    notes: ''
  });

  const [patients, setPatients] = useState<User[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AppointmentFormValues, string>>>({});

  // Filter providers by center
  useEffect(() => {
    if (formValues.center_id) {
      const fetchProvidersByCenter = async () => {
        try {
          // Fetch providers filtered by center_id
          const providersResponse = await usersAPI.getUsers({
            role: 'Provider',
            center_id: formValues.center_id
          });
          const providersData = providersResponse.data.data || providersResponse.data;
          setProviders(providersData);

          // If the currently selected provider is not in the new list, clear it
          if (formValues.provider_id && !providersData.some((p: { id: number | null; }) => p.id === formValues.provider_id)) {
            setFormValues(prev => ({
              ...prev,
              provider_id: null
            }));
          }
        } catch (err) {
          console.error('Error fetching providers by center:', err);
        }
      };

      fetchProvidersByCenter();
    } else {
      // Clear providers if no center is selected
      setProviders([]);

      // Clear provider selection
      if (formValues.provider_id) {
        setFormValues(prev => ({
          ...prev,
          provider_id: null
        }));
      }
    }
  }, [formValues.center_id]);

  // Fetch data for dropdowns and appointment data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch centers
        const centersResponse = await centersAPI.getCenters();
        const centersData = centersResponse.data.data || centersResponse.data;
        setCenters(centersData);

        // Fetch patients (role = Patient)
        const patientsResponse = await usersAPI.getUsers({ role: 'Patient' });
        const patientsData = patientsResponse.data.data || patientsResponse.data;
        setPatients(patientsData);

        // If in edit mode, fetch appointment data
        if (isEditMode) {
          const appointmentResponse = await appointmentsAPI.getAppointmentById(Number(id));
          const appointmentData = appointmentResponse.data.data || appointmentResponse.data;

          // Parse datetime into date and time
          const dateTime = new Date(appointmentData.appointment_datetime);
          const date = dateTime.toISOString().split('T')[0];
          const time = dateTime.toTimeString().split(' ')[0].substring(0, 5);

          // Set form values
          setFormValues({
            patient_id: appointmentData.patient_id,
            provider_id: appointmentData.provider_id || null,
            center_id: appointmentData.center_id,
            appointment_date: date,
            appointment_time: time,
            appointment_duration: appointmentData.appointment_duration,
            status: appointmentData.status,
            notes: appointmentData.notes || ''
          });

          // If center_id is available, fetch providers for that center
          if (appointmentData.center_id) {
            try {
              const providersResponse = await usersAPI.getUsers({
                role: 'Provider',
                center_id: appointmentData.center_id
              });
              const providersData = providersResponse.data.data || providersResponse.data;
              setProviders(providersData);
            } catch (err) {
              console.error('Error fetching providers for center:', err);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, patientIdParam]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (formErrors[name as keyof AppointmentFormValues]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseInt(value, 10) : 0;

    setFormValues(prev => ({
      ...prev,
      [name]: numValue
    }));

    // Clear error for this field
    if (formErrors[name as keyof AppointmentFormValues]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormValues(prev => ({
      ...prev,
      [name]: value ? (name === 'status' ? value : Number(value)) : null
    }));

    // Clear error for this field
    if (formErrors[name as keyof AppointmentFormValues]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AppointmentFormValues, string>> = {};

    if (!formValues.patient_id) {
      errors.patient_id = 'Patient is required';
    }

    if (!formValues.center_id) {
      errors.center_id = 'Healthcare center is required';
    }

    if (!formValues.appointment_date) {
      errors.appointment_date = 'Appointment date is required';
    }

    if (!formValues.appointment_time) {
      errors.appointment_time = 'Appointment time is required';
    }

    if (!formValues.appointment_duration || formValues.appointment_duration <= 0) {
      errors.appointment_duration = 'Valid appointment duration is required';
    }

    if (!formValues.provider_id) {
      errors.provider_id = 'Provider is required';
    }

    if (!formValues.status) {
      errors.status = 'Status is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If in assign provider mode, only validate provider_id
    if (assignProviderMode) {
      if (!formValues.provider_id) {
        setFormErrors({ provider_id: 'Provider is required' });
        return;
      }
    } else {
      // Full form validation
      if (!validateForm()) {
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      // Combine date and time into ISO string
      const dateTimeString = `${formValues.appointment_date}T${formValues.appointment_time}:00`;

      // Prepare data for API
      let appointmentData: any;

      // If in assign provider mode, only update provider_id
      if (assignProviderMode && isEditMode) {
        appointmentData = {
          provider_id: formValues.provider_id
        };
      } else {
        appointmentData = {
          patient_id: formValues.patient_id,
          center_id: formValues.center_id,
          provider_id: formValues.provider_id,
          appointment_datetime: dateTimeString,
          appointment_duration: formValues.appointment_duration,
          status: formValues.status,
          notes: formValues.notes || null
        };
      }

      let response;
      if (isEditMode) {
        response = await appointmentsAPI.updateAppointment(Number(id), appointmentData);
      } else {
        response = await appointmentsAPI.createAppointment(appointmentData);
      }

      setSuccess(`Appointment ${isEditMode ? 'updated' : 'created'} successfully`);

      // Redirect after a short delay
      setTimeout(() => {
        if (isEditMode) {
          navigate(`/admin/appointments/${id}`);
        } else {
          const newId = response.data.data?.id || response.data.id;
          navigate(`/admin/appointments/${newId}`);
        }
      }, 1500);
    } catch (err: any) {
      console.error('Error saving appointment:', err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} appointment. Please try again.`);
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
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading...</span>
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
                {pageTitle}
              </h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                {assignProviderMode
                  ? 'Assign a healthcare provider to this appointment'
                  : isEditMode
                    ? 'Update appointment details'
                    : 'Schedule a new appointment'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => isEditMode ? navigate(`/admin/appointments/${id}`) : navigate('/admin/appointments')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Cancel
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
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {assignProviderMode ? (
                // Simplified form for assigning provider only
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                      Assign Provider
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
                      Select a healthcare provider for this appointment.
                    </p>
                  </div>

                  <div className="max-w-md">
                    <Select
                      label="Provider *"
                      name="provider_id"
                      value={formValues.provider_id?.toString() || ''}
                      onChange={handleSelectChange}
                      error={formErrors.provider_id}
                    >
                      <option value="">Select a provider</option>
                      {providers.map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              ) : (
                // Full appointment form
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Select
                        label="Patient *"
                        name="patient_id"
                        value={formValues.patient_id?.toString() || ''}
                        onChange={handleSelectChange}
                        error={formErrors.patient_id}
                        disabled={isEditMode} // Can't change patient in edit mode
                      >
                        <option value="">Select a patient</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>
                            {patient.name}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Select
                        label="Healthcare Center *"
                        name="center_id"
                        value={formValues.center_id?.toString() || ''}
                        onChange={handleSelectChange}
                        error={formErrors.center_id}
                      >
                        <option value="">Select a center</option>
                        {centers.map(center => (
                          <option key={center.id} value={center.id}>
                            {center.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Select
                        label="Provider *"
                        name="provider_id"
                        value={formValues.provider_id?.toString() || ''}
                        onChange={handleSelectChange}
                        error={formErrors.provider_id}
                        disabled={!formValues.center_id}
                      >
                        <option value="">Select a provider</option>
                        {providers.map(provider => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name}
                          </option>
                        ))}
                      </Select>
                      {!formValues.center_id && (
                        <p className="mt-1 text-xs text-amber-600">
                          Please select a healthcare center first to see available providers.
                        </p>
                      )}
                      {formValues.center_id && providers.length === 0 && (
                        <p className="mt-1 text-xs text-red-600">
                          No providers available for this center. Please select a different center.
                        </p>
                      )}
                    </div>

                    <div>
                      <Select
                        label="Status *"
                        name="status"
                        value={formValues.status}
                        onChange={handleSelectChange}
                        error={formErrors.status}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Input
                        type="date"
                        label="Appointment Date *"
                        name="appointment_date"
                        value={formValues.appointment_date}
                        onChange={handleInputChange}
                        error={formErrors.appointment_date}
                      />
                    </div>

                    <div>
                      <Input
                        type="time"
                        label="Appointment Time *"
                        name="appointment_time"
                        value={formValues.appointment_time}
                        onChange={handleInputChange}
                        error={formErrors.appointment_time}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        label="Duration (minutes) *"
                        name="appointment_duration"
                        value={formValues.appointment_duration.toString()}
                        onChange={handleNumberChange}
                        min={15}
                        step={15}
                        error={formErrors.appointment_duration}
                      />
                    </div>
                  </div>

                  <div>
                    <Textarea
                      label="Notes"
                      name="notes"
                      value={formValues.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Enter any additional notes about this appointment"
                      error={formErrors.notes}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                >
                  {assignProviderMode
                    ? 'Assign Provider'
                    : isEditMode
                      ? 'Update Appointment'
                      : 'Create Appointment'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminAppointmentFormPage;
