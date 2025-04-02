
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export interface PricingPlanProps {
  name: string;
  price: string;
  period: string | null;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  isLoading: boolean;
  onSelect: () => void;
  savings?: string;
}

export const PricingPlan = ({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlight,
  isLoading,
  onSelect,
  savings
}: PricingPlanProps) => {
  return (
    <Card className={`relative border-2 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
      highlight ? 'border-indigo-600' : ''
    }`}>
      {highlight && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] text-white px-3 py-1 text-sm font-medium">
          Recommended
        </div>
      )}
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] transform origin-left group-hover:scale-x-100 transition-transform"></div>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {period && <span className="text-gray-600">/{period}</span>}
          {savings && (
            <span className="ml-2 text-sm text-green-500">{savings}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${highlight ? 'bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] hover:opacity-90' : ''}`}
          onClick={onSelect}
          disabled={isLoading}
        >
          {isLoading ? <><LoadingSpinner size="sm" className="mr-2" /> Processing...</> : cta}
        </Button>
        {name !== "Templates" && (
          <div className="mt-2 text-center w-full">
            <p className="text-xs text-gray-500">3-day free trial. Cancel anytime.</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
