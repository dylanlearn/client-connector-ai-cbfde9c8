
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ComponentRecommendation {
  component_type: string;
  confidence: number;
  reasoning: string;
}

export interface DesignGuideline {
  id: string;
  guideline_type: string;
  context: string;
  component_types: string[];
  recommendation: string;
  priority: number;
}

export function useContextComponentSelection(context?: string) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<ComponentRecommendation[]>([]);
  const [guidelines, setGuidelines] = useState<DesignGuideline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!context || !user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get recommendations based on usage patterns
      const { data: recData, error: recError } = await supabase
        .rpc('get_context_component_recommendations', {
          p_context: context,
          p_limit: 10
        });
        
      if (recError) throw recError;
      
      // Get design guidelines for this context
      const { data: guideData, error: guideError } = await supabase
        .from('design_system_guidelines')
        .select('*')
        .eq('context', context)
        .order('priority', { ascending: false });
        
      if (guideError) throw guideError;
      
      setRecommendations(recData || []);
      setGuidelines(guideData || []);
    } catch (err) {
      console.error('Error fetching component recommendations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
    } finally {
      setIsLoading(false);
    }
  }, [context, user?.id]);

  useEffect(() => {
    if (context) {
      fetchRecommendations();
    }
  }, [context, fetchRecommendations]);

  const recordComponentUsage = useCallback(async (componentType: string, contextName: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .rpc('record_component_usage', {
          p_component_type: componentType,
          p_context_name: contextName
        });
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error recording component usage:', err);
      return false;
    }
  }, [user?.id]);

  const addGuideline = async (guideline: Omit<DesignGuideline, 'id'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add guidelines');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('design_system_guidelines')
        .insert(guideline)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Guideline added successfully');
      fetchRecommendations(); // Refresh the guidelines
      return data;
    } catch (err) {
      console.error('Error adding guideline:', err);
      toast.error('Failed to add guideline');
      return null;
    }
  };

  return {
    recommendations,
    guidelines,
    isLoading,
    error,
    recordComponentUsage,
    addGuideline,
    refreshRecommendations: fetchRecommendations
  };
}
