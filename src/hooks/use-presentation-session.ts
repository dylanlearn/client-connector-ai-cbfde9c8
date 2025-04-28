
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PresentationSession {
  id: string;
  title: string;
  wireframe_id: string;
  presenter_id: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  settings: Record<string, any>;
}

export function usePresentationSession(sessionId?: string) {
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery({
    queryKey: ['presentation-session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const { data, error } = await supabase
        .from('presentation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data as PresentationSession;
    },
    enabled: !!sessionId
  });

  const createSession = useMutation({
    mutationFn: async (newSession: Partial<PresentationSession>) => {
      const { data, error } = await supabase
        .from('presentation_sessions')
        .insert(newSession)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Presentation session created successfully');
      queryClient.invalidateQueries({ queryKey: ['presentation-session'] });
    },
    onError: (error) => {
      toast.error('Failed to create presentation session', {
        description: error.message
      });
    }
  });

  const updateSession = useMutation({
    mutationFn: async (updates: Partial<PresentationSession>) => {
      const { data, error } = await supabase
        .from('presentation_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Presentation session updated successfully');
      queryClient.invalidateQueries({ queryKey: ['presentation-session', sessionId] });
    },
    onError: (error) => {
      toast.error('Failed to update presentation session', {
        description: error.message
      });
    }
  });

  return {
    session,
    isLoading,
    createSession: createSession.mutate,
    updateSession: updateSession.mutate
  };
}
