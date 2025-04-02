
import React, { createContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { AIMessage, AIAnalysis, AIContextType } from "@/types/ai";
import { designAssistantPrompt, analyticsPrompt } from "./prompts";
import { 
  createUserMessage, 
  createAssistantMessage, 
  createErrorMessage,
  generateAIResponse,
  parseFallbackAnalysis
} from "./utils";

export const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  // Generate actual AI response using OpenAI
  const simulateResponse = async (userPrompt: string) => {
    // Add user message
    const userMessage = createUserMessage(userPrompt);
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Call our Supabase Edge Function
      const aiResponse = await generateAIResponse(
        [...messages, userMessage],
        designAssistantPrompt
      );

      // Add AI response
      const aiMessage = createAssistantMessage(aiResponse.content);
      setMessages((prev) => [...prev, aiMessage]);
      console.log("AI response generated using model:", aiResponse.model, "with usage:", aiResponse.usage);
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Add error message
      const errorMessage = createErrorMessage();
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze questionnaire responses with AI
  const analyzeResponses = async (questionnaireData: Record<string, any>): Promise<AIAnalysis> => {
    setIsProcessing(true);
    
    try {
      // Prepare the prompt for OpenAI
      const promptContent = `
        Analyze the following client questionnaire responses for a website design project:
        
        ${Object.entries(questionnaireData)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Provide the following analysis:
        1. Tone analysis (formal, casual, professional, friendly) as scores from 0 to 1
        2. Clarity score from 0 to 1
        3. Number of actionable suggestions
        4. Key insights (2-5 points)
        
        Format your response as JSON with the following structure:
        {
          "toneAnalysis": {
            "formal": 0.7,
            "casual": 0.3,
            "professional": 0.8,
            "friendly": 0.6
          },
          "clarity": 0.75,
          "suggestionCount": 3,
          "keyInsights": [
            "First key insight",
            "Second key insight",
            "Third key insight"
          ]
        }
      `;
      
      // Call our Supabase Edge Function
      const aiResponse = await generateAIResponse(
        [{
          id: `analysis-${uuidv4()}`,
          role: "user",
          content: promptContent,
          timestamp: new Date()
        }],
        analyticsPrompt
      );
      
      console.log("Analysis response:", aiResponse.content);
      
      // Parse the response into a structured format
      let parsedAnalysis: AIAnalysis;
      
      try {
        // Try to parse the response as JSON directly
        parsedAnalysis = JSON.parse(aiResponse.content);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        
        // If direct parsing fails, use fallback parser
        parsedAnalysis = parseFallbackAnalysis();
      }
      
      setAnalysis(parsedAnalysis);
      return parsedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      return {
        clarity: 0.5,
        keyInsights: ["Error analyzing responses"]
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setAnalysis(null);
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isProcessing,
        analysis,
        simulateResponse,
        analyzeResponses,
        reset
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
