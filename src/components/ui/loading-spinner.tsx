
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingSpinner = ({
  size = 'md',
  color = 'text-primary',
  className = '',
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${color} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};
