
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useProjectGoals(projectId?: string) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId || !user?.id) return;
    
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        
        // Fetch goals with a joined count of associated KPIs
        const { data, error } = await supabase
          .from('project_goals')
          .select(`
            *,
            key_performance_indicators (count)
          `)
          .eq('project_id', projectId)
          .order('priority');
          
        if (error) throw error;
        
        // Format data to include KPI count
        const formattedData = data.map(goal => ({
          ...goal,
          kpi_count: goal.key_performance_indicators[0]?.count || 0
        }));
        
        setGoals(formattedData || []);
      } catch (err) {
        console.error('Error fetching project goals:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [projectId, user?.id]);

  const addGoal = async (goal: any) => {
    if (!projectId || !user?.id) {
      toast.error('Missing required information');
      return null;
    }
    
    try {
      const newGoal = {
        ...goal,
        project_id: projectId
      };
      
      const { data, error } = await supabase
        .from('project_goals')
        .insert(newGoal)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add kpi_count property for consistency with fetched data
      const formattedData = {
        ...data,
        kpi_count: 0
      };
      
      setGoals(prev => [...prev, formattedData]);
      toast.success('Goal added successfully');
      return formattedData;
    } catch (err) {
      console.error('Error adding goal:', err);
      toast.error('Failed to add goal');
      return null;
    }
  };

  const updateGoal = async (id: string, updates: any) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('project_goals')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setGoals(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast.success('Goal updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating goal:', err);
      toast.error('Failed to update goal');
      return false;
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('project_goals')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setGoals(prev => prev.filter(item => item.id !== id));
      toast.success('Goal deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting goal:', err);
      toast.error('Failed to delete goal');
      return false;
    }
  };

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal
  };
}
