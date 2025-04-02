
import { useState, useEffect } from "react";
import { useNavigate as useReactRouterNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useCheckoutStatus } from "@/hooks/use-checkout-status";
import { useSubscriptionStatus, useSubscriptionActions } from "./subscription";
import { SubscriptionInfo, SubscriptionStatus, BillingCycle } from "@/types/subscription";

// A safe wrapper for useNavigate that won't throw errors outside of Router context
const useNavigate = () => {
  try {
    return useReactRouterNavigate();
  } catch (error) {
    // Return a no-op function when outside of Router context
    return () => {
      console.warn("Navigation attempted outside Router context");
    };
  }
};

// Properly re-export enums and types using the correct syntax
export type { SubscriptionStatus, BillingCycle, SubscriptionInfo };

export const useSubscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { isAdmin, isVerifying } = useAdminStatus();
  const { checkSubscription, subscriptionInfo, setSubscriptionInfo } = useSubscriptionStatus(user, session, isAdmin);
  const { startSubscription } = useSubscriptionActions(user, session, navigate, toast);
  
  // Handle checkout status from URL parameters
  useCheckoutStatus();

  useEffect(() => {
    // Skip subscription check during admin verification to avoid race conditions
    if (user && !isVerifying) {
      console.log("useSubscription - Have user data, checking subscription");
      checkSubscription();
    } else {
      console.log("useSubscription - Missing user data or verifying admin, waiting...");
      setSubscriptionInfo(prev => ({ ...prev, isLoading: isVerifying }));
    }
    
    // Set up a subscription refresh timer to periodically check subscription status
    const refreshTimer = setInterval(() => {
      if (user && !isVerifying) {
        console.log("useSubscription - Periodic refresh check");
        checkSubscription();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(refreshTimer);
  }, [user?.id, isAdmin, isVerifying, checkSubscription, setSubscriptionInfo]);

  return {
    ...subscriptionInfo,
    startSubscription,
    refreshSubscription: checkSubscription,
  };
};
