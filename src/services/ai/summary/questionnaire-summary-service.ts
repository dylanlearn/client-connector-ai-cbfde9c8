
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for AI-powered questionnaire summarization
 */
export const AIQuestionnaireSummaryService = {
  /**
   * Summarizes client questionnaire responses into a concise brief
   */
  summarizeQuestionnaire: async (responses: Record<string, string>): Promise<string> => {
    try {
      const promptContent = `
        Summarize these client questionnaire responses into a clear, concise design brief:
        
        ${Object.entries(responses)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Create a professional, well-structured summary that organizes the client's needs
        and preferences into a cohesive document. Include sections for project goals,
        target audience, design preferences, and technical requirements.
      `;
      
      const systemPrompt = `You are an expert design consultant who excels at distilling client input
        into clear, actionable briefs. You can take messy, vague, or disorganized input and transform
        it into a professional document that guides the design process.`;
      
      // Use GPT-4o for summarizing questionnaire (content generation)
      const model = selectModelForFeature(AIFeatureType.ContentGeneration);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.5,
          model
        },
      });
      
      if (error) throw error;
      
      return data.response;
    } catch (error) {
      console.error("Error summarizing questionnaire:", error);
      return "Error generating questionnaire summary";
    }
  }
};
