export type AIMessage = {
  id: string;
  content: string;
  role: "system" | "user" | "assistant";
  timestamp: Date;
};

export interface AIAnalysis {
  toneAnalysis?: {
    formal: number;
    casual: number;
    professional: number;
    friendly: number;
  };
  clarity?: number;
  suggestionCount?: number;
  keyInsights?: string[];
  contradictions?: string[];
}

export interface DesignRecommendation {
  colorPalette?: Array<{name: string, hex: string, usage: string}>;
  typography?: {
    headings: string;
    body: string;
    accents: string;
  };
  layouts?: string[];
  components?: Array<{
    name: string;
    description: string;
    inspiration?: string;
  }>;
}

export interface AIMemoryContext {
  userMemories?: Array<{
    content: string;
    category: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }>;
  projectMemories?: Array<{
    content: string;
    category: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }>;
  globalInsights?: Array<{
    content: string;
    category: string;
    relevanceScore: number;
    frequency: number;
  }>;
}

export interface AIContextType {
  messages: AIMessage[];
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  designRecommendations: DesignRecommendation | null;
  memoryContext?: AIMemoryContext;
  simulateResponse: (userPrompt: string) => Promise<void>;
  analyzeResponses: (questionnaireData: Record<string, any>) => Promise<AIAnalysis>;
  generateDesignRecommendations: (questionnaire: Record<string, any>) => Promise<DesignRecommendation>;
  generateContent: (options: any) => Promise<string>;
  summarizeFeedback: (feedback: string) => Promise<string[]>;
  storeMemory: (content: string, category: string, projectId?: string, metadata?: Record<string, any>) => Promise<void>;
  reset: () => void;
}
