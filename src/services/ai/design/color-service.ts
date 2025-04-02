
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

export interface ColorPaletteOptions {
  industry?: string;
  mood?: string;
  preferences?: string[];
  existingColors?: string[];
}

/**
 * Service for AI-powered color palette recommendations
 */
export const AIColorService = {
  /**
   * Generates color palette suggestions based on brand personality and preferences
   */
  suggestColorPalette: async (options: ColorPaletteOptions): Promise<Array<{name: string, hex: string, usage: string}>> => {
    try {
      const { industry = '', mood = '', preferences = [], existingColors = [] } = options;
      
      const promptContent = `
        Suggest a color palette based on these parameters:
        - Industry: ${industry}
        - Mood/Tone: ${mood}
        - Client preferences: ${preferences.join(', ')}
        - Existing brand colors (if any): ${existingColors.join(', ')}
        
        Return a JSON array of color objects with these properties:
        - name: descriptive name of the color
        - hex: hex code (e.g., "#FF5500")
        - usage: how this color should be used (e.g., "primary", "accent", "background", "text")
        
        Provide 5-7 colors that work well together, following color theory principles.
      `;
      
      const systemPrompt = `You are an expert UI/UX designer with specialized knowledge in color theory.
        You create harmonious color palettes that align with brand personalities and industry standards.`;
      
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
      console.error("Error suggesting color palette:", error);
      return [
        { name: "Default Primary", hex: "#4F46E5", usage: "primary" },
        { name: "Default Secondary", hex: "#0EA5E9", usage: "secondary" },
        { name: "Default Background", hex: "#F9FAFB", usage: "background" }
      ];
    }
  }
};
