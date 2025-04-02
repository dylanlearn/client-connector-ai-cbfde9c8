
import { useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { SubscriptionInfo, SubscriptionStatus, SubscriptionResponse } from "@/types/subscription";
import { fetchSubscriptionStatus } from "@/utils/subscription-utils";

/**
 * Structured logging for client-side subscription monitoring
 */
const logSubscriptionEvent = (event: string, data?: any) => {
  console.log(`[Subscription] ${event}`, {
    timestamp: new Date().toISOString(),
    ...data
  });
};

/**
 * Hook to track and manage subscription status for a user
 * @param user - The current authenticated user
 * @param session - The current authentication session
 * @param isAdmin - Whether the user has admin status from another source
 * @returns Subscription status information and functions to manage it
 */
export const useSubscriptionStatus = (
  user: User | null, 
  session: Session | null, 
  isAdmin: boolean
) => {
  // Initialize subscription status
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    status: "free",
    isActive: false,
    inTrial: false,
    expiresAt: null,
    willCancel: false,
    isLoading: true,
    isAdmin: false,
  });

  /**
   * Check subscription status with the server
   * This is the main function for verifying a user's subscription state
   */
  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
      logSubscriptionEvent("check_skipped", { reason: "No user or session" });
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: true }));
      logSubscriptionEvent("check_started", { userId: user.id });
      
      // If user is admin, set subscription status accordingly
      if (isAdmin) {
        logSubscriptionEvent("admin_detected", { userId: user.id });
        setSubscriptionInfo({
          status: "sync-pro" as SubscriptionStatus,
          isActive: true,
          inTrial: false,
          expiresAt: null,
          willCancel: false,
          isLoading: false,
          isAdmin: true
        });
        return;
      }
      
      // For non-admin users, check subscription status
      const data = await fetchSubscriptionStatus();
      
      logSubscriptionEvent("status_received", { 
        userId: user.id,
        status: data.subscription,
        isActive: data.isActive,
        adminAssigned: data.adminAssigned || false
      });
      
      // Enhanced logic for admin-assigned subscription status
      const hasAdminAssigned = data.adminAssigned || false;
      const adminAssignedStatus = hasAdminAssigned ? data.subscription as SubscriptionStatus : null;
      
      setSubscriptionInfo({
        status: data.subscription as SubscriptionStatus,
        isActive: data.isActive || hasAdminAssigned || false,
        inTrial: data.inTrial,
        expiresAt: data.expiresAt,
        willCancel: data.willCancel,
        isLoading: false,
        isAdmin: data.isAdmin || false,
        adminAssigned: hasAdminAssigned,
        adminAssignedStatus: adminAssignedStatus
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logSubscriptionEvent("check_error", { 
        userId: user?.id,
        error: errorMessage
      });
      
      setSubscriptionInfo(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [user, session, isAdmin]);

  return {
    subscriptionInfo,
    setSubscriptionInfo,
    checkSubscription
  };
};
