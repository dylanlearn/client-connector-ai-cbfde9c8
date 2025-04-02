
import { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubscriptionActionsProps {
  willCancel: boolean;
  refreshSubscription: () => Promise<void>;
}

export function SubscriptionActions({ 
  willCancel,
  refreshSubscription
}: SubscriptionActionsProps) {
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const { error } = await supabase.functions.invoke("cancel-subscription");
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Subscription cancelled",
        description: "Your subscription will remain active until the end of the current billing period.",
      });
      
      await refreshSubscription();
      setShowCancelDialog(false);
    } catch (error: any) {
      toast({
        title: "Error cancelling subscription",
        description: error.message || "There was a problem cancelling your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          asChild
        >
          <a href="https://billing.stripe.com/p/login/test_XXX" target="_blank" rel="noopener noreferrer">
            <CreditCard className="h-4 w-4" />
            Manage Payment Methods
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </Button>
        
        {!willCancel && (
          <Button 
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel Subscription
          </Button>
        )}
      </div>
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of the current billing period. 
              After that, your account will revert to the free plan with limited features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Subscription"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
