
import { useState } from "react";
import { TabManager, TabItem } from "@/components/ui/tab-manager";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import { useDesignSelection } from "@/hooks/use-design-selection";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import OverviewTab from "@/components/analytics/tabs/OverviewTab";
import PreferencesTab from "@/components/analytics/tabs/PreferencesTab";
import TrendsTab from "@/components/analytics/tabs/TrendsTab";
import HeatmapsTab from "@/components/analytics/tabs/HeatmapsTab";
import ConversionTab from "@/components/analytics/tabs/ConversionTab";
import { useSubscription } from "@/hooks/use-subscription";
import InteractionTracker from "@/components/analytics/InteractionTracker";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { userPreferences, isLoading, isRealtime } = useAnalytics();
  const { user } = useAuth();
  const { clientAccessMode, viewOnlyMode } = useDesignSelection({});
  const { status, isActive, isAdmin, adminAssignedStatus } = useSubscription();
  
  // Enhanced determination if user has access to Pro features
  const hasProData = 
    status === "sync-pro" || // Paid subscription is Pro
    isAdmin || // User is an admin
    (adminAssignedStatus === "sync-pro") || // Admin explicitly assigned Pro
    (user?.role === 'admin'); // User role in auth is admin

  // Define the tabs
  const tabs: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
      content: <OverviewTab hasProData={hasProData} />,
      isLoading: isLoading
    },
    {
      id: "preferences",
      label: "Design Preferences",
      content: <PreferencesTab userPreferences={userPreferences} isLoading={isLoading} />,
      isLoading: isLoading
    },
    {
      id: "trends",
      label: "Trends",
      content: <TrendsTab hasProData={hasProData} />,
      isLoading: isLoading
    },
    {
      id: "heatmaps",
      label: "Heatmaps & Interaction",
      content: <HeatmapsTab hasProData={hasProData} />,
      isLoading: isLoading
    },
    {
      id: "conversion",
      label: "Conversion Analytics",
      content: <ConversionTab hasProData={hasProData} />,
      isLoading: isLoading
    }
  ];

  return (
    <DashboardLayout>
      {/* Hidden component that tracks interactions for analysis */}
      <InteractionTracker />
      
      <AnalyticsHeader 
        isRealtime={isRealtime} 
        clientAccessMode={clientAccessMode} 
        viewOnlyMode={viewOnlyMode} 
      />

      <TabManager
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="space-y-6"
      />
    </DashboardLayout>
  );
};

export default Analytics;
