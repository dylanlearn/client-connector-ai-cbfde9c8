
import { supabase } from "@/integrations/supabase/client";
import { GlobalMemoryInsights } from "./global-memory-insights";
import { MemoryCategory } from "../memory-types";

/**
 * Service for handling real-time updates to memory insights
 */
export const GlobalMemoryRealtime = {
  /**
   * Subscribe to real-time memory insights for a specific category
   * Returns a cleanup function to unsubscribe
   */
  subscribeToInsights: (
    category: MemoryCategory,
    onInsightsUpdate: (insights: string[]) => void
  ): (() => void) => {
    // First, fetch initial insights
    GlobalMemoryInsights.analyzeInsights(category)
      .then(insights => onInsightsUpdate(insights))
      .catch(error => console.error("Error fetching initial insights:", error));
    
    // Set up real-time subscription to global_memories table changes
    const channel = supabase
      .channel(`global-memories-${category}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_memories',
          filter: `category=eq.${category}`
        },
        async (payload) => {
          console.log(`Memory change detected for category ${category}:`, payload);
          try {
            // Re-analyze when memories change
            const freshInsights = await GlobalMemoryInsights.analyzeInsights(category);
            onInsightsUpdate(freshInsights);
          } catch (error) {
            console.error("Error updating insights after memory change:", error);
          }
        }
      )
      .subscribe();
    
    // Also subscribe to memory_analysis_results table changes
    const analysisChannel = supabase
      .channel(`memory-analysis-${category}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memory_analysis_results',
          filter: `category=eq.${category}`
        },
        (payload) => {
          console.log(`Analysis result change detected for ${category}:`, payload);
          if (payload.new && payload.eventType !== 'DELETE') {
            const insights = (payload.new as any).insights?.results || [];
            if (insights.length > 0) {
              onInsightsUpdate(insights);
            }
          }
        }
      )
      .subscribe();
    
    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(analysisChannel);
    };
  },
  
  /**
   * Trigger a real-time analysis update for a specific category
   */
  triggerAnalysisUpdate: async (category: MemoryCategory): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("analyze-memory-patterns", {
        body: { category, limit: 100 }
      });
      
      if (error) {
        console.error("Error triggering analysis update:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error triggering analysis update:", error);
      return false;
    }
  }
};
