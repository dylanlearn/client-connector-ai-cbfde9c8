
/**
 * Shared types for AI memory functionality
 */
export interface AIMemoryInterface {
  memoryContext: Record<string, any> | null;
  isProcessing: boolean;
  isRealtime: boolean;
  storeMemory: (content: string, category: string, relevanceScore?: number, metadata?: any) => Promise<void>;
  storeInteractionMemory: (
    eventType: 'click' | 'hover' | 'scroll' | 'view' | 'movement',
    element: string,
    position: { x: number, y: number }
  ) => Promise<void>;
  refreshMemoryContext: () => Promise<void>;
  resetMemoryContext: () => void;
}

export interface AIMemoryContext {
  userMemories: Record<string, any>[];
  projectMemories: Record<string, any>[];
  globalInsights: Record<string, any>[];
}
