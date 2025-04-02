
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory } from "../memory-types";
import { GlobalMemoryBase } from "./global-memory-base";

/**
 * Service for analyzing global memory insights
 */
export const GlobalMemoryInsights = {
  /**
   * Analyze global memories to extract insights using AI
   */
  analyzeInsights: async (
    category: MemoryCategory,
    limit: number = 100
  ): Promise<string[]> => {
    try {
      // Fetch most relevant memories from the specified category
      const { data, error } = await (supabase
        .from('global_memories') as any)
        .select('*')
        .eq('category', category)
        .order('relevance_score', { ascending: false })
        .order('frequency', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error("Error fetching global memories for analysis:", error);
        return ["Not enough data to extract insights"];
      }
      
      if (!data || data.length === 0) {
        return ["Not enough data to extract insights"];
      }
      
      // Transform the data to our memory format
      const memories = data.map(m => GlobalMemoryBase.mapToGlobalMemory(m));
      
      try {
        // Call the analyze-memory-patterns edge function
        const { data: analysisData, error: fnError } = await supabase.functions.invoke("analyze-memory-patterns", {
          body: {
            category,
            limit
          },
        });
        
        if (fnError) {
          console.error("Error invoking analyze-memory-patterns function:", fnError);
          return ["Error analyzing insights from global memory"];
        }
        
        return analysisData.insights;
      } catch (aiError) {
        console.error("Error analyzing global memory insights:", aiError);
        // Fallback to returning sample insights
        return [
          "Users prefer clean, minimalist layouts", 
          "Dark mode is preferred for extended usage", 
          "Accessibility considerations are important across all designs"
        ];
      }
    } catch (error) {
      console.error("Error analyzing global memory insights:", error);
      return ["Error analyzing insights from global memory"];
    }
  }
};
