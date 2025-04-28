
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WireframeActivity {
  id: string;
  wireframe_id: string;
  activity_type: string;
  description: string;
  user_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

interface ActivityFilters {
  activityType?: string;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

export function useActivityTimeline(wireframeId: string, filters: ActivityFilters = {}) {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['wireframe-activities', wireframeId, filters],
    queryFn: async () => {
      let query = supabase
        .from('wireframe_activities')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('created_at', { ascending: false });

      if (filters.activityType) {
        query = query.eq('activity_type', filters.activityType);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      if (filters.searchQuery) {
        query = query.ilike('description', `%${filters.searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as WireframeActivity[];
    }
  });

  return {
    activities,
    isLoading
  };
}
