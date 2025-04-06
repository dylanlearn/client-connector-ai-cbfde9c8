
import React, { useState, useCallback } from 'react';
import { AIMessage, AIAnalysis, DesignRecommendation, AIContextType } from '@/types/ai';
import { AIAnalyzerService, AIGeneratorService } from '@/services/ai';
import { AIContext } from './AIContext';
import { useMemory } from './MemoryContext';
import { v4 as uuidv4 } from 'uuid';

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [designRecommendations, setDesignRecommendations] = useState<DesignRecommendation[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get memory context and functions from MemoryProvider
  const { 
    memoryContext, 
    storeMemory: storeMemoryInContext,
    isRealtime
  } = useMemory();

  /**
   * Simulates an AI response for demo purposes
   */
  const simulateResponse = useCallback(async (prompt: string) => {
    setIsProcessing(true);
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Basic analysis simulation
      const sentiment = prompt.length > 10 ? 'positive' : 'neutral';
      const keyInsights = prompt.split(' ').slice(0, 3);

      // Create a simulated AI message
      const aiMessage: AIMessage = {
        id: uuidv4(),
        createdAt: new Date(),
        role: 'assistant',
        content: prompt,
        timestamp: new Date().toISOString()
      };

      // Update messages and analysis
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setAnalysis({
        summary: prompt,
        keyInsights: keyInsights,
        toneAnalysis: {
          formal: sentiment === 'positive' ? 0.8 : 0.2,
          casual: sentiment === 'positive' ? 0.2 : 0.8,
          professional: 0.5,
          friendly: 0.7,
        },
        clarity: 0.7,
        suggestionCount: 3,
        contradictions: [],
      });
    } catch (error) {
      console.error("Error simulating response:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Analyze responses from users
   */
  const analyzeResponses = useCallback(async (responses: Record<string, string>) => {
    setIsProcessing(true);
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Perform analysis using AIAnalyzerService
      const analysisResult = await AIAnalyzerService.analyzeResponses(responses);

      // Update state with the analysis result
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Error analyzing responses:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Generate design recommendations based on a prompt
   */
  const generateDesignRecommendations = useCallback(async (prompt: string) => {
    setIsProcessing(true);
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Since we don't have a direct method, simulate design recommendations
      const designPalette = [
        { name: 'Primary', hex: '#4F46E5', usage: 'Primary buttons and links' },
        { name: 'Secondary', hex: '#10B981', usage: 'Secondary actions and highlights' },
        { name: 'Accent', hex: '#F59E0B', usage: 'Accent elements and call to actions' },
        { name: 'Background', hex: '#F9FAFB', usage: 'Page backgrounds' },
        { name: 'Text', hex: '#111827', usage: 'Main text content' }
      ];
      
      const recommendations: DesignRecommendation = {
        colorPalette: designPalette,
        typography: {
          headings: 'Inter, sans-serif',
          body: 'Roboto, sans-serif',
          accents: 'Playfair Display, serif'
        },
        layouts: ['Content-First', 'Grid-Based', 'Asymmetrical'],
        components: [
          {
            name: 'Call-to-Action Buttons',
            description: 'Bold, high-contrast buttons with subtle hover effects'
          },
          {
            name: 'Card Components',
            description: 'Clean, minimal cards with clear hierarchy'
          }
        ]
      };

      // Update state with the recommendations
      setDesignRecommendations([recommendations]);
      
      // Store this in memory for future context
      if (storeMemoryInContext) {
        await storeMemoryInContext(
          `Generated design recommendations: ${JSON.stringify(recommendations)}`,
          'SuccessfulOutput',
          undefined,
          { 
            prompt, 
            timestamp: new Date().toISOString(),
            type: 'design_recommendation'
          }
        );
      }
    } catch (error) {
      console.error("Error generating design recommendations:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [storeMemoryInContext]);

  /**
   * Generate content based on prompt and type
   */
  const generateContent = useCallback(async (prompt: string, contentType: string) => {
    setIsProcessing(true);
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate content using AIGeneratorService with correctly formatted options
      const options = {
        type: contentType as 'header' | 'tagline' | 'cta' | 'description',
        context: prompt,
        maxLength: 500 // Default max length
      };
      
      const content = await AIGeneratorService.generateContent(options);
      
      // Store successful content generation in memory
      if (storeMemoryInContext) {
        await storeMemoryInContext(
          `Generated ${contentType} content: ${content}`,
          'SuccessfulOutput',
          undefined,
          { 
            prompt, 
            contentType,
            timestamp: new Date().toISOString() 
          }
        );
      }
      
      return String(content);
    } catch (error) {
      console.error("Error generating content:", error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [storeMemoryInContext]);

  /**
   * Summarize feedback from users
   */
  const summarizeFeedback = useCallback(async (feedback: string | string[]) => {
    setIsProcessing(true);
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convert array to string if needed
      const feedbackText = Array.isArray(feedback) ? feedback.join('\n') : feedback;
      
      // Use the AIGeneratorService
      const summary = await AIGeneratorService.summarizeFeedback(feedbackText);
      
      // Store feedback in memory
      if (storeMemoryInContext) {
        await storeMemoryInContext(
          `Summarized feedback: ${summary}`,
          'ClientFeedback',
          undefined,
          { 
            originalFeedback: feedbackText,
            timestamp: new Date().toISOString() 
          }
        );
      }
      
      // Handle different return types safely
      if (Array.isArray(summary)) {
        return summary.join('\n');
      } else if (typeof summary === 'string') {
        return summary;
      } else {
        return String(summary || ''); // Fix: Ensure summary is converted to string
      }
    } catch (error) {
      console.error("Error summarizing feedback:", error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [storeMemoryInContext]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setMessages([]);
    setAnalysis(null);
    setDesignRecommendations(null);
  }, []);

  // Use the storeMemory function from the MemoryContext
  const storeMemory = useCallback(async (
    content: string,
    category: string,
    relevanceScore?: number,
    metadata?: Record<string, any>
  ) => {
    if (storeMemoryInContext) {
      // Convert projectId parameter to relevanceScore for compatibility
      return storeMemoryInContext(content, category, undefined, metadata);
    }
  }, [storeMemoryInContext]);

  // Create default memory context if none is provided
  const defaultMemoryContext = {
    recentInteractions: [],
    userPreferences: [],
    projectDetails: []
  };

  const aiContextValue: AIContextType = {
    messages,
    isProcessing,
    analysis,
    designRecommendations,
    memoryContext: memoryContext || defaultMemoryContext,
    isRealtime,
    simulateResponse,
    analyzeResponses,
    generateDesignRecommendations,
    generateContent,
    summarizeFeedback,
    storeMemory,
    trackInteraction: async () => {},
    reset
  };

  return (
    <AIContext.Provider value={aiContextValue}>
      {children}
    </AIContext.Provider>
  );
};
