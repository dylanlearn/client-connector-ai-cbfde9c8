
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { AIContextType, AIMemoryContext } from "@/types/ai";
import { 
  useAIMessages,
  useAIAnalysis,
  useDesignRecommendations,
  useContentGeneration,
  useFeedbackSummary,
  useAIMemory
} from "./hooks";

export const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  // Use the custom hooks to manage different aspects of AI functionality
  const { 
    messages, 
    isProcessing: isMessageProcessing, 
    simulateResponse, 
    resetMessages 
  } = useAIMessages();
  
  const { 
    analysis, 
    isProcessing: isAnalysisProcessing, 
    analyzeResponses, 
    resetAnalysis 
  } = useAIAnalysis();
  
  const { 
    designRecommendations, 
    isProcessing: isDesignProcessing, 
    generateDesignRecommendations, 
    resetDesignRecommendations 
  } = useDesignRecommendations();
  
  const { 
    isProcessing: isContentProcessing, 
    generateContent 
  } = useContentGeneration();
  
  const { 
    isProcessing: isFeedbackProcessing, 
    summarizeFeedback 
  } = useFeedbackSummary();

  const {
    memoryContext,
    storeMemory,
    resetMemoryContext
  } = useAIMemory();

  // Determine overall processing state
  const isProcessing = 
    isMessageProcessing || 
    isAnalysisProcessing || 
    isDesignProcessing || 
    isContentProcessing || 
    isFeedbackProcessing;

  // Reset all AI state
  const reset = useCallback(() => {
    resetMessages();
    resetAnalysis();
    resetDesignRecommendations();
    resetMemoryContext();
  }, [resetMessages, resetAnalysis, resetDesignRecommendations, resetMemoryContext]);

  return (
    <AIContext.Provider
      value={{
        messages,
        isProcessing,
        analysis,
        designRecommendations,
        memoryContext,
        simulateResponse,
        analyzeResponses,
        generateDesignRecommendations,
        generateContent,
        summarizeFeedback,
        storeMemory,
        reset
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
