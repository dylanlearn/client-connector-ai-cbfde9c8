
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

export interface ContentGenerationOptions {
  type: 'header' | 'tagline' | 'cta' | 'description';
  tone?: string;
  context?: string;
  keywords?: string[];
  maxLength?: number;
}

/**
 * Service for generating AI-powered content
 */
export const AIContentGenerationService = {
  /**
   * Generates content based on type and specifications
   */
  generateContent: async (options: ContentGenerationOptions): Promise<string> => {
    try {
      const { type, tone = 'professional', context = '', keywords = [], maxLength = 100 } = options;
      
      const promptContent = `
        Generate a ${type} with the following specifications:
        - Tone: ${tone}
        - Context: ${context}
        - Keywords to include: ${keywords.join(', ')}
        - Maximum length: ${maxLength} characters
        
        Create a compelling ${type} that would resonate with the target audience.
      `;
      
      const systemPrompt = `You are an expert copywriter specialized in creating compelling web content.
        You create concise, engaging copy that matches the specified tone and incorporates required keywords.`;
      
      // Use GPT-4o for content generation (high quality)
      const model = selectModelForFeature(AIFeatureType.ContentGeneration);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.7,
          model
        },
      });
      
      if (error) throw error;
      
      return data.response.trim();
    } catch (error) {
      console.error("Error generating content:", error);
      return `[Error generating ${options.type}]`;
    }
  }
};
