
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ClientOverview, ClientProgressItem } from "@/types/client";

export function useClientOverview() {
  const { user } = useAuth();
  
  // Fetch client overview data
  const { data: clientOverview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['clientOverview', user?.id],
    queryFn: async (): Promise<ClientOverview | null> => {
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
        };
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
    queryFn: async (): Promise<ClientProgressItem[]> => {
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
  
  return {
    clientOverview,
    clientProgress,
    isLoadingOverview,
    isLoadingProgress
  };
}
