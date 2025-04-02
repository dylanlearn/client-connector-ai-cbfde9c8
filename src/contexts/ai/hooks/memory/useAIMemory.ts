
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

  return {
    // Expose the combined API
    memoryContext,
    isProcessing,
    isRealtime,
    storeMemory,
    refreshMemoryContext,
    resetMemoryContext: resetMemory
  };
};
