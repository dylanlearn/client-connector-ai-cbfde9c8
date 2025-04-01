
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuickStatsProps {
  projectCount: number;
}

const QuickStats = ({ projectCount }: QuickStatsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className={isMobile ? "text-lg" : ""}>Quick Stats</CardTitle>
        <CardDescription className={isMobile ? "text-sm" : ""}>Your activity summary</CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 pt-0 pb-4" : ""}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Active Projects</span>
            <span className="text-lg font-semibold">{projectCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Clients</span>
            <span className="text-lg font-semibold">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Completed</span>
            <span className="text-lg font-semibold">0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
