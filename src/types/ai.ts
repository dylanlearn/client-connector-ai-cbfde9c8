
/**
 * Base AI memory interface
 */
export interface AIMemory {
  content: string;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Global memory interface
 */
export interface GlobalMemory {
  content: string;
  category: string;
  relevanceScore: number;
  frequency: number;
}

/**
 * AI Message interface for chat conversations
 */
export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  id?: string;
  createdAt?: Date;
}

/**
 * AI Analysis result interface
 */
export interface AIAnalysis {
  sentiment?: string;
  entities?: string[];
  summary?: string;
  keyInsights?: string[];
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

/**
 * Design recommendation interface
 */
export interface DesignRecommendation {
  category?: string;
  suggestions?: string[];
  colorPalette?: Array<{name: string; hex: string; usage: string}>;
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

/**
 * Component Suggestion interface
 */
export interface ComponentSuggestion {
  name: string;
  description: string;
  usage: string;
}

/**
 * AI Memory Context interface
 */
export interface AIMemoryContext {
  recentInteractions: string[];
  userPreferences: string[];
  projectDetails: string[];
}

/**
 * Main AI Context Type interface
 */
export interface AIContextType {
  messages: AIMessage[];
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  designRecommendations: DesignRecommendation[] | null;
  memoryContext: AIMemoryContext | null;
  isRealtime: boolean;
  simulateResponse: (message: string) => void;
  analyzeResponses: (responses: Record<string, string>) => Promise<void>;
  generateDesignRecommendations: (prompt: string) => Promise<void>;
  generateContent: (
    prompt: string, 
    contentType: string
  ) => Promise<string>;
  summarizeFeedback: (feedback: string | string[]) => Promise<string>;
  storeMemory: (content: string, category: string, relevanceScore?: number, metadata?: any) => Promise<void>;
  trackInteraction: (
    eventType: 'click' | 'hover' | 'scroll' | 'view',
    elementSelector: string,
    position: { x: number, y: number }
  ) => Promise<void>;
  reset: () => void;
}

// Include FeedbackAnalysisResult interface from services
export interface FeedbackAnalysisResult {
  summary: string;
  sentimentScore: number;
  keyIssues: string[];
  recommendations: string[];
}
