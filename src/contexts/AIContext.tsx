
import React, { createContext, useContext, useState, ReactNode } from "react";

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

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  // Simulate AI response - will be replaced with actual API call later
  const simulateResponse = async (userPrompt: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      content: userPrompt,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a simulated response based on the input
      let simulatedResponse = "";

      // Simple keyword-based response simulation
      if (userPrompt.toLowerCase().includes("website")) {
        simulatedResponse = "I see you're building a website. Could you tell me more about the target audience and the main goals you want to achieve?";
      } else if (userPrompt.toLowerCase().includes("brand") || userPrompt.toLowerCase().includes("color")) {
        simulatedResponse = "Brand identity is crucial. What emotions do you want your brand to evoke? What competitors' branding do you admire?";
      } else if (userPrompt.toLowerCase().includes("audience") || userPrompt.toLowerCase().includes("customer")) {
        simulatedResponse = "Understanding your audience is key. What demographics are you targeting, and what are their specific pain points?";
      } else {
        simulatedResponse = "Thank you for sharing that information. Could you elaborate a bit more so I can better understand your needs?";
      }

      // Add AI response
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        content: simulatedResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error simulating AI response:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate analyzing questionnaire responses
  const analyzeResponses = async (questionnaireData: Record<string, any>): Promise<AIAnalysis> => {
    setIsProcessing(true);
    
    try {
      // Simulate analysis time
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate mock analysis
      const mockAnalysis: AIAnalysis = {
        toneAnalysis: {
          formal: Math.random() * 0.7 + 0.3, // 0.3-1.0
          casual: Math.random() * 0.6 + 0.2, // 0.2-0.8
          professional: Math.random() * 0.8 + 0.2, // 0.2-1.0
          friendly: Math.random() * 0.7 + 0.3, // 0.3-1.0
        },
        clarity: Math.random() * 0.6 + 0.4, // 0.4-1.0
        suggestionCount: Math.floor(Math.random() * 5) + 1, // 1-5
        keyInsights: [
          "Client values simplicity and clean design",
          "Mobile experience is a high priority",
          "Brand voice should be professional but approachable",
          "Content should focus on problem-solving",
          "Visual elements should reinforce trust and credibility"
        ].slice(0, Math.floor(Math.random() * 3) + 2) // Random 2-5 insights
      };
      
      setAnalysis(mockAnalysis);
      return mockAnalysis;
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
