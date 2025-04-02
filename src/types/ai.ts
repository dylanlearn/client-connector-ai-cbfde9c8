
export interface AIMessage {
  id: string;
  createdAt: Date;
  content: string;
  role: "user" | "assistant" | "error";
}

export interface AIAnalysis {
  summary?: string;
  keyInsights: string[];
  suggestedActions?: string[];
  toneAnalysis?: {
    formal: number;
    casual: number;
    professional: number;
    friendly: number;
  };
  clarity?: number;
  suggestionCount?: number;
  contradictions?: string[];
}

export interface DesignRecommendation {
  colorPalette: Array<{
    name: string;
    hex: string;
    usage?: string;
  }>;
  typography: {
    headings: string;
    body: string;
    accents?: string;
  };
  layouts?: string[];
  components?: string[];
}

export interface AIMemory {
  content: string;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface GlobalMemory {
  content: string;
  category: string;
  relevanceScore: number;
  frequency: number;
}

export interface AIMemoryContext {
  userMemories: AIMemory[];
  projectMemories: AIMemory[];
  globalInsights: GlobalMemory[];
}

/**
 * Context type for the AI provider
 */
export interface AIContextType {
  messages: AIMessage[];
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  designRecommendations: DesignRecommendation[] | null;
  memoryContext: AIMemoryContext | undefined;
  isRealtime?: boolean;
  simulateResponse: (prompt: string) => Promise<void>;
  analyzeResponses: (responses: Record<string, string>) => Promise<void>;
  generateDesignRecommendations: (prompt: string) => Promise<void>;
  generateContent: (prompt: string, contentType: string) => Promise<string>;
  summarizeFeedback: (feedback: string[]) => Promise<string>;
  storeMemory: (content: string, category: string, projectId?: string, metadata?: Record<string, any>) => Promise<void>;
  reset: () => void;
}
