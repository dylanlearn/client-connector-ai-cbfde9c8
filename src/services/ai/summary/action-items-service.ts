
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for converting feedback to action items
 */
export const AIActionItemsService = {
  /**
   * Converts raw feedback or notes into organized action items
   */
  convertToActionItems: async (feedback: string): Promise<Array<{task: string, priority: 'high' | 'medium' | 'low'}>> => {
    try {
      const promptContent = `
        Convert this raw feedback into a prioritized list of actionable tasks:
        
        ${feedback}
        
        Return a JSON array of task objects with:
        - task: a clear, actionable description of what needs to be done
        - priority: either "high", "medium", or "low" based on importance
        
        Focus on being specific and actionable. Break down vague feedback into concrete tasks.
      `;
      
      const systemPrompt = `You are an expert project manager who specializes in turning client feedback
        into clear, actionable tasks. You know how to interpret vague requests and transform them into
        specific action items with appropriate priorities.`;
      
      // Use GPT-4o-mini for converting to action items (basic summarization)
      const model = selectModelForFeature(AIFeatureType.Summarization);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.4,
          model
        },
      });
      
      if (error) throw error;
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error("Error converting to action items:", error);
      return [{ task: "Error processing feedback", priority: "medium" }];
    }
  }
};
