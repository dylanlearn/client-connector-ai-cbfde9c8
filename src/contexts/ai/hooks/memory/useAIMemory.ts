import { useState, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { MemoryCategory } from '@/services/ai/memory';
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
  
  const { storeMemory, storeInteractionMemory } = useMemoryStorage();
  
  const { 
    isRealtime,
    resetRealtimeSubscriptions
  } = useRealtimeMemory();

  /**
   * Store user interaction events in memory
   */
  const storeInteractionMemory = useCallback(async (
    eventType: 'click' | 'hover' | 'scroll' | 'view' | 'movement',
    element: string,
    position: { x: number, y: number }
  ) => {
    await storeMemory({
      category: MemoryCategory.Interaction,
      data: {
        eventType,
        element,
        position
      }
    });
  }, [storeMemory]);

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
    storeInteractionMemory,
    refreshMemoryContext,
    resetMemoryContext: resetMemory
  };
};
