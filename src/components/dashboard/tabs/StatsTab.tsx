
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/dashboard/EmptyState";
import { BarChart3, LayoutGrid, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PreferenceOverview from "@/components/analytics/PreferenceOverview";
import TopRankedDesigns from "@/components/analytics/TopRankedDesigns";
import CategoryDistribution from "@/components/analytics/CategoryDistribution";
import { useAnalytics } from "@/hooks/use-analytics";

const StatsTab = () => {
  const navigate = useNavigate();
  const { analytics, isLoading } = useAnalytics();
  const hasStats = !isLoading && analytics && analytics.length > 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Statistics</CardTitle>
          <CardDescription>
            Overview of your activity and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 py-4">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded"></div>
            <div className="h-24 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
            <div className="h-24 w-full bg-muted animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Statistics</CardTitle>
          <CardDescription>
            Overview of your activity and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState 
            title="No statistics yet"
            description="Complete your first project to see statistics."
            buttonText="Create Project"
            buttonAction={() => navigate("/new-project")}
            icon={BarChart3}
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Design Preferences</CardTitle>
          <CardDescription>
            Summary of your most selected design elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PreferenceOverview />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="h-[300px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Top Ranked Elements</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(300px-70px)]">
            <TopRankedDesigns />
          </CardContent>
        </Card>
        
        <Card className="h-[300px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(300px-70px)]">
            <CategoryDistribution />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsTab;
