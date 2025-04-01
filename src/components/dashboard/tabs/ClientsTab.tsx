
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientActivityFeed from "@/components/clients/ClientActivityFeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClientOverview {
  totalClients: number;
  activeClients: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

interface ClientProgressItem {
  clientName: string;
  email: string;
  completed: number;
  total: number;
  lastActive: Date | null;
}

export default function ClientsTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch client overview data
  const { data: clientOverview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['clientOverview', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        // Get client links count
        const { data: linksData, error: linksError } = await supabase
          .from('client_access_links')
          .select('id, status')
          .eq('designer_id', user.id);
          
        if (linksError) throw linksError;
        
        const totalClients = linksData.length;
        const activeClients = linksData.filter(link => link.status === 'active').length;
        
        // Get tasks statistics
        const { data: tasksData, error: tasksError } = await supabase
          .from('client_tasks')
          .select('id, status, link_id')
          .in('link_id', linksData.map(link => link.id));
          
        if (tasksError) throw tasksError;
        
        const completedTasks = tasksData.filter(task => task.status === 'completed').length;
        const totalTasks = tasksData.length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        return {
          totalClients,
          activeClients,
          completedTasks,
          pendingTasks,
          completionRate
        } as ClientOverview;
      } catch (error) {
        console.error('Error fetching client overview:', error);
        throw error;
      }
    },
    enabled: !!user
  });
  
  // Fetch client progress data
  const { data: clientProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['clientProgress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // First get all client links
        const { data: linksData, error: linksError } = await supabase
          .from('client_access_links')
          .select('id, client_name, client_email, last_accessed_at, status')
          .eq('designer_id', user.id)
          .eq('status', 'active')
          .order('last_accessed_at', { ascending: false });
          
        if (linksError) throw linksError;
        
        // For each client, get task completion stats
        const progressItems: ClientProgressItem[] = await Promise.all(
          linksData.map(async (link) => {
            const { data: tasksData, error: tasksError } = await supabase
              .from('client_tasks')
              .select('id, status')
              .eq('link_id', link.id);
              
            if (tasksError) throw tasksError;
            
            const total = tasksData.length;
            const completed = tasksData.filter(task => task.status === 'completed').length;
            
            return {
              clientName: link.client_name,
              email: link.client_email,
              completed,
              total,
              lastActive: link.last_accessed_at ? new Date(link.last_accessed_at) : null
            };
          })
        );
        
        return progressItems;
      } catch (error) {
        console.error('Error fetching client progress:', error);
        throw error;
      }
    },
    enabled: !!user
  });
  
  const handleCreateClientClick = () => {
    navigate('/clients');
  };
  
  return (
    <div className="space-y-6">
      {/* Client stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{clientOverview?.totalClients || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{clientOverview?.activeClients || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{clientOverview?.completedTasks || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {Math.round(clientOverview?.completionRate || 0)}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Client activity and progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientActivityFeed />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Client Progress</CardTitle>
              <CardDescription>Task completion by client</CardDescription>
            </div>
            <Button size="sm" onClick={handleCreateClientClick}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingProgress ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : clientProgress && clientProgress.length > 0 ? (
              <div className="space-y-5">
                {clientProgress.map((client, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{client.clientName}</span>
                      <span className="text-muted-foreground">
                        {client.completed}/{client.total} tasks
                      </span>
                    </div>
                    <Progress
                      value={client.total > 0 ? (client.completed / client.total) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No active clients</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={handleCreateClientClick}
                >
                  Add Your First Client
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
