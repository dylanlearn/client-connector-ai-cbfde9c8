
import { useState } from "react";
import { AIMessage } from "@/types/ai";
import { 
  createUserMessage, 
  createAssistantMessage, 
  createErrorMessage,
  generateAIResponse
} from "../utils";
import { designAssistantPrompt } from "../prompts";

export const useAIMessages = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const resetMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isProcessing,
    simulateResponse,
    resetMessages
  };
};
