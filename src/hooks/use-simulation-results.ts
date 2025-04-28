
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

export function useSimulationResults(wireframeId?: string, scenarioId?: string) {
  const { user } = useAuth();
  const [results, setResults] = useState<any | null>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch available scenarios for the wireframe
  useEffect(() => {
    if (!wireframeId || !user?.id) return;
    
    const fetchScenarios = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_test_scenarios')
          .select('id, title')
          .eq('wireframe_id', wireframeId);
          
        if (error) throw error;
        
        setScenarios(data || []);
      } catch (err) {
        console.error('Error fetching scenarios:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, [wireframeId, user?.id]);

  // Fetch results for a specific scenario
  useEffect(() => {
    if (!scenarioId || !user?.id) {
      setResults(null);
      return;
    }
    
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('simulation_results')
          .select('*')
          .eq('scenario_id', scenarioId)
          .order('simulation_date', { ascending: false })
          .limit(1)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        setResults(data || null);
      } catch (err) {
        console.error('Error fetching simulation results:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [scenarioId, user?.id]);

  return {
    results,
    scenarios,
    isLoading,
    error
  };
}
