
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useTestScenarios(wireframeId?: string) {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchScenarios = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('user_test_scenarios')
          .select(`
            *,
            test_task_flows (count)
          `);
        
        // Add filter for specific wireframe if provided
        if (wireframeId) {
          query = query.eq('wireframe_id', wireframeId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Format the data to include task count
        const formattedData = data.map(item => ({
          ...item,
          task_count: item.test_task_flows?.[0]?.count || 0
        }));
        
        setScenarios(formattedData || []);
      } catch (err) {
        console.error('Error fetching test scenarios:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, [wireframeId, user?.id]);

  const addScenario = async (scenario: any) => {
    if (!user?.id) {
      toast.error('You must be logged in to add test scenarios');
      return null;
    }
    
    try {
      const newScenario = {
        ...scenario,
        creator_id: user.id
      };
      
      const { data, error } = await supabase
        .from('user_test_scenarios')
        .insert(newScenario)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add task_count property for consistency
      const formattedData = {
        ...data,
        task_count: 0
      };
      
      setScenarios(prev => [formattedData, ...prev]);
      toast.success('Test scenario created successfully');
      return formattedData;
    } catch (err) {
      console.error('Error adding test scenario:', err);
      toast.error('Failed to create test scenario');
      return null;
    }
  };

  const updateScenario = async (id: string, updates: any) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('user_test_scenarios')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setScenarios(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast.success('Test scenario updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating test scenario:', err);
      toast.error('Failed to update test scenario');
      return false;
    }
  };

  const deleteScenario = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('user_test_scenarios')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setScenarios(prev => prev.filter(item => item.id !== id));
      toast.success('Test scenario deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting test scenario:', err);
      toast.error('Failed to delete test scenario');
      return false;
    }
  };

  return {
    scenarios,
    isLoading,
    error,
    addScenario,
    updateScenario,
    deleteScenario
  };
}
