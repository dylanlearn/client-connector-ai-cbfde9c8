
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { toast } from "sonner";
import { recordClientError } from "@/utils/monitoring/api-usage";

interface AppErrorBoundaryProps {
  children: ReactNode;
  /** Optional user id for error tracking */
  userId?: string;
  /** Optional callback for error handling */
  onError?: (error: Error) => void;
}

export function AppErrorBoundary({ children, userId, onError }: AppErrorBoundaryProps) {
  const handleError = (error: Error) => {
    // We already log in the ErrorBoundary component, but we can add toast notifications here
    toast.error("An error occurred", {
      description: "The application encountered an error. Our team has been notified.",
      duration: 5000,
    });
    
    // Additional logging or error handling could go here
    console.error("[AppErrorBoundary]", error);
    
    // If a custom error handler was provided, call it
    if (onError) {
      onError(error);
    }
    
    // If a userId was provided, include it in error tracking
    if (userId) {
      recordClientError(error, error.stack, "AppErrorBoundary", userId)
        .catch(e => console.error("Error recording client error:", e));
    }
  };
  
  return (
    <ErrorBoundary
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
