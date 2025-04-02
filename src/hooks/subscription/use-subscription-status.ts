
import { useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { SubscriptionInfo, SubscriptionStatus } from "@/types/subscription";
import { fetchSubscriptionStatus } from "@/utils/subscription-utils";

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

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: true }));
      
      // If user is admin, set subscription status accordingly
      if (isAdmin) {
        console.log("useSubscriptionStatus - User is admin, setting pro access");
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
      
      console.log("useSubscriptionStatus - Subscription data:", data);
      
      // Enhanced logic for admin-assigned subscription status
      const hasAdminAssigned = data.adminAssigned || false;
      const adminAssignedStatus = hasAdminAssigned ? data.subscription : null;
      
      setSubscriptionInfo({
        status: data.subscription,
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
      console.error("Error checking subscription:", error);
      setSubscriptionInfo(prev => ({ 
        ...prev, 
        isLoading: false,
        error: String(error)
      }));
    }
  }, [user, session, isAdmin]);

  return {
    subscriptionInfo,
    setSubscriptionInfo,
    checkSubscription
  };
};
