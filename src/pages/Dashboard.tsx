
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import StatsTab from "@/components/dashboard/tabs/StatsTab";
import TipsTab from "@/components/dashboard/tabs/TipsTab";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const { activeTab, loading, handleTabChange } = useDashboardTabs();

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/new-project")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>New Project</span>
        </Button>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        onValueChange={handleTabChange} 
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" isLoading={loading && activeTab === "overview"}>
          <OverviewTab projects={projects} />
        </TabsContent>

        <TabsContent value="stats" isLoading={loading && activeTab === "stats"}>
          <StatsTab />
        </TabsContent>

        <TabsContent value="tips" isLoading={loading && activeTab === "tips"}>
          <TipsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
