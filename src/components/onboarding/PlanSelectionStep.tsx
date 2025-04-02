
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Plan {
  id: string;
  label: string;
  description: string;
  features: string[];
  price: string;
}

interface PlanSelectionStepProps {
  plans: Plan[];
  onContinue: (selectedPlan: string) => void;
}

export function PlanSelectionStep({ plans, onContinue }: PlanSelectionStepProps) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const { toast } = useToast();

  const handleContinue = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose a plan to continue.",
        variant: "destructive",
      });
      return;
    }
    
    onContinue(selectedPlan);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center">
          Choose your plan
        </CardTitle>
        <CardDescription className="text-center text-base md:text-lg">
          Select the plan that works best for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-lg p-6 cursor-pointer hover:border-indigo-600 transition-colors
                ${selectedPlan === plan.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}
              `}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-5 h-5 rounded-full border ${selectedPlan === plan.id ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}></div>
                <span className="font-bold text-lg">{plan.label}</span>
              </div>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="text-2xl font-bold mb-2 text-indigo-600">{plan.price}</div>
              <p className="text-xs text-gray-500 mb-4">Starts with a 3-day free trial</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full p-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleContinue}
          className="w-full md:w-auto px-8"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
