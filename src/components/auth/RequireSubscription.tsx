
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { validateAuthState } from "@/utils/auth-utils";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, memo } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

interface RequireSubscriptionProps {
  children: React.ReactNode;
}

/**
 * Component that specifically checks for subscription status
 * Memoized to prevent unnecessary re-renders during routing checks
 */
const RequireSubscription = memo(({ children }: RequireSubscriptionProps) => {
  const { isLoading: subscriptionLoading, isActive, isAdmin } = useSubscription();
  const { user, isLoading: authLoading, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log("RequireSubscription - Profile:", profile);
  console.log("RequireSubscription - isAdmin from useSubscription:", isAdmin);
  console.log("RequireSubscription - profile role:", profile?.role);
  console.log("RequireSubscription - isActive:", isActive);
  console.log("RequireSubscription - current path:", location.pathname);
  
  // Use effect to ensure component is fully mounted before checking auth
  useEffect(() => {
    if (!subscriptionLoading && !authLoading) {
      setIsInitialized(true);
    }
  }, [subscriptionLoading, authLoading]);
  
  // Loading state during initialization or auth/subscription checks
  if (!isInitialized || subscriptionLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user || !validateAuthState(user, profile)) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Direct check for admin role in profile - this is the critical fix
  const hasAdminRole = profile?.role === 'admin';
  
  // Log detailed information for debugging
  console.log("Admin check details:", {
    "profile?.role": profile?.role,
    "isAdmin from useSubscription": isAdmin,
    "hasAdminRole": hasAdminRole
  });
  
  // Check for admin status first - admins always have access
  if (hasAdminRole) {
    console.log("Admin user detected via profile, granting access");
    return <>{children}</>;
  }
  
  if (isAdmin) {
    console.log("Admin user detected via subscription hook, granting access");
    return <>{children}</>;
  }
  
  // If user is authenticated but doesn't have an active status, redirect to pricing
  if (!isActive) {
    console.log("User does not have active subscription, redirecting to pricing");
    
    // Show a toast notification
    toast({
      title: "Subscription Required",
      description: "You need an active subscription to access this content.",
      variant: "destructive",
    });
    
    return <Navigate to="/pricing?needSubscription=true" state={{ from: location.pathname }} replace />;
  }
  
  // Render children if user is authenticated and has an active subscription
  return <>{children}</>;
});

RequireSubscription.displayName = "RequireSubscription";

export default RequireSubscription;
