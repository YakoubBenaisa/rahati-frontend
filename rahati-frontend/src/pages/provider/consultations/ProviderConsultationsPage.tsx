import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Badge, Select } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { consultationsAPI } from '../../../services/api';
import { Consultation as ApiConsultation, ConsultationStatus } from '../../../types';

// Define a local interface that matches our UI needs
interface ConsultationUI {
  id: number;
  patientName: string;
  patientId: number;
  date: string;
  time: string;
  status: ConsultationStatus;
  type: string;
  diagnosis?: string;
  followUpRequired: boolean;
}

const ProviderConsultationsPage: React.FC = () => {
  const { user } = useAuth('Provider');
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<ConsultationUI[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationUI[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch consultations data from API
  useEffect(() => {
    if (!user?.id) return;

    const fetchConsultations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get consultations for the provider
        const response = await consultationsAPI.getConsultations({
          provider_id: user.id
        });

        const consultationsData = response.data.data || response.data;

        // Transform API data to our UI format
        const transformedConsultations: ConsultationUI[] = consultationsData.map((consultation: ApiConsultation) => {
          // Extract date and time from appointment_datetime
          const dateTime = new Date(consultation.start_time);
          const date = dateTime.toISOString().split('T')[0];
          const time = dateTime.toTimeString().split(' ')[0].substring(0, 5);

          // Get patient info from appointment
          const patient = consultation.appointment?.patient;

          return {
            id: consultation.id,
            patientName: patient?.name || 'Unknown Patient',
            patientId: patient?.id || 0,
            date,
            time,
            status: consultation.status,
            type: consultation.appointment?.appointment_type || 'Consultation',
            diagnosis: consultation.diagnosis || undefined,
            followUpRequired: consultation.follow_up_required || false
          };
        });

        setConsultations(transformedConsultations);
        setFilteredConsultations(transformedConsultations);
      } catch (err: any) {
        console.error('Error fetching consultations:', err);
        setError(err.response?.data?.message || 'Failed to load consultations. Please try again.');
        setConsultations([]);
        setFilteredConsultations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  // Filter consultations based on search term and status
  useEffect(() => {
    let filtered = consultations;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        consultation =>
          consultation.patientName.toLowerCase().includes(term) ||
          consultation.type.toLowerCase().includes(term) ||
          (consultation.diagnosis && consultation.diagnosis.toLowerCase().includes(term))
      );
    }

    setFilteredConsultations(filtered);
  }, [searchTerm, statusFilter, consultations]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
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
              <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
              <p className="mt-2 text-gray-600">
                View and manage your patient consultations.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                as={Link}
                to="/provider/consultations/new"
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                New Consultation
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/2">
                <Input
                  placeholder="Search by patient name, type, or diagnosis..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  leftIcon={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="w-full md:w-1/4">
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ]}
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredConsultations.length} {filteredConsultations.length === 1 ? 'consultation' : 'consultations'} found
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
          ) : filteredConsultations.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No consultations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'You have no consultations yet.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                           'bg-blue-100 text-blue-600'
                           
                        }`}>
                          {consultation.patientName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{consultation.patientName}</h3>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8a1 1 0 11-2 0V6a1 1 0 112 0v4z" clipRule="evenodd" />
                            </svg>
                            {consultation.type}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <Badge
                        variant={
                           'primary' 
                          
                        }
                        className="mb-2"
                      >
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </Badge>
                      <Button
                        as={Link}
                        to={`/provider/consultations/${consultation.id}`}
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
                        <h4 className="text-sm font-medium text-gray-500">Diagnosis</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {consultation.diagnosis || 'Not yet diagnosed'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Follow-up Required</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {consultation.followUpRequired ? 'Yes' : 'No'}
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

export default ProviderConsultationsPage;
