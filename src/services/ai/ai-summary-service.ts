
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "./ai-model-selector";

/**
 * Service for AI-powered summarization of client data
 */
export const AISummaryService = {
  /**
   * Summarizes client questionnaire responses into a concise brief
   */
  summarizeQuestionnaire: async (responses: Record<string, string>): Promise<string> => {
    try {
      const promptContent = `
        Summarize these client questionnaire responses into a clear, concise design brief:
        
        ${Object.entries(responses)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Create a professional, well-structured summary that organizes the client's needs
        and preferences into a cohesive document. Include sections for project goals,
        target audience, design preferences, and technical requirements.
      `;
      
      const systemPrompt = `You are an expert design consultant who excels at distilling client input
        into clear, actionable briefs. You can take messy, vague, or disorganized input and transform
        it into a professional document that guides the design process.`;
      
      // Use GPT-4o for summarizing questionnaire (content generation)
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
      console.error("Error summarizing questionnaire:", error);
      return "Error generating questionnaire summary";
    }
  },
  
  /**
   * Converts raw feedback or notes into organized action items
   */
  convertToActionItems: async (feedback: string): Promise<Array<{task: string, priority: 'high' | 'medium' | 'low'}>> => {
    try {
      const promptContent = `
        Convert this raw feedback into a prioritized list of actionable tasks:
        
        ${feedback}
        
        Return a JSON array of task objects with:
        - task: a clear, actionable description of what needs to be done
        - priority: either "high", "medium", or "low" based on importance
        
        Focus on being specific and actionable. Break down vague feedback into concrete tasks.
      `;
      
      const systemPrompt = `You are an expert project manager who specializes in turning client feedback
        into clear, actionable tasks. You know how to interpret vague requests and transform them into
        specific action items with appropriate priorities.`;
      
      // Use GPT-4o-mini for converting to action items (basic summarization)
      const model = selectModelForFeature(AIFeatureType.Summarization);
      
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
      console.error("Error converting to action items:", error);
      return [{ task: "Error processing feedback", priority: "medium" }];
    }
  },
  
  /**
   * Creates a revised project brief based on original brief and feedback
   */
  createRevisedBrief: async (originalBrief: string, feedback: string): Promise<string> => {
    try {
      const promptContent = `
        Create a revised project brief based on:
        
        ORIGINAL BRIEF:
        ${originalBrief}
        
        CLIENT FEEDBACK:
        ${feedback}
        
        Incorporate the feedback into a new, cohesive brief that maintains the structure
        of the original but addresses all points raised in the feedback. Highlight any
        significant changes or new requirements.
      `;
      
      const systemPrompt = `You are an expert design consultant who specializes in iterative project planning.
        You excel at incorporating feedback while maintaining document cohesion and clarity.`;
      
      // Use GPT-4o for creating revised briefs (content generation)
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
      console.error("Error creating revised brief:", error);
      return "Error creating revised brief";
    }
  }
};
