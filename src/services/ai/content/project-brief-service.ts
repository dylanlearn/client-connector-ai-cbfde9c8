
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for generating project briefs
 */
export const AIProjectBriefService = {
  /**
   * Generates a project brief based on questionnaire responses
   */
  generateProjectBrief: async (questionnaireData: Record<string, any>): Promise<string> => {
    try {
      const promptContent = `
        Generate a comprehensive project brief based on these client questionnaire responses:
        
        ${Object.entries(questionnaireData)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Include sections for:
        1. Project Overview
        2. Objectives
        3. Target Audience
        4. Key Features
        5. Design Direction
        6. Content Requirements
        
        Write in a professional tone. Be clear and specific, transforming even vague client responses
        into actionable specifications.
      `;
      
      const systemPrompt = `You are an expert design consultant who specializes in creating 
        clear project briefs from client questionnaires. You know how to interpret client needs
        and transform vague or inconsistent responses into a cohesive, actionable document.`;
      
      // Use GPT-4o for generating project briefs (high quality)
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
      console.error("Error generating project brief:", error);
      return "Error generating project brief";
    }
  }
};
