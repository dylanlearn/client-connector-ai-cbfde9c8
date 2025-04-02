
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
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with DezignSync and elevate your design workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="relative border-2 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Basic Plan</CardTitle>
              <CardDescription>Perfect for individual designers</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-gray-600">/month</span>
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
                className="w-full" 
                onClick={() => handleSelectPlan("basic", "monthly")}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Get Started"}
              </Button>
              <div className="mt-2 text-center w-full">
                <Button 
                  variant="outline" 
                  className="w-full text-sm" 
                  onClick={() => handleSelectPlan("basic", "annual")}
                  disabled={isLoading}
                >
                  Annual plan: $99.99/year (Save 16%)
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="relative border-2 border-indigo-600 overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
              Recommended
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Pro Plan</CardTitle>
              <CardDescription>For design teams and agencies</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-gray-600">/month</span>
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
                className="w-full bg-indigo-600 hover:bg-indigo-700" 
                onClick={() => handleSelectPlan("pro", "monthly")}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Get Started"}
              </Button>
              <div className="mt-2 text-center w-full">
                <Button 
                  variant="outline" 
                  className="w-full text-sm border-indigo-600 text-indigo-600 hover:bg-indigo-50" 
                  onClick={() => handleSelectPlan("pro", "annual")}
                  disabled={isLoading}
                >
                  Annual plan: $199.99/year (Save 16%)
                </Button>
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
