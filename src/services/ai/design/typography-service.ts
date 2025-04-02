
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for AI-powered typography recommendations
 */
export const AITypographyService = {
  /**
   * Recommends typography combinations based on brand personality
   */
  suggestTypography: async (brandPersonality: Record<string, number>): Promise<{headings: string, body: string, accents: string}> => {
    try {
      const promptContent = `
        Based on this brand personality profile:
        ${Object.entries(brandPersonality)
          .map(([trait, score]) => `${trait}: ${score}`)
          .join('\n')}
        
        Suggest typography combinations (Google Fonts preferred) for:
        1. Headings
        2. Body text
        3. Accent text (buttons, highlights)
        
        Return a JSON object with these three properties: headings, body, accents.
        Each value should be a font name that's available on Google Fonts.
      `;
      
      const systemPrompt = `You are a typography expert who specializes in web design.
        You understand how different fonts convey different brand personalities and how
        to create harmonious typography combinations that enhance readability and brand voice.`;
      
      // Use GPT-4o for design recommendation (high quality)
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
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
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error("Error suggesting typography:", error);
      return {
        headings: "Montserrat",
        body: "Open Sans",
        accents: "Montserrat"
      };
    }
  }
};
