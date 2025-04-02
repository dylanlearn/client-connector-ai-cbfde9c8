import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, AlertCircle, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSubscription, BillingCycle } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { RedeemInvitation } from "@/components/auth/RedeemInvitation";
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

const SubscriptionSettings = () => {
  const { toast } = useToast();
  const { 
    status, 
    isActive, 
    expiresAt, 
    willCancel, 
    inTrial, 
    isLoading, 
    startSubscription, 
    refreshSubscription 
  } = useSubscription();
  
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const getPriceDisplay = (plan: "basic" | "pro", cycle: BillingCycle) => {
    if (plan === "basic") {
      return cycle === "monthly" ? "$29/month" : "$290/year";
    } else {
      return cycle === "monthly" ? "$69/month" : "$690/year";
    }
  };

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
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            View and manage your subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Current Plan</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={status === "free" ? "outline" : "default"} className="capitalize">
                      {status}
                    </Badge>
                    {inTrial && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Trial
                      </Badge>
                    )}
                    {willCancel && (
                      <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                        Cancels soon
                      </Badge>
                    )}
                  </div>
                </div>
                
                {status !== "free" && expiresAt && (
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {willCancel ? "Ends on" : "Next billing date"}:
                    </div>
                    <div className="font-medium">{format(new Date(expiresAt), "MMM d, yyyy")}</div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {status === "free" ? (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold mb-2">Choose a plan</h3>
                    <div className="flex justify-center mb-3">
                      <ToggleGroup 
                        type="single" 
                        value={billingCycle}
                        onValueChange={(value) => value && setBillingCycle(value as BillingCycle)}
                        className="border rounded-md"
                      >
                        <ToggleGroupItem value="monthly" size="sm" className="px-3">
                          Monthly
                        </ToggleGroupItem>
                        <ToggleGroupItem value="annual" size="sm" className="px-3">
                          Annual (Save 16%)
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Basic</h4>
                          <div className="text-right">
                            <div className="font-bold">{getPriceDisplay("basic", billingCycle)}</div>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm my-3 flex-grow">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            10 projects
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Basic design tools
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Standard support
                          </li>
                        </ul>
                        <Button 
                          onClick={() => startSubscription("basic", billingCycle)}
                          variant="outline"
                          className="w-full mt-auto"
                        >
                          Choose Basic
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-primary/5 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-bl">
                          Popular
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Pro</h4>
                          <div className="text-right">
                            <div className="font-bold">{getPriceDisplay("pro", billingCycle)}</div>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm my-3 flex-grow">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Unlimited projects
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Advanced AI analysis
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Client readiness score
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Priority support
                          </li>
                        </ul>
                        <Button 
                          onClick={() => startSubscription("pro", billingCycle)}
                          className="w-full mt-auto"
                        >
                          Choose Pro
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Free plan limitations</AlertTitle>
                    <AlertDescription>
                      The free plan is limited to 3 projects and does not include advanced features.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold mb-3">Subscription Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Plan</div>
                          <div className="font-medium capitalize">{status}</div>
                        </div>
                        {inTrial && (
                          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                            <AlertDescription>
                              You're currently in a trial period ending on {expiresAt && format(new Date(expiresAt), "MMM d, yyyy")}.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Status</div>
                          <div className="font-medium">
                            {willCancel 
                              ? "Cancels at end of billing period" 
                              : isActive 
                                ? "Active" 
                                : "Inactive"}
                          </div>
                        </div>
                        {willCancel && (
                          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                            <AlertDescription>
                              Your subscription will remain active until {expiresAt && format(new Date(expiresAt), "MMM d, yyyy")}.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                  
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
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <RedeemInvitation />
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
};

export default SubscriptionSettings;
