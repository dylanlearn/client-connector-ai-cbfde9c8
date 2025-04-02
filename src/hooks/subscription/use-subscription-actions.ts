
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createSubscriptionCheckout } from "@/utils/subscription-utils";
import { BillingCycle } from "@/types/subscription";

export const useSubscriptionActions = () => {
  const [isStarting, setIsStarting] = useState(false);
  const { toast } = useToast();

  const startSubscription = async (plan: "sync" | "sync-pro", billingCycle: BillingCycle = "monthly") => {
    try {
      setIsStarting(true);
      const data = await createSubscriptionCheckout(plan, billingCycle);
      
      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Error starting subscription:", error);
      toast({
        title: "Error starting subscription",
        description: error.message || "There was a problem starting your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return {
    startSubscription,
    isStarting
  };
};
