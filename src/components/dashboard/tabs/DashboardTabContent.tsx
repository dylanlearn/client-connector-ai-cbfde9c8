
import { ReactNode, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DashboardTabContentProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
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
  className
}: DashboardTabContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-muted-foreground">Loading content...</span>
      </div>
    );
  }
  
  // If we have a title, wrap content in a card
  if (title) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }
  
  // Otherwise just return the children
  return <div className={className}>{children}</div>;
});

DashboardTabContent.displayName = "DashboardTabContent";

export default DashboardTabContent;
