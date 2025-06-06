import { useState, ChangeEvent, FormEvent } from 'react';

/**
 * Custom hook for form handling
 * @param initialValues - Initial form values
 * @param onSubmit - Function to call on form submission
 * @param validate - Optional validation function
 * @returns Form state and handlers
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T, resetForm: () => void) => void,
  validate?: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setValues({
        ...values,
        [name]: checked,
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }

    // Clear error when field is changed
    if (errors[name as string]) {
      const { [name]: _, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  // Handle input blur (for validation)
  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;

    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate on blur if validation function is provided
    if (validate) {
      const validationErrors = validate(values);
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name as string],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields if validation function is provided
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);

      setTouched(allTouched);

      // Don't submit if there are validation errors
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values, resetForm);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set a specific field value
  const setFieldValue = (field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is changed
    if (errors[field as string]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Set multiple field values at once
  const setMultipleFields = (newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));

    // Clear errors for changed fields
    const clearedErrors = { ...errors };
    Object.keys(newValues).forEach(key => {
      if (clearedErrors[key as string]) {
        delete clearedErrors[key as string];
      }
    });

    setErrors(clearedErrors);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setMultipleFields,
  };
};

export default useForm;
