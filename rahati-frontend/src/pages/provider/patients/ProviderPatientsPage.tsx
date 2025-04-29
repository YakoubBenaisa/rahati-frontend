import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Badge } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  upcomingAppointment: string | null;
  status: 'active' | 'inactive';
}

const ProviderPatientsPage: React.FC = () => {
  const { user } = useAuth('Provider');
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  // Mock fetch patients data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockPatients: Patient[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          lastVisit: '2023-05-15',
          upcomingAppointment: '2023-06-10 10:00 AM',
          status: 'active'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543',
          lastVisit: '2023-04-22',
          upcomingAppointment: '2023-06-15 2:30 PM',
          status: 'active'
        },
        {
          id: 3,
          name: 'Robert Johnson',
          email: 'robert.johnson@example.com',
          phone: '(555) 456-7890',
          lastVisit: '2023-05-30',
          upcomingAppointment: null,
          status: 'active'
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          phone: '(555) 234-5678',
          lastVisit: '2023-03-10',
          upcomingAppointment: '2023-06-20 11:15 AM',
          status: 'active'
        },
        {
          id: 5,
          name: 'Michael Wilson',
          email: 'michael.wilson@example.com',
          phone: '(555) 876-5432',
          lastVisit: '2023-02-28',
          upcomingAppointment: null,
          status: 'inactive'
        }
      ];
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm)
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
              <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
              <p className="mt-2 text-gray-600">
                View and manage your patient records.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                as={Link}
                to="/provider/schedule"
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              >
                Check Schedule
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="w-full md:w-1/2">
                <Input
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  leftIcon={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'} found
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredPatients.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'You have no patients assigned to you yet.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-semibold">
                          {patient.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {patient.email}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {patient.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <Badge
                        variant={patient.status === 'active' ? 'success' : 'danger'}
                        className="mb-2"
                      >
                        {patient.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        as={Link}
                        to={`/provider/patients/${patient.id}`}
                        variant="primary"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Last Visit</h4>
                        <p className="mt-1 text-sm text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Upcoming Appointment</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {patient.upcomingAppointment ? patient.upcomingAppointment : 'None scheduled'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ProviderPatientsPage;
