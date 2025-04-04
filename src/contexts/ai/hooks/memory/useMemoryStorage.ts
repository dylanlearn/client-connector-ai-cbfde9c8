
import { useCallback } from 'react';
import { useMemory } from '@/contexts/ai/MemoryContext';
import { MemoryCategory } from '@/services/ai/memory';

/**
 * Hook specifically for memory storage operations
 */
export const useMemoryStorage = () => {
  const { storeMemory } = useMemory();
  
  /**
   * Store user interaction events in memory
   */
  const storeInteractionMemory = useCallback(async (
    eventType: 'click' | 'hover' | 'scroll' | 'view',
    element: string,
    position: { x: number, y: number }
  ) => {
    const content = `User ${eventType} on ${element} at position (${position.x}, ${position.y})`;
    const metadata = {
      eventType,
      element,
      position,
      pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
      timestamp: new Date().toISOString()
    };
    
    await storeMemory(
      content,
      MemoryCategory.InteractionPattern,
      undefined,
      metadata
    );
  }, [storeMemory]);

  return {
    storeMemory,
    storeInteractionMemory
  };
};

export default useMemoryStorage;
