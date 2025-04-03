
import { IntakeFormData } from "@/types/intake-form";
import { IntakeSummaryResult } from "./types/intake-summary-types";
import { buildIntakePrompt } from "./utils/prompt-builder";
import { parseAIResponse } from "./utils/response-parser";
import { callOpenAI } from "./api/openai-client";

/**
 * Service for summarizing client intake form data with AI-powered analysis
 */
export const IntakeSummaryService = {
  /**
   * Generate a comprehensive summary of client intake form data
   */
  summarizeIntakeForm: async (formData: IntakeFormData): Promise<IntakeSummaryResult> => {
    try {
      // Build the prompt for our AI model
      const promptOptions = buildIntakePrompt(formData);
      
      // Call OpenAI via Supabase Edge Function
      const response = await callOpenAI(promptOptions);
      
      // Parse and structure the response
      return parseAIResponse(response);
    } catch (error) {
      console.error("Error generating intake summary:", error);
      // Provide a more human-friendly fallback response
      return {
        summary: "### I couldn't generate a complete summary right now\n\nThis might be due to a temporary issue with our AI service. The good news is that we've saved all your responses, so we can try again in a moment.",
        tone: ["professional", "friendly"],
        direction: "clean and modern design with intuitive user experience",
        priorities: ["clear communication", "user-friendly navigation", "visual appeal"],
        draftCopy: {
          header: "Building Your Vision Together",
          subtext: "We're excited to bring your ideas to life with a thoughtfully designed digital experience that reflects your unique brand.",
          cta: "Let's Begin"
        }
      };
    }
  }
};
