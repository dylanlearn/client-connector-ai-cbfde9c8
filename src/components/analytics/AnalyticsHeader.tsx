
import { BarChart3, PieChart, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareAnalyticsLink from "@/components/analytics/ShareAnalyticsLink";

interface AnalyticsHeaderProps {
  isRealtime: boolean;
  clientAccessMode: boolean | undefined;
  viewOnlyMode: boolean | undefined;
}

const AnalyticsHeader = ({ isRealtime, clientAccessMode, viewOnlyMode }: AnalyticsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Design Analytics</h1>
        {isRealtime && (
          <div className="flex items-center ml-4 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
            <Zap className="w-4 h-4 text-green-500 mr-1" />
            Live Data
          </div>
        )}
        {clientAccessMode && (
          <div className="flex items-center ml-4 text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded">
            <Share2 className="w-4 h-4 mr-1" />
            Client View Mode
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {!viewOnlyMode && <ShareAnalyticsLink />}
        <Button variant="outline">
          <PieChart className="mr-2 h-4 w-4" />
          Overview
        </Button>
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
