
import { BarChart3, ChevronRight, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DesignPreferenceChart from "@/components/analytics/DesignPreferenceChart";
import TopRankedDesigns from "@/components/analytics/TopRankedDesigns";
import CategoryDistribution from "@/components/analytics/CategoryDistribution";
import PreferenceTimeline from "@/components/analytics/PreferenceTimeline";
import { useAnalytics } from "@/hooks/use-analytics";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
  hasProData: boolean;
}

const OverviewTab = ({ hasProData }: OverviewTabProps) => {
  const { isRealtime } = useAnalytics();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Design Preference Metrics</CardTitle>
              <CardDescription>
                Average preference scores across all intakes
              </CardDescription>
            </div>
            {isRealtime && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Live data
              </Badge>
            )}
          </CardHeader>
          <CardContent className="h-80">
            <DesignPreferenceChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selections</CardTitle>
            <CardDescription>
              Most frequently selected designs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopRankedDesigns />
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              View all rankings
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Overall preference by design category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <CategoryDistribution />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preference Timeline</CardTitle>
            <CardDescription>
              How preferences have evolved over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasProData ? (
              <div className="h-64">
                <PreferenceTimeline />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center bg-muted/30 rounded-md p-4">
                <LineChart className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Track how design preferences evolve over time with a Pro subscription.
                </p>
                <Button>Upgrade to Pro</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
