
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/use-subscription";
import { RedeemInvitation } from "@/components/auth/RedeemInvitation";
import { PlanSelector } from "@/components/settings/subscription/PlanSelector";
import { FreePlanInfo } from "@/components/settings/subscription/FreePlanInfo";
import { CurrentPlanDisplay } from "@/components/settings/subscription/CurrentPlanDisplay";
import { SubscriptionDetails } from "@/components/settings/subscription/SubscriptionDetails";
import { SubscriptionActions } from "@/components/settings/subscription/SubscriptionActions";
import { SubscriptionLoadingState } from "@/components/settings/subscription/LoadingState";

const SubscriptionSettings = () => {
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
            <SubscriptionLoadingState />
          ) : (
            <>
              <CurrentPlanDisplay
                status={status}
                inTrial={inTrial}
                willCancel={willCancel}
                expiresAt={expiresAt}
              />
              
              <Separator />
              
              {status === "free" ? (
                <div className="space-y-4">
                  <PlanSelector startSubscription={startSubscription} />
                  <FreePlanInfo />
                </div>
              ) : (
                <>
                  <SubscriptionDetails
                    status={status}
                    expiresAt={expiresAt}
                    inTrial={inTrial}
                    willCancel={willCancel}
                    isActive={isActive}
                  />
                  
                  <SubscriptionActions
                    willCancel={willCancel}
                    refreshSubscription={refreshSubscription}
                  />
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <RedeemInvitation />
      </div>
    </>
  );
};

export default SubscriptionSettings;
