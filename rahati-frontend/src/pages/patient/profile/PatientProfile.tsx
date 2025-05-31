import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert, Input, Textarea } from '../../../components/ui';
import { useUserStore } from '../../../store';

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  caregiver_name?: string;
  caregiver_phone?: string;
}

const PatientProfile: React.FC = () => {
  const { 
    currentUser, 
    fetchCurrentUser, 
    updateUserProfile, 
    isLoading, 
    error: userError 
  } = useUserStore();
  
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
    caregiver_name: '',
    caregiver_phone: ''
  });
  
  const [errors, setErrors] = useState<Partial<ProfileFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch current user data
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Initialize form values when user data is loaded
  useEffect(() => {
    if (currentUser) {
      setFormValues({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        caregiver_name: currentUser.caregiver_name || '',
        caregiver_phone: currentUser.caregiver_phone || ''
      });
    }
  }, [currentUser]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name as keyof ProfileFormValues]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Validate form
  const validateForm = (): Partial<ProfileFormValues> => {
    const newErrors: Partial<ProfileFormValues> = {};
    
    if (!formValues.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formValues.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formValues.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formValues.address) {
      newErrors.address = 'Address is required';
    }
    
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
      await updateUserProfile(formValues);
      
      setSuccess(true);
      setIsEditing(false);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date to display in a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {userError && (
          <Alert
            variant="error"
            title="Error"
            message={userError}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            title="Success"
            message="Your profile has been updated successfully."
            className="mb-6"
            onClose={() => setSuccess(false)}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            View and manage your personal information.
          </p>
        </motion.div>

        {isLoading && !currentUser ? (
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name*
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formValues.name}
                          onChange={handleInputChange}
                          error={errors.name}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address*
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formValues.email}
                          onChange={handleInputChange}
                          error={errors.email}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number*
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formValues.phone}
                          onChange={handleInputChange}
                          error={errors.phone}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address*
                        </label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formValues.address}
                          onChange={handleInputChange}
                          error={errors.address}
                          required
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Caregiver Information</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        If you have a caregiver, please provide their contact information.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="caregiver_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Caregiver Name
                          </label>
                          <Input
                            id="caregiver_name"
                            name="caregiver_name"
                            type="text"
                            value={formValues.caregiver_name || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="caregiver_phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Caregiver Phone
                          </label>
                          <Input
                            id="caregiver_phone"
                            name="caregiver_phone"
                            type="tel"
                            value={formValues.caregiver_phone || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1 text-gray-900">{currentUser?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                        <p className="mt-1 text-gray-900">{currentUser?.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                        <p className="mt-1 text-gray-900">{currentUser?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <p className="mt-1 text-gray-900">{currentUser?.address || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Caregiver Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Caregiver Name</h3>
                          <p className="mt-1 text-gray-900">{currentUser?.caregiver_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Caregiver Phone</h3>
                          <p className="mt-1 text-gray-900">{currentUser?.caregiver_phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                          <p className="mt-1 text-gray-900">{currentUser?.created_at ? formatDate(currentUser.created_at) : 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                          <p className="mt-1 text-gray-900">{currentUser?.updated_at ? formatDate(currentUser.updated_at) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default PatientProfile;
