
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { BillingCycle, useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/hooks/use-auth";

const UpgradeCard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status, inTrial, startSubscription, isAdmin } = useSubscription();
  const { profile } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  
  // Direct check for admin status from profile
  const isAdminUser = profile?.role === 'admin' || isAdmin;
  
  console.log("UpgradeCard - Admin status:", { 
    "profile?.role": profile?.role, 
    "isAdmin from subscription": isAdmin,
    "combined isAdminUser": isAdminUser 
  });
  
  const handleUpgrade = () => {
    // Check for admin status first
    if (isAdminUser) {
      toast({
        title: "Admin Access",
        description: "As an admin, you already have access to all features.",
      });
      return;
    }
    
    if (status === "pro") {
      toast({
        title: "Already subscribed",
        description: "You already have a Pro subscription.",
      });
      return;
    }
    
    startSubscription("pro", billingCycle);
  };

  // Calculate price based on billing cycle
  const price = billingCycle === "monthly" ? "$69" : "$690";
  const period = billingCycle === "monthly" ? "/month" : "/year";
  const savingsText = billingCycle === "annual" ? "Save 16% with annual billing" : "";
  
  // Early return for admin users
  if (isAdminUser) {
    return (
      <Card className="md:col-span-2">
        <CardHeader className={isMobile ? "px-4 py-4" : ""}>
          <CardTitle className={isMobile ? "text-lg" : ""}>Admin Access</CardTitle>
          <CardDescription className={isMobile ? "text-sm" : ""}>
            As an admin, you have access to all Sync Pro features
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "px-4 pt-0 pb-4" : ""}>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="font-bold text-lg md:text-xl text-green-700">Full Access Enabled</div>
              <p className="text-sm text-gray-600">You have admin privileges with access to all features</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4">
              <div className="flex items-center">
                <div className="bg-green-500 text-white rounded-full p-1 mr-2">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={isMobile ? "text-sm" : ""}>Unlimited projects</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 text-white rounded-full p-1 mr-2">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={isMobile ? "text-sm" : ""}>Advanced AI analysis</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 text-white rounded-full p-1 mr-2">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={isMobile ? "text-sm" : ""}>Client readiness score</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 text-white rounded-full p-1 mr-2">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={isMobile ? "text-sm" : ""}>Project analytics</span>
              </div>
            </div>
            <Button 
              className="w-full md:w-auto text-sm"
              variant="outline"
              onClick={() => navigate("/admin")} 
            >
              Go to Admin Panel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
              <div className="flex justify-center md:justify-end mb-2">
                <ToggleGroup 
                  type="single" 
                  value={billingCycle}
                  onValueChange={(value) => value && setBillingCycle(value as BillingCycle)}
                  className="border rounded-md"
                >
                  <ToggleGroupItem value="monthly" size="sm" className="text-xs px-3">
                    Monthly
                  </ToggleGroupItem>
                  <ToggleGroupItem value="annual" size="sm" className="text-xs px-3">
                    Annual
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="text-center md:text-right">
                <span className="text-sm text-gray-500">From</span>
                <div className="font-bold text-lg md:text-xl">{price}<span className="text-sm font-normal">{period}</span></div>
                {savingsText && <p className="text-xs text-green-600">{savingsText}</p>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Unlimited projects</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Advanced AI analysis</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Client readiness score</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Project analytics</span>
            </div>
          </div>
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

export default UpgradeCard;
