import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  name,
  ...props
}) => {
  // Generate an ID if not provided
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const baseInputClasses = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200';
  
  // Error and success classes
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  // Icon padding classes
  const iconPaddingClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const inputClasses = `
    ${baseInputClasses}
    ${stateClasses}
    ${iconPaddingClasses}
    ${fullWidthClass}
    ${className}
  `;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          name={name}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
