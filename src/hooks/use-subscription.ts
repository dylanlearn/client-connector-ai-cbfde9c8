import { useState, useEffect } from "react";
import { useNavigate as useReactRouterNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useCheckoutStatus } from "@/hooks/use-checkout-status";
import { 
  fetchSubscriptionStatus, 
  createSubscriptionCheckout 
} from "@/utils/subscription-utils";
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

export { SubscriptionStatus, BillingCycle };
// Fix: Use 'export type' for re-exporting types
export type { SubscriptionInfo };

export const useSubscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { isAdmin, isVerifying } = useAdminStatus();
  
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

  // Handle checkout status from URL parameters
  useCheckoutStatus();

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: true }));
      
      // If user is admin, set subscription status accordingly
      if (isAdmin) {
        console.log("useSubscription - User is admin, setting pro access");
        setSubscriptionInfo({
          status: "pro",
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
      
      console.log("useSubscription - Subscription data:", data);
      setSubscriptionInfo({
        status: data.subscription,
        isActive: data.isActive,
        inTrial: data.inTrial,
        expiresAt: data.expiresAt,
        willCancel: data.willCancel,
        isLoading: false,
        isAdmin: data.isAdmin || false
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startSubscription = async (
    plan: "basic" | "pro", 
    billingCycle: BillingCycle = "monthly", 
    returnUrl?: string
  ) => {
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const data = await createSubscriptionCheckout(plan, billingCycle, returnUrl);

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error starting subscription:", error);
      
      // Check if this is likely a configuration issue
      if (error.message?.includes("Edge Function returned a non-2xx status code")) {
        toast({
          title: "Configuration Error",
          description: "The Stripe API key has not been properly configured in the Supabase Edge Function. Please contact the site administrator to resolve this issue.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription error",
          description: "There was a problem starting your subscription. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

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
  }, [user?.id, isAdmin, isVerifying]);

  return {
    ...subscriptionInfo,
    startSubscription,
    refreshSubscription: checkSubscription,
  };
};
