
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { AIContextType, AIMemoryContext as AIMemoryContextType, AIAnalysis, DesignRecommendation } from "@/types/ai";
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
    position: { x: number, y: number },
    projectId?: string
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

  // Adapter functions to match expected interface types
  const analyzeResponsesAdapter = async (responses: Record<string, string>): Promise<void> => {
    await analyzeResponses(responses as Record<string, any>);
  };

  const generateDesignRecommendationsAdapter = async (prompt: string): Promise<void> => {
    const parseData = { prompt, type: 'design', timestamp: new Date().toISOString() };
    await generateDesignRecommendations(parseData as unknown as Record<string, any>);
  };

  const summarizeFeedbackAdapter = async (feedbackArray: string[]): Promise<string> => {
    // Join array items if array provided, or use single string
    const feedback = Array.isArray(feedbackArray) ? feedbackArray.join('\n') : feedbackArray as unknown as string;
    const result = await summarizeFeedback(feedback);
    return Array.isArray(result) ? result.join('\n') : result;
  };

  const generateContentAdapter = async (prompt: string, contentType: string): Promise<string> => {
    return await generateContent(prompt, contentType);
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isProcessing,
        analysis,
        designRecommendations,
        memoryContext: memoryContext as AIMemoryContextType | undefined,
        isRealtime,
        simulateResponse,
        analyzeResponses: analyzeResponsesAdapter,
        generateDesignRecommendations: generateDesignRecommendationsAdapter,
        generateContent: generateContentAdapter,
        summarizeFeedback: summarizeFeedbackAdapter,
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
