
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionStatus, BillingCycle } from "@/types/subscription";

/**
 * Fetches the current subscription status from the Supabase Edge Function
 */
export const fetchSubscriptionStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("check-subscription");
    
    if (error) {
      console.error("Error checking subscription:", error);
      throw error;
    }
    
    console.log("Subscription status response:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchSubscriptionStatus:", error);
    throw error;
  }
};

/**
 * Starts a new subscription process by calling the create-checkout Edge Function
 */
export const createSubscriptionCheckout = async (
  plan: "basic" | "pro", 
  billingCycle: BillingCycle = "monthly", 
  returnUrl?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { plan, billingCycle, returnUrl },
    });

    if (error) {
      console.error("Error starting subscription:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createSubscriptionCheckout:", error);
    throw error;
  }
};

/**
 * Cancels an existing subscription
 */
export const cancelSubscription = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("cancel-subscription");
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    throw error;
  }
};

/**
 * Checks URL parameters for checkout status
 * Returns null if no checkout parameter is found
 */
export const getCheckoutStatusFromUrl = (): 'success' | 'canceled' | null => {
  const params = new URLSearchParams(window.location.search);
  const checkoutStatus = params.get("checkout");
  
  if (checkoutStatus === "success" || checkoutStatus === "canceled") {
    return checkoutStatus;
  }
  
  return null;
};

/**
 * Cleans up checkout parameters from the URL
 */
export const cleanupCheckoutParams = () => {
  const newUrl = window.location.pathname;
  window.history.replaceState({}, document.title, newUrl);
};
