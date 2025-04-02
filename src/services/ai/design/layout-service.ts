
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

export interface LayoutRecommendationOptions {
  siteType: string;
  inspirations?: string[];
  features?: string[];
  audience?: string;
}

/**
 * Service for AI-powered layout recommendations
 */
export const AILayoutService = {
  /**
   * Recommends layout structures based on site type and requirements
   */
  recommendLayouts: async (options: LayoutRecommendationOptions): Promise<string[]> => {
    try {
      const { siteType, inspirations = [], features = [], audience = '' } = options;
      
      const promptContent = `
        Recommend layout structures for a ${siteType} website with:
        - Target audience: ${audience}
        - Required features: ${features.join(', ')}
        - Inspired by: ${inspirations.join(', ')}
        
        Provide layout recommendations as a JSON array of strings, each describing a specific layout recommendation
        for a section of the website. Be specific about structure, content organization, and user flows.
      `;
      
      const systemPrompt = `You are an expert UI/UX designer who specializes in information architecture
        and layout design. You create recommendations that optimize for user experience while meeting
        business objectives and technical requirements.`;
      
      // Use GPT-4o for design recommendation (high quality)
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.6,
          model
        },
      });
      
      if (error) throw error;
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error("Error recommending layouts:", error);
      return [
        "Hero section with clear value proposition",
        "Feature grid with icons and brief descriptions",
        "Testimonials section with client quotes"
      ];
    }
  }
};
