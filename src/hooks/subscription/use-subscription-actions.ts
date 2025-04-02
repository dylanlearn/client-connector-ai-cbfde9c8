
import { useState } from "react";
import { createSubscriptionCheckout } from "@/utils/subscription-utils";
import { toast } from "sonner";
import { BillingCycle } from "@/types/subscription";

export const useSubscriptionActions = () => {
  const [isStarting, setIsStarting] = useState(false);

  const startSubscription = async (plan: "basic" | "pro", billingCycle: BillingCycle = "monthly") => {
    try {
      setIsStarting(true);
      const returnUrl = `${window.location.origin}/settings?checkout=success`;
      const data = await createSubscriptionCheckout(plan, billingCycle, returnUrl);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Error starting subscription:", error);
      toast.error("Failed to start subscription. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  return {
    startSubscription,
    isStarting
  };
};
