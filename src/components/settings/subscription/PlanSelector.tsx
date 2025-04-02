
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingCycle } from "@/hooks/use-subscription";

interface PlanSelectorProps {
  startSubscription: (plan: "basic" | "pro", billingCycle: BillingCycle) => Promise<void>;
}

export function PlanSelector({ startSubscription }: PlanSelectorProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const getPriceDisplay = (plan: "basic" | "pro", cycle: BillingCycle) => {
    if (plan === "basic") {
      return cycle === "monthly" ? "$29/month" : "$290/year";
    } else {
      return cycle === "monthly" ? "$69/month" : "$690/year";
    }
  };

  return (
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
  );
}
