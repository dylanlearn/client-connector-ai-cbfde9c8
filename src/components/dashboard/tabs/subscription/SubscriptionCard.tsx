
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingCycle } from "@/types/subscription";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { BillingCycleToggle } from "./BillingCycleToggle";
import { PricingDisplay } from "./PricingDisplay";
import { FeaturesList } from "./FeaturesList";

interface SubscriptionCardProps {
  isMobile: boolean;
  status: string;
  inTrial: boolean;
}

export const SubscriptionCard = ({ 
  isMobile, 
  status, 
  inTrial 
}: SubscriptionCardProps) => {
  const { toast } = useToast();
  const { startSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  
  const proFeatures = [
    "Unlimited projects",
    "Advanced AI analysis",
    "Client readiness score",
    "Project analytics"
  ];
  
  const handleUpgrade = () => {
    if (status === "pro") {
      toast({
        title: "Already subscribed",
        description: "You already have a Pro subscription.",
      });
      return;
    }
    
    startSubscription("pro", billingCycle);
  };
  
  return (
    <Card className="md:col-span-2">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className={isMobile ? "text-lg" : ""}>Upgrade to Sync Pro</CardTitle>
        <CardDescription className={isMobile ? "text-sm" : ""}>
          Unlock advanced features for your design workflow
          {inTrial && status === "pro" && <span className="ml-2 text-green-600 font-medium">• Trial Active</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 pt-0 pb-4" : ""}>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
            <h3 className="font-bold text-base md:text-lg">Pro features include:</h3>
            <div className="w-full md:w-auto">
              <BillingCycleToggle 
                billingCycle={billingCycle}
                onChange={(value) => setBillingCycle(value)}
              />
              <PricingDisplay billingCycle={billingCycle} />
            </div>
          </div>
          
          <FeaturesList
            features={proFeatures}
            isMobile={isMobile}
          />
          
          <div className="mt-4">
            {status === "pro" ? (
              <Button className="w-full md:w-auto text-sm" disabled>Already Subscribed</Button>
            ) : (
              <Button 
                className="w-full md:w-auto text-sm" 
                onClick={handleUpgrade}
              >
                {inTrial ? "Continue with Pro" : "Start 3-Day Free Trial"}
              </Button>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Start with a 3-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
