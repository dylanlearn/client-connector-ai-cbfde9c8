
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for identifying contradictions in client requirements
 */
export const AIContradictionService = {
  /**
   * Identifies contradictions in client requirements
   */
  identifyContradictions: async (responses: Record<string, string>): Promise<string[]> => {
    try {
      const promptContent = `
        Analyze these client responses and identify any contradictions or inconsistencies in their requirements:
        
        ${Object.entries(responses)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Return a list of contradictions, if any exist. Format as a JSON array of strings.
        If no contradictions are found, return an empty array.
      `;
      
      const systemPrompt = `You are an expert at identifying contradictions in design requirements. 
        Your goal is to flag any inconsistencies in client requests to help create clear design directions.`;
      
      // Use GPT-4o for contradiction detection (part of analytics)
      const model = selectModelForFeature(AIFeatureType.DataAnalytics);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.3,
          model
        },
      });
      
      if (error) throw error;
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error("Error identifying contradictions:", error);
      return ["Error identifying contradictions"];
    }
  }
};
