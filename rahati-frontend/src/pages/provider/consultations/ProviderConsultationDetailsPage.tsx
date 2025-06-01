import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Textarea, Alert, Input } from '../../../components/ui';
//import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';

interface ConsultationDetails {
  id: number;
  patientId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  status: 'active' | 'completed' | 'cancelled';
  type: string;
  diagnosis?: string;
  symptoms: string[];
  treatmentPlan?: string;
  medications: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ProviderConsultationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  //const { user } = useAuth('Provider');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  //  fetch consultation data
  useEffect(() => {
    setIsLoading(true);
    //  API call
    setTimeout(() => {
      //  consultation data
     
      setConsultation(consultation);
      setDiagnosis(consultation ? consultation.diagnosis || '' : '');
      setTreatmentPlan(consultation ? consultation.treatmentPlan || '' : '');
      setFollowUpRequired(consultation ? consultation.followUpRequired || false : false);
      setFollowUpDate(consultation ? consultation.followUpDate || '' : '');
      setNotes(consultation ? consultation.notes || '' : '');
      setMedications(consultation ? consultation.medications || [] : []);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consultation) return;
    
    setIsSaving(true);
    
    // Validate follow-up date if follow-up is required
    if (followUpRequired && !followUpDate) {
      setError('Please select a follow-up date');
      setIsSaving(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Update consultation data
      const updatedConsultation: ConsultationDetails = {
        ...consultation,
        diagnosis,
        treatmentPlan,
        followUpRequired,
        followUpDate: followUpRequired ? followUpDate : undefined,
        notes,
        medications,
        status: 'completed',
        updatedAt: new Date().toISOString()
      };
      
      setConsultation(updatedConsultation);
      setSuccess('Consultation updated successfully');
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

  // Handle adding a new medication
  const handleAddMedication = () => {
    if (!newMedication.trim()) return;
    
    setMedications([...medications, newMedication.trim()]);
    setNewMedication('');
  };

  // Handle removing a medication
  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  // Handle completing the consultation
  const handleCompleteConsultation = () => {
    if (!consultation) return;
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update consultation status
      const updatedConsultation: ConsultationDetails = {
        ...consultation,
        status: 'completed',
        updatedAt: new Date().toISOString()
      };
      
      setConsultation(updatedConsultation);
      setSuccess('Consultation marked as completed');
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

  // Handle cancelling the consultation
  const handleCancelConsultation = () => {
    if (!consultation) return;
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update consultation status
      const updatedConsultation: ConsultationDetails = {
        ...consultation,
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      };
      
      setConsultation(updatedConsultation);
      setSuccess('Consultation cancelled');
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

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
          <Card>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Consultation not found</h3>
              <p className="mt-1 text-sm text-gray-500">The consultation you're looking for doesn't exist or you don't have access.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/provider/consultations')}
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
                onClick={() => navigate('/provider/consultations')}
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
                <h1 className="text-3xl font-bold text-gray-900">{consultation.type}</h1>
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
            <div className="mt-4 md:mt-0 flex space-x-3">
              {consultation.status === 'active' && (
                <>
                  <Button
                    onClick={handleCompleteConsultation}
                    //variant={"success"}
                    isLoading={isSaving}
                  >
                    Complete
                  </Button>
                  <Button
                    onClick={handleCancelConsultation}
                    variant="danger"
                    isLoading={isSaving}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button
                as={Link}
                to={`/provider/patients/${consultation.patientId}`}
                variant="primary"
              >
                View Patient
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
          {/* Patient Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title="Patient Information">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-semibold">
                    {consultation.patientName.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{consultation.patientName}</h3>
                    <div className="text-sm text-gray-500">Patient ID: {consultation.patientId}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center text-sm">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{consultation.patientEmail}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{consultation.patientPhone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Reported Symptoms</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {consultation.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="warning">{symptom}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    as={Link}
                    to={`/provider/patients/${consultation.patientId}`}
                    variant="outline"
                    fullWidth
                  >
                    View Full Patient Record
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Consultation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card title="Consultation Details">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnosis
                    </label>
                    <Input
                      id="diagnosis"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Enter diagnosis"
                      disabled={consultation.status !== 'active'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="treatmentPlan" className="block text-sm font-medium text-gray-700 mb-1">
                      Treatment Plan
                    </label>
                    <Textarea
                      id="treatmentPlan"
                      value={treatmentPlan}
                      onChange={(e) => setTreatmentPlan(e.target.value)}
                      placeholder="Describe the treatment plan"
                      rows={4}
                      disabled={consultation.status !== 'active'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medications
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        placeholder="Add medication"
                        disabled={consultation.status !== 'active'}
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        onClick={handleAddMedication}
                        variant="secondary"
                        disabled={!newMedication.trim() || consultation.status !== 'active'}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {medications.map((medication, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                          <span className="text-sm">{medication}</span>
                          {consultation.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedication(index)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      {medications.length === 0 && (
                        <p className="text-sm text-gray-500">No medications prescribed</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="followUpRequired"
                      type="checkbox"
                      checked={followUpRequired}
                      onChange={(e) => setFollowUpRequired(e.target.checked)}
                      disabled={consultation.status !== 'active'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="followUpRequired" className="ml-2 block text-sm text-gray-700">
                      Follow-up Required
                    </label>
                  </div>
                  
                  {followUpRequired && (
                    <div>
                      <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Follow-up Date
                      </label>
                      <Input
                        id="followUpDate"
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={consultation.status !== 'active'}
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes"
                      rows={4}
                      disabled={consultation.status !== 'active'}
                    />
                  </div>
                  
                  {consultation.status === 'active' && (
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
                        isLoading={isSaving}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderConsultationDetailsPage;
