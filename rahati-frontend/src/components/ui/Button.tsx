import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { motion } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Base button props
interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// Props for regular button
interface ButtonProps extends ButtonBaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
  to?: never;
}

// Props for link button
interface LinkButtonProps extends ButtonBaseProps, Omit<LinkProps, 'className'> {
  as: typeof Link;
}

// Combined props type
type CombinedButtonProps = ButtonProps | LinkButtonProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, CombinedButtonProps>((props, ref) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    as: Component = 'button',
    disabled,
    ...rest
  } = props;

  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200';

  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2',
    secondary: 'bg-[var(--color-secondary-600)] text-white hover:bg-[var(--color-secondary-700)] focus:ring-2 focus:ring-[var(--color-secondary-500)] focus:ring-offset-2',
    accent: 'bg-[var(--color-accent)] text-white hover:opacity-90 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2',
    outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2',
    ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2',
    link: 'bg-transparent text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] hover:underline p-0 focus:ring-0',
    danger: 'bg-[var(--color-error)] text-white hover:opacity-90 focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-2',
  };

  // Disabled classes
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || isLoading ? disabledClasses : ''}
    ${fullWidthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Button content
  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  // Animation props
  const animationProps = {
    whileTap: { scale: disabled || isLoading ? 1 : 0.98 },
    whileHover: { scale: disabled || isLoading ? 1 : 1.02 },
  };

  // Render as Link
  if (Component === Link) {
    return (
      <Component
        className={buttonClasses}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...rest as LinkProps}
      >
        {content}
      </Component>
    );
  }

  // Render as button
  return (
    <Component
      className={buttonClasses}
      disabled={disabled || isLoading}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      {content}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
