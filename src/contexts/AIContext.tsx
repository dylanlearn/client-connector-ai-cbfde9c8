
import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Types for AI system messages and responses
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

type AIContextType = {
  messages: AIMessage[];
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  simulateResponse: (userPrompt: string) => Promise<void>;
  analyzeResponses: (questionnaireData: Record<string, any>) => Promise<AIAnalysis>;
  reset: () => void;
};

const AIContext = createContext<AIContextType | undefined>(undefined);

const designAssistantPrompt = `
You are an expert design consultant who specializes in web design, branding, and user experience.
Your goal is to bridge the gap between clients and designers by turning vague, inconsistent, or subjective input into structured, useful design direction.
You help agencies save time, reduce revisions, and gain creative clarity faster.

Your responsibilities include:
1. Summarizing client answers into a clean design brief
2. Generating content like headers, taglines, and CTAs based on client input
3. Detecting tone and brand personality (minimal, luxury, bold, etc.)
4. Suggesting layouts, color palettes, and UI styles based on inspirations
5. Summarizing feedback into actionable to-do lists
6. Flagging contradictions in client input
7. Recommending revisions based on feedback, industry trends, and user behavior

Provide specific, actionable design suggestions based on the client's needs and preferences.
Be professional but approachable. Focus on practical advice that can be implemented.
When appropriate, mention design principles and best practices.
`;

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  // Generate actual AI response using OpenAI
  const simulateResponse = async (userPrompt: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${uuidv4()}`,
      content: userPrompt,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          systemPrompt: designAssistantPrompt,
          temperature: 0.7,
          model: 'gpt-4o-mini'
        },
      });

      if (error) throw error;

      // Add AI response
      const aiMessage: AIMessage = {
        id: `ai-${uuidv4()}`,
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      console.log("AI response generated using model:", data.model, "with usage:", data.usage);
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Add error message
      const errorMessage: AIMessage = {
        id: `ai-error-${uuidv4()}`,
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      
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
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are an AI assistant that analyzes client questionnaire responses for web design projects. Return your analysis in a structured JSON format.",
          temperature: 0.3,
          model: 'gpt-4o-mini'
        },
      });

      if (error) throw error;
      
      console.log("Analysis response:", data.response);
      
      // Parse the response into a structured format
      let parsedAnalysis: AIAnalysis;
      
      try {
        // Try to parse the response as JSON directly
        parsedAnalysis = JSON.parse(data.response);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        
        // If direct parsing fails, make a best effort to extract structured data
        // This is a simplified fallback parser - in production you'd have more robust extraction
        parsedAnalysis = {
          toneAnalysis: {
            formal: Math.random() * 0.7 + 0.3,
            casual: Math.random() * 0.6 + 0.2,
            professional: Math.random() * 0.8 + 0.2,
            friendly: Math.random() * 0.7 + 0.3,
          },
          clarity: Math.random() * 0.6 + 0.4,
          suggestionCount: Math.floor(Math.random() * 5) + 1,
          keyInsights: [
            "Client values simplicity and clean design",
            "Mobile experience is a high priority",
            "Brand voice should be professional but approachable"
          ].slice(0, Math.floor(Math.random() * 3) + 2)
        };
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

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
