import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Input, Select, Alert } from '../../../components/ui';
import { motion } from 'framer-motion';
import { accommodationsAPI } from '../../../services/api';

interface Accommodation {
  id: number;
  center: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  appointmentId: number;
  appointmentDate: string;
}

const PatientAccommodations: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch accommodations data from API
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await accommodationsAPI.getAccommodations();
        const data = response.data.data || response.data;

        // Transform API data to match our interface if needed
        const formattedData = data.map((item: any) => ({
          id: item.id,
          center: item.center?.name || 'Unknown Center',
          roomType: item.room_type || 'Standard Room',
          checkInDate: item.check_in_date,
          checkOutDate: item.check_out_date,
          status: item.status || 'pending',
          appointmentId: item.appointment_id,
          appointmentDate: item.appointment?.date || new Date().toISOString()
        }));

        setAccommodations(formattedData);
        setFilteredAccommodations(formattedData);
      } catch (err: any) {
        console.error('Error fetching accommodations:', err);
        setError(err.response?.data?.message || 'Failed to load accommodations. Please try again.');
        setAccommodations([]);
        setFilteredAccommodations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Filter accommodations based on search term and status
  useEffect(() => {
    let filtered = accommodations;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(accommodation => accommodation.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        accommodation =>
          accommodation.center.toLowerCase().includes(term) ||
          accommodation.roomType.toLowerCase().includes(term)
      );
    }

    setFilteredAccommodations(filtered);
  }, [searchTerm, statusFilter, accommodations]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Format status for display
  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get status badge variant
  const getStatusVariant = (status: string): 'success' | 'warning' | 'primary' | 'info' | 'danger' | 'secondary' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'checked_in':
        return 'primary';
      case 'checked_out':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
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
              <h1 className="text-3xl font-bold text-gray-900">My Accommodations</h1>
              <p className="mt-2 text-gray-600">
                View and manage your accommodation bookings.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                as={Link}
                to="/patient/accommodations/new"
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Book Accommodation
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
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/2">
                <Input
                  placeholder="Search by center or room type..."
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
                    { value: 'pending', label: 'Pending' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'checked_in', label: 'Checked In' },
                    { value: 'checked_out', label: 'Checked Out' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ]}
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredAccommodations.length} {filteredAccommodations.length === 1 ? 'booking' : 'bookings'} found
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {error && (
            <Alert variant="error" className="mb-6" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredAccommodations.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No accommodations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'You have no accommodation bookings yet.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <div className="mt-6">
                    <Button
                      as={Link}
                      to="/patient/accommodations/new"
                      variant="primary"
                    >
                      Book Accommodation
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccommodations.map((accommodation) => (
                <Card key={accommodation.id} className="h-full hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant={getStatusVariant(accommodation.status)}>
                        {formatStatus(accommodation.status)}
                      </Badge>
                      <Button
                        as={Link}
                        to={`/patient/accommodations/${accommodation.id}`}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {accommodation.center}
                    </h3>

                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Room Type:</span> {accommodation.roomType}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Check-in</p>
                        <p className="text-gray-900">{new Date(accommodation.checkInDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Check-out</p>
                        <p className="text-gray-900">{new Date(accommodation.checkOutDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        For appointment on {new Date(accommodation.appointmentDate).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex justify-between">
                        <Button
                          as={Link}
                          to={`/patient/appointments/${accommodation.appointmentId}`}
                          variant="outline"
                          size="sm"
                        >
                          View Appointment
                        </Button>

                        {(accommodation.status === 'pending' || accommodation.status === 'confirmed') && (
                          <Button
                            as={Link}
                            to={`/patient/accommodations/${accommodation.id}/modify`}
                            variant="primary"
                            size="sm"
                          >
                            Modify
                          </Button>
                        )}
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

export default PatientAccommodations;
