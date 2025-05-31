import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Textarea, Alert, Input, Select } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { consultationsAPI } from '../../../services/api';

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
  const { user } = useAuth('Provider');
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

  // Fetch consultation data from API
  useEffect(() => {
    if (!id) return;
    
    const fetchConsultationDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await consultationsAPI.getConsultationById(parseInt(id));
        const data = response.data.data || response.data;
        
        // Transform API data to match our interface
        const formattedData: ConsultationDetails = {
          id: data.id,
          patientId: data.patient?.id || 0,
          patientName: data.patient?.name || 'Unknown Patient',
          patientEmail: data.patient?.email || 'No email available',
          patientPhone: data.patient?.phone || 'No phone available',
          date: data.date,
          time: data.time || '12:00',
          status: data.status || 'active',
          type: data.type || 'General',
          diagnosis: data.diagnosis,
          symptoms: data.symptoms || [],
          treatmentPlan: data.treatment_plan,
          medications: data.medications || [],
          followUpRequired: data.follow_up_required || false,
          followUpDate: data.follow_up_date,
          notes: data.notes,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString()
        };
        
        setConsultation(formattedData);
        setDiagnosis(formattedData.diagnosis || '');
        setTreatmentPlan(formattedData.treatmentPlan || '');
        setFollowUpRequired(formattedData.followUpRequired);
        setFollowUpDate(formattedData.followUpDate || '');
        setNotes(formattedData.notes || '');
        setMedications(formattedData.medications || []);
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

  // Handle saving consultation updates
  const handleSaveConsultation = async () => {
    if (!consultation || !id) return;
    
    setIsSaving(true);
    setError(null);
    
    // Validate follow-up date if follow-up is required
    if (followUpRequired && !followUpDate) {
      setError('Please select a follow-up date');
      setIsSaving(false);
      return;
    }
    
    try {
      // Prepare consultation data
      const consultationData = {
        diagnosis,
        treatment_plan: treatmentPlan,
        follow_up_required: followUpRequired,
        follow_up_date: followUpRequired ? followUpDate : null,
        notes,
        medications,
        status: 'completed'
      };
      
      // Update consultation in API
      await consultationsAPI.updateConsultation(parseInt(id), consultationData);
      
      // Update local state
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
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating consultation:', err);
      setError(err.response?.data?.message || 'Failed to update consultation. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
  const handleCompleteConsultation = async () => {
    if (!consultation || !id) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Complete consultation in API
      await consultationsAPI.completeConsultation(parseInt(id), {
        status: 'completed'
      });
      
      // Update local state
      const updatedConsultation: ConsultationDetails = {
        ...consultation,
        status: 'completed',
        updatedAt: new Date().toISOString()
      };
      
      setConsultation(updatedConsultation);
      setSuccess('Consultation marked as completed');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error completing consultation:', err);
      setError(err.response?.data?.message || 'Failed to complete consultation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancelling the consultation
  const handleCancelConsultation = async () => {
    if (!consultation || !id) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Cancel consultation in API
      await consultationsAPI.cancelConsultation(parseInt(id));
      
      // Update local state
      const updatedConsultation: ConsultationDetails = {
        ...consultation,
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      };
      
      setConsultation(updatedConsultation);
      setSuccess('Consultation cancelled');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error cancelling consultation:', err);
      setError(err.response?.data?.message || 'Failed to cancel consultation. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-6"
            />
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
            <div className="mt-4 md:mt-0 flex space-x-3">
              {consultation.status === 'active' && (
                <>
                  <Button
                    onClick={handleCompleteConsultation}
                    variant="success"
                    isLoading={isSaving}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    onClick={handleCancelConsultation}
                    variant="danger"
                    isLoading={isSaving}
                  >
                    Cancel Consultation
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title="Patient Information">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{consultation.patientName}</h3>
                  <p className="text-gray-600 mt-1">{consultation.patientEmail}</p>
                  <p className="text-gray-600">{consultation.patientPhone}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Consultation Type</h4>
                  <p className="text-gray-700">{consultation.type}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
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
                    View Patient Record
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
            <Card title="Consultation Notes">
              {consultation.status === 'active' ? (
                <form className="space-y-6">
                  <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnosis
                    </label>
                    <Textarea
                      id="diagnosis"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Enter diagnosis"
                      rows={3}
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
                      placeholder="Enter treatment plan"
                      rows={3}
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
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddMedication}
                        variant="outline"
                        type="button"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {medications.map((medication, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{medication}</span>
                          <Button
                            onClick={() => handleRemoveMedication(index)}
                            variant="text"
                            size="sm"
                            className="text-red-600"
                            type="button"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        id="followUpRequired"
                        type="checkbox"
                        checked={followUpRequired}
                        onChange={(e) => setFollowUpRequired(e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="followUpRequired" className="ml-2 block text-sm font-medium text-gray-700">
                        Follow-up Required
                      </label>
                    </div>
                    
                    {followUpRequired && (
                      <div className="mt-2">
                        <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Follow-up Date
                        </label>
                        <Input
                          id="followUpDate"
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleSaveConsultation}
                      variant="primary"
                      isLoading={isSaving}
                      type="button"
                    >
                      Save and Complete Consultation
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {consultation.diagnosis && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Diagnosis</h3>
                      <p className="text-gray-700">{consultation.diagnosis}</p>
                    </div>
                  )}
                  
                  {consultation.treatmentPlan && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Treatment Plan</h3>
                      <p className="text-gray-700">{consultation.treatmentPlan}</p>
                    </div>
                  )}
                  
                  {consultation.medications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Medications</h3>
                      <div className="space-y-2">
                        {consultation.medications.map((medication, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-700">{medication}</p>
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
                    </div>
                  )}
                  
                  {consultation.notes && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
                      <p className="text-gray-700">{consultation.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderConsultationDetailsPage;
