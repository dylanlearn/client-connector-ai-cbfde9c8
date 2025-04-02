
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription, BillingCycle } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { PricingPlan } from "@/components/pricing/PricingPlan";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { DemoNotice } from "@/components/pricing/DemoNotice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Pricing = () => {
  const { startSubscription, isLoading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showDemoNotice, setShowDemoNotice] = useState(false);
  const [showSubscriptionNeeded, setShowSubscriptionNeeded] = useState(false);

  const handleSelectPlan = (planType: "basic" | "pro" | "templates") => {
    if (planType === "templates") {
      navigate("/templates");
      return;
    }

    // If user is already authenticated, start subscription process
    if (user) {
      const returnUrl = window.location.origin + "/dashboard";
      startSubscription(planType, billingCycle, returnUrl);
    } else {
      // If not authenticated, redirect to login page first
      navigate("/login", { state: { from: "/pricing" } });
    }
  };

  useEffect(() => {
    // After 1 second, show the demo notice
    const timer = setTimeout(() => {
      setShowDemoNotice(true);
    }, 1000);
    
    // Check if the user needs a subscription
    const needSubscription = searchParams.get('needSubscription');
    if (needSubscription === 'true') {
      setShowSubscriptionNeeded(true);
    }
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Define the pricing plans
  const pricingPlans = [
    {
      name: "Sync Basic",
      price: billingCycle === "monthly" ? "$35" : "$360",
      period: billingCycle === "monthly" ? "month" : "year",
      description: "Perfect for individual designers",
      features: [
        "Up to 10 client projects",
        "Standard question templates",
        "Basic analytics",
        "Email support"
      ],
      cta: "Get Started",
      planType: "basic" as const,
      highlight: false,
      savings: billingCycle === "annual" ? "Save 15%" : undefined
    },
    {
      name: "Sync Pro",
      price: billingCycle === "monthly" ? "$69" : "$650",
      period: billingCycle === "monthly" ? "month" : "year",
      description: "For design teams and agencies",
      features: [
        "Unlimited client projects",
        "Advanced question templates",
        "Advanced analytics & reporting",
        "AI design suggestions",
        "Priority support"
      ],
      cta: "Get Started",
      planType: "pro" as const,
      highlight: true,
      savings: billingCycle === "annual" ? "Save 22%" : undefined
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-purple-50">
      <PricingHeader 
        onDashboardClick={() => navigate("/dashboard")}
        isAuthenticated={!!user}
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {showDemoNotice && <DemoNotice />}

        {showSubscriptionNeeded && (
          <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscription Required</AlertTitle>
            <AlertDescription>
              You need an active subscription to access the dashboard and app features. Please select a plan below.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with DezignSync and elevate your design workflow
          </p>
          
          <div className="mt-8">
            <BillingToggle billingCycle={billingCycle} onChange={setBillingCycle} />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              cta={plan.cta}
              highlight={plan.highlight}
              isLoading={isLoading}
              onSelect={() => handleSelectPlan(plan.planType)}
              savings={plan.savings}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h3 className="font-semibold text-xl mb-2">100% Satisfaction Guarantee</h3>
          <p className="text-gray-600">
            Try DezignSync for 3 days risk-free. If you're not completely satisfied,
            cancel your subscription for a full refund.
          </p>
        </div>
      </main>
      
      <footer className="py-6 px-6 bg-white border-t">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} DezignSync. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
