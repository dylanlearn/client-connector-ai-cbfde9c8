import { ReactNode, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

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
  errorComponent
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
        <div className="space-y-4">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton key={index} className={`w-full ${skeletonHeight}`} />
          ))}
        </div>
      );
    }
    
    // Default loading spinner
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-muted-foreground">Loading content...</span>
      </div>
    );
  };
  
  // Handle error state
  const renderErrorState = () => {
    if (errorComponent) {
      return errorComponent;
    }
    
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-red-800 font-medium">Error loading content</h3>
        <p className="text-red-700 text-sm mt-1">
          {error?.message || "An unknown error occurred. Please try again."}
        </p>
      </div>
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
