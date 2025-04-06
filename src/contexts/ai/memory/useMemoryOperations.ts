
import { useCallback } from 'react';
import { AIMemoryService, MemoryCategory } from '@/services/ai';
import { AIMemoryContext } from './types';

export const useMemoryOperations = (userId: string | undefined) => {
  /**
   * Refresh the memory context, pulling in latest memories across layers
   */
  const refreshMemoryContext = useCallback(async (projectId?: string): Promise<AIMemoryContext | null> => {
    if (!userId) return null;
    
    try {
      const contextualMemories = await AIMemoryService.getContextualMemories(
        userId,
        projectId,
        {
          limit: 10,
          timeframe: {
            // Get memories from the last 30 days
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      );
      
      return {
        userMemories: contextualMemories.userMemories.map(m => ({
          content: m.content,
          category: m.category,
          timestamp: m.timestamp,
          metadata: m.metadata
        })),
        projectMemories: contextualMemories.projectMemories.map(m => ({
          content: m.content,
          category: m.category,
          timestamp: m.timestamp,
          metadata: m.metadata
        })),
        globalInsights: contextualMemories.globalMemories.map(m => ({
          content: m.content,
          category: m.category,
          relevanceScore: m.relevanceScore,
          frequency: m.frequency
        })),
        // Add these required fields
        recentInteractions: [],
        userPreferences: [],
        projectDetails: []
      };
    } catch (error) {
      console.error("Error refreshing memory context:", error);
      return null;
    }
  }, [userId]);

  /**
   * Store a memory in the appropriate layers based on context
   */
  const storeMemory = useCallback(async (
    content: string,
    category: string, 
    projectId?: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!userId) return;
    
    try {
      // Map string category to enum
      const memoryCategory = category as MemoryCategory;
      
      await AIMemoryService.storeMemoryAcrossLayers(
        userId,
        content,
        memoryCategory,
        projectId,
        metadata
      );
      
      // Trigger real-time analysis update
      await AIMemoryService.global.realtime.triggerAnalysisUpdate(memoryCategory);
      
      return true;
    } catch (error) {
      console.error("Error storing memory:", error);
      return false;
    }
  }, [userId]);

  /**
   * Store an interaction event as a memory
   */
  const storeInteractionMemory = useCallback(async (
    eventType: 'click' | 'hover' | 'scroll' | 'view' | 'movement',
    element: string,
    position: { x: number, y: number },
    projectId?: string
  ) => {
    if (!userId) return;
    
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
      projectId,
      metadata
    );
  }, [userId, storeMemory]);

  return {
    refreshMemoryContext,
    storeMemory,
    storeInteractionMemory
  };
};
