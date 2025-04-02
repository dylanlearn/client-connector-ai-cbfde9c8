
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/ui/empty-state";
import PreferenceOverview from "@/components/analytics/PreferenceOverview";
import TopRankedDesigns from "@/components/analytics/TopRankedDesigns";
import CategoryDistribution from "@/components/analytics/CategoryDistribution";
import { useAnalytics } from "@/hooks/use-analytics";
import DashboardTabContent from "./DashboardTabContent";

const StatsTab = () => {
  const navigate = useNavigate();
  const { analytics, isLoading } = useAnalytics();
  const hasStats = !isLoading && analytics && analytics.length > 0;

  if (isLoading) {
    return (
      <DashboardTabContent 
        title="Your Statistics" 
        description="Overview of your activity and engagement"
        isLoading={true}
      >
        {null}
      </DashboardTabContent>
    );
  }

  if (!hasStats) {
    return (
      <DashboardTabContent 
        title="Your Statistics" 
        description="Overview of your activity and engagement"
      >
        <EmptyState 
          title="No statistics yet"
          description="Complete your first project to see statistics."
          action={{
            label: "Create Project",
            onClick: () => navigate("/new-project")
          }}
          icon={<BarChart3 className="h-6 w-6 text-muted-foreground" />}
        />
      </DashboardTabContent>
    );
  }
  
  return (
    <div className="space-y-4">
      <DashboardTabContent 
        title="Design Preferences" 
        description="Summary of your most selected design elements"
      >
        <PreferenceOverview />
      </DashboardTabContent>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardTabContent 
          title="Top Ranked Elements" 
          className="h-[300px]"
        >
          <div className="h-[calc(300px-100px)]">
            <TopRankedDesigns />
          </div>
        </DashboardTabContent>
        
        <DashboardTabContent 
          title="Category Distribution" 
          className="h-[300px]"
        >
          <div className="h-[calc(300px-100px)]">
            <CategoryDistribution />
          </div>
        </DashboardTabContent>
      </div>
    </div>
  );
};

export default StatsTab;
