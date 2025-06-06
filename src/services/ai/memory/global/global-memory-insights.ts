
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
    limit: number = 100,
    forceRefresh: boolean = false
  ): Promise<string[]> => {
    try {
      // First check if we have recent analysis results (less than 15 minutes old)
      // unless forceRefresh is true
      if (!forceRefresh) {
        const { data: existingAnalysis, error: fetchError } = await supabase
          .from('memory_analysis_results')
          .select('insights, analyzed_at')
          .eq('category', category)
          .order('analyzed_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!fetchError && existingAnalysis) {
          const analysisTime = new Date(existingAnalysis.analyzed_at);
          const now = new Date();
          const timeDiff = now.getTime() - analysisTime.getTime();
          const fifteenMinutes = 15 * 60 * 1000;
          
          // If analysis is recent, return the cached results
          if (timeDiff < fifteenMinutes) {
            console.log(`Using cached analysis for ${category} from ${analysisTime.toISOString()}`);
            // Safely handle the insights data regardless of type
            const insightsData = existingAnalysis.insights;
            if (typeof insightsData === 'object' && insightsData !== null && 'results' in insightsData) {
              // Convert all items to strings to ensure type safety
              return (insightsData.results as any[]).map(item => String(item));
            } else if (Array.isArray(insightsData)) {
              return insightsData.map(item => String(item));
            }
            return [];
          }
        }
      }
      
      // Call the consolidated analytics API
      const { data: analysisData, error: fnError } = await supabase.functions.invoke("analytics-api", {
        body: {
          action: "analyze_memory_patterns",
          analysis_type: "global_insights",
          category,
          limit
        },
      });
      
      if (fnError) {
        console.error("Error invoking analytics-api function:", fnError);
        return ["Error analyzing insights from global memory"];
      }
      
      // Ensure all insights are strings
      return (analysisData.insights || []).map((insight: any) => String(insight));
    } catch (error) {
      console.error("Error analyzing global memory insights:", error);
      return ["Error analyzing insights from global memory"];
    }
  }
};
