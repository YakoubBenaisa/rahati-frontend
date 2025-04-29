import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Card, Badge, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useFeedbackStore } from '../../../store';
import { Feedback } from '../../../types';

const PatientFeedback: React.FC = () => {
  const { user } = useAuth('Patient');
  const {
    feedbackList,
    fetchFeedback,
    isLoading,
    error
  } = useFeedbackStore();
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchFeedback({ patient_id: user.id });
    }
  }, [fetchFeedback, user]);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get rating stars
  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get recommendation likelihood display
  const getRecommendationDisplay = (likelihood: string) => {
    switch (likelihood) {
      case 'very_likely':
        return 'Very Likely';
      case 'likely':
        return 'Likely';
      case 'neutral':
        return 'Neutral';
      case 'unlikely':
        return 'Unlikely';
      case 'very_unlikely':
        return 'Very Unlikely';
      default:
        return likelihood;
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Feedback</h1>
              <p className="mt-2 text-gray-600">
                View your feedback and ratings for past appointments.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                as={Link}
                to="/patient/feedback/new"
                variant="primary"
                className="flex items-center"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Submit New Feedback
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feedback list */}
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
          ) : feedbackList.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
              <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h4>
              <p className="text-gray-600 mb-4">
                You haven't submitted any feedback yet.
              </p>
              <Button
                as={Link}
                to="/patient/feedback/new"
                variant="primary"
              >
                Submit Feedback
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackList.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {feedback.appointment?.center?.name || 'Unknown Center'}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600">
                          {feedback.created_at ? formatDate(feedback.created_at) : 'Unknown date'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">Overall Rating:</span>
                          {getRatingStars(feedback.rating)}
                        </div>
                        {feedback.provider_rating && (
                          <div className="flex items-center mt-1">
                            <span className="text-sm font-medium text-gray-700 mr-2">Provider Rating:</span>
                            {getRatingStars(feedback.provider_rating)}
                          </div>
                        )}
                        {feedback.facility_rating && (
                          <div className="flex items-center mt-1">
                            <span className="text-sm font-medium text-gray-700 mr-2">Facility Rating:</span>
                            {getRatingStars(feedback.facility_rating)}
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Category:</span> {getCategoryDisplayName(feedback.category)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Would Recommend:</span> {getRecommendationDisplay(feedback.recommendation_likelihood)}
                        </p>
                        {feedback.comment && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Comment:</p>
                            <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded-md">
                              {feedback.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start">
                      <Badge
                        variant="primary"
                        className="mb-2"
                      >
                        {feedback.appointment?.status || 'Unknown status'}
                      </Badge>
                      <Button
                        as={Link}
                        to={`/patient/feedback/${feedback.id}`}
                        variant="outline"
                        size="sm"
                        className="mb-2"
                      >
                        View Details
                      </Button>
                      <Button
                        as={Link}
                        to={`/patient/appointments/${feedback.appointment_id}`}
                        variant="outline"
                        size="sm"
                      >
                        View Appointment
                      </Button>
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

export default PatientFeedback;
