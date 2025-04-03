
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { toast } from "sonner";

interface AppErrorBoundaryProps {
  children: ReactNode;
  /** Optional user id for error tracking */
  userId?: string;
}

export function AppErrorBoundary({ children, userId }: AppErrorBoundaryProps) {
  const handleError = (error: Error) => {
    // We already log in the ErrorBoundary component, but we can add toast notifications here
    toast.error("An error occurred", {
      description: "The application encountered an error. Our team has been notified.",
      duration: 5000,
    });
    
    // Additional logging or error handling could go here
    console.error("[AppErrorBoundary]", error);
  };
  
  return (
    <ErrorBoundary
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
