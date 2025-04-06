
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
}

/**
 * AI Analysis result interface
 */
export interface AIAnalysis {
  sentiment: string;
  entities: string[];
  summary: string;
}

/**
 * Design recommendation interface
 */
export interface DesignRecommendation {
  category: string;
  suggestions: string[];
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
    type: 'header' | 'tagline' | 'cta' | 'description',
    tone: string,
    context: string,
    keywords: string[],
    maxLength: number
  ) => Promise<string>;
  summarizeFeedback: (feedback: string[]) => Promise<string>;
  storeMemory: (content: string, category: string, relevanceScore?: number, metadata?: any) => Promise<void>;
  trackInteraction: (
    eventType: 'click' | 'hover' | 'scroll' | 'view',
    elementSelector: string,
    position: { x: number, y: number }
  ) => Promise<void>;
  analyzeFeedback?: (feedbackText: string) => Promise<FeedbackAnalysisResult | null>;
  reset: () => void;
}

// Include FeedbackAnalysisResult interface from services
export interface FeedbackAnalysisResult {
  summary: string;
  sentimentScore: number;
  keyIssues: string[];
  recommendations: string[];
}
