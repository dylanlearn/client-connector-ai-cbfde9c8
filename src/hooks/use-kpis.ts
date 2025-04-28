
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useKeyPerformanceIndicators(projectId?: string, goalId?: string) {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId || !user?.id) return;
    
    const fetchKPIs = async () => {
      try {
        setIsLoading(true);
        
        // Start building the query
        let query = supabase
          .from('key_performance_indicators')
          .select(`
            *,
            wireframe_goal_connections (count)
          `)
          .eq('project_id', projectId);
        
        // Add filter for specific goal if provided
        if (goalId) {
          query = query.eq('goal_id', goalId);
        }
        
        const { data, error } = await query;
          
        if (error) throw error;
        
        // Format the data to include element connection count
        const formattedData = data.map(kpi => ({
          ...kpi,
          element_connections: kpi.wireframe_goal_connections[0]?.count || 0
        }));
        
        setKpis(formattedData || []);
      } catch (err) {
        console.error('Error fetching KPIs:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, [projectId, goalId, user?.id]);

  const addKPI = async (kpi: any) => {
    if (!projectId || !user?.id) {
      toast.error('Missing required information');
      return null;
    }
    
    try {
      const newKPI = {
        ...kpi,
        project_id: projectId
      };
      
      const { data, error } = await supabase
        .from('key_performance_indicators')
        .insert(newKPI)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add element_connections property for consistency
      const formattedData = {
        ...data,
        element_connections: 0
      };
      
      setKpis(prev => [...prev, formattedData]);
      toast.success('KPI added successfully');
      return formattedData;
    } catch (err) {
      console.error('Error adding KPI:', err);
      toast.error('Failed to add KPI');
      return null;
    }
  };

  const updateKPI = async (id: string, updates: any) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('key_performance_indicators')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setKpis(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast.success('KPI updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating KPI:', err);
      toast.error('Failed to update KPI');
      return false;
    }
  };

  const deleteKPI = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('key_performance_indicators')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setKpis(prev => prev.filter(item => item.id !== id));
      toast.success('KPI deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting KPI:', err);
      toast.error('Failed to delete KPI');
      return false;
    }
  };

  return {
    kpis,
    isLoading,
    error,
    addKPI,
    updateKPI,
    deleteKPI
  };
}
