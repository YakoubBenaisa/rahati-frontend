import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useFeedbackStore } from '../../../store';

const PatientFeedbackDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth('Patient');
  const { 
    selectedFeedback: feedback, 
    fetchFeedbackById, 
    deleteFeedback,
    isLoading, 
    error: feedbackError 
  } = useFeedbackStore();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFeedbackById(Number(id));
    }
  }, [id, fetchFeedbackById]);

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

  // Handle feedback deletion
  const handleDeleteFeedback = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await deleteFeedback(Number(id));
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/patient/feedback');
      }, 2000);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            to="/patient/feedback"
            className="inline-flex items-center text-gray-600 hover:text-primary-600"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Feedback
          </Link>
        </div>

        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {feedbackError && (
          <Alert
            variant="error"
            title="Error"
            message={feedbackError}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            title="Feedback Deleted"
            message="Your feedback has been deleted successfully. Redirecting to feedback list..."
            className="mb-6"
          />
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : feedback ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Feedback Details
                    </h1>
                    <p className="mt-1 text-gray-600">
                      Submitted on {feedback.created_at ? formatDate(feedback.created_at) : 'Unknown date'}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">Overall Rating:</span>
                      {getRatingStars(feedback.rating)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Appointment information */}
                  {feedback.appointment && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h2>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Date & Time</p>
                            <p className="text-gray-900">
                              {formatDate(feedback.appointment.appointment_datetime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Provider</p>
                            <p className="text-gray-900">
                              {feedback.appointment.provider?.name || 'Provider not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Center</p>
                            <p className="text-gray-900">
                              {feedback.appointment.center?.name || 'Center not specified'}
                            </p>
                          </div>
                          <div>
                            <Link
                              to={`/patient/appointments/${feedback.appointment.id}`}
                              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                            >
                              View Appointment Details
                              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ratings information */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ratings</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Overall Rating</p>
                          <div className="flex items-center">
                            {getRatingStars(feedback.rating)}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Provider Rating</p>
                          <div className="flex items-center">
                            {getRatingStars(feedback.provider_rating || 0)}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Facility Rating</p>
                          <div className="flex items-center">
                            {getRatingStars(feedback.facility_rating || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional information */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-gray-900">
                          {getCategoryDisplayName(feedback.category)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Would Recommend</p>
                        <p className="text-gray-900">
                          {getRecommendationDisplay(feedback.recommendation_likelihood)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                {feedback.comment && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Comments</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-900">{feedback.comment}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button
                    as={Link}
                    to={`/patient/feedback/${feedback.id}/edit`}
                    variant="primary"
                  >
                    Edit Feedback
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Feedback
                  </Button>
                </div>
              </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Feedback</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this feedback? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteFeedback}
                      isLoading={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
            <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Feedback Not Found</h4>
            <p className="text-gray-600 mb-4">
              The feedback you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              as={Link}
              to="/patient/feedback"
              variant="primary"
            >
              Back to Feedback
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PatientFeedbackDetails;
