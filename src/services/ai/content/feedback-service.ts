
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for processing client feedback
 */
export const AIFeedbackService = {
  /**
   * Summarizes client feedback into actionable items
   */
  summarizeFeedback: async (feedback: string): Promise<string[]> => {
    try {
      const promptContent = `
        Summarize the following client feedback into a list of clear, actionable to-do items:
        
        ${feedback}
        
        Return only a JSON array of strings, each representing one actionable task.
        Focus on design and content changes that can be implemented.
      `;
      
      const systemPrompt = `You are an expert at interpreting client feedback and converting
        it into clear, actionable tasks for designers and developers. Be specific and practical.`;
      
      // Use GPT-4o-mini for summarizing feedback (simpler task)
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
      console.error("Error summarizing feedback:", error);
      return ["Error processing feedback"];
    }
  }
};
