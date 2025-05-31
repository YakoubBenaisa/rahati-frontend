import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert } from '../../../components/ui';
import { useForm } from '../../../hooks';
import { motion } from 'framer-motion';
import { appointmentsAPI, centersAPI, accommodationsAPI, roomsAPI, mealOptionsAPI } from '../../../services/api';

interface RoomType {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  isAccessible: boolean;
  maxGuests: number;
}

interface MealOption {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface BookAccommodationFormValues {
  appointment_id: string;
  center_id: string;
  room_type_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: string;
  meal_option_id: string;
  special_requests: string;
}

const PatientBookAccommodation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<{ id: number; date: string; center: string; centerId: number }[]>([]);
  const [centers, setCenters] = useState<{ id: number; name: string }[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [mealOptions, setMealOptions] = useState<MealOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Get appointment ID from query params if available
  const queryParams = new URLSearchParams(location.search);
  const appointmentIdFromQuery = queryParams.get('appointment');

  // Fetch appointments data from API
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get user's appointments
        const response = await appointmentsAPI.getAppointments({ status: 'scheduled' });
        const data = response.data.data || response.data;

        // Transform API data to match our interface
        const formattedData = data.map((item: any) => ({
          id: item.id,
          date: item.date,
          center: item.center?.name || 'Unknown Center',
          centerId: item.center_id
        }));

        setAppointments(formattedData);

        // If appointment ID is provided in query, set center ID based on that appointment
        if (appointmentIdFromQuery) {
          const appointment = formattedData.find((a: { id: number; }) => a.id === Number(appointmentIdFromQuery));
          if (appointment) {
            setFieldValue('center_id', appointment.centerId.toString());
          }
        }
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
        setError(err.response?.data?.message || 'Failed to load appointments. Please try again.');
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [appointmentIdFromQuery]);

