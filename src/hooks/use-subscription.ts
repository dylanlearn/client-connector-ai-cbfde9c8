
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
  }, [user?.id, session?.access_token, isAdminRole, checkSubscription]);
  
  // Explicit check for admin access from profile for redundancy
  const hasAdminRole = profile?.role === 'admin' || isAdminRole;
  
  // Enhanced check for admin-assigned subscription status in profile
  const hasAssignedSyncProAccess = 
    profile?.role === 'sync-pro' || 
    profile?.subscription_status === 'sync-pro' || 
    subscriptionInfo.adminAssignedStatus === 'sync-pro';
    
  const hasAssignedSyncAccess = 
    profile?.role === 'sync' || 
    profile?.subscription_status === 'sync' || 
    subscriptionInfo.adminAssignedStatus === 'sync';
  
  // Log detailed information for admin role and subscription status
  useEffect(() => {
    if (user) {
      console.log("Subscription hook state:", {
        "profile.role": profile?.role,
        "profile.subscription_status": profile?.subscription_status,
        "isAdminRole from useAdminStatus": isAdminRole,
        "admin from subscriptionInfo": subscriptionInfo.isAdmin,
        "adminAssigned from subscriptionInfo": subscriptionInfo.adminAssigned,
        "adminAssignedStatus from subscriptionInfo": subscriptionInfo.adminAssignedStatus,
        "hasAdminRole": hasAdminRole,
        "hasAssignedSyncProAccess": hasAssignedSyncProAccess,
        "hasAssignedSyncAccess": hasAssignedSyncAccess,
        "subscription status": subscriptionInfo.status,
        "is subscription active": subscriptionInfo.isActive
      });
    }
  }, [
    user, 
    profile?.role, 
    profile?.subscription_status, 
    isAdminRole, 
    subscriptionInfo, 
    hasAdminRole, 
    hasAssignedSyncProAccess, 
    hasAssignedSyncAccess
  ]);
  
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
  
  // Enhanced determination if user has active access
  const isActive = 
    hasAdminRole || 
    subscriptionInfo.isActive || 
    hasAssignedSyncProAccess || 
    hasAssignedSyncAccess;
  
  // Determine effective subscription status based on all sources
  const effectiveStatus = hasAssignedSyncProAccess 
    ? "sync-pro" 
    : (hasAssignedSyncAccess 
        ? "sync" 
        : subscriptionInfo.status);
  
  return {
    // Subscription status info with enhanced status determination
    status: effectiveStatus,
    isActive,
    inTrial: subscriptionInfo.inTrial,
    expiresAt: subscriptionInfo.expiresAt,
    willCancel: subscriptionInfo.willCancel,
    
    // Administrative status (explicit detection through multiple paths)
    isAdmin: hasAdminRole,
    isAdminFromAPI: subscriptionInfo.isAdmin,
    isAdminFromProfile: profile?.role === 'admin',
    
    // Admin-assigned subscription info
    adminAssigned: subscriptionInfo.adminAssigned,
    adminAssignedStatus: subscriptionInfo.adminAssignedStatus,
    
    // Loading states
    isLoading,
    isRefreshing,
    
    // Actions
    refreshSubscription,
    startSubscription,
    
    // Error state
    error: subscriptionInfo.error
  };
};
