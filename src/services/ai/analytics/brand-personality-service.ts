
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for brand personality detection
 */
export const AIBrandPersonalityService = {
  /**
   * Detects the brand personality and tone based on client responses
   */
  detectBrandPersonality: async (responses: Record<string, string>): Promise<Record<string, number>> => {
    try {
      const promptContent = `
        Based on these client responses, identify the brand personality traits on a scale from 0 to 1:
        
        ${Object.entries(responses)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Rate each personality trait from 0 (not present) to 1 (strongly present):
        - Minimal
        - Luxury
        - Playful
        - Bold
        - Traditional
        - Innovative
        - Friendly
        - Professional
        - Elegant
        - Rustic
        
        Format your response as JSON only.
      `;
      
      const systemPrompt = `You are an expert in brand personality analysis. Extract and quantify personality traits from client descriptions.`;
      
      // Use GPT-4o for brand personality detection (part of analytics)
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
      console.error("Error detecting brand personality:", error);
      return {
        minimal: 0.5,
        professional: 0.5,
        friendly: 0.5
      };
    }
  }
};
