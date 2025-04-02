
import { BillingCycle } from "@/types/subscription";

interface BillingToggleProps {
  billingCycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export const BillingToggle = ({ billingCycle, onChange }: BillingToggleProps) => {
  const toggleBillingCycle = () => {
    onChange(billingCycle === "monthly" ? "annual" : "monthly");
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-indigo-600" : "text-gray-500"}`}>
        Monthly
      </span>
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
  );
};
