
import { useAuth } from "@/hooks/use-auth";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import ClientsTab from "@/components/dashboard/tabs/ClientsTab";
import StatsTab from "@/components/dashboard/tabs/StatsTab";
import TipsTab from "@/components/dashboard/tabs/TipsTab";
import UpgradeCard from "@/components/dashboard/tabs/UpgradeCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  status: string;
}

/**
 * Dashboard page component that fits within the application shell
 */
const Dashboard = () => {
  const { user, profile } = useAuth();
  const { activeTab, handleTabChange } = useDashboardTabs();
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Fetch projects for the Overview tab
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // For demo purposes, we're setting dummy data
        // In a real app, this would fetch from API/database
        setProjects([
          { id: '1', name: 'Website Redesign', status: 'active' },
          { id: '2', name: 'Mobile App UI', status: 'pending' },
        ]);
      } catch (error) {
        console.error('Error fetching projects:', error);
        
        // Show error toast
        toast.error("Could not load projects", {
          description: "There was a problem fetching your projects."
        });
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.name || user?.user_metadata?.name || 'User'}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="col-span-2">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <OverviewTab projects={projects} />
                </TabsContent>
                <TabsContent value="clients" className="space-y-4">
                  <ClientsTab />
                </TabsContent>
                <TabsContent value="stats" className="space-y-4">
                  <StatsTab />
                </TabsContent>
                <TabsContent value="tips" className="space-y-4">
                  <TipsTab />
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <UpgradeCard />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
