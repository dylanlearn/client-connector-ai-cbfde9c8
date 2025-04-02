
import { supabase } from "@/integrations/supabase/client";

export interface ContentGenerationOptions {
  type: 'header' | 'tagline' | 'cta' | 'description';
  tone?: string;
  context?: string;
  keywords?: string[];
  maxLength?: number;
}

export interface DesignSuggestionOptions {
  industry?: string;
  style?: string;
  inspirations?: string[];
  preferences?: Record<string, any>;
  requirements?: string[];
}

/**
 * Service for generating AI-powered content and suggestions
 */
export const AIGeneratorService = {
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
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.7,
          model: 'gpt-4o-mini'
        },
      });
      
      if (error) throw error;
      
      return data.response.trim();
    } catch (error) {
      console.error("Error generating content:", error);
      return `[Error generating ${options.type}]`;
    }
  },
  
  /**
   * Summarizes client feedback into actionable items
   */
  summarizeFeedback: async (feedback: string): Promise<string[]> => {
    try {
      const promptContent = `
        Summarize the following client feedback into a list of clear, actionable to-do items:
        
        ${feedback}
        
        Return only a JSON array of strings, each representing one actionable task.
        Focus on design and content changes that can be implemented.
      `;
      
      const systemPrompt = `You are an expert at interpreting client feedback and converting
        it into clear, actionable tasks for designers and developers. Be specific and practical.`;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.4,
          model: 'gpt-4o-mini'
        },
      });
      
      if (error) throw error;
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error("Error summarizing feedback:", error);
      return ["Error processing feedback"];
    }
  },
  
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
      
      return data.response;
    } catch (error) {
      console.error("Error generating project brief:", error);
      return "Error generating project brief";
    }
  }
};
