
import { useState, useCallback } from "react";
import { AIMemoryContext } from "./types";
import { AIMemoryService } from "@/services/ai";
import { useAuth } from "@/hooks/use-auth";

/**
 * Hook for managing memory context state
 */
export const useMemoryContext = () => {
  const { user } = useAuth();
  const [memoryContext, setMemoryContext] = useState<AIMemoryContext | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

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
   * Reset the memory context
   */
  const resetMemoryContext = useCallback(() => {
    setMemoryContext(undefined);
  }, []);

  return {
    memoryContext,
    isProcessing,
    refreshMemoryContext,
    resetMemoryContext,
    setMemoryContext
  };
};
