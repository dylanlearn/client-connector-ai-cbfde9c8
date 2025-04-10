
import { v4 as uuidv4 } from "uuid";
import { AIMessage, AIAnalysis } from "@/types/ai";
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "@/services/ai/ai-model-selector";

export const createUserMessage = (content: string): AIMessage => ({
  id: `user-${uuidv4()}`,
  content,
  role: "user",
  createdAt: new Date(),
  timestamp: new Date().toISOString(),
});

export const createAssistantMessage = (content: string): AIMessage => ({
  id: `ai-${uuidv4()}`,
  content,
  role: "assistant",
  createdAt: new Date(),
  timestamp: new Date().toISOString(),
});

export const createErrorMessage = (): AIMessage => ({
  id: `ai-error-${uuidv4()}`,
  content: "I'm sorry, I encountered an error processing your request. Please try again later.",
  role: "assistant",
  createdAt: new Date(),
  timestamp: new Date().toISOString(),
});

export const generateAIResponse = async (
  messages: AIMessage[],
  systemPrompt: string
) => {
  try {
    // Use GPT-4o-mini for regular conversation
    const model = selectModelForFeature(AIFeatureType.TextGeneration);
    
    const { data, error } = await supabase.functions.invoke("generate-with-openai", {
      body: {
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        systemPrompt,
        temperature: 0.7,
        model
      },
    });

    if (error) throw error;

    return {
      content: data.response,
      model: data.model,
      usage: data.usage
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

export const parseFallbackAnalysis = (): AIAnalysis => ({
  keyInsights: [
    "Client values simplicity and clean design",
    "Mobile experience is a high priority",
    "Brand voice should be professional but approachable"
  ].slice(0, Math.floor(Math.random() * 3) + 2),
  toneAnalysis: {
    formal: Math.random() * 0.7 + 0.3,
    casual: Math.random() * 0.6 + 0.2,
    professional: Math.random() * 0.8 + 0.2,
    friendly: Math.random() * 0.7 + 0.3,
  },
  clarity: Math.random() * 0.6 + 0.4,
  suggestionCount: Math.floor(Math.random() * 5) + 1
});
