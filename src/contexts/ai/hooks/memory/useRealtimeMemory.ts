
import { useState, useCallback, useEffect, useRef } from "react";
import { MemoryCategory, AIMemoryService } from "@/services/ai";
import { useAuth } from "@/hooks/use-auth";
import { useMemoryContext } from "./useMemoryContext";

/**
 * Hook for managing real-time memory updates
 */
export const useRealtimeMemory = () => {
  const { user } = useAuth();
  const { memoryContext, setMemoryContext } = useMemoryContext();
  const [isRealtime, setIsRealtime] = useState(false);
  
  // Use refs to store cleanup functions for realtime subscriptions
  const cleanupFunctions = useRef<(() => void)[]>([]);

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
   * Update memory context with new insights
   */
  const updateMemoryContext = useCallback((
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
  }, [setMemoryContext]);

  /**
   * Setup real-time subscriptions for memory insights
   */
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user?.id) return;
    
    // Clear any existing subscriptions
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
    
    // Categories to subscribe to
    const categories = [
      MemoryCategory.TonePreference,
      MemoryCategory.ColorPreference,
      MemoryCategory.LayoutPreference,
      MemoryCategory.ClientFeedback
    ];
    
    // Create subscriptions for each category
    categories.forEach(category => {
      const cleanup = subscribeToCategory(
        category, 
        (insights) => updateMemoryContext(category, insights)
      );
      
      cleanupFunctions.current.push(cleanup);
    });
    
    setIsRealtime(true);
    
    return () => {
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
      setIsRealtime(false);
    };
  }, [user, subscribeToCategory, updateMemoryContext]);

  /**
   * Reset the real-time subscriptions
   */
  const resetRealtimeSubscriptions = useCallback(() => {
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
    setIsRealtime(false);
  }, []);

  // Set up realtime subscriptions when user is available
  useEffect(() => {
    if (user?.id) {
      const cleanup = setupRealtimeSubscriptions();
      return cleanup;
    }
  }, [user, setupRealtimeSubscriptions]);

  return {
    isRealtime,
    setupRealtimeSubscriptions,
    resetRealtimeSubscriptions
  };
};
