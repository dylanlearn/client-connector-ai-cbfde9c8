
import { useState } from "react";
import { BillingCycle } from "@/hooks/use-subscription";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BillingCycleToggleProps {
  billingCycle: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

export const BillingCycleToggle = ({ billingCycle, onChange }: BillingCycleToggleProps) => {
  return (
    <div className="flex justify-center md:justify-end mb-2">
      <ToggleGroup 
        type="single" 
        value={billingCycle}
        onValueChange={(value) => value && onChange(value as BillingCycle)}
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
  );
};
