
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";
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
  const { isAdmin: adminStatusDirect, isVerifying } = useAdminStatus();
  const { user, isLoading: authLoading, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log("RequireSubscription - Check details:", { 
    "profile?.role": profile?.role,
    "profile?.subscription_status": profile?.subscription_status, 
    "isAdmin from subscription": isAdmin,
    "isAdmin from direct check": adminStatusDirect,
    "isActive": isActive,
    "current path": location.pathname 
  });
  
  // Use effect to ensure component is fully mounted before checking auth
  useEffect(() => {
    if (!subscriptionLoading && !authLoading && !isVerifying) {
      setIsInitialized(true);
    }
  }, [subscriptionLoading, authLoading, isVerifying]);
  
  // Loading state during initialization or auth/subscription checks
  if (!isInitialized || subscriptionLoading || authLoading || isVerifying) {
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
  
  // Multiple redundant checks for admin status for reliability
  const hasAdminRole = 
    profile?.role === 'admin' || // Check profile directly
    isAdmin ||                   // Check from subscription hook
    adminStatusDirect;           // Check from admin status hook
    
  // Check for admin-assigned subscription access
  const hasAdminAssignedAccess = 
    profile?.role === 'pro' || 
    profile?.role === 'basic' || 
    profile?.subscription_status === 'pro' || 
    profile?.subscription_status === 'basic';
  
  // Log detailed information for debugging
  console.log("Access check:", {
    "profile role": profile?.role,
    "profile subscription_status": profile?.subscription_status,
    "isAdmin from subscription": isAdmin,
    "adminStatusDirect": adminStatusDirect,
    "final hasAdminRole": hasAdminRole,
    "hasAdminAssignedAccess": hasAdminAssignedAccess,
    "isActive": isActive
  });
  
  // Check for admin status first - admins always have access
  if (hasAdminRole) {
    console.log("Admin user detected, granting access");
    return <>{children}</>;
  }
  
  // Check for admin-assigned subscription status
  if (hasAdminAssignedAccess) {
    console.log("User has admin-assigned subscription access, granting access");
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
