import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks';
import { motion } from 'framer-motion';
import { centersAPI, usersAPI, appointmentsAPI, serviceCapacityAPI } from '../../../services/api';
import { useAppointmentStore } from '../../../store';

interface BookAppointmentFormValues {
  center_id: string;
  provider_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes: string;
}

const PatientBookAppointment: React.FC = () => {
  const { user } = useAuth('Patient');
  const navigate = useNavigate();
  const { createAppointment } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [centers, setCenters] = useState<{ id: number; name: string }[]>([]);
  const [providers, setProviders] = useState<{ id: number; name: string }[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form validation
  const validateForm = (values: BookAppointmentFormValues) => {
    const errors: Partial<Record<keyof BookAppointmentFormValues, string>> = {};

    if (!values.center_id) {
      errors.center_id = 'Please select a healthcare center';
    }

    if (!values.provider_id) {
      errors.provider_id = 'Please select a healthcare provider';
    }

    if (!values.appointment_date) {
      errors.appointment_date = 'Please select an appointment date';
    }

    if (!values.appointment_time) {
      errors.appointment_time = 'Please select an appointment time';
    }

    if (!values.reason.trim()) {
      errors.reason = 'Please enter a reason for your appointment';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values: BookAppointmentFormValues, resetForm: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      // Format the appointment datetime
      const appointmentDatetime = `${values.appointment_date}T${values.appointment_time}:00`;

      // Create appointment data object
      const appointmentData = {
        patient_id: user?.id,
        center_id: Number(values.center_id),
        provider_id: Number(values.provider_id),
        appointment_datetime: appointmentDatetime,
        appointment_duration: 30, // Default to 30 minutes
        status: 'scheduled',
        reason: values.reason,
        notes: values.notes
      };

      // Call the API to create the appointment
      await createAppointment(appointmentData);

      setSuccess('Appointment booked successfully');

      // Redirect to appointments list after 2 seconds
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form with default values
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting } = useForm<BookAppointmentFormValues>(
    {
      center_id: '',
      provider_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      notes: ''
    },
    handleSubmit,
    validateForm
  );

  // Fetch centers data
  useEffect(() => {
    const fetchCenters = async () => {
      setIsLoading(true);
      try {
        const response = await centersAPI.getCenters({ is_active: true });
        const centersData = response.data.data || response.data;
        setCenters(centersData.map((center: any) => ({
          id: center.id,
          name: center.name
        })));
      } catch (err: any) {
        console.error('Error fetching centers:', err);
        setError('Failed to load healthcare centers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Fetch providers data when center changes
  useEffect(() => {
    if (values.center_id) {
      const fetchProviders = async () => {
        setProviders([]);
        setIsLoading(true);
        try {
          const response = await usersAPI.getUsers({
            role: 'Provider',
            center_id: values.center_id,
            is_active: true
          });
          const providersData = response.data.data || response.data;
          setProviders(providersData.map((provider: any) => ({
            id: provider.id,
            name: provider.name
          })));
        } catch (err: any) {
          console.error('Error fetching providers:', err);
          setError('Failed to load healthcare providers. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProviders();
    }
  }, [values.center_id]);

  // Fetch available times when provider and date change
  useEffect(() => {
    if (values.provider_id && values.appointment_date) {
      const fetchAvailableTimes = async () => {
        setAvailableTimes([]);
        setIsLoading(true);
        try {
          // Get service capacity for the selected date and provider
          const response = await serviceCapacityAPI.getServiceCapacities({
            provider_id: values.provider_id,
            date: values.appointment_date,
            service_type: 'appointment'
          });

          const capacityData = response.data.data || response.data;

          // Get existing appointments for the provider on the selected date
          const appointmentsResponse = await appointmentsAPI.getAppointments({
            provider_id: values.provider_id,
            date: values.appointment_date,
            status: 'scheduled'
          });

          const bookedAppointments = appointmentsResponse.data.data || appointmentsResponse.data;

          // Generate available time slots based on capacity and booked appointments
          // This is a simplified example - in a real app, you'd need more complex logic
          const timeSlots = [];
          if (capacityData.length > 0) {
            const capacity = capacityData[0];
            const startTime = new Date(`${values.appointment_date}T${capacity.start_time}`);
            const endTime = new Date(`${values.appointment_date}T${capacity.end_time}`);

            // Generate 30-minute slots
            for (let time = startTime; time < endTime; time.setMinutes(time.getMinutes() + 30)) {
              const timeString = time.toTimeString().substring(0, 5);

              // Check if this time slot is already booked
              const isBooked = bookedAppointments.some((appointment: any) => {
                const appointmentTime = new Date(appointment.appointment_datetime)
                  .toTimeString().substring(0, 5);
                return appointmentTime === timeString;
              });

              if (!isBooked) {
                timeSlots.push(timeString);
              }
            }
          } else {
            // If no specific capacity data, use default business hours
            const defaultTimes = [
              '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
              '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
            ];

            // Filter out already booked times
            for (const time of defaultTimes) {
              const isBooked = bookedAppointments.some((appointment: any) => {
                const appointmentTime = new Date(appointment.appointment_datetime)
                  .toTimeString().substring(0, 5);
                return appointmentTime === time;
              });

              if (!isBooked) {
                timeSlots.push(time);
              }
            }
          }

          setAvailableTimes(timeSlots);
        } catch (err: any) {
          console.error('Error fetching available times:', err);
          setError('Failed to load available appointment times. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAvailableTimes();
    }
  }, [values.provider_id, values.appointment_date]);

  // Get tomorrow's date as the minimum date for appointment
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
              <p className="mt-2 text-gray-600">
                Schedule a new appointment with a healthcare provider.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/patient/appointments')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Appointments
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
                <div>
                  <label htmlFor="center_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Healthcare Center *
                  </label>
                  <Select
                    id="center_id"
                    name="center_id"
                    value={values.center_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: '', label: 'Select a healthcare center' },
                      ...centers.map(center => ({
                        value: center.id.toString(),
                        label: center.name
                      }))
                    ]}
                    error={touched.center_id && errors.center_id}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="provider_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Healthcare Provider *
                  </label>
                  <Select
                    id="provider_id"
                    name="provider_id"
                    value={values.provider_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: '', label: values.center_id ? 'Select a provider' : 'Please select a center first' },
                      ...providers.map(provider => ({
                        value: provider.id.toString(),
                        label: provider.name
                      }))
                    ]}
                    error={touched.provider_id && errors.provider_id}
                    disabled={!values.center_id || isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date *
                    </label>
                    <Input
                      id="appointment_date"
                      name="appointment_date"
                      type="date"
                      value={values.appointment_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={getTomorrowDate()}
                      error={touched.appointment_date && errors.appointment_date}
                      disabled={!values.provider_id || isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Time *
                    </label>
                    <Select
                      id="appointment_time"
                      name="appointment_time"
                      value={values.appointment_time}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={[
                        { value: '', label: values.appointment_date ? 'Select a time' : 'Please select a date first' },
                        ...availableTimes.map(time => ({
                          value: time,
                          label: time
                        }))
                      ]}
                      error={touched.appointment_time && errors.appointment_time}
                      disabled={!values.appointment_date || isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Appointment *
                  </label>
                  <Input
                    id="reason"
                    name="reason"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter the reason for your appointment"
                    error={touched.reason && errors.reason}
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter any additional information that might be helpful for the provider"
                    rows={4}
                    error={touched.notes && errors.notes}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/patient/appointments')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                  >
                    Book Appointment
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

export default PatientBookAppointment;
