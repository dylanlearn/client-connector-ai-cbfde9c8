
import { useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { type BillingCycle } from "@/types/subscription";
import { createSubscriptionCheckout } from "@/utils/subscription-utils";

type ToastType = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

type NavigateFunction = (path: string) => void;

export const useSubscriptionActions = (
  user: User | null,
  session: Session | null,
  navigate: NavigateFunction,
  toast: { (props: ToastType): void }
) => {
  const startSubscription = useCallback(
    async (
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
            description:
              "The Stripe API key has not been properly configured in the Supabase Edge Function. Please contact the site administrator to resolve this issue.",
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
    },
    [user, session, navigate, toast]
  );

  return {
    startSubscription,
  };
};
