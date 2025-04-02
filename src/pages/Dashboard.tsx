
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import StatsTab from "@/components/dashboard/tabs/StatsTab";
import TipsTab from "@/components/dashboard/tabs/TipsTab";
import ClientsTab from "@/components/dashboard/tabs/ClientsTab";
import { TabManager, TabItem } from "@/components/ui/tab-manager";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const { activeTab, loading, handleTabChange } = useDashboardTabs();

  // Define tabs configuration
  const dashboardTabs: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
      content: <OverviewTab projects={projects} />,
      isLoading: loading && activeTab === "overview"
    },
    {
      id: "clients",
      label: "Clients",
      content: <ClientsTab />,
      isLoading: loading && activeTab === "clients"
    },
    {
      id: "stats",
      label: "Stats",
      content: <StatsTab />,
      isLoading: loading && activeTab === "stats"
    },
    {
      id: "tips",
      label: "Tips",
      content: <TipsTab />,
      isLoading: loading && activeTab === "tips"
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/new-project")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>New Project</span>
        </Button>
      </div>

      <TabManager 
        tabs={dashboardTabs}
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        className="space-y-4"
      />
    </DashboardLayout>
  );
};

export default Dashboard;
