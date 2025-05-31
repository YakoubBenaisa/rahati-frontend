import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  animate = false,
  onClick,
  hoverable = false,
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  
  // Hoverable classes
  const hoverableClasses = hoverable ? 'cursor-pointer transition-all duration-300 hover:shadow-lg' : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${hoverableClasses}
    ${className}
  `;
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  
  const CardComponent = animate ? motion.div : 'div';
  
  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      variants={animate ? cardVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
    >
      {(title || subtitle) && (
        <div className="px-6 pt-6 pb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={`px-6 py-4 ${!title && !subtitle ? 'pt-6' : ''}`}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </CardComponent>
  );
};

export default Card;
