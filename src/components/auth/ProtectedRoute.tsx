
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { isUserActive, validateAuthState } from "@/utils/auth-utils";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, memo } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route protection component that checks user authentication and subscription status
 * Memoized to prevent unnecessary re-renders during routing
 */
const ProtectedRoute = memo(({ children }: ProtectedRouteProps) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use effect to ensure we only run authentication checks after the component is mounted
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);
  
  // Loading display during initialization
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  // Redirect to login if user is not authenticated, preserving the intended destination
  if (!user || !validateAuthState(user, profile)) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Check if the user has an active subscription status or privileged role
  const active = isUserActive(profile);
  
  // If not active, redirect to pricing with a message
  if (!active) {
    // Use effect to show toast only once
    useEffect(() => {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to access this content.",
        variant: "destructive",
      });
    }, []);
    
    return <Navigate to="/pricing?needSubscription=true" state={{ from: location.pathname }} replace />;
  }
  
  // Render children if user is authenticated and has an active plan
  return <>{children}</>;
});

ProtectedRoute.displayName = "ProtectedRoute";

export default ProtectedRoute;
