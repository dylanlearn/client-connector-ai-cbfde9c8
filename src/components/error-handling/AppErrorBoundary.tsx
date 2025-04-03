
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  const { user } = useAuth();
  
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
