
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsService = {
  /**
   * Fetch analytics data for a given time period
   */
  async fetchAnalytics(userId: string, startDate: Date, endDate: Date) {
    try {
      const { data, error } = await supabase
        .from('design_analytics')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching analytics:', err);
      return [];
    }
  },
  
  /**
   * Get interaction data summary
   */
  async getInteractionSummary(userId: string) {
    try {
      const { data, error } = await supabase
        .from('interaction_events')
        .select('event_type, count(*)')
        .eq('user_id', userId)
        .group('event_type');
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching interaction summary:', err);
      return [];
    }
  }
};
