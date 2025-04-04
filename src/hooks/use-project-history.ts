
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectHistory } from '@/types/project-history';

export const useProjectHistory = (projectId?: string) => {
  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project-history', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_history')
        .select('*')
        .eq('project_id', projectId)
        .order('changed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching project history:', error);
        throw error;
      }
      
      return data as ProjectHistory[];
    },
    enabled: !!projectId,
  });

  return {
    history,
    isLoading,
    error,
  };
};
