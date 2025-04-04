
import { useMemory } from '@/contexts/ai/MemoryContext';

/**
 * Hook to use the central memory context
 */
export const useMemoryContext = () => {
  return useMemory();
};

export default useMemoryContext;
