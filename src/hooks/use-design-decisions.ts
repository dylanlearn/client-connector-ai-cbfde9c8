
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DesignDecision {
  id: string;
  title: string;
  description: string;
  rationale: string;
  impact: 'Low' | 'Medium' | 'High';
  tradeoffs?: Record<string, any>;
  ref_links?: Record<string, any>;
  element_links?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useDesignDecisions(wireframeId: string) {
  const queryClient = useQueryClient();

  const { data: decisions = [], isLoading } = useQuery({
    queryKey: ['design-decisions', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_decisions')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DesignDecision[];
    }
  });

  const createDecision = useMutation({
    mutationFn: async (newDecision: Omit<DesignDecision, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('design_decisions')
        .insert(newDecision)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-decisions', wireframeId] });
      toast.success('Design decision recorded successfully');
    },
    onError: (error) => {
      toast.error('Failed to record design decision', {
        description: error.message
      });
    }
  });

  return {
    decisions,
    isLoading,
    createDecision: createDecision.mutate
  };
}
