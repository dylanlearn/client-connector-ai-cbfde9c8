
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsData, AnalyticsFilter } from "@/types/analytics";
import { withRetry } from "@/utils/retry-utils";
import { toast } from "sonner";

export const AnalyticsService = {
  /**
   * Fetch analytics data for a given time period with enterprise-grade retry logic
   */
  async fetchAnalytics(userId: string, startDate: Date, endDate: Date) {
    return withRetry(async () => {
      try {
        const { data, error } = await supabase
          .from('design_analytics')
          .select('*')
          .eq('user_id', userId)
          .gte('updated_at', startDate.toISOString())
          .lte('updated_at', endDate.toISOString())
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching analytics:', err);
        throw err; // Re-throw to allow retry mechanism to work
      }
    }, {
      maxRetries: 3,
      onRetry: (attempt, error) => {
        console.warn(`Retry attempt ${attempt} for analytics fetch: ${error.message}`);
      }
    });
  },
  
  /**
   * Get interaction data summary with improved error handling
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
      
      // Provide user-friendly error message
      toast.error("Unable to load interaction data", {
        description: "Please try again later"
      });
      
      return [];
    }
  },
  
  /**
   * Store analytics data with batching for performance
   */
  async storeAnalytics(data: AnalyticsData[], batchSize = 50) {
    if (!data.length) return { success: true, inserted: 0 };
    
    try {
      let inserted = 0;
      
      // Process in smaller batches for better performance
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('analytics_data')
          .insert(batch);
          
        if (error) throw error;
        
        inserted += batch.length;
      }
      
      return { success: true, inserted };
    } catch (err) {
      console.error('Error storing analytics data:', err);
      return { success: false, error: err, inserted: 0 };
    }
  },
  
  /**
   * Filter analytics data with pagination support
   */
  async filterAnalytics(filters: AnalyticsFilter) {
    const { startDate, endDate, category, userId, limit = 100 } = filters;
    
    try {
      let query = supabase
        .from('design_analytics')
        .select('*');
        
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (startDate) {
        query = query.gte('updated_at', startDate.toISOString());
      }
      
      if (endDate) {
        query = query.lte('updated_at', endDate.toISOString());
      }
      
      const { data, error } = await query
        .order('updated_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error filtering analytics:', err);
      return [];
    }
  }
};
