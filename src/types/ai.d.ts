// Add feedback analysis to AI context type
import { FeedbackAnalysisResult } from "@/services/ai/content/feedback-analysis-service";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIAnalysis {
  sentiment: string;
  entities: string[];
  summary: string;
}

export interface DesignRecommendation {
  category: string;
  suggestions: string[];
}

export interface AIMemoryContext {
  recentInteractions: string[];
  userPreferences: string[];
  projectDetails: string[];
}

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

  // Add feedback analysis method
  analyzeFeedback?: (feedbackText: string) => Promise<FeedbackAnalysisResult | null>;

  // Keep the rest unchanged
  reset: () => void;
}
