
import { createContext } from 'react';
import { AIContextType } from '@/types/ai';

// Default values for the context
const defaultContext: AIContextType = {
  isGenerating: false,
  setIsGenerating: () => {},
  aiModel: 'gpt-4',
  setAiModel: () => {},
  messages: [],
  isProcessing: false,
  analysis: null,
  designRecommendations: null,
  memoryContext: null,
  isRealtime: false,
  simulateResponse: async () => {},
  analyzeResponses: async () => {},
  generateDesignRecommendations: async () => {},
  generateContent: async () => ''
};

export const AIContext = createContext<AIContextType>(defaultContext);
