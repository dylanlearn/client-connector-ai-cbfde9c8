
import { supabase } from "@/integrations/supabase/client";

export interface ColorPaletteOptions {
  industry?: string;
  mood?: string;
  preferences?: string[];
  existingColors?: string[];
}

export interface LayoutRecommendationOptions {
  siteType: string;
  inspirations?: string[];
  features?: string[];
  audience?: string;
}

/**
 * Service for AI-powered design recommendations
 */
export const AIDesignService = {
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
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.5,
          model: 'gpt-4o-mini'
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
  },
  
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
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.5,
          model: 'gpt-4o-mini'
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
  },
  
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
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.6,
          model: 'gpt-4o-mini'
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
  },
  
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
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.6,
          model: 'gpt-4o-mini'
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
