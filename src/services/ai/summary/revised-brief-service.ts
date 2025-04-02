
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for creating revised briefs based on feedback
 */
export const AIRevisedBriefService = {
  /**
   * Creates a revised project brief based on original brief and feedback
   */
  createRevisedBrief: async (originalBrief: string, feedback: string): Promise<string> => {
    try {
      const promptContent = `
        Create a revised project brief based on:
        
        ORIGINAL BRIEF:
        ${originalBrief}
        
        CLIENT FEEDBACK:
        ${feedback}
        
        Incorporate the feedback into a new, cohesive brief that maintains the structure
        of the original but addresses all points raised in the feedback. Highlight any
        significant changes or new requirements.
      `;
      
      const systemPrompt = `You are an expert design consultant who specializes in iterative project planning.
        You excel at incorporating feedback while maintaining document cohesion and clarity.`;
      
      // Use GPT-4o for creating revised briefs (content generation)
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
      console.error("Error creating revised brief:", error);
      return "Error creating revised brief";
    }
  }
};
