import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  name,
  rows = 4,
  ...props
}) => {
  // Generate an ID if not provided
  const textareaId = id || name || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const baseTextareaClasses = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200';
  
  // Error and success classes
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const textareaClasses = `
    ${baseTextareaClasses}
    ${stateClasses}
    ${fullWidthClass}
    ${className}
  `;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        className={textareaClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Textarea;
