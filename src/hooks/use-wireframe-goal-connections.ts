
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useWireframeGoalConnections(wireframeId?: string) {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!wireframeId || !user?.id) return;
    
    const fetchConnections = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('wireframe_goal_connections')
          .select(`
            *,
            project_goals (
              title as goal_title
            ),
            key_performance_indicators (
              name as kpi_name
            )
          `)
          .eq('wireframe_id', wireframeId);
          
        if (error) throw error;
        
        // Format the data to simplify access
        const formattedData = data.map(conn => ({
          ...conn,
          goal_title: conn.project_goals?.goal_title || 'Unknown goal',
          kpi_name: conn.key_performance_indicators?.kpi_name
        }));
        
        setConnections(formattedData || []);
      } catch (err) {
        console.error('Error fetching wireframe-goal connections:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [wireframeId, user?.id]);

  const addConnection = async (connection: any) => {
    if (!wireframeId || !user?.id) {
      toast.error('Missing required information');
      return null;
    }
    
    try {
      const newConnection = {
        ...connection,
        wireframe_id: wireframeId
      };
      
      const { data, error } = await supabase
        .from('wireframe_goal_connections')
        .insert(newConnection)
        .select(`
          *,
          project_goals (
            title as goal_title
          ),
          key_performance_indicators (
            name as kpi_name
          )
        `)
        .single();
        
      if (error) throw error;
      
      // Format the data
      const formattedData = {
        ...data,
        goal_title: data.project_goals?.goal_title || 'Unknown goal',
        kpi_name: data.key_performance_indicators?.kpi_name
      };
      
      setConnections(prev => [...prev, formattedData]);
      toast.success('Connection added successfully');
      return formattedData;
    } catch (err) {
      console.error('Error adding connection:', err);
      toast.error('Failed to add connection');
      return null;
    }
  };

  const updateConnection = async (id: string, updates: any) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('wireframe_goal_connections')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state - simplified approach
      setConnections(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast.success('Connection updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating connection:', err);
      toast.error('Failed to update connection');
      return false;
    }
  };

  const deleteConnection = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('wireframe_goal_connections')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setConnections(prev => prev.filter(item => item.id !== id));
      toast.success('Connection deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting connection:', err);
      toast.error('Failed to delete connection');
      return false;
    }
  };

  const getAnalyticsData = async () => {
    if (!wireframeId) return null;
    
    try {
      // This would call our stored function to get analytics on the connections
      // We'll use a local calculation for now
      const goalCounts = connections.reduce((acc, conn) => {
        const goalId = conn.goal_id;
        acc[goalId] = (acc[goalId] || 0) + 1;
        return acc;
      }, {});
      
      const kpiCounts = connections.reduce((acc, conn) => {
        if (conn.kpi_id) {
          acc[conn.kpi_id] = (acc[conn.kpi_id] || 0) + 1;
        }
        return acc;
      }, {});
      
      return {
        totalConnections: connections.length,
        goalCoverage: Object.keys(goalCounts).length,
        kpiCoverage: Object.keys(kpiCounts).length,
        elementCoverage: new Set(connections.map(c => c.element_id)).size
      };
    } catch (err) {
      console.error('Error getting analytics data:', err);
      return null;
    }
  };

  return {
    connections,
    isLoading,
    error,
    addConnection,
    updateConnection,
    deleteConnection,
    getAnalyticsData
  };
}
