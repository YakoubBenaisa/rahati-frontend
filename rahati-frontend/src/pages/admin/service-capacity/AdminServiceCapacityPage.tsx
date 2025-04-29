import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge, Table, Pagination } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { serviceCapacityAPI, centersAPI } from '../../../services/api';
import { ServiceCapacity, Center } from '../../../types';
import { formatDate } from '../../../utils/dateUtils';

const AdminServiceCapacityPage: React.FC = () => {
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  const [serviceCapacities, setServiceCapacities] = useState<ServiceCapacity[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Fetch centers for reference
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await centersAPI.getCenters();
        setCenters(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching centers:', err);
      }
    };
    
    fetchCenters();
  }, []);

  // Fetch service capacities
  useEffect(() => {
    const fetchServiceCapacities = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await serviceCapacityAPI.getServiceCapacities({
          page: currentPage,
          per_page: itemsPerPage
        });
        
        const data = response.data;
        setServiceCapacities(data.data || data);
        
        // Handle pagination if available
        if (data.meta) {
          setTotalPages(data.meta.last_page);
          setTotalItems(data.meta.total);
        }
      } catch (err) {
        console.error('Error fetching service capacities:', err);
        setError('Failed to load service capacities. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServiceCapacities();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get center name by ID
  const getCenterName = (centerId: number) => {
    const center = centers.find(c => c.id === centerId);
    return center ? center.name : `Center #${centerId}`;
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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Service Capacity</h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Manage service capacity for healthcare centers.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/admin/service-capacity/new')}
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Add Service Capacity
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
                <span className="ml-3 text-[var(--color-text-secondary)]">Loading service capacities...</span>
              </div>
            ) : serviceCapacities.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-[var(--color-text-primary)]">No service capacities found</h3>
                <p className="mt-1 text-[var(--color-text-secondary)]">Get started by adding a new service capacity.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => navigate('/admin/service-capacity/new')}
                    variant="primary"
                  >
                    Add Service Capacity
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Center</Table.HeaderCell>
                      <Table.HeaderCell>Service Type</Table.HeaderCell>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>Time Range</Table.HeaderCell>
                      <Table.HeaderCell>Max Capacity</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {serviceCapacities.map((capacity) => (
                      <Table.Row key={capacity.id}>
                        <Table.Cell>{capacity.id}</Table.Cell>
                        <Table.Cell>{getCenterName(capacity.center_id)}</Table.Cell>
                        <Table.Cell>{capacity.service_type}</Table.Cell>
                        <Table.Cell>{formatDate(capacity.date)}</Table.Cell>
                        <Table.Cell>
                          {formatDate(capacity.start_time, 'time')} - {formatDate(capacity.end_time, 'time')}
                        </Table.Cell>
                        <Table.Cell>{capacity.max_capacity}</Table.Cell>
                        <Table.Cell>
                          <Badge variant={capacity.is_active ? 'success' : 'error'}>
                            {capacity.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/service-capacity/${capacity.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/service-capacity/${capacity.id}/edit`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                
                {totalPages > 1 && (
                  <div className="py-4 px-6 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminServiceCapacityPage;
