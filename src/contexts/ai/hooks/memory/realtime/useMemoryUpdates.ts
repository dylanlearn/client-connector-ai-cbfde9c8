
import { useCallback } from "react";
import { MemoryCategory } from "@/services/ai";

/**
 * Hook for handling memory context updates from realtime events
 */
export const useMemoryUpdates = () => {
  /**
   * Update memory context with new insights
   */
  const updateMemoryContext = useCallback((
    setMemoryContext: React.Dispatch<React.SetStateAction<any>>,
    category: MemoryCategory,
    insights: string[]
  ) => {
    setMemoryContext(prev => {
      if (!prev) return prev;
      
      // Find any existing global insights for this category
      const hasCategory = prev.globalInsights.some(insight => 
        insight.category === category
      );
      
      if (hasCategory) {
        // Update existing insights
        return {
          ...prev,
          globalInsights: prev.globalInsights.map(insight => 
            insight.category === category
              ? {
                  ...insight,
                  content: insights.join('\n'),
                  relevanceScore: 1.0, // Boost relevance for fresh insights
                  frequency: insight.frequency + 1
                }
              : insight
          )
        };
      } else if (insights.length > 0) {
        // Add new insights
        return {
          ...prev,
          globalInsights: [
            ...prev.globalInsights,
            {
              content: insights.join('\n'),
              category: category,
              relevanceScore: 1.0, // High relevance for new insights
              frequency: 1,
            }
          ]
        };
      }
      
      return prev;
    });
  }, []);

  return {
    updateMemoryContext
  };
};
