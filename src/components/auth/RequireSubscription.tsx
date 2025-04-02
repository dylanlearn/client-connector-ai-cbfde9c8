
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { isUserActive, validateAuthState } from "@/utils/auth-utils";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface RequireSubscriptionProps {
  children: React.ReactNode;
}

const RequireSubscription = ({ children }: RequireSubscriptionProps) => {
  const { isLoading: subscriptionLoading } = useSubscription();
  const { user, isLoading: authLoading, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use effect to ensure component is fully mounted before checking auth
  useEffect(() => {
    if (!subscriptionLoading && !authLoading) {
      setIsInitialized(true);
    }
  }, [subscriptionLoading, authLoading]);
  
  // Don't render anything until we've completed the initial checks
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Don't redirect while things are loading
  if (subscriptionLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user || !validateAuthState(user, profile)) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Use our utility function to check if the user has an active subscription or privileged role
  const active = isUserActive(profile);
  
  // If user is authenticated but doesn't have an active status, redirect to pricing
  if (!active) {
    // Show a toast notification
    useEffect(() => {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to access this content.",
        variant: "destructive",
      });
    }, []);
    
    return <Navigate to="/pricing?needSubscription=true" state={{ from: location.pathname }} replace />;
  }
  
  // Render children if user is authenticated and has an active subscription
  return <>{children}</>;
};

export default RequireSubscription;
