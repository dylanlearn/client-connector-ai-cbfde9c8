
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CulturalContext {
  id: string;
  name: string;
  region: string;
  language?: string;
  reading_direction?: string;
  color_preferences?: Record<string, string>;
  layout_preferences?: Record<string, any>;
  typography_adjustments?: Record<string, any>;
}

export interface CulturalAdaptation {
  id: string;
  cultural_context_id: string;
  component_type?: string;
  wireframe_element_type?: string;
  adaptation_rules: Record<string, any>;
  notes?: string;
}

export interface RegionalPreference {
  id: string;
  region: string;
  category: string;
  preference_data: Record<string, any>;
  source?: string;
  confidence: number;
}

export function useCulturalDesignAdaptation(region?: string) {
  const { user } = useAuth();
  const [culturalContexts, setCulturalContexts] = useState<CulturalContext[]>([]);
  const [currentContext, setCurrentContext] = useState<CulturalContext | null>(null);
  const [adaptations, setAdaptations] = useState<CulturalAdaptation[]>([]);
  const [regionalPreferences, setRegionalPreferences] = useState<RegionalPreference[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCulturalContexts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('cultural_contexts')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setCulturalContexts(data || []);
      
      // Set current context if region is provided
      if (region) {
        const context = data?.find(c => c.region.toLowerCase() === region.toLowerCase());
        if (context) setCurrentContext(context);
      } else if (data && data.length > 0) {
        // Default to the first context
        setCurrentContext(data[0]);
      }
    } catch (err) {
      console.error('Error fetching cultural contexts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch cultural contexts'));
    } finally {
      setIsLoading(false);
    }
  }, [region]);

  const fetchAdaptationsForContext = useCallback(async (contextId: string) => {
    setIsLoading(true);
    
    try {
      // Fetch cultural adaptations
      const { data: adaptData, error: adaptError } = await supabase
        .from('cultural_design_adaptations')
        .select('*')
        .eq('cultural_context_id', contextId);
        
      if (adaptError) throw adaptError;
      
      setAdaptations(adaptData || []);
      
      // Get current context details
      const context = culturalContexts.find(c => c.id === contextId);
      
      if (context) {
        // Fetch regional preferences for this region
        const { data: prefData, error: prefError } = await supabase
          .from('regional_design_preferences')
          .select('*')
          .eq('region', context.region);
          
        if (prefError) throw prefError;
        
        setRegionalPreferences(prefData || []);
      }
    } catch (err) {
      console.error('Error fetching cultural adaptations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch adaptations'));
    } finally {
      setIsLoading(false);
    }
  }, [culturalContexts]);

  useEffect(() => {
    fetchCulturalContexts();
  }, [fetchCulturalContexts]);

  useEffect(() => {
    if (currentContext?.id) {
      fetchAdaptationsForContext(currentContext.id);
    }
  }, [currentContext, fetchAdaptationsForContext]);

  const getAdaptationForComponent = useCallback((componentType: string): Record<string, any> | null => {
    const adaptation = adaptations.find(a => a.component_type === componentType);
    return adaptation?.adaptation_rules || null;
  }, [adaptations]);

  const getPreferenceForCategory = useCallback((category: string): Record<string, any> | null => {
    const preference = regionalPreferences.find(p => p.category === category);
    return preference?.preference_data || null;
  }, [regionalPreferences]);

  const addCulturalContext = async (context: Omit<CulturalContext, 'id'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add cultural contexts');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('cultural_contexts')
        .insert(context)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Cultural context added successfully');
      fetchCulturalContexts();
      return data;
    } catch (err) {
      console.error('Error adding cultural context:', err);
      toast.error('Failed to add cultural context');
      return null;
    }
  };

  const addCulturalAdaptation = async (adaptation: Omit<CulturalAdaptation, 'id'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add adaptations');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('cultural_design_adaptations')
        .insert(adaptation)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Cultural adaptation added successfully');
      if (adaptation.cultural_context_id === currentContext?.id) {
        fetchAdaptationsForContext(currentContext.id);
      }
      return data;
    } catch (err) {
      console.error('Error adding cultural adaptation:', err);
      toast.error('Failed to add cultural adaptation');
      return null;
    }
  };

  const setContext = (contextName: string) => {
    const context = culturalContexts.find(c => c.name === contextName);
    if (context) {
      setCurrentContext(context);
      return true;
    }
    return false;
  };

  return {
    culturalContexts,
    currentContext,
    adaptations,
    regionalPreferences,
    isLoading,
    error,
    setContext,
    getAdaptationForComponent,
    getPreferenceForCategory,
    addCulturalContext,
    addCulturalAdaptation
  };
}
