
import { ReactNode, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertMessage } from "@/components/ui/alert-message";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface DashboardTabContentProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
  /**
   * Number of skeleton items to show when loading
   * @default 0
   */
  skeletonCount?: number;
  /**
   * Height of each skeleton item
   * @default "h-12"
   */
  skeletonHeight?: string;
  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;
  /**
   * Custom error state
   */
  error?: Error | null;
  /**
   * Custom error component
   */
  errorComponent?: ReactNode;
  /**
   * Whether to show an error boundary around content
   * @default true
   */
  withErrorBoundary?: boolean;
  /**
   * Function to retry loading data on failure
   */
  onRetry?: () => void;
}

/**
 * Shared component for dashboard tab content with consistent styling
 * Memoized to prevent unnecessary re-renders when parent tabs change
 */
const DashboardTabContent = memo(({
  title,
  description,
  isLoading = false,
  children,
  className = "",
  skeletonCount = 0,
  skeletonHeight = "h-12",
  loadingComponent,
  error,
  errorComponent,
  withErrorBoundary = true,
  onRetry
}: DashboardTabContentProps) => {
  // Handle loading state
  const renderLoadingState = () => {
    // If a custom loading component is provided, use it
    if (loadingComponent) {
      return loadingComponent;
    }
    
    // If skeleton count is specified, render skeletons
    if (skeletonCount > 0) {
      return (
        <div className="space-y-4" aria-label="Loading content">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton key={index} className={`w-full ${skeletonHeight}`} />
          ))}
        </div>
      );
    }
    
    // Default loading spinner
    return (
      <div className="flex justify-center items-center py-12" role="status" aria-live="polite">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-muted-foreground">Loading content...</span>
        <span className="sr-only">Loading content, please wait</span>
      </div>
    );
  };
  
  // Handle error state
  const renderErrorState = () => {
    if (errorComponent) {
      return errorComponent;
    }
    
    return (
      <AlertMessage type="error" title="Error loading content">
        <p className="mb-4">
          {error?.message || "An unknown error occurred. Please try again."}
        </p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded"
          >
            Retry
          </button>
        )}
      </AlertMessage>
    );
  };
  
  // Determine what content to render
  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }
    
    if (error) {
      return renderErrorState();
    }
    
    if (withErrorBoundary) {
      return (
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      );
    }
    
    return children;
  };
  
  // If we have a title, wrap content in a card
  if (title) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    );
  }
  
  // Otherwise just return the content
  return <div className={className}>{renderContent()}</div>;
});

DashboardTabContent.displayName = "DashboardTabContent";

export default DashboardTabContent;
