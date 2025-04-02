
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { isUserActive } from "@/utils/auth-utils";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // Show loading state if authentication is still being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Redirect to login if user is not authenticated, preserving the intended destination
  if (!user) {
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
};

export default ProtectedRoute;