  // Fetch centers data from API
  useEffect(() => {
    const fetchCenters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await centersAPI.getCenters();
        const data = response.data.data || response.data;

        // Transform API data to match our interface
        const formattedData = data.map((item: any) => ({
          id: item.id,
          name: item.name
        }));

        setCenters(formattedData);
      } catch (err: any) {
        console.error('Error fetching centers:', err);
        setError(err.response?.data?.message || 'Failed to load healthcare centers. Please try again.');
        setCenters([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Form validation and submission functions will be defined later
  let validateForm: (values: BookAccommodationFormValues) => Partial<Record<keyof BookAccommodationFormValues, string>>;
  let handleSubmit: (values: BookAccommodationFormValues, resetForm: () => void) => Promise<void>;

  // Initialize form with default values - we'll define the functions after this
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting, setFieldValue } = useForm<BookAccommodationFormValues>(
    {
      appointment_id: appointmentIdFromQuery || '',
      center_id: '',
      room_type_id: '',
      check_in_date: '',
      check_out_date: '',
      number_of_guests: '1',
      meal_option_id: '',
      special_requests: ''
    },
    (values, resetForm) => handleSubmit(values, resetForm),
    (values) => validateForm(values)
  );

  // Fetch room types when center changes
  useEffect(() => {
    if (values.center_id) {
      setRoomTypes([]);
      setIsLoading(true);

      const fetchRoomTypes = async () => {
        try {
          const response = await roomsAPI.getRooms({ center_id: values.center_id });
          const data = response.data.data || response.data;

          // Transform API data to match our interface
          const formattedData = data.map((item: any) => ({
            id: item.id,
            name: item.name || 'Standard Room',
            description: item.description || 'No description available',
            pricePerNight: item.price_per_night || 0,
            isAccessible: item.is_accessible || false,
            maxGuests: item.max_guests || 2
          }));

          setRoomTypes(formattedData);
        } catch (err: any) {
          console.error('Error fetching room types:', err);
          setError(err.response?.data?.message || 'Failed to load room types. Please try again.');
          setRoomTypes([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRoomTypes();
    }
  }, [values.center_id]);

  // Fetch meal options when center changes
  useEffect(() => {
    if (values.center_id) {
      setMealOptions([]);
      setIsLoading(true);

      const fetchMealOptions = async () => {
        try {
          const response = await mealOptionsAPI.getMealOptions({ center_id: values.center_id });
          const data = response.data.data || response.data;

          // Transform API data to match our interface
          const formattedData = data.map((item: any) => ({
            id: item.id,
            name: item.name || 'No Meals',
            description: item.description || 'No description available',
            price: item.price || 0
          }));

          setMealOptions(formattedData);
        } catch (err: any) {
          console.error('Error fetching meal options:', err);
          setError(err.response?.data?.message || 'Failed to load meal options. Please try again.');
          setMealOptions([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMealOptions();
    }
  }, [values.center_id]);

  // Calculate total price
  useEffect(() => {
    if (values.room_type_id && values.check_in_date && values.check_out_date) {
      const roomType = roomTypes.find(rt => rt.id.toString() === values.room_type_id);
      const mealOption = values.meal_option_id
        ? mealOptions.find(mo => mo.id.toString() === values.meal_option_id)
        : null;

      if (roomType) {
        const checkInDate = new Date(values.check_in_date);
        const checkOutDate = new Date(values.check_out_date);
        const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

        let price = roomType.pricePerNight * nights;
        if (mealOption) {
          price += mealOption.price;
        }

        setTotalPrice(price);
      }
    } else {
      setTotalPrice(0);
    }
  }, [values.room_type_id, values.check_in_date, values.check_out_date, values.meal_option_id, roomTypes, mealOptions]);

  // Define the validation function
  validateForm = (values: BookAccommodationFormValues) => {
    const errors: Partial<Record<keyof BookAccommodationFormValues, string>> = {};

    if (!values.appointment_id) {
      errors.appointment_id = 'Please select an appointment';
    }

    if (!values.center_id) {
      errors.center_id = 'Please select a healthcare center';
    }

    if (!values.room_type_id) {
      errors.room_type_id = 'Please select a room type';
    }

    if (!values.check_in_date) {
      errors.check_in_date = 'Please select a check-in date';
    }

    if (!values.check_out_date) {
      errors.check_out_date = 'Please select a check-out date';
    } else if (values.check_in_date && new Date(values.check_out_date) <= new Date(values.check_in_date)) {
      errors.check_out_date = 'Check-out date must be after check-in date';
    }

    if (!values.number_of_guests) {
      errors.number_of_guests = 'Please enter the number of guests';
    } else {
      const guests = parseInt(values.number_of_guests);
      const roomType = roomTypes.find(rt => rt.id.toString() === values.room_type_id);

      if (isNaN(guests) || guests < 1) {
        errors.number_of_guests = 'Number of guests must be at least 1';
      } else if (roomType && guests > roomType.maxGuests) {
        errors.number_of_guests = `Maximum ${roomType.maxGuests} guests allowed for this room type`;
      }
    }

    return errors;
  };

  // Define the submission function
  handleSubmit = async (values: BookAccommodationFormValues, resetForm: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Booking accommodation:', values);

      // Create accommodation booking data
      const bookingData = {
        appointment_id: parseInt(values.appointment_id),
        center_id: parseInt(values.center_id),
        room_type_id: parseInt(values.room_type_id),
        check_in_date: values.check_in_date,
        check_out_date: values.check_out_date,
        number_of_guests: parseInt(values.number_of_guests),
        meal_option_id: values.meal_option_id ? parseInt(values.meal_option_id) : null,
        special_requests: values.special_requests
      };

      // Call API to book accommodation
      await accommodationsAPI.bookAccommodation(bookingData);

      setSuccess('Accommodation booked successfully');
      resetForm();

      // Redirect to accommodations list after 2 seconds
      setTimeout(() => {
        navigate('/patient/accommodations');
      }, 2000);
    } catch (err: any) {
      console.error('Error booking accommodation:', err);
      setError(err.response?.data?.message || 'Failed to book accommodation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  // Get tomorrow's date as the minimum date for check-in
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Handle appointment selection
  const handleAppointmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const appointmentId = e.target.value;
    setFieldValue('appointment_id', appointmentId);

    // Set center based on selected appointment
    if (appointmentId) {
      const appointment = appointments.find(a => a.id.toString() === appointmentId);
      if (appointment) {
        setFieldValue('center_id', appointment.centerId.toString());

        // Set check-in date to day before appointment
        const appointmentDate = new Date(appointment.date);
        const checkInDate = new Date(appointmentDate);
        checkInDate.setDate(appointmentDate.getDate() - 1);
        setFieldValue('check_in_date', checkInDate.toISOString().split('T')[0]);

        // Set check-out date to day after appointment
        const checkOutDate = new Date(appointmentDate);
        checkOutDate.setDate(appointmentDate.getDate() + 1);
        setFieldValue('check_out_date', checkOutDate.toISOString().split('T')[0]);
      }
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Book Accommodation</h1>
              <p className="mt-2 text-gray-600">
                Book accommodation for your healthcare appointment.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/patient/accommodations')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Accommodations
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <form onSubmit={submitForm}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="appointment_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment *
                    </label>
                    <Select
                      id="appointment_id"
                      name="appointment_id"
                      value={values.appointment_id}
                      onChange={handleAppointmentChange}
                      onBlur={handleBlur}
                      options={[
                        { value: '', label: 'Select an appointment' },
                        ...appointments.map(appointment => ({
                          value: appointment.id.toString(),
                          label: `${new Date(appointment.date).toLocaleDateString()} - ${appointment.center}`
                        }))
                      ]}
                      error={touched.appointment_id && errors.appointment_id ? errors.appointment_id : undefined}
                      disabled={isLoading || !!appointmentIdFromQuery}
                    />
                  </div>

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
                      error={touched.center_id && errors.center_id ? errors.center_id : undefined}
                      disabled={isLoading || !!values.appointment_id}
                    />
                  </div>

                  <div>
                    <label htmlFor="room_type_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <Select
                      id="room_type_id"
                      name="room_type_id"
                      value={values.room_type_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={[
                        { value: '', label: values.center_id ? 'Select a room type' : 'Please select a center first' },
                        ...roomTypes.map(roomType => ({
                          value: roomType.id.toString(),
                          label: `${roomType.name} - $${roomType.pricePerNight.toFixed(2)}/night${roomType.isAccessible ? ' (Accessible)' : ''}`
                        }))
                      ]}
                      error={touched.room_type_id && errors.room_type_id ? errors.room_type_id : undefined}
                      disabled={!values.center_id || isLoading}
                    />
                    {values.room_type_id && (
                      <p className="mt-1 text-sm text-gray-500">
                        {roomTypes.find(rt => rt.id.toString() === values.room_type_id)?.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="check_in_date" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date *
                      </label>
                      <Input
                        id="check_in_date"
                        name="check_in_date"
                        type="date"
                        value={values.check_in_date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={getTomorrowDate()}
                        error={touched.check_in_date && errors.check_in_date ? errors.check_in_date : undefined}
                        disabled={isLoading || !!values.appointment_id}
                      />
                    </div>

                    <div>
                      <label htmlFor="check_out_date" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date *
                      </label>
                      <Input
                        id="check_out_date"
                        name="check_out_date"
                        type="date"
                        value={values.check_out_date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={values.check_in_date || getTomorrowDate()}
                        error={touched.check_out_date && errors.check_out_date ? errors.check_out_date : undefined}
                        disabled={isLoading || !!values.appointment_id}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="number_of_guests" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests *
                      </label>
                      <Input
                        id="number_of_guests"
                        name="number_of_guests"
                        type="number"
                        min="1"
                        max={values.room_type_id ? roomTypes.find(rt => rt.id.toString() === values.room_type_id)?.maxGuests : undefined}
                        value={values.number_of_guests}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.number_of_guests && errors.number_of_guests ? errors.number_of_guests : undefined}
                      />
                    </div>

                    <div>
                      <label htmlFor="meal_option_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Meal Option
                      </label>
                      <Select
                        id="meal_option_id"
                        name="meal_option_id"
                        value={values.meal_option_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={[
                          { value: '', label: values.center_id ? 'Select a meal option' : 'Please select a center first' },
                          ...mealOptions.map(option => ({
                            value: option.id.toString(),
                            label: `${option.name}${option.price > 0 ? ` - $${option.price.toFixed(2)}` : ''}`
                          }))
                        ]}
                        error={touched.meal_option_id && errors.meal_option_id ? errors.meal_option_id : undefined}
                        disabled={!values.center_id || isLoading}
                      />
                      {values.meal_option_id && (
                        <p className="mt-1 text-sm text-gray-500">
                          {mealOptions.find(mo => mo.id.toString() === values.meal_option_id)?.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <Textarea
                      id="special_requests"
                      name="special_requests"
                      value={values.special_requests}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter any special requests or requirements"
                      rows={4}
                      error={touched.special_requests && errors.special_requests ? errors.special_requests : undefined}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/patient/accommodations')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                    >
                      Book Accommodation
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
          >
            <Card title="Booking Summary">
              <div className="space-y-4">
                {values.center_id && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Healthcare Center</h3>
                    <p className="mt-1 text-gray-900">
                      {centers.find(c => c.id.toString() === values.center_id)?.name || 'Not selected'}
                    </p>
                  </div>
                )}

                {values.room_type_id && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Room Type</h3>
                    <p className="mt-1 text-gray-900">
                      {roomTypes.find(rt => rt.id.toString() === values.room_type_id)?.name || 'Not selected'}
                    </p>
                  </div>
                )}

                {values.check_in_date && values.check_out_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Stay Duration</h3>
                    <p className="mt-1 text-gray-900">
                      {new Date(values.check_in_date).toLocaleDateString()} to {new Date(values.check_out_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {values.meal_option_id && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Meal Option</h3>
                    <p className="mt-1 text-gray-900">
                      {mealOptions.find(mo => mo.id.toString() === values.meal_option_id)?.name || 'Not selected'}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Total Price</h3>
                    <span className="text-xl font-bold text-primary-600">${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {totalPrice > 0 ? 'Price includes room and selected meal option.' : 'Select room type and dates to see total price.'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientBookAccommodation;
