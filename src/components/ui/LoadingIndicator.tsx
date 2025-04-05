
import React from 'react';

interface LoadingIndicatorProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'md',
  color = 'border-gray-300'
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 ${color} border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingIndicator;
