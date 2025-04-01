
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/dashboard/EmptyState";
import { BarChart3, LayoutGrid, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PreferenceOverview from "@/components/analytics/PreferenceOverview";

const StatsTab = () => {
  const navigate = useNavigate();
  const hasStats = false; // This would normally come from a hook or context

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Top Ranked Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Star className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-sm font-medium">Modern Hero #3</span>
              </div>
              <span className="text-sm text-muted-foreground">Ranked #1 (12×)</span>
            </div>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => navigate("/analytics")}
              className="mt-4 px-0"
            >
              View all rankings
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <LayoutGrid className="h-4 w-4 text-purple-500" />
                </div>
                <span className="text-sm font-medium">Hero Sections</span>
              </div>
              <span className="text-sm text-muted-foreground">32% preference</span>
            </div>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => navigate("/analytics")}
              className="mt-4 px-0"
            >
              View full breakdown
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsTab;
