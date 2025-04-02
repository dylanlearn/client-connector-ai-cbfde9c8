
import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClientProgressItem } from "@/types/client";

export function useClientProgress() {
  const { user } = useAuth();
  const [clientProgress, setClientProgress] = useState<ClientProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClientProgress = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch client progress data from the database
      const { data, error } = await supabase
        .from('client_access_links')
        .select(`
          id,
          client_name,
          client_email,
          last_accessed_at,
          client_tasks:client_tasks(
            id,
            status
          )
        `)
        .eq('designer_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform the data into the required format
        const progressData: ClientProgressItem[] = data.map(client => {
          const tasks = client.client_tasks || [];
          const completed = tasks.filter(task => task.status === 'completed').length;
          
          return {
            clientName: client.client_name,
            email: client.client_email,
            completed,
            total: tasks.length,
            lastActive: client.last_accessed_at ? new Date(client.last_accessed_at) : null
          };
        });
        
        setClientProgress(progressData);
      }
    } catch (err) {
      console.error("Error fetching client progress:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error("Failed to load client progress data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClientProgress();
    }
  }, [user]);

  return {
    clientProgress,
    isLoading,
    error,
    refreshClientProgress: fetchClientProgress
  };
}
