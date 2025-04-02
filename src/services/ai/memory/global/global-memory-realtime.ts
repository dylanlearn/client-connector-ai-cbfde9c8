
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory } from "../memory-types";

/**
 * Service for real-time global memory functionality
 */
export const GlobalMemoryRealtime = {
  /**
   * Subscribe to insights for a specific category
   */
  subscribeToInsights: (
    category: MemoryCategory,
    callback: (insights: string[]) => void
  ): () => void => {
    const channel = supabase
      .channel('memory-insights')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'memory_analysis_results',
          filter: `category=eq.${category}`
        },
        async (payload) => {
          console.log('New memory analysis result:', payload);
          try {
            // Extract insights from the payload
            const insights = payload.new.insights?.results || [];
            
            // Convert all insights to strings to ensure type safety
            const safeInsights = insights.map((item: any) => String(item));
            
            // Invoke the callback with the insights
            callback(safeInsights);
          } catch (error) {
            console.error('Error processing memory analysis results:', error);
          }
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  },
  
  /**
   * Trigger a real-time analysis update for a category
   */
  triggerAnalysisUpdate: async (category: MemoryCategory): Promise<void> => {
    try {
      // Call the analyze-memory-patterns function to refresh insights
      const { error } = await supabase.functions.invoke("analyze-memory-patterns", {
        body: {
          category,
          forceRefresh: true
        },
      });
      
      if (error) {
        console.error("Error triggering memory analysis update:", error);
      }
    } catch (error) {
      console.error("Error triggering memory analysis update:", error);
    }
  }
};
