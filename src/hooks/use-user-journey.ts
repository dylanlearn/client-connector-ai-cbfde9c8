
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserJourney {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  status: 'draft' | 'active' | 'archived';
  steps: JourneyStep[];
}

export interface JourneyStep {
  id: string;
  journey_id: string;
  title: string;
  description?: string;
  step_order: number;
  wireframe_id?: string;
  screen_id?: string;
  transition_type?: string;
  transition_metadata?: Record<string, any>;
}

export function useUserJourney(journeyId?: string) {
  const queryClient = useQueryClient();

  const { data: journey, isLoading } = useQuery({
    queryKey: ['user-journey', journeyId],
    queryFn: async () => {
      if (!journeyId) return null;

      const { data: journeyData, error: journeyError } = await supabase
        .from('user_journeys')
        .select('*')
        .eq('id', journeyId)
        .single();

      if (journeyError) throw journeyError;

      const { data: stepsData, error: stepsError } = await supabase
        .from('journey_steps')
        .select('*')
        .eq('journey_id', journeyId)
        .order('step_order', { ascending: true });

      if (stepsError) throw stepsError;

      return {
        ...journeyData,
        steps: stepsData
      } as UserJourney;
    },
    enabled: !!journeyId
  });

  const createJourney = useMutation({
    mutationFn: async (newJourney: Partial<UserJourney>) => {
      const { data, error } = await supabase
        .from('user_journeys')
        .insert(newJourney)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('User journey created successfully');
      queryClient.invalidateQueries({ queryKey: ['user-journey'] });
    }
  });

  const updateJourney = useMutation({
    mutationFn: async (updates: Partial<UserJourney>) => {
      const { data, error } = await supabase
        .from('user_journeys')
        .update(updates)
        .eq('id', journeyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('User journey updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user-journey', journeyId] });
    }
  });

  return {
    journey,
    isLoading,
    createJourney: createJourney.mutate,
    updateJourney: updateJourney.mutate
  };
}
