import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../layouts';
import { Button, Input, Select, Alert } from '../../components/ui';
import { useForm } from '../../hooks';
import { useAuthStore } from '../../store';
import { isValidEmail, isValidPassword, isValidPhone } from '../../utils';
import { UserRole } from '../../types';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  phone: string;
  address: string;
}

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated, error, clearError, setRedirectUrl } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  // Get redirect URL from location state or query params
  const getRedirectUrl = () => {
    // Check location state first
    const state = location.state as { from?: string };
    if (state?.from) return state.from;

    // Then check URL query params
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    return redirect || '/dashboard';
  };

  // Set redirect URL on component mount
  useEffect(() => {
    const redirectUrl = getRedirectUrl();
    if (redirectUrl !== '/dashboard') {
      setRedirectUrl(redirectUrl);
    }
  }, [location, setRedirectUrl]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getRedirectUrl());
    }
  }, [isAuthenticated, navigate, location]);

  // Show alert when there's an error
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    }
  }, [error]);

  // Form validation
  const validateForm = (values: RegisterFormValues) => {
      const errors: Partial<Omit<RegisterFormValues, 'role'> & { role?: string }> = {};

    if (!values.name) {
      errors.name = 'Name is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Password must be at least 8 characters and include a number, uppercase, and lowercase letter';
    }

    if (!values.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (values.password !== values.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }

    if (!values.role) {
      errors.role = 'Please select a role';
    }

    if (values.phone && !isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number';
    }

    return errors;
  };

  // Form submission handler
  const handleSubmit = async (values: RegisterFormValues) => {
    const redirectUrl = getRedirectUrl();
    await register(values, redirectUrl);
  };

  // Initialize form
  const { values, errors, handleChange, handleBlur, handleSubmit: submitForm, isSubmitting } = useForm<RegisterFormValues>(
    {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'Patient',
      phone: '',
      address: '',
    },
    handleSubmit,
    validateForm
  );

  // Role options
  const roleOptions = [
    { value: 'Patient', label: 'Patient' },
    { value: 'Provider', label: 'Healthcare Provider' },
  ];

  return (
    <AuthLayout
      title="Create a new account"
      subtitle="Or sign in to your existing account"
    >
      {showAlert && error && (
        <Alert
          variant="error"
          message={error}
          onClose={() => {
            setShowAlert(false);
            clearError();
          }}
          className="mb-4"
        />
      )}

      <form className="space-y-6" onSubmit={submitForm}>
        <Input
          label="Full name"
          type="text"
          name="name"
          id="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          required
        />

        <Input
          label="Email address"
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          helperText="Password must be at least 8 characters and include a number, uppercase, and lowercase letter"
          required
        />

        <Input
          label="Confirm password"
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          autoComplete="new-password"
          value={values.password_confirmation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password_confirmation}
          required
        />

        <Select
          label="Role"
          name="role"
          id="role"
          options={roleOptions}
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.role}
          required
        />

        <Input
          label="Phone number (optional)"
          type="tel"
          name="phone"
          id="phone"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
        />

        <Input
          label="Address (optional)"
          type="text"
          name="address"
          id="address"
          autoComplete="street-address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address}
        />

        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
          >
            Sign up
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
            Facebook
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
