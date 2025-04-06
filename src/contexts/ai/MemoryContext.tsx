
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AIMemoryContext, MemoryContextType } from './memory/types';
import { useMemoryOperations } from './memory/useMemoryOperations';
import { useRealtimeSubscriptions } from './memory/useRealtimeSubscriptions';
import { useAuth } from '@/hooks/use-auth';

// Create context with default values
const MemoryContext = createContext<MemoryContextType>({
  memoryContext: undefined,
  isProcessing: false,
  isRealtime: false,
  storeMemory: async () => {},
  storeInteractionMemory: async () => {},
  refreshMemoryContext: async () => {},
  resetMemoryContext: () => {}
});

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [memoryContext, setMemoryContext] = useState<AIMemoryContext | undefined>({
    userMemories: [],
    projectMemories: [],
    globalInsights: [],
    recentInteractions: [],
    userPreferences: [],
    projectDetails: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  
  // Get memory operations
  const { 
    refreshMemoryContext: refreshMemories, 
    storeMemory: storeMemoryOp, 
    storeInteractionMemory: storeInteractionMemoryOp 
  } = useMemoryOperations(user?.id);
  
  // Get realtime subscription functions
  const { 
    setupRealtimeSubscriptions, 
    resetSubscriptions 
  } = useRealtimeSubscriptions(user?.id, setMemoryContext, setIsRealtime);

  /**
   * Refresh the memory context, pulling in latest memories across layers
   */
  const refreshMemoryContext = useCallback(async (projectId?: string) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    
    try {
      const memoryData = await refreshMemories(projectId);
      if (memoryData) {
        setMemoryContext(memoryData);
      }
    } catch (error) {
      console.error("Error refreshing memory context:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [user, refreshMemories]);

  /**
   * Store a memory in the appropriate layers based on context
   */
  const storeMemory = useCallback(async (
    content: string,
    category: string, 
    projectId?: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    
    try {
      await storeMemoryOp(content, category, projectId, metadata);
      
      // Refresh memory context after storing new memory
      await refreshMemoryContext(projectId);
    } catch (error) {
      console.error("Error storing memory:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [user, storeMemoryOp, refreshMemoryContext]);

  /**
   * Store an interaction event as a memory
   */
  const storeInteractionMemory = useCallback(async (
    eventType: 'click' | 'hover' | 'scroll' | 'view' | 'movement',
    element: string,
    position: { x: number, y: number }
  ) => {
    if (!user?.id) return;
    await storeInteractionMemoryOp(eventType, element, position);
  }, [user, storeInteractionMemoryOp]);

  /**
   * Reset the memory context
   */
  const resetMemoryContext = useCallback(() => {
    setMemoryContext(undefined);
    resetSubscriptions();
  }, [resetSubscriptions]);
  
  // Set up realtime subscriptions when user is available
  useEffect(() => {
    if (user?.id) {
      const cleanup = setupRealtimeSubscriptions();
      return cleanup;
    }
  }, [user, setupRealtimeSubscriptions]);

  // Context value to be provided
  const contextValue: MemoryContextType = {
    memoryContext,
    isProcessing,
    isRealtime,
    storeMemory,
    storeInteractionMemory,
    refreshMemoryContext,
    resetMemoryContext
  };

  return (
    <MemoryContext.Provider value={contextValue}>
      {children}
    </MemoryContext.Provider>
  );
};

// Custom hook to use the memory context
export const useMemory = () => useContext(MemoryContext);
