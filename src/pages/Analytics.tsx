
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import { useDesignSelection } from "@/hooks/use-design-selection";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import OverviewTab from "@/components/analytics/tabs/OverviewTab";
import PreferencesTab from "@/components/analytics/tabs/PreferencesTab";
import TrendsTab from "@/components/analytics/tabs/TrendsTab";

const Analytics = () => {
  const hasProData = false; // This would determine if user has access to Pro features
  const { userPreferences, isLoading, isRealtime } = useAnalytics();
  const { user } = useAuth();
  const { clientAccessMode, viewOnlyMode } = useDesignSelection({});

  return (
    <DashboardLayout>
      <AnalyticsHeader 
        isRealtime={isRealtime} 
        clientAccessMode={clientAccessMode} 
        viewOnlyMode={viewOnlyMode} 
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="preferences">Design Preferences</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab hasProData={hasProData} />
        </TabsContent>
        
        <TabsContent value="preferences">
          <PreferencesTab 
            userPreferences={userPreferences} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="trends">
          <TrendsTab hasProData={hasProData} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Analytics;
