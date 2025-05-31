import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks';
import { motion } from 'framer-motion';
import { usersAPI, consultationsAPI, appointmentsAPI } from '../../../services/api';

interface Patient {
  id: number;
  name: string;
}

interface ConsultationFormValues {
  patientId: string;
  appointmentId?: string;
  date: string;
  time: string;
  type: string;
  symptoms: string;
  provider_notes: string;
  diagnosis: string;
  treatment_plan: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  appointment_datetime: string;
  notes?: string;
  status: string;
}

const ProviderNewConsultationPage: React.FC = () => {
  const { user } = useAuth('Provider');
  const navigate = useNavigate();
  const location = useLocation();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get patient ID and appointment ID from query params if available
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromQuery = queryParams.get('patient');
  const appointmentIdFromQuery = queryParams.get('appointment');

  // Fetch appointment data if appointmentId is provided
  useEffect(() => {
    if (!appointmentIdFromQuery) return;

    const fetchAppointment = async () => {
      setIsDataLoading(true);
      setError(null);

      try {
        const response = await appointmentsAPI.getAppointmentById(Number(appointmentIdFromQuery));
        const appointmentData = response.data.data || response.data;

        setAppointment(appointmentData);

        // Pre-fill form with appointment data
        if (appointmentData) {
          const appointmentDate = new Date(appointmentData.appointment_datetime);

          // Format date and time for form inputs
          const formattedDate = appointmentDate.toISOString().split('T')[0];
          const formattedTime = appointmentDate.toTimeString().slice(0, 5);

          // Update form values
          handleChange({
            target: {
              name: 'date',
              value: formattedDate
            }
          } as React.ChangeEvent<HTMLInputElement>);

          handleChange({
            target: {
              name: 'time',
              value: formattedTime
            }
          } as React.ChangeEvent<HTMLInputElement>);

          if (appointmentData.notes) {
            handleChange({
              target: {
                name: 'provider_notes',
                value: appointmentData.notes
              }
            } as React.ChangeEvent<HTMLTextAreaElement>);
          }

          handleChange({
            target: {
              name: 'appointmentId',
              value: appointmentData.id.toString()
            }
          } as React.ChangeEvent<HTMLInputElement>);
        }
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError('Failed to load appointment data. Please try again.');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentIdFromQuery]);

  // Fetch patients data from API
  useEffect(() => {
    const fetchPatients = async () => {
      setIsDataLoading(true);
      setError(null);

      try {
        // Use the provider-specific endpoint to get patients
        const response = await usersAPI.getMyPatients();
        console.log('My patients response:', response.data);

        const patientsData = response.data.data || response.data;

        // Process patients data
        const processedPatients: Patient[] = patientsData.map((patient: any) => ({
          id: patient.id,
          name: patient.name
        }));

        setPatients(processedPatients);

        // If we have an appointment with a patient_id, select that patient
        if (appointment && appointment.patient_id) {
          handleChange({
            target: {
              name: 'patientId',
              value: appointment.patient_id.toString()
            }
          } as React.ChangeEvent<HTMLSelectElement>);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again.');

        // Fallback to regular users API if the provider-specific endpoint fails
        try {
          const fallbackResponse = await usersAPI.getUsers({ role: 'Patient' });
          const fallbackData = fallbackResponse.data.data || fallbackResponse.data;

          // Process patients data
          const fallbackPatients: Patient[] = fallbackData.map((patient: any) => ({
            id: patient.id,
            name: patient.name
          }));

          setPatients(fallbackPatients);
          setError('Using limited patient data.');

          // If we have an appointment with a patient_id, select that patient
          if (appointment && appointment.patient_id) {
            handleChange({
              target: {
                name: 'patientId',
                value: appointment.patient_id.toString()
              }
            } as React.ChangeEvent<HTMLSelectElement>);
          }
        } catch (fallbackErr) {
          console.error('Fallback error fetching patients:', fallbackErr);
          setError('Failed to load patients. Please try again later.');
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchPatients();
  }, [appointment]);

  // Form validation
  const validateForm = (values: ConsultationFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.patientId) {
      errors.patientId = 'Please select a patient';
    }

    if (!values.date) {
      errors.date = 'Please select a date';
    }

    if (!values.time) {
      errors.time = 'Please select a time';
    }

    if (!values.type) {
      errors.type = 'Please select a consultation type';
    }

    if (!values.symptoms.trim()) {
      errors.symptoms = 'Please enter symptoms';
    }

    // These fields are optional according to the API validation rules
    // but we can add validation if needed

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values: ConsultationFormValues, resetForm: () => void) => {
    if (!user?.id) return;

    setIsDataLoading(true);
    setError(null);

    try {
      console.log('Creating consultation:', values);

      // Combine date and time
      const dateTime = new Date(`${values.date}T${values.time}`);

      // Prepare consultation data
      const consultationData: any = {
        patient_id: Number(values.patientId),
        provider_id: user.id,
        start_time: dateTime.toISOString(),
        consultation_type: values.type,
        symptoms: values.symptoms,
        provider_notes: values.provider_notes,
        diagnosis: values.diagnosis,
        treatment_plan: values.treatment_plan,
        status: 'in-progress' // Start the consultation immediately with valid status
      };

      // If this consultation is linked to an appointment, include the appointment_id
      if (values.appointmentId) {
        consultationData.appointment_id = Number(values.appointmentId);

        // Also update the appointment status to 'completed'
        try {
          await appointmentsAPI.updateAppointment(Number(values.appointmentId), {
            status: 'completed',
            notes: appointment?.notes ? `${appointment.notes}\nConsultation completed on ${new Date().toLocaleDateString()}.` : `Consultation completed on ${new Date().toLocaleDateString()}.`
          });
        } catch (appointmentErr) {
          console.error('Error updating appointment status:', appointmentErr);
          // Continue with consultation creation even if appointment update fails
        }
      }

      // Create consultation
      const response = await consultationsAPI.createConsultation(consultationData);
      console.log('Consultation created:', response.data);

      setSuccess('Consultation created successfully');

      // Reset form
      resetForm();

      // Redirect to consultations list after 2 seconds
      setTimeout(() => {
        navigate('/provider/consultations');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating consultation:', err);
      setError(err.response?.data?.message || 'Failed to create consultation. Please try again.');
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initialize form with default values
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting } = useForm<ConsultationFormValues>(
    {
      patientId: patientIdFromQuery || '',
      appointmentId: appointmentIdFromQuery || undefined,
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'initial',
      symptoms: '',
      provider_notes: '',
      diagnosis: '',
      treatment_plan: ''
    },
    handleSubmit,
    validateForm
  );

  // Consultation type options
  const consultationTypeOptions = [
    { value: 'initial', label: 'Initial Consultation' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'specialist', label: 'Specialist Referral' }
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
              <h1 className="text-3xl font-bold text-gray-900">New Consultation</h1>
              <p className="mt-2 text-gray-600">
                Create a new consultation record for a patient.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/provider/consultations')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Consultations
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
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <Select
                    id="patientId"
                    name="patientId"
                    value={values.patientId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: '', label: 'Select a patient' },
                      ...patients.map(patient => ({
                        value: patient.id.toString(),
                        label: patient.name
                      }))
                    ]}
                    error={touched.patientId && errors.patientId ? errors.patientId : undefined}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={new Date().toISOString().split('T')[0]}
                      error={touched.date && errors.date ? errors.date : undefined}
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={values.time}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.time && errors.time ? errors.time : undefined}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Type
                  </label>
                  <Select
                    id="type"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={consultationTypeOptions}
                    error={touched.type && errors.type ? errors.type : undefined}
                  />
                </div>

                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms
                  </label>
                  <Textarea
                    id="symptoms"
                    name="symptoms"
                    value={values.symptoms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter patient symptoms"
                    rows={3}
                    error={touched.symptoms && errors.symptoms ? errors.symptoms : undefined}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter symptoms separated by commas.
                  </p>
                </div>

                <div>
                  <label htmlFor="provider_notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Provider Notes
                  </label>
                  <Textarea
                    id="provider_notes"
                    name="provider_notes"
                    value={values.provider_notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter provider notes"
                    rows={4}
                    error={touched.provider_notes && errors.provider_notes ? errors.provider_notes : undefined}
                  />
                </div>

                <div>
                  <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={values.diagnosis}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter diagnosis"
                    rows={3}
                    error={touched.diagnosis && errors.diagnosis ? errors.diagnosis : undefined}
                  />
                </div>

                <div>
                  <label htmlFor="treatment_plan" className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment Plan
                  </label>
                  <Textarea
                    id="treatment_plan"
                    name="treatment_plan"
                    value={values.treatment_plan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter treatment plan"
                    rows={4}
                    error={touched.treatment_plan && errors.treatment_plan ? errors.treatment_plan : undefined}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/provider/consultations')}
                    disabled={isDataLoading || isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isDataLoading || isSubmitting}
                  >
                    Create Consultation
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

export default ProviderNewConsultationPage;
