
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";

const Pricing = () => {
  const { startSubscription, isLoading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handleSelectPlan = (plan: "basic" | "pro", cycle: "monthly" | "annual") => {
    // If user is already authenticated, start subscription process
    if (user) {
      const returnUrl = window.location.origin + "/dashboard";
      startSubscription(plan, cycle, returnUrl);
    } else {
      // If not authenticated, redirect to login page first
      navigate("/login", { state: { from: "/pricing" } });
    }
  };

  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === "monthly" ? "annual" : "monthly");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-purple-50">
      <header className="w-full py-4 px-6 flex justify-between items-center border-b bg-white/50 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-indigo-600" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="font-bold text-xl">DezignSync</span>
        </Link>
        
        <div className="flex gap-4">
          {user ? (
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with DezignSync and elevate your design workflow
          </p>
          
          <div className="flex items-center justify-center mt-8 gap-3">
            <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-indigo-600" : "text-gray-500"}`}>Monthly</span>
            <button 
              onClick={toggleBillingCycle} 
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${billingCycle === "annual" ? "bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7]" : "bg-gray-200"}`}
            >
              <span 
                className={`${billingCycle === "annual" ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} 
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === "annual" ? "text-indigo-600" : "text-gray-500"}`}>
              Annual <span className="text-green-500 text-xs">(Save {billingCycle === "annual" ? "15-22%" : ""})</span>
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="relative border-2 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] transform origin-left group-hover:scale-x-100 transition-transform"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Sync Basic</CardTitle>
              <CardDescription>Perfect for individual designers</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">{billingCycle === "monthly" ? "$35" : "$360"}</span>
                <span className="text-gray-600">/{billingCycle === "monthly" ? "month" : "year"}</span>
                {billingCycle === "annual" && (
                  <span className="ml-2 text-sm text-green-500">Save 15%</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Up to 10 client projects</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Standard question templates</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] hover:opacity-90" 
                onClick={() => handleSelectPlan("basic", billingCycle)}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Get Started"}
              </Button>
              <div className="mt-2 text-center w-full">
                <p className="text-xs text-gray-500">3-day free trial. Cancel anytime.</p>
              </div>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="relative border-2 border-indigo-600 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] text-white px-3 py-1 text-sm font-medium">
              Recommended
            </div>
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] transform origin-left group-hover:scale-x-100 transition-transform"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Sync Pro</CardTitle>
              <CardDescription>For design teams and agencies</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">{billingCycle === "monthly" ? "$69" : "$650"}</span>
                <span className="text-gray-600">/{billingCycle === "monthly" ? "month" : "year"}</span>
                {billingCycle === "annual" && (
                  <span className="ml-2 text-sm text-green-500">Save 22%</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Unlimited client projects</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Advanced question templates</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Advanced analytics & reporting</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>AI design suggestions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] hover:opacity-90" 
                onClick={() => handleSelectPlan("pro", billingCycle)}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Get Started"}
              </Button>
              <div className="mt-2 text-center w-full">
                <p className="text-xs text-gray-500">3-day free trial. Cancel anytime.</p>
              </div>
            </CardFooter>
          </Card>
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
