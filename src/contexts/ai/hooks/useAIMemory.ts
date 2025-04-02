
import { useState, useCallback, useEffect, useRef } from "react";
import { AIMemoryContext } from "@/types/ai";
import { AIMemoryService, MemoryCategory } from "@/services/ai";
import { useAuth } from "@/hooks/use-auth";

export const useAIMemory = () => {
  const { user } = useAuth();
  const [memoryContext, setMemoryContext] = useState<AIMemoryContext | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  
  // Use refs to store cleanup functions for realtime subscriptions
  const cleanupFunctions = useRef<(() => void)[]>([]);

  /**
   * Store a memory in the appropriate layers based on context
   */
  const storeMemory = useCallback(async (
    content: string,
    category: string, 
    projectId?: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    
    try {
      // Map string category to enum
      const memoryCategory = category as MemoryCategory;
      
      await AIMemoryService.storeMemoryAcrossLayers(
        user.id,
        content,
        memoryCategory,
        projectId,
        metadata
      );
      
      // Refresh memory context after storing new memory
      await refreshMemoryContext(projectId);
      
      // Trigger real-time analysis update
      await AIMemoryService.global.realtime.triggerAnalysisUpdate(memoryCategory);
    } catch (error) {
      console.error("Error storing memory:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  /**
   * Refresh the memory context, pulling in latest memories across layers
   */
  const refreshMemoryContext = useCallback(async (projectId?: string) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    
    try {
      const contextualMemories = await AIMemoryService.getContextualMemories(
        user.id,
        projectId,
        {
          limit: 10,
          timeframe: {
            // Get memories from the last 30 days
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      );
      
      setMemoryContext({
        userMemories: contextualMemories.userMemories.map(m => ({
          content: m.content,
          category: m.category,
          timestamp: m.timestamp,
          metadata: m.metadata
        })),
        projectMemories: contextualMemories.projectMemories.map(m => ({
          content: m.content,
          category: m.category,
          timestamp: m.timestamp,
          metadata: m.metadata
        })),
        globalInsights: contextualMemories.globalMemories.map(m => ({
          content: m.content,
          category: m.category,
          relevanceScore: m.relevanceScore,
          frequency: m.frequency
        }))
      });
    } catch (error) {
      console.error("Error refreshing memory context:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  /**
   * Setup real-time subscriptions for memory insights
   */
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user?.id) return;
    
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
                        timestamp: new Date(),
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
  }, [user]);

  /**
   * Reset the memory context
   */
  const resetMemoryContext = useCallback(() => {
    setMemoryContext(undefined);
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
    memoryContext,
    isProcessing,
    isRealtime,
    storeMemory,
    refreshMemoryContext,
    resetMemoryContext
  };
};
