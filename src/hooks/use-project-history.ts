
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectHistory } from '@/types/project-history';
import { withRetry } from '@/utils/retry-utils';
import { toast } from 'sonner';

/**
 * Enterprise-grade hook for fetching and managing project history
 * with comprehensive error handling and retries
 */
export const useProjectHistory = (projectId?: string) => {
  const {
    data: history,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['project-history', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      return withRetry(async () => {
        const { data, error } = await supabase
          .from('project_history')
          .select('*')
          .eq('project_id', projectId)
          .order('changed_at', { ascending: false });
        
        if (error) {
          throw new Error(`Error fetching project history: ${error.message}`);
        }
        
        return data as ProjectHistory[];
      }, {
        maxRetries: 3,
        initialDelay: 500, 
        onRetry: (attempt, error) => {
          console.warn(`Retry #${attempt} fetching project history: ${error.message}`);
        }
      });
    },
    enabled: !!projectId,
    onError: (err: Error) => {
      toast.error('Error loading project history', {
        description: err.message
      });
    }
  });

  /**
   * Add a new history entry
   */
  const addHistoryEntry = async (
    newStatus: string,
    previousStatus: string | null,
    notes?: string
  ): Promise<boolean> => {
    if (!projectId) return false;

    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        throw new Error('User ID not available');
      }

      const { error } = await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          user_id: userId,
          previous_status: previousStatus,
          new_status: newStatus,
          notes: notes || null
        });

      if (error) {
        throw new Error(`Failed to add history entry: ${error.message}`);
      }

      // Refetch history data to update UI
      refetch();
      return true;
    } catch (error) {
      console.error('Error adding history entry:', error);
      toast.error('Failed to update project history', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  /**
   * Get current authenticated user ID
   */
  const getCurrentUserId = async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user?.id || null;
  };

  return {
    history,
    isLoading,
    error,
    refetch,
    addHistoryEntry
  };
};
