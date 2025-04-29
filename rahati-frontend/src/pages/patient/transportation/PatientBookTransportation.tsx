import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert, Input, Select, Textarea } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useTransportationStore, useAppointmentStore } from '../../../store';
import { Appointment } from '../../../types';

interface BookTransportationFormValues {
  appointment_id: number | null;
  pickup_location: string;
  dropoff_location: string;
  pickup_time: string;
  vehicle_type: string;
  passenger_count: number;
  special_requirements?: string;
}

const PatientBookTransportation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  
  const { user } = useAuth('Patient');
  const { 
    createTransportationRequest, 
    isLoading: transportationLoading, 
    error: transportationError 
  } = useTransportationStore();
  
  const { 
    appointments, 
    fetchAppointments, 
    isLoading: appointmentsLoading 
  } = useAppointmentStore();
  
  const [formValues, setFormValues] = useState<BookTransportationFormValues>({
    appointment_id: appointmentId ? Number(appointmentId) : null,
    pickup_location: '',
    dropoff_location: '',
    pickup_time: '',
    vehicle_type: 'sedan',
    passenger_count: 1,
    special_requirements: ''
  });
  
  const [errors, setErrors] = useState<Partial<BookTransportationFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's appointments for the dropdown
  useEffect(() => {
    if (user?.id) {
      fetchAppointments({ patient_id: user.id, status: 'scheduled' });
    }
  }, [fetchAppointments, user]);

  // Pre-fill dropoff location if appointment is selected
  useEffect(() => {
    if (formValues.appointment_id) {
      const selectedAppointment = appointments.find(a => a.id === formValues.appointment_id);
      if (selectedAppointment?.center?.name) {
        setFormValues(prev => ({
          ...prev,
          dropoff_location: selectedAppointment.center.name + (selectedAppointment.center.address ? `, ${selectedAppointment.center.address}` : '')
        }));
      }
    }
  }, [formValues.appointment_id, appointments]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'appointment_id') {
      setFormValues({
        ...formValues,
        [name]: value ? Number(value) : null
      });
    } else if (name === 'passenger_count') {
      setFormValues({
        ...formValues,
        [name]: Number(value)
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name as keyof BookTransportationFormValues]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Validate form
  const validateForm = (): Partial<BookTransportationFormValues> => {
    const newErrors: Partial<BookTransportationFormValues> = {};
    
    if (!formValues.pickup_location) {
      newErrors.pickup_location = 'Pickup location is required';
    }
    
    if (!formValues.dropoff_location) {
      newErrors.dropoff_location = 'Dropoff location is required';
    }
    
    if (!formValues.pickup_time) {
      newErrors.pickup_time = 'Pickup time is required';
    }
    
    if (!formValues.vehicle_type) {
      newErrors.vehicle_type = 'Vehicle type is required';
    }
    
    if (!formValues.passenger_count || formValues.passenger_count < 1) {
      newErrors.passenger_count = 'At least 1 passenger is required';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createTransportationRequest({
        ...formValues,
        status: 'pending'
      });
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/patient/transportation');
      }, 2000);
    } catch (err) {
      console.error('Error creating transportation request:', err);
      setError('Failed to create transportation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for min attribute
  const getTodayFormatted = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Format datetime for min attribute
  const getNowFormatted = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            to="/patient/transportation"
            className="inline-flex items-center text-gray-600 hover:text-primary-600"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Transportation Requests
          </Link>
        </div>

        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {transportationError && (
          <Alert
            variant="error"
            title="Error"
            message={transportationError}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            title="Success"
            message="Your transportation request has been submitted successfully. Redirecting to transportation requests..."
            className="mb-6"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">
                Request Transportation
              </h1>
              <p className="mt-1 text-gray-600">
                Fill out the form below to request transportation service.
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Related appointment */}
                <div className="mb-6">
                  <label htmlFor="appointment_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Related Appointment (Optional)
                  </label>
                  <Select
                    id="appointment_id"
                    name="appointment_id"
                    value={formValues.appointment_id?.toString() || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  >
                    <option value="">-- Select an appointment --</option>
                    {appointmentsLoading ? (
                      <option disabled>Loading appointments...</option>
                    ) : appointments.length === 0 ? (
                      <option disabled>No upcoming appointments found</option>
                    ) : (
                      appointments
                        .filter(a => a.status === 'scheduled')
                        .map(appointment => (
                          <option key={appointment.id} value={appointment.id.toString()}>
                            {new Date(appointment.appointment_datetime).toLocaleDateString()} - {appointment.center?.name || 'Unknown Center'}
                          </option>
                        ))
                    )}
                  </Select>
                  <p className="mt-1 text-sm text-gray-500">
                    Linking to an appointment will help us coordinate your transportation with your healthcare visit.
                  </p>
                </div>

                {/* Pickup and dropoff locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="pickup_location" className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location*
                    </label>
                    <Input
                      id="pickup_location"
                      name="pickup_location"
                      type="text"
                      value={formValues.pickup_location}
                      onChange={handleInputChange}
                      placeholder="Enter pickup address"
                      required
                      error={errors.pickup_location}
                    />
                  </div>
                  <div>
                    <label htmlFor="dropoff_location" className="block text-sm font-medium text-gray-700 mb-1">
                      Dropoff Location*
                    </label>
                    <Input
                      id="dropoff_location"
                      name="dropoff_location"
                      type="text"
                      value={formValues.dropoff_location}
                      onChange={handleInputChange}
                      placeholder="Enter dropoff address"
                      required
                      error={errors.dropoff_location}
                    />
                  </div>
                </div>

                {/* Pickup time */}
                <div className="mb-6">
                  <label htmlFor="pickup_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Date & Time*
                  </label>
                  <Input
                    id="pickup_time"
                    name="pickup_time"
                    type="datetime-local"
                    value={formValues.pickup_time}
                    onChange={handleInputChange}
                    min={getNowFormatted()}
                    required
                    error={errors.pickup_time}
                  />
                </div>

                {/* Vehicle type and passenger count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type*
                    </label>
                    <Select
                      id="vehicle_type"
                      name="vehicle_type"
                      value={formValues.vehicle_type}
                      onChange={handleInputChange}
                      required
                      error={errors.vehicle_type}
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="van">Van</option>
                      <option value="wheelchair_accessible">Wheelchair Accessible</option>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="passenger_count" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Passengers*
                    </label>
                    <Input
                      id="passenger_count"
                      name="passenger_count"
                      type="number"
                      min="1"
                      max="10"
                      value={formValues.passenger_count}
                      onChange={handleInputChange}
                      required
                      error={errors.passenger_count}
                    />
                  </div>
                </div>

                {/* Special requirements */}
                <div className="mb-6">
                  <label htmlFor="special_requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements (Optional)
                  </label>
                  <Textarea
                    id="special_requirements"
                    name="special_requirements"
                    value={formValues.special_requirements || ''}
                    onChange={handleInputChange}
                    placeholder="Enter any special requirements or notes for your transportation"
                    rows={4}
                  />
                </div>

                {/* Submit button */}
                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || success}
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PatientBookTransportation;
