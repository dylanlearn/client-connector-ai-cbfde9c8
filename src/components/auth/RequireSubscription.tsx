
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthorization } from "@/hooks/use-authorization";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { Permission } from "@/utils/authorization/auth-service";

interface RequireSubscriptionProps {
  children: ReactNode;
}

/**
 * Component that checks for paid subscription status
 */
const RequireSubscription = ({ children }: RequireSubscriptionProps) => {
  const { isLoading, user } = useAuth();
  const { hasPaidSubscription } = useAuthorization();
  const location = useLocation();
  const { toast } = useToast();
  
  // Loading state during initialization or auth checks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If user doesn't have a paid subscription, redirect to pricing
  if (!hasPaidSubscription()) {
    toast({
      title: "Subscription Required",
      description: "You need an active subscription to access this content.",
      variant: "destructive",
    });
    
    return <Navigate to="/pricing?needSubscription=true" state={{ from: location.pathname }} replace />;
  }
  
  // Render children if user has an active subscription
  return <>{children}</>;
};

export default RequireSubscription;
