import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Option[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  label,
  options = [],
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  name,
  children,
  ...props
}) => {
  // Generate an ID if not provided
  const selectId = id || name || `select-${Math.random().toString(36).substring(2, 9)}`;

  // Base classes
  const baseSelectClasses = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white';

  // Error and success classes
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';

  // Combine all classes
  const selectClasses = `
    ${baseSelectClasses}
    ${stateClasses}
    ${fullWidthClass}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          name={name}
          className={selectClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {children || (options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
