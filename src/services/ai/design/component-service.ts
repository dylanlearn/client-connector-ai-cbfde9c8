
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for AI-powered component recommendations
 */
export const AIComponentService = {
  /**
   * Generates component suggestions based on site requirements
   */
  suggestComponents: async (siteType: string, features: string[]): Promise<Array<{name: string, description: string, inspiration?: string}>> => {
    try {
      const promptContent = `
        Suggest UI components that would be effective for a ${siteType} website
        that needs to implement these features:
        ${features.join('\n')}
        
        Return a JSON array of component objects with:
        - name: the component name
        - description: a brief description of its purpose and functionality
        - inspiration: (optional) reference to a popular site with good implementation
        
        Focus on components that would enhance user experience and conversion rates.
      `;
      
      const systemPrompt = `You are an expert UI/UX designer specializing in component design.
        You know which UI patterns work best for different types of websites and user needs.`;
      
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
      console.error("Error suggesting components:", error);
      return [
        {
          name: "Default Header",
          description: "Standard navigation header with logo and menu items"
        },
        {
          name: "Default Footer",
          description: "Standard footer with sitemap, contact info, and social links"
        }
      ];
    }
  }
};
