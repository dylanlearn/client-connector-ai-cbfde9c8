
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSimulateTest(scenarioId?: string) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const simulate = async (iterations: number = 100) => {
    if (!scenarioId || !user?.id) {
      toast.error('Missing required information');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    setSimulationResults(null);
    setCurrentStep(0);
    setTotalSteps(5); // Simulate 5 steps in our process
    setProgress(0);
    
    try {
      // Simulate a multi-step process
      for (let i = 1; i <= 5; i++) {
        setCurrentStep(i);
        setProgress(i / 5 * 100);
        
        // Wait for a moment to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Call the database function to simulate the test
      const { data, error } = await supabase.rpc('simulate_user_test', {
        p_scenario_id: scenarioId,
        p_iterations: iterations
      });
        
      if (error) throw error;
      
      // Get the result details
      const resultId = data.result_id;
      
      const { data: resultData, error: resultError } = await supabase
        .from('simulation_results')
        .select('*')
        .eq('id', resultId)
        .single();
        
      if (resultError) throw resultError;
      
      setSimulationResults(resultData);
      toast.success('Simulation completed successfully');
      return resultData;
    } catch (err) {
      console.error('Error running simulation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(`Simulation failed: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    simulate,
    isLoading,
    currentStep,
    totalSteps,
    progress,
    simulationResults,
    error
  };
}
