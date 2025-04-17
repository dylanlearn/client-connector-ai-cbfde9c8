
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingCycle } from "@/types/subscription";

interface PlanSelectorProps {
  startSubscription: (plan: "sync" | "sync-pro", billingCycle: BillingCycle) => Promise<void>;
}

export function PlanSelector({ startSubscription }: PlanSelectorProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const getPriceDisplay = (plan: "sync" | "sync-pro", cycle: BillingCycle) => {
    if (plan === "sync") {
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
          <ToggleGroupItem value="monthly" className="px-3">
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem value="annual" className="px-3">
            Annual (Save 16%)
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">Sync</h4>
            <div className="text-right">
              <div className="font-bold">{getPriceDisplay("sync", billingCycle)}</div>
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
            onClick={() => startSubscription("sync", billingCycle)}
            variant="outline"
            className="w-full mt-auto"
          >
            Choose Sync
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 bg-primary/5 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-bl">
            Popular
          </div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">Sync Pro</h4>
            <div className="text-right">
              <div className="font-bold">{getPriceDisplay("sync-pro", billingCycle)}</div>
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
            onClick={() => startSubscription("sync-pro", billingCycle)}
            className="w-full mt-auto"
          >
            Choose Sync Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
