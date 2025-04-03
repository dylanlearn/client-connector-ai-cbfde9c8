
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
    analyzeResponses: analyzeResponsesInternal, 
    resetAnalysis 
  } = useAIAnalysis();
  
  const { 
    designRecommendations, 
    isProcessing: isDesignProcessing, 
    generateDesignRecommendations: generateDesignRecommendationsInternal, 
    resetDesignRecommendations 
  } = useDesignRecommendations();
  
  const { 
    isProcessing: isContentProcessing, 
    generateContent 
  } = useContentGeneration();
  
  const { 
    isProcessing: isFeedbackProcessing, 
    summarizeFeedback: summarizeFeedbackInternal 
  } = useFeedbackSummary();

  const {
    isProcessing: isFeedbackAnalysisProcessing,
    analyzeFeedback
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

  // Wrapper for analyzeResponses to match expected interface
  const analyzeResponses = async (responses: Record<string, string>): Promise<void> => {
    await analyzeResponsesInternal(responses);
  };

  // Wrapper for generateDesignRecommendations to match expected interface
  const generateDesignRecommendations = async (prompt: string): Promise<void> => {
    // Convert prompt to a simple questionnaire object
    const questionnaire = { prompt };
    await generateDesignRecommendationsInternal(questionnaire);
  };

  // Wrapper for summarizeFeedback to match expected interface
  const summarizeFeedback = async (feedback: string[]): Promise<string> => {
    // Join array into string for processing if internal expects a string
    const feedbackText = feedback.join("\n");
    const result = await summarizeFeedbackInternal(feedbackText);
    // Convert the string[] result to a single string for compatibility
    return Array.isArray(result) ? result.join("\n") : result;
  };

  // Track user interaction for analytics (simplified version)
  const trackInteraction = async (
    eventType: 'click' | 'hover' | 'scroll' | 'view',
    elementSelector: string,
    position: { x: number, y: number }
  ): Promise<void> => {
    // Make sure we're only passing 3 args as expected by storeInteractionMemory
    await storeInteractionMemory(eventType, elementSelector, position);
  };

  // Determine overall processing state
  const isProcessing = 
    isMessageProcessing || 
    isAnalysisProcessing || 
    isDesignProcessing || 
    isContentProcessing || 
    isFeedbackProcessing ||
    isFeedbackAnalysisProcessing ||
    isMemoryProcessing;

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
