
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for AI-powered accessibility recommendations
 */
export const AIAccessibilityService = {
  /**
   * Generates accessibility recommendations based on website requirements
   */
  generateAccessibilityGuidelines: async (
    siteType: string,
    audience: string[] = []
  ): Promise<string[]> => {
    try {
      const promptContent = `
        Generate accessibility guidelines for a ${siteType} website
        with these audience characteristics:
        ${audience.join(', ')}
        
        Return a JSON array of string recommendations focused on web accessibility 
        best practices specific to this type of site and audience.
        Include WCAG compliance recommendations where appropriate.
      `;
      
      const systemPrompt = `You are an accessibility expert who specializes in creating
        inclusive digital experiences. You understand WCAG guidelines and how to apply
        them to different types of websites and user needs.`;
      
      // Use GPT-4o for design recommendation (high quality)
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
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
      console.error("Error generating accessibility guidelines:", error);
      return [
        "Ensure adequate color contrast for all text content",
        "Use semantic HTML elements for better screen reader compatibility",
        "Make all interactive elements keyboard accessible"
      ];
    }
  }
};
