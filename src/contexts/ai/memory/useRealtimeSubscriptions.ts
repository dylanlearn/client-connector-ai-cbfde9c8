
import { useCallback, useRef } from 'react';
import { AIMemoryService, MemoryCategory } from '@/services/ai';
import { AIMemoryContext } from './types';

export const useRealtimeSubscriptions = (
  userId: string | undefined,
  setMemoryContext: React.Dispatch<React.SetStateAction<AIMemoryContext | undefined>>,
  setIsRealtime: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Store cleanup functions for realtime subscriptions
  const cleanupFunctions = useRef<(() => void)[]>([]);

  /**
   * Setup real-time subscriptions for memory insights
   */
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!userId) return () => {};
    
    // Clear any existing subscriptions
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
    
    // Subscribe to different memory categories
    const categories = [
      MemoryCategory.TonePreference,
      MemoryCategory.ColorPreference,
      MemoryCategory.LayoutPreference,
      MemoryCategory.ClientFeedback
    ];
    
    categories.forEach(category => {
      const cleanup = AIMemoryService.global.realtime.subscribeToInsights(
        category,
        (insights) => {
          console.log(`Real-time insights update for ${category}:`, insights);
          // Update memory context with new insights
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
        }
      );
      
      cleanupFunctions.current.push(cleanup);
    });
    
    setIsRealtime(true);
    
    return () => {
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
      setIsRealtime(false);
    };
  }, [userId, setMemoryContext, setIsRealtime]);

  /**
   * Reset the memory context
   */
  const resetSubscriptions = useCallback(() => {
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
    setIsRealtime(false);
  }, [setIsRealtime]);

  return {
    setupRealtimeSubscriptions,
    resetSubscriptions
  };
};
