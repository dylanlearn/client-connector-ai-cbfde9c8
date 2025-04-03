
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { AIContextType, AIMemoryContext, AIAnalysis, DesignRecommendation } from "@/types/ai";
import { 
  useAIMessages,
  useAIAnalysis,
  useDesignRecommendations,
  useContentGeneration,
  useFeedbackSummary,
  useAIMemory,
  useFeedbackAnalysis
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
    generateContent,
    isProcessing: isContentProcessing 
  } = useContentGeneration();
  
  const { 
    summarizeFeedback,
    isProcessing: isFeedbackProcessing 
  } = useFeedbackSummary();

  const {
    analyzeFeedback,
    isAnalyzing: isFeedbackAnalysisProcessing
  } = useFeedbackAnalysis();

  const {
    memoryContext,
    isProcessing: isMemoryProcessing,
    isRealtime,
    storeMemory,
    storeInteractionMemory,
    refreshMemoryContext,
    resetMemoryContext
  } = useAIMemory();

  // Determine overall processing state
  const isProcessing = 
    isMessageProcessing || 
    isAnalysisProcessing || 
    isDesignProcessing || 
    isContentProcessing || 
    isFeedbackProcessing ||
    isFeedbackAnalysisProcessing ||
    isMemoryProcessing;

  // Track user interaction for analytics
  const trackInteraction = async (
    eventType: 'click' | 'hover' | 'scroll' | 'view',
    elementSelector: string,
    position: { x: number, y: number }
  ): Promise<void> => {
    await storeInteractionMemory(eventType, elementSelector, position);
  };

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
        isRealtime,
        simulateResponse,
        analyzeResponses,
        generateDesignRecommendations,
        generateContent,
        summarizeFeedback,
        storeMemory,
        trackInteraction,
        analyzeFeedback,
        reset
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
