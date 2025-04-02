
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingPlan } from "@/components/pricing/PricingPlan";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { DemoNotice } from "@/components/pricing/DemoNotice";
import InteractionTracker from "@/components/analytics/InteractionTracker";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: "templates" | "sync" | "sync-pro") => {
    if (plan === "templates") {
      navigate("/templates");
      return;
    }
    
    setLoadingPlan(plan);
    try {
      await startSubscription(plan, billingCycle);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error starting subscription:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hidden tracker to collect interaction data */}
      <InteractionTracker />
      
      {/* Header */}
      <PricingHeader 
        onDashboardClick={handleDashboardClick} 
        isAuthenticated={!!user}
      />
      
      {/* Main content */}
      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Demo notice */}
        <DemoNotice />

        {/* Pricing section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your design workflow needs
          </p>
          
          <div className="mt-6">
            <BillingToggle 
              billingCycle={billingCycle} 
              onChange={(cycle) => setBillingCycle(cycle)} 
            />
          </div>
        </div>

        {/* Pricing plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Templates */}
          <PricingPlan
            name="Templates"
            price="From $29"
            period={null}
            description="Individual templates for one-time projects"
            features={[
              "Pre-designed template packages",
              "One-time payment",
              "Technical integration support",
              "30-day support"
            ]}
            cta="Browse Templates"
            highlight={false}
            isLoading={loadingPlan === "templates"}
            onSelect={() => handleSelectPlan("templates")}
          />
          
          {/* Basic */}
          <PricingPlan
            name="Basic"
            price={billingCycle === "monthly" ? "$29" : "$290"}
            period={billingCycle}
            description="Essential designs for small businesses"
            features={[
              "10 projects",
              "Basic design tools",
              "Basic analytics",
              "Standard support"
            ]}
            cta={`Choose Basic ${billingCycle}`}
            highlight={false}
            isLoading={loadingPlan === "sync"}
            onSelect={() => handleSelectPlan("sync")}
            savings={billingCycle === "annual" ? "Save $58/year" : undefined}
          />
          
          {/* Pro */}
          <PricingPlan
            name="Pro"
            price={billingCycle === "monthly" ? "$69" : "$690"}
            period={billingCycle}
            description="Advanced design tools for agencies"
            features={[
              "Unlimited projects",
              "Advanced AI analysis",
              "Client readiness score",
              "Project analytics",
              "Premium support"
            ]}
            cta={`Choose Pro ${billingCycle}`}
            highlight={true}
            isLoading={loadingPlan === "sync-pro"}
            onSelect={() => handleSelectPlan("sync-pro")}
            savings={billingCycle === "annual" ? "Save $138/year" : undefined}
          />
        </div>
        
        {/* FAQ section could be added here */}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2023 DezignSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
