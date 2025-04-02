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

export interface AIContextType {
  messages: AIMessage[];
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  designRecommendations: DesignRecommendation | null;
  simulateResponse: (userPrompt: string) => Promise<void>;
  analyzeResponses: (questionnaireData: Record<string, any>) => Promise<AIAnalysis>;
  generateDesignRecommendations: (questionnaire: Record<string, any>) => Promise<DesignRecommendation>;
  generateContent: (options: any) => Promise<string>;
  summarizeFeedback: (feedback: string) => Promise<string[]>;
  reset: () => void;
}
