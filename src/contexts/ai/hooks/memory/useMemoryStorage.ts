
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
  ): Promise<void> => {
    if (!user?.id) return;
    
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
    } catch (error) {
      console.error("Error storing memory:", error);
    }
  }, [user, refreshMemoryContext]);

  /**
   * Store an interaction event as a memory
   * This is used for tracking user behavior for analytics
   */
  const storeInteractionMemory = useCallback(async (
    eventType: 'click' | 'hover' | 'scroll' | 'view',
    elementSelector: string,
    position: { x: number, y: number },
    projectId?: string,
    pageUrl?: string
  ): Promise<void> => {
    if (!user?.id) return;
    
    const content = `User ${eventType} on ${elementSelector} at position (${position.x}, ${position.y})`;
    const metadata = {
      eventType,
      elementSelector,
      position,
      pageUrl: pageUrl || window.location.pathname,
      timestamp: new Date().toISOString()
    };
    
    await storeMemory(
      content,
      MemoryCategory.InteractionPattern,
      projectId,
      metadata
    );
  }, [user, storeMemory]);

  return {
    storeMemory,
    storeInteractionMemory
  };
};
