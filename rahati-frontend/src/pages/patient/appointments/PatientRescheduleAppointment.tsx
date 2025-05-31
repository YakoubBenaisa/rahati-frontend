import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert, Input } from '../../../components/ui';
import { useAppointmentStore } from '../../../store';
import { serviceCapacityAPI, appointmentsAPI } from '../../../services/api';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const PatientRescheduleAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedAppointment: appointment,
    fetchAppointmentById,
    updateAppointment,
    isLoading: appointmentLoading,
    error: appointmentError
  } = useAppointmentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAppointmentById(Number(id));
    }
  }, [id, fetchAppointmentById]);

  // Generate available dates when appointment is loaded
  useEffect(() => {
    if (appointment) {
      // Generate available dates (next 14 days)
      const dates = [];
      const today = new Date();
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }

      setAvailableDates(dates);
      setError(appointmentError || null);
    }
  }, [appointment, appointmentError]);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time from datetime string
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle date selection
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setIsLoading(true);

    try {
      if (appointment?.center_id && appointment?.provider_id) {
        // Fetch service capacity for the selected date, center, and provider
        const capacityResponse = await serviceCapacityAPI.getServiceCapacities({
          center_id: appointment.center_id,
          provider_id: appointment.provider_id,
          date: date,
          service_type: 'appointment'
        });

        const capacityData = capacityResponse.data.data || capacityResponse.data;

        // Fetch existing appointments for the provider on the selected date
        const appointmentsResponse = await appointmentsAPI.getAppointments({
          provider_id: appointment.provider_id,
          date: date,
          status: 'scheduled'
        });

        const bookedAppointments = appointmentsResponse.data.data || appointmentsResponse.data;

        // Generate available time slots based on capacity and booked appointments
        const availableSlots = [];

        if (capacityData.length > 0) {
          const capacity = capacityData[0];
          const startTime = new Date(`${date}T${capacity.start_time || '09:00:00'}`);
          const endTime = new Date(`${date}T${capacity.end_time || '17:00:00'}`);
          const slotDuration = 30; // minutes

          for (let time = startTime; time < endTime; time.setMinutes(time.getMinutes() + slotDuration)) {
            const slotTime = new Date(time);
            const timeString = slotTime.toTimeString().substring(0, 5);

            // Check if this time slot is already booked
            const isBooked = bookedAppointments.some((appt: any) => {
              const apptTime = new Date(appt.appointment_datetime).toTimeString().substring(0, 5);
              return apptTime === timeString && appt.id !== appointment.id; // Exclude current appointment
            });

            availableSlots.push({
              id: slotTime.toISOString(),
              time: slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              available: !isBooked
            });
          }
        } else {
          // If no specific capacity data, use default business hours
          const startTime = new Date(`${date}T09:00:00`);
          const endTime = new Date(`${date}T17:00:00`);
          const slotDuration = 30; // minutes

          for (let time = startTime; time < endTime; time.setMinutes(time.getMinutes() + slotDuration)) {
            const slotTime = new Date(time);
            const timeString = slotTime.toTimeString().substring(0, 5);

            // Check if this time slot is already booked
            const isBooked = bookedAppointments.some((appt: any) => {
              const apptTime = new Date(appt.appointment_datetime).toTimeString().substring(0, 5);
              return apptTime === timeString && appt.id !== appointment.id; // Exclude current appointment
            });

            availableSlots.push({
              id: slotTime.toISOString(),
              time: slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              available: !isBooked
            });
          }
        }

        setTimeSlots(availableSlots);
      }
    } catch (error: any) {
      console.error('Error fetching time slots:', error);
      setError(error.message || 'Failed to load available time slots. Please try again.');
    } finally {
      setIsLoading(false);
    }

    setSelectedTimeSlot('');
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot || !appointment) {
      setError('Please select a date and time for your appointment');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create the appointment datetime from selected date and time slot
      const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
      if (!selectedSlot) {
        throw new Error('Selected time slot not found');
      }

      // Parse the time from the selected slot
      const [hours, minutes] = selectedSlot.time.match(/(\d+):(\d+)/)?.slice(1).map(Number) || [0, 0];
      const isPM = selectedSlot.time.toLowerCase().includes('pm');

      // Create a new date object with the selected date and time
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(isPM && hours !== 12 ? hours + 12 : hours);
      appointmentDateTime.setMinutes(minutes);

      // Update the appointment with the new datetime
      await updateAppointment(appointment.id, {
        appointment_datetime: appointmentDateTime.toISOString(),
        status: 'scheduled'
      });

      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/patient/appointments/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setError('Failed to reschedule appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            to={`/patient/appointments/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-primary-600"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Appointment Details
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

        {success && (
          <Alert
            variant="success"
            title="Appointment Rescheduled"
            message="Your appointment has been successfully rescheduled. Redirecting to appointment details..."
            className="mb-6"
          />
        )}

        {isLoading || appointmentLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : appointment ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Reschedule Appointment
                </h1>
                <p className="mt-1 text-gray-600">
                  Select a new date and time for your appointment with {appointment.provider?.name || 'your provider'}
                </p>
              </div>

              <div className="p-6">
                {/* Current appointment info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Appointment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="text-gray-900">
                        {formatDate(appointment.appointment_datetime)} at {formatTime(appointment.appointment_datetime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="text-gray-900">
                        {appointment.provider?.name || 'Provider not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">
                        {appointment.center?.name || 'Center not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Date selection */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a New Date</h2>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={availableDates[0]}
                      max={availableDates[availableDates.length - 1]}
                      required
                      className="max-w-xs"
                    />
                  </div>

                  {/* Time slots */}
                  {selectedDate && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Time Slot</h2>
                      {isLoading ? (
                        <div className="animate-pulse space-y-3">
                          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              className={`p-3 rounded-md border text-center ${
                                !slot.available
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : selectedTimeSlot === slot.id
                                  ? 'bg-primary-100 text-primary-700 border-primary-300'
                                  : 'bg-white text-gray-900 border-gray-200 hover:border-primary-300'
                              }`}
                              onClick={() => slot.available && handleTimeSlotSelect(slot.id)}
                              disabled={!slot.available}
                            >
                              {slot.time}
                              {!slot.available && <div className="text-xs">(Unavailable)</div>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="mt-8 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      disabled={!selectedDate || !selectedTimeSlot || isSubmitting || success}
                    >
                      Confirm Reschedule
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
            <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Appointment Not Found</h4>
            <p className="text-gray-600 mb-4">
              The appointment you're trying to reschedule doesn't exist or you don't have permission to modify it.
            </p>
            <Button
              as={Link}
              to="/patient/appointments"
              variant="primary"
            >
              Back to Appointments
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PatientRescheduleAppointment;
