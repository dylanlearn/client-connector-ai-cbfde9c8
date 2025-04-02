
import { useCallback } from "react";
import { useMemoryContext } from "./useMemoryContext";
import { useMemoryStorage } from "./useMemoryStorage";
import { useRealtimeMemory } from "./useRealtimeMemory";

/**
 * Combined hook for AI memory functionality
 * This is a facade that combines the more specialized hooks
 */
export const useAIMemory = () => {
  const { 
    memoryContext,
    isProcessing,
    refreshMemoryContext,
    resetMemoryContext
  } = useMemoryContext();
  
  const { storeMemory } = useMemoryStorage();
  
  const { 
    isRealtime,
    resetRealtimeSubscriptions
  } = useRealtimeMemory();

  /**
   * Reset all memory state and subscriptions
   */
  const resetMemory = useCallback(() => {
    resetMemoryContext();
    resetRealtimeSubscriptions();
  }, [resetMemoryContext, resetRealtimeSubscriptions]);

  // Fix the TS error by modifying the return value of storeMemory to be void
  const storeMemoryWrapper = useCallback(async (
    content: string,
    category: string, 
    projectId?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> => {
    await storeMemory(content, category, projectId, metadata);
    // Return void instead of boolean
  }, [storeMemory]);

  return {
    // Expose the combined API
    memoryContext,
    isProcessing,
    isRealtime,
    storeMemory: storeMemoryWrapper,
    refreshMemoryContext,
    resetMemoryContext: resetMemory
  };
};
