
import { BillingCycle } from "@/types/subscription";

interface PricingDisplayProps {
  billingCycle: BillingCycle;
}

export const PricingDisplay = ({ billingCycle }: PricingDisplayProps) => {
  // Calculate price based on billing cycle
  const price = billingCycle === "monthly" ? "$69" : "$690";
  const period = billingCycle === "monthly" ? "/month" : "/year";
  const savingsText = billingCycle === "annual" ? "Save 16% with annual billing" : "";
  
  return (
    <div className="text-center md:text-right">
      <span className="text-sm text-gray-500">From</span>
      <div className="font-bold text-lg md:text-xl">{price}<span className="text-sm font-normal">{period}</span></div>
      {savingsText && <p className="text-xs text-green-600">{savingsText}</p>}
    </div>
  );
};
