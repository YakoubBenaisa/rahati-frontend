import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert, Input, Switch } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { useUserStore } from '../../../store';

interface PasswordFormValues {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const PatientSettings: React.FC = () => {
  const {  logout } = useAuth('Patient');
  const { updatePassword, error: userError } = useUserStore();

  const [passwordFormValues, setPasswordFormValues] = useState<PasswordFormValues>({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState<Partial<PasswordFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [feedbackRequests, setFeedbackRequests] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy settings
  const [shareDataWithProviders, setShareDataWithProviders] = useState(true);
  const [shareAnonymousData, setShareAnonymousData] = useState(false);

  // Handle input changes for password form
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordFormValues({
      ...passwordFormValues,
      [name]: value
    });

    // Clear error for this field
    if (errors[name as keyof PasswordFormValues]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Validate password form
  const validatePasswordForm = (): Partial<PasswordFormValues> => {
    const newErrors: Partial<PasswordFormValues> = {};

    if (!passwordFormValues.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!passwordFormValues.password) {
      newErrors.password = 'New password is required';
    } else if (passwordFormValues.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!passwordFormValues.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your new password';
    } else if (passwordFormValues.password !== passwordFormValues.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    return newErrors;
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updatePassword(passwordFormValues);

      setSuccess(true);
      setPasswordFormValues({
        current_password: '',
        password: '',
        password_confirmation: ''
      });

      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password. Please check your current password and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle notification settings save
  const handleNotificationSettingsSave = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create settings object
      /*const notificationSettings = {
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        appointment_reminders: appointmentReminders,
        feedback_requests: feedbackRequests,
        marketing_emails: marketingEmails
      };*/

      // Update user profile with notification settings

      setSuccess(true);

      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('Failed to update notification settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle privacy settings save
  const handlePrivacySettingsSave = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create settings object
     /* const privacySettings = {
        share_data_with_providers: shareDataWithProviders,
        share_anonymous_data: shareAnonymousData
      };*/

      // Update user profile with privacy settings

      setSuccess(true);

      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      setError('Failed to update privacy settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            message="Your settings have been updated successfully."
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Password Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Change Password
                </h2>
                <p className="mt-1 text-gray-600">
                  Update your password to keep your account secure.
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password*
                      </label>
                      <Input
                        id="current_password"
                        name="current_password"
                        type="password"
                        value={passwordFormValues.current_password}
                        onChange={handlePasswordInputChange}
                        error={errors.current_password}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password*
                      </label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={passwordFormValues.password}
                        onChange={handlePasswordInputChange}
                        error={errors.password}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password*
                      </label>
                      <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={passwordFormValues.password_confirmation}
                        onChange={handlePasswordInputChange}
                        error={errors.password_confirmation}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Notification Settings
                </h2>
                <p className="mt-1 text-gray-600">
                  Manage how you receive notifications.
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via text message</p>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onChange={setSmsNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Appointment Reminders</h3>
                      <p className="text-sm text-gray-500">Receive reminders about upcoming appointments</p>
                    </div>
                    <Switch
                      checked={appointmentReminders}
                      onChange={setAppointmentReminders}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Feedback Requests</h3>
                      <p className="text-sm text-gray-500">Receive requests to provide feedback after appointments</p>
                    </div>
                    <Switch
                      checked={feedbackRequests}
                      onChange={setFeedbackRequests}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                      <p className="text-sm text-gray-500">Receive promotional emails about our services</p>
                    </div>
                    <Switch
                      checked={marketingEmails}
                      onChange={setMarketingEmails}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={handleNotificationSettingsSave}
                  >
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Privacy Settings
                </h2>
                <p className="mt-1 text-gray-600">
                  Manage how your information is used.
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Share Data with Healthcare Providers</h3>
                      <p className="text-sm text-gray-500">Allow your healthcare providers to access your medical information</p>
                    </div>
                    <Switch
                      checked={shareDataWithProviders}
                      onChange={setShareDataWithProviders}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Share Anonymous Data for Research</h3>
                      <p className="text-sm text-gray-500">Allow us to use your anonymized data for healthcare research</p>
                    </div>
                    <Switch
                      checked={shareAnonymousData}
                      onChange={setShareAnonymousData}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={handlePrivacySettingsSave}
                  >
                    Save Privacy Settings
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Actions
                </h2>
                <p className="mt-1 text-gray-600">
                  Manage your account.
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Log Out</h3>
                    <p className="text-sm text-gray-500 mb-2">Log out of your account on this device</p>
                    <Button
                      variant="outline"
                      onClick={() => logout()}
                    >
                      Log Out
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
                    <p className="text-sm text-gray-500 mb-2">Permanently delete your account and all associated data</p>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientSettings;
