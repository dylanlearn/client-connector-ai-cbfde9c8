
import { useCallback } from "react";
import { MemoryCategory, AIMemoryService } from "@/services/ai";

/**
 * Hook for managing memory category subscriptions
 * Handles the subscription lifecycle and callbacks
 */
export const useMemorySubscriptions = () => {
  /**
   * Subscribe to a specific memory category for real-time updates
   */
  const subscribeToCategory = useCallback((
    category: MemoryCategory,
    setContextFn: (insights: string[]) => void
  ) => {
    return AIMemoryService.global.realtime.subscribeToInsights(
      category,
      (insights) => {
        console.log(`Real-time insights update for ${category}:`, insights);
        setContextFn(insights);
      }
    );
  }, []);

  /**
   * Set up subscriptions for multiple categories at once
   */
  const setupCategorySubscriptions = useCallback((
    categories: MemoryCategory[],
    updateHandler: (category: MemoryCategory, insights: string[]) => void
  ) => {
    // Create array of cleanup functions
    return categories.map(category => 
      subscribeToCategory(
        category, 
        (insights) => updateHandler(category, insights)
      )
    );
  }, [subscribeToCategory]);

  return {
    subscribeToCategory,
    setupCategorySubscriptions
  };
};
