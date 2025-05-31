import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useTransportationStore } from '../../../store';

const PatientTransportation: React.FC = () => {
  const { user } = useAuth('Patient');
  const {
    transportationRequests,
    fetchTransportationRequests,
    cancelTransportationRequest,
    isLoading,
    error
  } = useTransportationStore();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchTransportationRequests({ patient_id: user.id });
    }
  }, [fetchTransportationRequests, user]);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time from datetime string
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle transportation request cancellation
  const handleCancelTransportation = async (id: number) => {
    setCancellingId(id);
    try {
      await cancelTransportationRequest(id);
      setSuccessMessage('Transportation request cancelled successfully');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error cancelling transportation request:', err);
    } finally {
      setCancellingId(null);
    }
  };

  // Filter transportation requests based on active tab
  const filteredRequests = transportationRequests.filter(request => {
    const pickupDate = new Date(request.pickup_time);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return pickupDate >= today && request.status !== 'cancelled' && request.status !== 'completed';
    } else if (activeTab === 'past') {
      return pickupDate < today || request.status === 'completed' || request.status === 'cancelled';
    }
    
    return true; // 'all' tab
  });

  // Sort transportation requests by date
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = new Date(a.pickup_time);
    const dateB = new Date(b.pickup_time);
    
    if (activeTab === 'past') {
      return dateB.getTime() - dateA.getTime();
    }
    
    return dateA.getTime() - dateB.getTime();
  });

  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-primary-100 text-primary-700';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'modified':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success message */}
        {successMessage && (
          <Alert 
            variant="success" 
            message={successMessage} 
            className="mb-4"
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {/* Error message */}
        {error && (
          <Alert 
            variant="error" 
            message={error} 
            className="mb-4"
            onClose={() => {}}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">My Transportation</h1>
          <p className="mt-2 text-gray-600">
            View and manage your transportation requests.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex justify-end"
        >
          <Button
            as={Link}
            to="/patient/transportation/new"
            variant="primary"
            className="flex items-center"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Request New Transportation
          </Button>
        </motion.div>

        {/* Transportation requests list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
              <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No transportation requests found</h4>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming transportation requests."
                  : activeTab === 'past'
                  ? "You don't have any past transportation requests."
                  : "You don't have any transportation requests."}
              </p>
              <Button
                as={Link}
                to="/patient/transportation/new"
                variant="primary"
              >
                Request Transportation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="font-medium text-gray-900">
                          {formatDate(request.pickup_time)} at {formatTime(request.pickup_time)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900">
                          <span className="font-medium">From:</span> {request.pickup_location}
                        </p>
                        <p className="text-gray-900">
                          <span className="font-medium">To:</span> {request.dropoff_location}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Vehicle:</span> {request.vehicle_type}, {request.passenger_count} passenger(s)
                        </p>
                        {request.special_requirements && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Special requirements:</span> {request.special_requirements}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <div className="ml-4 flex space-x-2">
                        <Button
                          as={Link}
                          to={`/patient/transportation/${request.id}`}
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                        {(request.status === 'pending' || request.status === 'confirmed') && (
                          <>
                            <Button
                              as={Link}
                              to={`/patient/transportation/${request.id}/edit`}
                              variant="outline"
                              size="sm"
                              className="text-primary-600 border-primary-600 hover:bg-primary-50"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleCancelTransportation(request.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              isLoading={cancellingId === request.id}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PatientTransportation;
