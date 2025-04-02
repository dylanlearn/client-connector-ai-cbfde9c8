
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const UpgradeCard = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="md:col-span-2">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className={isMobile ? "text-lg" : ""}>Upgrade to Sync Pro</CardTitle>
        <CardDescription className={isMobile ? "text-sm" : ""}>Unlock advanced features for your design workflow</CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 pt-0 pb-4" : ""}>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-base md:text-lg">Pro features include:</h3>
            <div className="text-right">
              <span className="text-sm text-gray-500">From</span>
              <div className="font-bold text-lg md:text-xl">$69<span className="text-sm font-normal">/month</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Unlimited projects</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Advanced AI analysis</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Client readiness score</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={isMobile ? "text-sm" : ""}>Project analytics</span>
            </div>
          </div>
          <Button className="mt-4 w-full md:w-auto text-sm">Upgrade Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;
