import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge, Alert, Tabs, Tab } from '../../../components/ui';
//import { useAuth } from '../../../hooks';
import { useCenterStore } from '../../../store/centerStore';
import { motion } from 'framer-motion';

const AdminCenterDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
 // const { user } = useAuth('Admin');
  const { selectedCenter, fetchCenterById, isLoading, error, clearError, deleteCenter } = useCenterStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch center data
  useEffect(() => {
    if (id) {
      fetchCenterById(Number(id));
    }
  }, [id, fetchCenterById]);

  // Handle center deactivation/activation
  const handleToggleStatus = async () => {
    if (!selectedCenter) return;
    
    setIsDeactivating(true);
    
    try {
      // In a real app, you would call an API to update the center status
      // For now, we'll just show a success message
      setSuccess(`Center ${selectedCenter.is_active ? 'deactivated' : 'activated'} successfully`);
      setIsDeactivating(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setLocalError('Failed to update center status');
      setIsDeactivating(false);
    }
  };

  // Handle center deletion
  const handleDeleteCenter = async () => {
    if (!selectedCenter) return;
    
    if (window.confirm(`Are you sure you want to delete the center "${selectedCenter.name}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      
      try {
        await deleteCenter(selectedCenter.id);
        setSuccess('Center deleted successfully');
        
        // Redirect to centers list after 2 seconds
        setTimeout(() => {
          navigate('/admin/centers');
        }, 2000);
      } catch (err) {
        setLocalError('Failed to delete center');
        setIsDeleting(false);
      }
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

  if (!selectedCenter) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Center not found</h3>
              <p className="mt-1 text-sm text-gray-500">The healthcare center you're looking for doesn't exist or you don't have access.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/admin/centers')}
                  variant="primary"
                >
                  Back to Centers
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
                onClick={() => navigate('/admin/centers')}
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
              <h1 className="text-3xl font-bold text-gray-900">{selectedCenter.name}</h1>
              <Badge
                variant={selectedCenter.is_active ? 'success' : 'danger'}
                className="ml-4"
              >
                {selectedCenter.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                as={Link}
                to={`/admin/centers/${selectedCenter.id}/edit`}
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                Edit Center
              </Button>
              <Button
                onClick={handleToggleStatus}
                //variant={selectedCenter.is_active ? 'danger' : 'success'}
                isLoading={isDeactivating}
              >
                {selectedCenter.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </motion.div>

        {(localError || error) && (
          <Alert
            variant="error"
            message={localError || error || ''}
            onClose={() => {
              setLocalError(null);
              clearError();
            }}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Center Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <p className="mt-1">{selectedCenter.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Description:</span>
                        <p className="mt-1">{selectedCenter.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Address:</span>
                        <p className="mt-1">{selectedCenter.address}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <p className="mt-1">
                          <Badge
                            variant={selectedCenter.is_active ? 'success' : 'danger'}
                          >
                            {selectedCenter.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <p className="mt-1">{selectedCenter.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="mt-1">{selectedCenter.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Website:</span>
                        <p className="mt-1">
                          {selectedCenter.website ? (
                            <a
                              href={selectedCenter.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {selectedCenter.website}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Coordinates:</span>
                        <p className="mt-1">
                          {selectedCenter.latitude && selectedCenter.longitude
                            ? `${selectedCenter.latitude}, ${selectedCenter.longitude}`
                            : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Delete Healthcare Center</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Permanently delete this healthcare center and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <div className="mt-4">
                          <Button
                            onClick={handleDeleteCenter}
                            variant="danger"
                            size="sm"
                            isLoading={isDeleting}
                          >
                            Delete Center
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab id="rooms" label="Rooms">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Rooms</h3>
                    <Button
                      as={Link}
                      to={`/admin/rooms/new?center=${selectedCenter.id}`}
                      variant="primary"
                      size="sm"
                    >
                      Add New Room
                    </Button>
                  </div>
                  
                  <div className="text-center py-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms found</h3>
                    <p className="mt-1 text-sm text-gray-500">This center has no rooms yet.</p>
                    <div className="mt-6">
                      <Button
                        as={Link}
                        to={`/admin/rooms/new?center=${selectedCenter.id}`}
                        variant="primary"
                      >
                        Add New Room
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab id="services" label="Services">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Services</h3>
                    <Button
                      as={Link}
                      to={`/admin/services/new?center=${selectedCenter.id}`}
                      variant="primary"
                      size="sm"
                    >
                      Add New Service
                    </Button>
                  </div>
                  
                  <div className="text-center py-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
                    <p className="mt-1 text-sm text-gray-500">This center has no services yet.</p>
                    <div className="mt-6">
                      <Button
                        as={Link}
                        to={`/admin/services/new?center=${selectedCenter.id}`}
                        variant="primary"
                      >
                        Add New Service
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab id="providers" label="Providers">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Healthcare Providers</h3>
                    <Button
                      as={Link}
                      to={`/admin/users/new?role=Provider&center=${selectedCenter.id}`}
                      variant="primary"
                      size="sm"
                    >
                      Add Provider
                    </Button>
                  </div>
                  
                  <div className="text-center py-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
                    <p className="mt-1 text-sm text-gray-500">This center has no healthcare providers yet.</p>
                    <div className="mt-6">
                      <Button
                        as={Link}
                        to={`/admin/users/new?role=Provider&center=${selectedCenter.id}`}
                        variant="primary"
                      >
                        Add Provider
                      </Button>
                    </div>
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

export default AdminCenterDetailsPage;
