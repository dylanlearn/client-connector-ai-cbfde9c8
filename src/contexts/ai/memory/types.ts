
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
  userMemories: {
    content: string;
    category: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];
  projectMemories: {
    content: string;
    category: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];
  globalInsights: {
    content: string;
    category: string;
    relevanceScore: number;
    frequency: number;
  }[];
}
