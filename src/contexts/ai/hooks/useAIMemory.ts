
import { useMemory } from '@/contexts/ai/MemoryContext';

/**
 * Hook for AI memory functionality
 * This is now a simple wrapper around the centralized memory context
 * to maintain backward compatibility
 */
export const useAIMemory = () => {
  // Use the centralized memory context
  return useMemory();
};

export default useAIMemory;
