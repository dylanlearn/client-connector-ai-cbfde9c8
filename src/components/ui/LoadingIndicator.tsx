
import { memo } from "react";

type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoadingIndicatorProps {
  /**
   * The size of the loading indicator
   * @default "md"
   */
  size?: LoadingSize;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Visible loading text
   */
  text?: string;
  /**
   * Whether to center the loading indicator
   * @default true
   */
  centered?: boolean;
  /**
   * The color of the spinner (using Tailwind classes)
   * @default "border-indigo-600"
   */
  color?: string;
}

const sizeClasses: Record<LoadingSize, string> = {
  xs: "h-4 w-4 border-2",
  sm: "h-8 w-8 border-2",
  md: "h-12 w-12 border-b-2",
  lg: "h-16 w-16 border-b-3",
  xl: "h-24 w-24 border-b-4"
};

/**
 * Reusable loading indicator component for consistent UX across the app
 * Using memo to prevent unnecessary re-renders
 */
const LoadingIndicator = memo(({ 
  size = "md", 
  className = "",
  text,
  centered = true,
  color = "border-indigo-600"
}: LoadingIndicatorProps) => {
  const containerClasses = centered ? "flex items-center justify-center" : "";
  
  return (
    <div className={containerClasses}>
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} ${color} ${className}`}
        aria-label="Loading"
      />
      {text && (
        <span className="ml-3 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
});

LoadingIndicator.displayName = "LoadingIndicator";

export default LoadingIndicator;
