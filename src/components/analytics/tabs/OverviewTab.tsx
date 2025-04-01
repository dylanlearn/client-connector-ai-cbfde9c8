
import { BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DesignPreferenceChart from "@/components/analytics/DesignPreferenceChart";
import TopRankedDesigns from "@/components/analytics/TopRankedDesigns";
import CategoryDistribution from "@/components/analytics/CategoryDistribution";

interface OverviewTabProps {
  hasProData: boolean;
}

const OverviewTab = ({ hasProData }: OverviewTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Design Preference Metrics</CardTitle>
            <CardDescription>
              Average preference scores across all intakes
            </CardDescription>
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
            <CardTitle>Selection Timeline</CardTitle>
            <CardDescription>
              Recent design selection activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasProData ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading timeline data...</p>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center bg-muted/30 rounded-md p-4">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Unlock detailed timeline analytics with a Pro subscription.
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
