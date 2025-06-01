import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge } from '../../../components/ui';
import { motion } from 'framer-motion';
import { serviceCapacityAPI, centersAPI } from '../../../services/api';
import { ServiceCapacity, Center } from '../../../types';
import { formatDate } from '../../../utils/dateUtils';

const AdminServiceCapacityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [serviceCapacity, setServiceCapacity] = useState<ServiceCapacity | null>(null);
  const [center, setCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Fetch service capacity data
  useEffect(() => {
    const fetchServiceCapacity = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await serviceCapacityAPI.getServiceCapacityById(Number(id));
        const data = response.data.data || response.data;
        setServiceCapacity(data);
        
        // Fetch center details if center_id is available
        if (data.center_id) {
          try {
            const centerResponse = await centersAPI.getCenterById(data.center_id);
            setCenter(centerResponse.data.data || centerResponse.data);
          } catch (centerErr) {
            console.error('Error fetching center:', centerErr);
          }
        }
      } catch (err) {
        console.error('Error fetching service capacity:', err);
        setError('Failed to load service capacity. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchServiceCapacity();
    }
  }, [id]);

  // Handle delete service capacity
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await serviceCapacityAPI.deleteServiceCapacity(Number(id));
      navigate('/admin/service-capacity', { state: { message: 'Service capacity deleted successfully' } });
    } catch (err) {
      console.error('Error deleting service capacity:', err);
      setError('Failed to delete service capacity. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading service capacity...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!serviceCapacity && !isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert
            variant="error"
            message="Service capacity not found."
            className="mb-6"
          />
          <Button
            onClick={() => navigate('/admin/service-capacity')}
            variant="primary"
          >
            Back to Service Capacity
          </Button>
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
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Service Capacity Details</h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                View detailed information about this service capacity.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                onClick={() => navigate('/admin/service-capacity')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back
              </Button>
              <Button
                onClick={() => navigate(`/admin/service-capacity/${id}/edit`)}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                Edit
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                Delete
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

        {showDeleteConfirm && (
          <>
            <Alert
              variant="warning"
              message="Are you sure you want to delete this service capacity? This action cannot be undone."
              className="mb-6"
            />
            <div className="flex space-x-3 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                isLoading={isDeleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </>
        )}

        {serviceCapacity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                      {serviceCapacity.service_type}
                    </h2>
                    <div className="mt-2 flex items-center">
                      <Badge 
                      //variant={serviceCapacity.is_active ? 'success' : 'error'}
                      >
                        {serviceCapacity.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="ml-4 text-[var(--color-text-secondary)]">
                        Max Capacity: {serviceCapacity.max_capacity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Badge variant="info" size="lg">
                      {formatDate(serviceCapacity.date)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Center Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Center Name:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {center?.name || `Center #${serviceCapacity.center_id}`}
                        </span>
                      </div>
                      {center && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-tertiary)]">Address:</span>
                            <span className="text-[var(--color-text-secondary)]">{center.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-tertiary)]">Phone:</span>
                            <span className="text-[var(--color-text-secondary)]">{center.phone}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Schedule Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Date:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {formatDate(serviceCapacity.date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Time Range:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {formatDate(serviceCapacity.start_time)} - {formatDate(serviceCapacity.end_time)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Maximum Capacity:</span>
                        <span className="text-[var(--color-text-secondary)]">{serviceCapacity.max_capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {serviceCapacity.notes && (
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Notes</h3>
                    <p className="mt-2 text-[var(--color-text-secondary)]">{serviceCapacity.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">System Information</h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[var(--color-text-tertiary)]">ID:</span>
                      <span className="ml-2 text-[var(--color-text-secondary)]">{serviceCapacity.id}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-tertiary)]">Created:</span>
                      <span className="ml-2 text-[var(--color-text-secondary)]">
                        {serviceCapacity.created_at ? formatDate(serviceCapacity.created_at) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-tertiary)]">Last Updated:</span>
                      <span className="ml-2 text-[var(--color-text-secondary)]">
                        {serviceCapacity.updated_at ? formatDate(serviceCapacity.updated_at) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminServiceCapacityDetailsPage;
