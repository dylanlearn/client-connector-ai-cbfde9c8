
import { useCallback } from "react";
import { MemoryCategory } from "@/services/ai";
import { AIMemoryService } from "@/services/ai";
import { useAuth } from "@/hooks/use-auth";
import { useMemoryContext } from "./useMemoryContext";

/**
 * Hook for storing memories
 */
export const useMemoryStorage = () => {
  const { user } = useAuth();
  const { refreshMemoryContext } = useMemoryContext();

  /**
   * Store a memory in the appropriate layers based on context
   */
  const storeMemory = useCallback(async (
    content: string,
    category: string, 
    projectId?: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id) return false;
    
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
      
      return true;
    } catch (error) {
      console.error("Error storing memory:", error);
      return false;
    }
  }, [user, refreshMemoryContext]);

  return {
    storeMemory
  };
};
