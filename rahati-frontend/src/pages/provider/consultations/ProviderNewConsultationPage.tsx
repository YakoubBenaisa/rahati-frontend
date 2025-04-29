import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Select, Textarea, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks';
import { motion } from 'framer-motion';

interface Patient {
  id: number;
  name: string;
}

interface ConsultationFormValues {
  patientId: string;
  date: string;
  time: string;
  type: string;
  symptoms: string;
  notes: string;
}

const ProviderNewConsultationPage: React.FC = () => {
  const { user } = useAuth('Provider');
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get patient ID from query params if available
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromQuery = queryParams.get('patient');

  // Mock fetch patients data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPatients: Patient[] = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Robert Johnson' },
        { id: 4, name: 'Emily Davis' },
        { id: 5, name: 'Michael Wilson' }
      ];
      setPatients(mockPatients);
    }, 500);
  }, []);

  // Form validation
  const validateForm = (values: ConsultationFormValues) => {
    const errors: Partial<Record<keyof ConsultationFormValues, string>> = {};
    
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
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = (values: ConsultationFormValues, resetForm: () => void) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        console.log('Creating consultation:', values);
        
        // Mock successful response
        setSuccess('Consultation created successfully');
        setIsLoading(false);
        
        // Reset form
        resetForm();
        
        // Redirect to consultations list after 2 seconds
        setTimeout(() => {
          navigate('/provider/consultations');
        }, 2000);
      } catch (err) {
        setError('Failed to create consultation. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  // Initialize form with default values
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting } = useForm<ConsultationFormValues>(
    {
      patientId: patientIdFromQuery || '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'initial',
      symptoms: '',
      notes: ''
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
                    error={touched.patientId && errors.patientId}
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
                      error={touched.date && errors.date}
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
                      error={touched.time && errors.time}
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
                    error={touched.type && errors.type}
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
                    error={touched.symptoms && errors.symptoms}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter symptoms separated by commas.
                  </p>
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
                    placeholder="Enter any additional notes"
                    rows={4}
                    error={touched.notes && errors.notes}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/provider/consultations')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
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
