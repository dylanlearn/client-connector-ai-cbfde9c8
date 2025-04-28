
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PresentationParticipant {
  id: string;
  session_id: string;
  user_id?: string;
  email?: string;
  name?: string;
  role: 'presenter' | 'participant' | 'observer';
  joined_at?: string;
  last_active_at?: string;
}

export function usePresentationParticipants(sessionId?: string) {
  const queryClient = useQueryClient();

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['presentation-participants', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from('presentation_participants')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as PresentationParticipant[];
    },
    enabled: !!sessionId
  });

  const addParticipant = useMutation({
    mutationFn: async (newParticipant: Partial<PresentationParticipant>) => {
      const { data, error } = await supabase
        .from('presentation_participants')
        .insert({ ...newParticipant, session_id: sessionId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentation-participants', sessionId] });
    }
  });

  const updateParticipant = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PresentationParticipant> & { id: string }) => {
      const { data, error } = await supabase
        .from('presentation_participants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentation-participants', sessionId] });
    }
  });

  return {
    participants,
    isLoading,
    addParticipant: addParticipant.mutate,
    updateParticipant: updateParticipant.mutate
  };
}
