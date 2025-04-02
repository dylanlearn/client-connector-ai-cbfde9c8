
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
  isAdmin: boolean; // Added isAdmin property
}

export const useSubscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session, profile } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    status: "free",
    isActive: false,
    inTrial: false,
    expiresAt: null,
    willCancel: false,
    isLoading: true,
    isAdmin: false, // Initialize isAdmin as false
  });

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: true }));
      
      // First check if user is an admin from the profile
      // This is the critical fix - ensure we properly check the role
      const isAdmin = profile?.role === 'admin';
      console.log("useSubscription - Checking admin status:", isAdmin, "for profile:", profile);
      
      // If user is admin, we can set subscription status accordingly without checking further
      if (isAdmin) {
        console.log("useSubscription - User is admin, setting pro access");
        setSubscriptionInfo({
          status: "pro", // Admin users are treated as having pro status
          isActive: true,
          inTrial: false,
          expiresAt: null,
          willCancel: false,
          isLoading: false,
          isAdmin: true
        });
        return;
      }
      
      // For non-admin users, check subscription normally
      console.log("useSubscription - User is not admin, checking subscription");
      
      // Make direct database check for admin role as a backup
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (!profileError && profileData?.role === 'admin') {
        console.log("useSubscription - Direct DB check found admin role");
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
      
      // Continue with regular subscription check
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        throw error;
      }
      
      console.log("useSubscription - Subscription data:", data);
      setSubscriptionInfo({
        status: data.subscription,
        isActive: data.isActive,
        inTrial: data.inTrial,
        expiresAt: data.expiresAt,
        willCancel: data.willCancel,
        isLoading: false,
        isAdmin: false
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
        return;
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
    console.log("useSubscription - Effect triggered, user:", user?.id, "profile:", profile);
    
    // Only check subscription if we have both user and profile data
    if (user) {
      console.log("useSubscription - Have user data, checking subscription");
      checkSubscription();
    } else {
      console.log("useSubscription - Missing user data, waiting...");
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
    }
    
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
  }, [user?.id, profile]);

  return {
    ...subscriptionInfo,
    startSubscription,
    refreshSubscription: checkSubscription,
  };
};
