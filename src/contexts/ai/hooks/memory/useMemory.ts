
import { useMemory as useMemoryContext } from '@/contexts/ai/MemoryContext';

/**
 * A simplified hook for accessing memory functionality throughout the application.
 * This is a thin wrapper around the central memory context to maintain backward compatibility.
 */
export const useMemory = () => {
  // Use the centralized memory context
  return useMemoryContext();
};

export default useMemory;
