
import { memo } from "react";

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Reusable loading indicator component for consistent UX across the app
 * Using memo to prevent unnecessary re-renders
 */
const LoadingIndicator = memo(({ 
  size = "md", 
  className = "" 
}: LoadingIndicatorProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-b-3",
  };
  
  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-indigo-600 ${className}`}
        aria-label="Loading"
      />
    </div>
  );
});

LoadingIndicator.displayName = "LoadingIndicator";

export default LoadingIndicator;
