
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { validateAuthState } from "@/utils/auth-utils";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, memo } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { logAuthError } from "@/utils/monitoring/client-error-logger";

interface RequireSubscriptionProps {
  children: React.ReactNode;
}

/**
 * Component that specifically checks for subscription status
 * Memoized to prevent unnecessary re-renders during routing checks
 */
const RequireSubscription = memo(({ children }: RequireSubscriptionProps) => {
  const { 
    isLoading: subscriptionLoading, 
    isActive, 
    isAdmin,
    status,
    refreshSubscription
  } = useSubscription();
  const { isAdmin: adminStatusDirect, isVerifying, verifyAdminStatus } = useAdminStatus();
  const { user, isLoading: authLoading, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Enhanced logging for debugging admin status issues
  useEffect(() => {
    console.log("RequireSubscription - Check details:", { 
      "profile?.role": profile?.role,
      "profile?.subscription_status": profile?.subscription_status, 
      "isAdmin from subscription": isAdmin,
      "isAdmin from direct check": adminStatusDirect,
      "subscription status": status,
      "isActive": isActive,
      "current path": location.pathname,
      "retryCount": retryCount
    });
  }, [profile, isAdmin, adminStatusDirect, status, isActive, location.pathname, retryCount]);
  
  // Use effect to ensure component is fully mounted before checking auth
  useEffect(() => {
    if (!subscriptionLoading && !authLoading && !isVerifying) {
      setIsInitialized(true);
    }
  }, [subscriptionLoading, authLoading, isVerifying]);

  // Automatic retry mechanism for admin status verification
  useEffect(() => {
    // If we have a user with admin role in profile, but adminStatusDirect or isAdmin is false
    // and we haven't tried too many times already, retry verification
    if (user && profile?.role === 'admin' && !adminStatusDirect && !isAdmin && retryCount < 3) {
      const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff
      
      console.log(`Retrying admin status verification in ${retryDelay}ms (attempt ${retryCount + 1})`, {
        userId: user.id,
        profile: profile
      });
      
      const timer = setTimeout(async () => {
        console.log("Executing admin status verification retry:", retryCount + 1);
        await verifyAdminStatus(true); // Force verification
        await refreshSubscription(); // Also refresh subscription status
        setRetryCount(prev => prev + 1);
      }, retryDelay);
      
      return () => clearTimeout(timer);
    }
  }, [user, profile, adminStatusDirect, isAdmin, retryCount, verifyAdminStatus, refreshSubscription]);
  
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
    
  // Check for admin-assigned subscription access - enhanced reliability
  const hasAdminAssignedAccess = 
    profile?.role === 'sync-pro' || 
    profile?.role === 'sync' || 
    profile?.subscription_status === 'sync-pro' || 
    profile?.subscription_status === 'sync' ||
    status === 'sync-pro' ||
    status === 'sync';
  
  // Enhanced logging for auth debug
  console.log("Access check:", {
    "profile role": profile?.role,
    "profile subscription_status": profile?.subscription_status,
    "isAdmin from subscription": isAdmin,
    "adminStatusDirect": adminStatusDirect,
    "final hasAdminRole": hasAdminRole,
    "subscription status": status,
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
  
  // If user is authenticated but doesn't have an active subscription,
  // but profile says they should have access, log the discrepancy and grant access
  if (!isActive && (profile?.role === 'admin' || profile?.subscription_status === 'sync-pro')) {
    console.log("Subscription status mismatch detected - granting access based on profile");
    
    // Log the discrepancy for monitoring
    logAuthError(
      "Subscription status mismatch detected", 
      user.id, 
      { 
        profile_role: profile?.role,
        profile_subscription: profile?.subscription_status,
        subscription_api_status: status,
        subscription_api_active: isActive 
      }
    );
    
    // Grant access based on profile
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
