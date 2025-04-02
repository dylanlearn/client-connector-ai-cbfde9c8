
export type AIMessage = {
  id: string;
  content: string;
  role: "system" | "user" | "assistant";
  timestamp: Date;
};

export type AIAnalysis = {
  toneAnalysis?: {
    formal: number;
    casual: number;
    professional: number;
    friendly: number;
  };
  clarity?: number;
  suggestionCount?: number;
  keyInsights?: string[];
};

export type AIContextType = {
  messages: AIMessage[];
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  simulateResponse: (userPrompt: string) => Promise<void>;
  analyzeResponses: (questionnaireData: Record<string, any>) => Promise<AIAnalysis>;
  reset: () => void;
};
