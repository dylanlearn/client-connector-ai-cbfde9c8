
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
      // Use RPC to get grouped data instead of using .group() which doesn't exist
      const { data, error } = await supabase.rpc('get_interaction_summary', {
        user_id_param: userId
      });
      
      // If the RPC doesn't exist, provide a fallback using a basic query
      if (error && error.message.includes('does not exist')) {
        console.warn('RPC get_interaction_summary not found, using fallback query');
        
        // Simple query that doesn't need grouping
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('interaction_events')
          .select('event_type, count')
          .eq('user_id', userId);
          
        if (fallbackError) throw fallbackError;
        return fallbackData || [];
      }
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching interaction summary:', err);
      return [];
    }
  }
};
