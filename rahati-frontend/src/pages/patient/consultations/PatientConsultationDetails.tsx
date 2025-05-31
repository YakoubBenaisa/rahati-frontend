import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Alert } from '../../../components/ui';
import { motion } from 'framer-motion';
import { consultationsAPI } from '../../../services/api';

interface ConsultationDetails {
  id: number;
  date: string;
  time: string;
  provider: {
    id: number;
    name: string;
    specialty: string;
    imageUrl?: string;
  };
  center: {
    id: number;
    name: string;
    address: string;
  };
  status: 'active' | 'completed' | 'cancelled';
  diagnosis?: string;
  symptoms: string[];
  treatmentPlan?: string;
  medications: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
}

const PatientConsultationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch consultation data from API
  useEffect(() => {
    const fetchConsultationDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsAPI.getConsultationById(parseInt(id));
        const data = response.data.data || response.data;

        // Transform API data to match our interface
        const formattedData: ConsultationDetails = {
          id: data.id,
          date: data.date,
          time: data.time || '12:00',
          provider: {
            id: data.provider?.id || 0,
            name: data.provider?.name || 'Unknown Provider',
            specialty: data.provider?.specialty || 'General',
            imageUrl: data.provider?.image_url
          },
          center: {
            id: data.center?.id || 0,
            name: data.center?.name || 'Unknown Center',
            address: data.center?.address || 'No address available'
          },
          status: data.status || 'active',
          diagnosis: data.diagnosis,
          symptoms: data.symptoms || [],
          treatmentPlan: data.treatment_plan,
          medications: data.medications?.map((med: any) => ({
            name: med.name,
            dosage: med.dosage,
            instructions: med.instructions
          })) || [],
          followUpRequired: data.follow_up_required || false,
          followUpDate: data.follow_up_date,
          notes: data.notes
        };

        setConsultation(formattedData);
      } catch (err: any) {
        console.error('Error fetching consultation details:', err);
        setError(err.response?.data?.message || 'Failed to load consultation details. Please try again.');
        setConsultation(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultationDetails();
  }, [id]);

  if (isLoading) {
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

  if (!consultation) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="error" className="mb-6" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Card>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Consultation not found</h3>
              <p className="mt-1 text-sm text-gray-500">The consultation you're looking for doesn't exist or you don't have access.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/patient/consultations')}
                  variant="primary"
                >
                  Back to Consultations
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
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/patient/consultations')}
                variant="outline"
                size="sm"
                className="mr-4"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Consultation Details</h1>
                <p className="text-gray-600">
                  {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                </p>
              </div>
              <Badge
                variant={
                  consultation.status === 'active' ? 'primary' :
                  consultation.status === 'completed' ? 'success' :
                  'danger'
                }
                className="ml-4"
              >
                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
              </Badge>
            </div>
            <div className="mt-4 md:mt-0">
              {consultation.followUpRequired && consultation.followUpDate && (
                <Button
                  as={Link}
                  to={`/patient/appointments/new?followUp=true&provider=${consultation.provider.id}`}
                  variant="primary"
                >
                  Schedule Follow-Up
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title="Provider Information">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  {consultation.provider.imageUrl ? (
                    <img
                      src={consultation.provider.imageUrl}
                      alt={consultation.provider.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-semibold">
                      {consultation.provider.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{consultation.provider.name}</h3>
                  <p className="text-sm text-gray-500">{consultation.provider.specialty}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Healthcare Center</h4>
                <p className="mt-1 text-sm text-gray-900">{consultation.center.name}</p>
                <p className="text-sm text-gray-500">{consultation.center.address}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  as={Link}
                  to={`/patient/appointments/new?provider=${consultation.provider.id}`}
                  variant="outline"
                  fullWidth
                >
                  Book New Appointment
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Consultation Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card title="Consultation Details">
              <div className="space-y-6">
                {consultation.diagnosis && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Diagnosis</h3>
                    <p className="text-gray-700">{consultation.diagnosis}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {consultation.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="warning">{symptom}</Badge>
                    ))}
                  </div>
                </div>

                {consultation.treatmentPlan && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Treatment Plan</h3>
                    <p className="text-gray-700">{consultation.treatmentPlan}</p>
                  </div>
                )}

                {consultation.medications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Medications</h3>
                    <div className="space-y-4">
                      {consultation.medications.map((medication, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium text-gray-900">{medication.name} ({medication.dosage})</h4>
                          <p className="text-gray-700 mt-1">{medication.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {consultation.followUpRequired && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Follow-Up</h3>
                    <p className="text-gray-700">
                      {consultation.followUpDate
                        ? `Follow-up appointment recommended by ${new Date(consultation.followUpDate).toLocaleDateString()}.`
                        : 'Follow-up appointment recommended.'}
                    </p>
                    {consultation.followUpDate && (
                      <div className="mt-2">
                        <Button
                          as={Link}
                          to={`/patient/appointments/new?followUp=true&provider=${consultation.provider.id}`}
                          variant="primary"
                          size="sm"
                        >
                          Schedule Follow-Up
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {consultation.notes && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
                    <p className="text-gray-700">{consultation.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientConsultationDetails;
