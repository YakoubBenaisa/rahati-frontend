import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Textarea, Alert, Tabs, Tab } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';

interface PatientDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: 'active' | 'inactive';
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

interface MedicalNote {
  id: number;
  date: string;
  title: string;
  content: string;
  createdBy: string;
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

  // Mock fetch patient data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock patient data
      const mockPatient: PatientDetails = {
        id: Number(id),
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, CA 12345',
        dateOfBirth: '1985-06-15',
        gender: 'Male',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        medicalConditions: ['Hypertension', 'Asthma'],
        medications: ['Lisinopril 10mg', 'Albuterol inhaler'],
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '(555) 987-6543'
        },
        status: 'active'
      };

      // Mock appointments
      const mockAppointments: Appointment[] = [
        {
          id: 101,
          date: '2023-05-15',
          time: '10:00 AM',
          reason: 'Annual check-up',
          status: 'completed',
          notes: 'Patient is in good health. Blood pressure is normal.'
        },
        {
          id: 102,
          date: '2023-06-10',
          time: '2:30 PM',
          reason: 'Follow-up appointment',
          status: 'scheduled',
          notes: ''
        },
        {
          id: 103,
          date: '2023-04-02',
          time: '11:15 AM',
          reason: 'Respiratory issues',
          status: 'completed',
          notes: 'Prescribed albuterol inhaler for asthma symptoms.'
        }
      ];

      // Mock medical notes
      const mockMedicalNotes: MedicalNote[] = [
        {
          id: 201,
          date: '2023-05-15',
          title: 'Annual Check-up Notes',
          content: 'Patient reports feeling well. No significant changes in health status. Blood pressure: 120/80. Heart rate: 72 bpm. Weight: 175 lbs.',
          createdBy: 'Dr. Smith'
        },
        {
          id: 202,
          date: '2023-04-02',
          title: 'Respiratory Assessment',
          content: 'Patient presented with shortness of breath and wheezing. Lung examination revealed mild wheezing. Diagnosed with asthma exacerbation. Prescribed albuterol inhaler and advised to avoid triggers.',
          createdBy: 'Dr. Smith'
        }
      ];

      setPatient(mockPatient);
      setAppointments(mockAppointments);
      setMedicalNotes(mockMedicalNotes);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Handle adding a new medical note
  const handleAddNote = () => {
    if (!noteTitle.trim()) {
      setError('Please enter a note title');
      return;
    }

    if (!newNote.trim()) {
      setError('Please enter note content');
      return;
    }

    const newMedicalNote: MedicalNote = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: noteTitle,
      content: newNote,
      createdBy: user?.name || 'Provider'
    };

    setMedicalNotes([newMedicalNote, ...medicalNotes]);
    setNewNote('');
    setNoteTitle('');
    setSuccess('Medical note added successfully');

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
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
                        <p className="mt-1">{new Date(patient.dateOfBirth).toLocaleDateString()} ({calculateAge(patient.dateOfBirth)} years)</p>
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
                                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {appointment.reason}
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
                                  {new Date(note.date).toLocaleDateString()}
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
