
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useSubscriptionStatus } from "@/hooks/subscription/use-subscription-status";
import { useSubscriptionActions } from "@/hooks/subscription/use-subscription-actions";
import { fetchSubscriptionStatus } from "@/utils/subscription-utils";
import { SubscriptionInfo, BillingCycle, SubscriptionStatus } from "@/types/subscription";

// Re-export the types
export type { BillingCycle, SubscriptionStatus } from "@/types/subscription";

export const useSubscription = () => {
  // Get auth context
  const { user, session, profile } = useAuth();
  
  // Use admin status hook for reliable admin detection
  const { isAdmin: isAdminRole, isVerifying: isVerifyingAdmin } = useAdminStatus();
  
  // Initialize with default subscription status
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get subscription status from the hook
  const { subscriptionInfo, checkSubscription } = useSubscriptionStatus(
    user, 
    session,
    isAdminRole // Pass admin status to subscription hook
  );
  
  // Get subscription actions (like starting a new subscription)
  const { startSubscription, isStarting } = useSubscriptionActions();
  
  // Combined loading state
  const isLoading = subscriptionInfo.isLoading || isVerifyingAdmin || isRefreshing || isStarting;
  
  // Refresh subscription info when user or admin status changes
  useEffect(() => {
    if (user && session) {
      checkSubscription();
    }
  }, [user?.id, session?.access_token, isAdminRole]);
  
  // Explicit check for admin access from profile for redundancy
  const hasAdminRole = profile?.role === 'admin' || isAdminRole;
  
  // Check for admin-assigned subscription status in profile
  const hasAssignedProAccess = profile?.role === 'pro' || profile?.subscription_status === 'pro';
  const hasAssignedBasicAccess = profile?.role === 'basic' || profile?.subscription_status === 'basic';
  
  // Log detailed information for admin role and subscription status
  useEffect(() => {
    if (user) {
      console.log("Subscription hook state:", {
        "profile.role": profile?.role,
        "profile.subscription_status": profile?.subscription_status,
        "isAdminRole from useAdminStatus": isAdminRole,
        "admin from subscriptionInfo": subscriptionInfo.isAdmin,
        "hasAdminRole": hasAdminRole,
        "hasAssignedProAccess": hasAssignedProAccess,
        "hasAssignedBasicAccess": hasAssignedBasicAccess,
        "subscription status": subscriptionInfo.status,
        "is subscription active": subscriptionInfo.isActive
      });
    }
  }, [user, profile?.role, profile?.subscription_status, isAdminRole, subscriptionInfo, hasAdminRole, hasAssignedProAccess, hasAssignedBasicAccess]);
  
  // Manual refresh function for debugging and recovery
  const refreshSubscription = async () => {
    if (!user || !session) return;
    
    try {
      setIsRefreshing(true);
      const data = await fetchSubscriptionStatus();
      console.log("Manual subscription refresh data:", data);
      
      // Force re-check of subscription status
      await checkSubscription();
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Determine if user has active access, either through subscription, admin role, or admin-assigned access
  const isActive = hasAdminRole || subscriptionInfo.isActive || hasAssignedProAccess || hasAssignedBasicAccess;
  
  return {
    // Subscription status info
    status: hasAssignedProAccess ? "pro" : (hasAssignedBasicAccess ? "basic" : subscriptionInfo.status),
    isActive,
    inTrial: subscriptionInfo.inTrial,
    expiresAt: subscriptionInfo.expiresAt,
    willCancel: subscriptionInfo.willCancel,
    
    // Administrative status (explicit detection through multiple paths)
    isAdmin: hasAdminRole,
    isAdminFromAPI: subscriptionInfo.isAdmin,
    isAdminFromProfile: profile?.role === 'admin',
    
    // Loading states
    isLoading,
    isRefreshing,
    
    // Actions
    refreshSubscription,
    startSubscription
  };
};
