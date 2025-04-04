
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

export const useProjectDetail = (projectId?: string) => {
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
      
      return data as Project;
    },
    enabled: !!projectId,
  });

  return {
    project,
    isLoading,
    error,
  };
};
