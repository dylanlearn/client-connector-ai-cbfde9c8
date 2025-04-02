
import { useState, useEffect } from "react";
import { useNavigate as useReactRouterNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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

export type SubscriptionStatus = "free" | "basic" | "pro";
export type BillingCycle = "monthly" | "annual";

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  isActive: boolean;
  inTrial: boolean;
  expiresAt: string | null;
  willCancel: boolean;
  isLoading: boolean;
}

export const useSubscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    status: "free",
    isActive: false,
    inTrial: false,
    expiresAt: null,
    willCancel: false,
    isLoading: true,
  });

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        throw error;
      }
      
      setSubscriptionInfo({
        status: data.subscription,
        isActive: data.isActive,
        inTrial: data.inTrial,
        expiresAt: data.expiresAt,
        willCancel: data.willCancel,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startSubscription = async (plan: "basic" | "pro", billingCycle: BillingCycle = "monthly", returnUrl?: string) => {
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
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan, billingCycle, returnUrl },
      });

      if (error) {
        throw error;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error starting subscription:", error);
      toast({
        title: "Subscription error",
        description: "There was a problem starting your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkSubscription();
    
    // Check subscription when URL has checkout=success or checkout=canceled
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    
    if (checkoutStatus === "success") {
      toast({
        title: "Subscription started!",
        description: "Your subscription has been activated with a 3-day free trial.",
      });
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (checkoutStatus === "canceled") {
      toast({
        title: "Subscription canceled",
        description: "Your subscription process was canceled.",
        variant: "destructive",
      });
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [user?.id]);

  return {
    ...subscriptionInfo,
    startSubscription,
    refreshSubscription: checkSubscription,
  };
};
