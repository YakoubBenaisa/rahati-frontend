import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert, Select, Textarea } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useFeedbackStore, useAppointmentStore } from '../../../store';
import { RecommendationLikelihood } from '../../../types';

interface FeedbackFormValues {
  appointment_id: number | null;
  rating: number;
  comment: string;
  category: string;
  provider_rating: number;
  facility_rating: number;
  recommendation_likelihood: RecommendationLikelihood;
}

const PatientCreateFeedback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  
  const { user } = useAuth('Patient');
  const { 
    submitFeedback, 
    error: feedbackError 
  } = useFeedbackStore();
  
  const { 
    appointments, 
    fetchAppointments, 
    isLoading: appointmentsLoading 
  } = useAppointmentStore();
  
  const [formValues, setFormValues] = useState<FeedbackFormValues>({
    appointment_id: appointmentId ? Number(appointmentId) : null,
    rating: 0,
    comment: '',
    category: '',
    provider_rating: 0,
    facility_rating: 0,
    recommendation_likelihood: 'neutral'
  });
  
  const [errors, setErrors] = useState<Partial<FeedbackFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's completed appointments for the dropdown
  useEffect(() => {
    if (user?.id) {
      fetchAppointments({ patient_id: user.id, status: 'completed' });
    }
  }, [fetchAppointments, user]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'appointment_id') {
      setFormValues({
        ...formValues,
        [name]: value ? Number(value) : null
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name as keyof FeedbackFormValues]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Handle star rating click
  const handleRatingClick = (ratingType: 'rating' | 'provider_rating' | 'facility_rating', value: number) => {
    setFormValues({
      ...formValues,
      [ratingType]: value
    });
    
    // Clear error for this field
    if (errors[ratingType]) {
      setErrors({
        ...errors,
        [ratingType]: undefined
      });
    }
  };

  // Validate form
  const validateForm = (): Partial<FeedbackFormValues> => {
    const newErrors: Partial<FeedbackFormValues> = {};
    
   
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await submitFeedback(formValues);
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/patient/feedback');
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating component
  const renderStarRating = (
    ratingType: 'rating' | 'provider_rating' | 'facility_rating',
    currentRating: number,
    error?: string
  ) => {
    return (
      <div>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(ratingType, star)}
              className={`h-8 w-8 ${
                star <= currentRating ? 'text-yellow-400' : 'text-gray-300'
              } focus:outline-none`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
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
            title="Feedback Submitted"
            message="Your feedback has been submitted successfully. Thank you for your input!"
            className="mb-6"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">
                Submit Feedback
              </h1>
              <p className="mt-1 text-gray-600">
                Share your experience to help us improve our services.
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Appointment selection */}
                <div className="mb-6">
                  <label htmlFor="appointment_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Appointment*
                  </label>
                  <Select
                    id="appointment_id"
                    name="appointment_id"
                    value={formValues.appointment_id?.toString() || ''}
                    onChange={handleInputChange}
                    className="w-full"
                    //error={errors.appointment_id}
                    required
                  >
                    <option value="">-- Select an appointment --</option>
                    {appointmentsLoading ? (
                      <option disabled>Loading appointments...</option>
                    ) : appointments.length === 0 ? (
                      <option disabled>No completed appointments found</option>
                    ) : (
                      appointments
                        .filter(a => a.status === 'completed')
                        .map(appointment => (
                          <option key={appointment.id} value={appointment.id.toString()}>
                            {new Date(appointment.appointment_datetime).toLocaleDateString()} - {appointment.center?.name || 'Unknown Center'}
                          </option>
                        ))
                    )}
                  </Select>
                </div>

                {/* Overall rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Rating*
                  </label>
                  {renderStarRating('rating', formValues.rating, errors.rating as string | undefined)}
                </div>

                {/* Provider rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider Rating*
                  </label>
                  {renderStarRating('provider_rating', formValues.provider_rating, errors.provider_rating as string | undefined)}
                </div>

                {/* Facility rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Rating*
                  </label>
                  {renderStarRating('facility_rating', formValues.facility_rating, errors.facility_rating as string | undefined)}
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <Select
                    id="category"
                    name="category"
                    value={formValues.category}
                    onChange={handleInputChange}
                    className="w-full"
                    error={errors.category}
                    required
                  >
                    <option value="">-- Select a category --</option>
                    <option value="medical_care">Medical Care</option>
                    <option value="staff_service">Staff Service</option>
                    <option value="facility_cleanliness">Facility Cleanliness</option>
                    <option value="appointment_scheduling">Appointment Scheduling</option>
                    <option value="transportation_service">Transportation Service</option>
                    <option value="accommodation_service">Accommodation Service</option>
                    <option value="other">Other</option>
                  </Select>
                </div>

                {/* Recommendation likelihood */}
                <div className="mb-6">
                  <label htmlFor="recommendation_likelihood" className="block text-sm font-medium text-gray-700 mb-1">
                    How likely are you to recommend our services to others?*
                  </label>
                  <Select
                    id="recommendation_likelihood"
                    name="recommendation_likelihood"
                    value={formValues.recommendation_likelihood}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  >
                    <option value="very_likely">Very Likely</option>
                    <option value="likely">Likely</option>
                    <option value="neutral">Neutral</option>
                    <option value="unlikely">Unlikely</option>
                    <option value="very_unlikely">Very Unlikely</option>
                  </Select>
                </div>

                {/* Comments */}
                <div className="mb-6">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Comments
                  </label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formValues.comment}
                    onChange={handleInputChange}
                    placeholder="Please share any additional feedback or suggestions..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                {/* Submit button */}
                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || success}
                  >
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PatientCreateFeedback;
