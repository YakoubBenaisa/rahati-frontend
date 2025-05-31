import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Textarea, Alert, Tabs, Tab, Spinner } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { usersAPI, appointmentsAPI, consultationsAPI } from '../../../services/api';
import { formatDate } from '../../../utils/dateUtils';

interface PatientDetails {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: 'active' | 'inactive';
  role: string;
  is_active?: boolean;
  medical_info?: {
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
    blood_type?: string;
    emergency_contact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
}

interface Appointment {
  id: number;
  patient_id: number;
  provider_id: number;
  center_id: number;
  appointment_datetime: string;
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface MedicalNote {
  id: number;
  patient_id: number;
  provider_id: number;
  date: string;
  title: string;
  content: string;
  createdBy?: string;
  created_at?: string;
  updated_at?: string;
}

const ProviderPatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth('Provider');
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalNotes, setMedicalNotes] = useState<MedicalNote[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch patient details using the provider-specific endpoint
        const patientResponse = await usersAPI.getPatientDetails(Number(id));
        console.log('Patient details response:', patientResponse.data);

        const patientData = patientResponse.data.data || patientResponse.data;
        const patient = patientData.patient || patientData;

        // Process patient data
        const processedPatient: PatientDetails = {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone || 'Not provided',
          address: patient.address || 'Not provided',
          dateOfBirth: patient.date_of_birth,
          gender: patient.gender || 'Not specified',
          status: patient.is_active ? 'active' : 'inactive',
          role: patient.role,
          is_active: patient.is_active,
          bloodType: patient.medical_info?.blood_type || 'Not specified',
          allergies: patient.medical_info?.allergies || [],
          medicalConditions: patient.medical_info?.conditions || [],
          medications: patient.medical_info?.medications || [],
          emergencyContact: patient.medical_info?.emergency_contact || {
            name: 'Not provided',
            relationship: 'Not provided',
            phone: 'Not provided'
          }
        };

        setPatient(processedPatient);

        // If the API response includes appointments, use them directly
        if (patientData.appointments) {
          const processedAppointments: Appointment[] = patientData.appointments.map((appointment: any) => ({
            id: appointment.id,
            patient_id: appointment.patient_id,
            provider_id: appointment.provider_id,
            center_id: appointment.center_id,
            appointment_datetime: appointment.appointment_datetime,
            reason: appointment.reason || 'Not specified',
            status: appointment.status || 'scheduled',
            notes: appointment.notes || '',
            created_at: appointment.created_at,
            updated_at: appointment.updated_at
          }));

          setAppointments(processedAppointments);
        } else {
          // Otherwise fetch them separately
          await fetchPatientAppointments(Number(id));
        }

        // If the API response includes consultations, use them as medical notes
        if (patientData.consultations) {
          const processedNotes: MedicalNote[] = patientData.consultations.map((consultation: any) => ({
            id: consultation.id,
            patient_id: consultation.patient_id,
            provider_id: consultation.provider_id,
            date: consultation.consultation_date || consultation.created_at,
            title: consultation.diagnosis || 'Consultation Notes',
            content: consultation.notes || 'No notes provided',
            createdBy: consultation.provider?.name || 'Healthcare Provider',
            created_at: consultation.created_at,
            updated_at: consultation.updated_at
          }));

          setMedicalNotes(processedNotes);
        } else {
          // Otherwise fetch them separately
          await fetchPatientMedicalNotes(Number(id));
        }
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError('Failed to load patient details. Please try again.');

        // Fallback to regular user API if the provider-specific endpoint fails
        try {
          const fallbackResponse = await usersAPI.getUserById(Number(id));
          const patientData = fallbackResponse.data.data || fallbackResponse.data;

          // Process patient data
          const processedPatient: PatientDetails = {
            id: patientData.id,
            name: patientData.name,
            email: patientData.email,
            phone: patientData.phone || 'Not provided',
            address: patientData.address || 'Not provided',
            dateOfBirth: patientData.date_of_birth,
            gender: patientData.gender || 'Not specified',
            status: patientData.is_active ? 'active' : 'inactive',
            role: patientData.role,
            is_active: patientData.is_active,
            bloodType: patientData.medical_info?.blood_type || 'Not specified',
            allergies: patientData.medical_info?.allergies || [],
            medicalConditions: patientData.medical_info?.conditions || [],
            medications: patientData.medical_info?.medications || [],
            emergencyContact: patientData.medical_info?.emergency_contact || {
              name: 'Not provided',
              relationship: 'Not provided',
              phone: 'Not provided'
            }
          };

          setPatient(processedPatient);

          // Fetch patient appointments
          await fetchPatientAppointments(Number(id));

          // Fetch patient medical notes
          await fetchPatientMedicalNotes(Number(id));

          setError('Using limited patient data. Some information may be missing.');
        } catch (fallbackErr) {
          console.error('Fallback error fetching patient details:', fallbackErr);
          setError('Failed to load patient details. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  // Fetch patient appointments
  const fetchPatientAppointments = async (patientId: number) => {
    try {
      const response = await appointmentsAPI.getAppointments({ patient_id: patientId });
      console.log('Patient appointments response:', response.data);

      const appointmentsData = response.data.data || response.data;

      // Process appointments data
      const processedAppointments: Appointment[] = appointmentsData.map((appointment: any) => ({
        id: appointment.id,
        patient_id: appointment.patient_id,
        provider_id: appointment.provider_id,
        center_id: appointment.center_id,
        appointment_datetime: appointment.appointment_datetime,
        reason: appointment.reason || 'Not specified',
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
        created_at: appointment.created_at,
        updated_at: appointment.updated_at
      }));

      setAppointments(processedAppointments);
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
      // We don't set an error here as we still want to display the patient details
      // even if we couldn't fetch their appointments
    }
  };

  // Fetch patient medical notes
  const fetchPatientMedicalNotes = async (patientId: number) => {
    try {
      // In a real application, you would have an API endpoint for medical notes
      // For now, we'll use consultations as a proxy for medical notes
      const response = await consultationsAPI.getConsultations({ patient_id: patientId });
      console.log('Patient consultations response:', response.data);

      const consultationsData = response.data.data || response.data;

      // Process consultations data as medical notes
      const processedNotes: MedicalNote[] = consultationsData.map((consultation: any) => ({
        id: consultation.id,
        patient_id: consultation.patient_id,
        provider_id: consultation.provider_id,
        date: consultation.consultation_date || consultation.created_at,
        title: consultation.diagnosis || 'Consultation Notes',
        content: consultation.notes || 'No notes provided',
        createdBy: consultation.provider?.name || 'Healthcare Provider',
        created_at: consultation.created_at,
        updated_at: consultation.updated_at
      }));

      setMedicalNotes(processedNotes);
    } catch (err) {
      console.error('Error fetching patient medical notes:', err);
      // We don't set an error here as we still want to display the patient details
      // even if we couldn't fetch their medical notes
    }
  };

  // Handle adding a new medical note
  const handleAddNote = async () => {
    if (!noteTitle.trim()) {
      setError('Please enter a note title');
      return;
    }

    if (!newNote.trim()) {
      setError('Please enter note content');
      return;
    }

    if (!id || !user?.id) {
      setError('Missing patient or provider information');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real application, you would have an API endpoint for adding medical notes
      // For now, we'll use consultations as a proxy for medical notes
      const consultationData = {
        patient_id: Number(id),
        provider_id: user.id,
        diagnosis: noteTitle,
        notes: newNote,
        consultation_date: new Date().toISOString(),
        status: 'completed'
      };

      const response = await consultationsAPI.startConsultation(consultationData);
      console.log('Add note response:', response.data);

      // Create a new note from the response
      const responseData = response.data.data || response.data;

      const newMedicalNote: MedicalNote = {
        id: responseData.id || Date.now(),
        patient_id: Number(id),
        provider_id: user.id,
        date: responseData.consultation_date || new Date().toISOString(),
        title: noteTitle,
        content: newNote,
        createdBy: user?.name || 'Provider',
        created_at: responseData.created_at || new Date().toISOString(),
        updated_at: responseData.updated_at || new Date().toISOString()
      };

      // Add the new note to the list
      setMedicalNotes([newMedicalNote, ...medicalNotes]);

      // Clear the form
      setNewNote('');
      setNoteTitle('');

      // Show success message
      setSuccess('Medical note added successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding medical note:', err);
      setError('Failed to add medical note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-gray-600">Loading patient details...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!patient) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Patient not found</h3>
              <p className="mt-1 text-sm text-gray-500">The patient you're looking for doesn't exist or you don't have access.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/provider/patients')}
                  variant="primary"
                >
                  Back to Patients
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
                onClick={() => navigate('/provider/patients')}
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
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <Badge
                variant={patient.status === 'active' ? 'success' : 'danger'}
                className="ml-4"
              >
                {patient.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                as={Link}
                to={`/provider/appointments/new?patient=${patient.id}`}
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              >
                Schedule Appointment
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
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              <Tab id="overview" label="Overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="mt-1">{patient.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <p className="mt-1">{patient.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Address:</span>
                        <p className="mt-1">{patient.address}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                        <p className="mt-1">
                          {patient.dateOfBirth
                            ? `${formatDate(patient.dateOfBirth, 'date')} (${calculateAge(patient.dateOfBirth)} years)`
                            : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Gender:</span>
                        <p className="mt-1">{patient.gender}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Blood Type:</span>
                        <p className="mt-1">{patient.bloodType}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Allergies:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {patient.allergies.length > 0 ? (
                            patient.allergies.map((allergy, index) => (
                              <Badge key={index} variant="warning">{allergy}</Badge>
                            ))
                          ) : (
                            <p>No known allergies</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Medical Conditions:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {patient.medicalConditions.length > 0 ? (
                            patient.medicalConditions.map((condition, index) => (
                              <Badge key={index} variant="info">{condition}</Badge>
                            ))
                          ) : (
                            <p>No known medical conditions</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Medications:</span>
                        <ul className="mt-1 list-disc list-inside">
                          {patient.medications.length > 0 ? (
                            patient.medications.map((medication, index) => (
                              <li key={index}>{medication}</li>
                            ))
                          ) : (
                            <p>No current medications</p>
                          )}
                        </ul>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Emergency Contact:</span>
                        <p className="mt-1">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</p>
                        <p>{patient.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab id="appointments" label="Appointments">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Appointment History</h3>
                    <Button
                      as={Link}
                      to={`/provider/appointments/new?patient=${patient.id}`}
                      variant="primary"
                      size="sm"
                    >
                      Schedule New Appointment
                    </Button>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="text-center py-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                      <p className="mt-1 text-sm text-gray-500">This patient has no appointment history.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-white">
                      <ul className="divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                          <li key={appointment.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                    appointment.status === 'completed'
                                      ? 'bg-green-100 text-green-600'
                                      : appointment.status === 'scheduled'
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-red-100 text-red-600'
                                  }`}>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatDate(appointment.appointment_datetime, 'datetime')}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {appointment.reason || 'No reason specified'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge
                                  variant={
                                    appointment.status === 'completed' ? 'success' :
                                    appointment.status === 'scheduled' ? 'primary' :
                                    'danger'
                                  }
                                  className="mr-4"
                                >
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                                <Button
                                  as={Link}
                                  to={`/provider/appointments/${appointment.id}`}
                                  variant="outline"
                                  size="sm"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                            {appointment.notes && (
                              <div className="mt-2 ml-14">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Notes:</span> {appointment.notes}
                                </p>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Tab>
              <Tab id="notes" label="Medical Notes">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Medical Note</h3>
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="Note Title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter medical notes here..."
                        rows={4}
                      />
                      <Button
                        onClick={handleAddNote}
                        variant="primary"
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Notes</h3>
                    {medicalNotes.length === 0 ? (
                      <div className="text-center py-6">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No medical notes</h3>
                        <p className="mt-1 text-sm text-gray-500">There are no medical notes for this patient yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {medicalNotes.map((note) => (
                          <Card key={note.id}>
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-lg font-medium text-gray-900">{note.title}</h4>
                                <div className="text-sm text-gray-500">
                                  {formatDate(note.date, 'date')}
                                </div>
                              </div>
                              <p className="mt-2 text-gray-600 whitespace-pre-line">{note.content}</p>
                              <div className="mt-4 text-sm text-gray-500">
                                Added by: {note.createdBy}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ProviderPatientDetailsPage;
