
export interface AIContextType {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  generateContent: (prompt: string) => Promise<string>;
  
  // Add properties used by components
  messages: AIMessage[];
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  designRecommendations: DesignRecommendation[] | null;
  memoryContext: AIMemoryContext | null;
  isRealtime: boolean;
  simulateResponse: (message: string) => void;
  analyzeResponses: (responses: Record<string, string>) => Promise<void>;
  generateDesignRecommendations: (prompt: string) => Promise<void>;
}

export interface AIMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  createdAt?: Date;
}

export interface AIAnalysis {
  sentiment?: string;
  entities?: string[];
  summary?: string;
  toneAnalysis?: Record<string, number>;
  clarity?: number;
  keyInsights?: string[];
  suggestionCount?: number;
  contradictions?: string[]; // Add the contradictions property
}

export interface DesignRecommendation {
  colorPalette?: { name: string; hex: string; usage?: string }[];
  typography?: {
    headings: string;
    body: string;
    accents: string;
  };
  layouts?: string[];
  components?: ComponentSuggestion[];
}

export interface ComponentSuggestion {
  name: string;
  description: string;
  inspiration?: string;
}

export interface AIMemoryContext {
  userMemories: AIMemoryItem[];
  projectMemories: AIMemoryItem[];
  globalInsights: AIGlobalInsight[];
  recentInteractions: string[];
  userPreferences: string[];
  projectDetails: string[];
}

export interface AIMemoryItem {
  content: string;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AIGlobalInsight {
  content: string;
  category: string;
  relevanceScore: number;
  frequency: number;
}

export interface GlobalMemory {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  relevanceScore: number;
  frequency: number;
  metadata?: Record<string, any>;
}

export interface AIMemory {
  content: string;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface FeedbackAnalysisResult {
  sentiment: string;
  keyPoints: string[];
  suggestions: string[];
  tone: string;
  priority: string;
}
