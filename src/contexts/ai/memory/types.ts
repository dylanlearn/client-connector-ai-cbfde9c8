
export interface MemoryContextType {
  memoryContext: AIMemoryContext | undefined;
  isProcessing: boolean;
  isRealtime: boolean;
  storeMemory: (content: string, category: string, projectId?: string, metadata?: Record<string, any>) => Promise<void>;
  storeInteractionMemory: (
    eventType: 'click' | 'hover' | 'scroll' | 'view' | 'movement',
    element: string, 
    position: { x: number, y: number }
  ) => Promise<void>;
  refreshMemoryContext: (projectId?: string) => Promise<void>;
  resetMemoryContext: () => void;
}

export interface AIMemoryContext {
  userMemories: Record<string, any>[];
  projectMemories: Record<string, any>[];
  globalInsights: Record<string, any>[];
}
