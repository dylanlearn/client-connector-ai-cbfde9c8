
import { useCallback } from 'react';
import { MemoryCategory } from '@/services/ai/memory';
import { useMemoryContext } from "./useMemoryContext";
import { useMemoryStorage } from "./useMemoryStorage";
import { useRealtimeMemory } from "./useRealtimeMemory";
import { AIMemoryInterface } from './types';

/**
 * Combined hook for AI memory functionality
 * This is a facade that combines the more specialized hooks
 */
export const useAIMemory = (): AIMemoryInterface => {
  const { 
    memoryContext,
    isProcessing,
    refreshMemoryContext,
    resetMemoryContext
  } = useMemoryContext();
  
  // Rename the imported function to avoid naming conflicts
  const { 
    storeMemory, 
    storeInteractionMemory: storeInteractionMemoryFromStorage 
  } = useMemoryStorage();
  
  const { 
    isRealtime,
    resetRealtimeSubscriptions
  } = useRealtimeMemory();

  /**
   * Store user interaction events in memory
   * Enhanced version that supports all event types including 'movement'
   */
  const storeInteractionMemory = useCallback(async (
    eventType: 'click' | 'hover' | 'scroll' | 'view' | 'movement',
    element: string,
    position: { x: number, y: number }
  ) => {
    // For movement events, use direct storeMemory with InteractionPattern category
    if (eventType === 'movement') {
      await storeMemory(
        `User ${eventType} near ${element} at position (${position.x}, ${position.y})`,
        MemoryCategory.InteractionPattern,
        undefined,
        {
          eventType,
          element,
          position,
          timestamp: new Date().toISOString()
        }
      );
    } else {
      // For other event types, use the storage utility function
      await storeInteractionMemoryFromStorage(
        eventType,
        element,
        position
      );
    }
  }, [storeMemory, storeInteractionMemoryFromStorage]);

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
