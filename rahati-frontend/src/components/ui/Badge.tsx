import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  // Rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  // Combine all classes
  const badgeClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${roundedClasses}
    ${className}
  `;
  
  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
