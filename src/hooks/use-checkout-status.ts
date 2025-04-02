
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCheckoutStatusFromUrl, cleanupCheckoutParams } from "@/utils/subscription-utils";

/**
 * Hook to handle checkout status from URL parameters
 */
export const useCheckoutStatus = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const checkoutStatus = getCheckoutStatusFromUrl();
    
    if (checkoutStatus === "success") {
      toast({
        title: "Subscription started!",
        description: "Your subscription has been activated with a 3-day free trial.",
      });
      
      // Clean up URL
      cleanupCheckoutParams();
    } else if (checkoutStatus === "canceled") {
      toast({
        title: "Subscription canceled",
        description: "Your subscription process was canceled.",
        variant: "destructive",
      });
      
      // Clean up URL
      cleanupCheckoutParams();
    }
  }, []);
};
