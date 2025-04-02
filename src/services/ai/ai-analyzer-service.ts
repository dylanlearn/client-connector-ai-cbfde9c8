
import { supabase } from "@/integrations/supabase/client";
import { AIAnalysis } from "@/types/ai";
import { AIFeatureType, selectModelForFeature } from "./ai-model-selector";

/**
 * Service for analyzing client responses and extracting insights
 */
export const AIAnalyzerService = {
  /**
   * Analyzes questionnaire responses to extract insights and patterns
   */
  analyzeResponses: async (questionnaireData: Record<string, any>): Promise<AIAnalysis> => {
    try {
      // Prepare the prompt for analysis
      const promptContent = `
        Analyze the following client questionnaire responses for a website design project:
        
        ${Object.entries(questionnaireData)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Provide the following analysis:
        1. Tone analysis (formal, casual, professional, friendly) as scores from 0 to 1
        2. Clarity score from 0 to 1
        3. Number of actionable suggestions
        4. Key insights (2-5 points)
        5. Identify any contradictions in the client's requirements
        
        Format your response as JSON with the following structure:
        {
          "toneAnalysis": {
            "formal": 0.7,
            "casual": 0.3,
            "professional": 0.8,
            "friendly": 0.6
          },
          "clarity": 0.75,
          "suggestionCount": 3,
          "keyInsights": [
            "First key insight",
            "Second key insight",
            "Third key insight"
          ],
          "contradictions": [
            "Wants minimal design but prefers bold elements",
            "Other contradiction if any"
          ]
        }
      `;
      
      const systemPrompt = `You are an expert design analyst who can identify patterns, 
        preferences, and contradictions in client feedback. You specialize in extracting meaningful insights 
        from questionnaire responses to guide the design process.`;
      
      // Select the model - use GPT-4o for data analytics
      const model = selectModelForFeature(AIFeatureType.DataAnalytics);
      
      // Call the OpenAI edge function
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
      
      try {
        // Try to parse the response as JSON directly
        return JSON.parse(data.response);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        
        // Return a basic structure if parsing fails
        return {
          clarity: 0.5,
          keyInsights: ["Error analyzing responses"],
          contradictions: ["Could not identify contradictions"]
        };
      }
    } catch (error) {
      console.error("Error in AIAnalyzerService:", error);
      return {
        clarity: 0.5,
        keyInsights: ["Error analyzing responses"]
      };
    }
  },
  
  /**
   * Detects the brand personality and tone based on client responses
   */
  detectBrandPersonality: async (responses: Record<string, string>): Promise<Record<string, number>> => {
    try {
      const promptContent = `
        Based on these client responses, identify the brand personality traits on a scale from 0 to 1:
        
        ${Object.entries(responses)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Rate each personality trait from 0 (not present) to 1 (strongly present):
        - Minimal
        - Luxury
        - Playful
        - Bold
        - Traditional
        - Innovative
        - Friendly
        - Professional
        - Elegant
        - Rustic
        
        Format your response as JSON only.
      `;
      
      const systemPrompt = `You are an expert in brand personality analysis. Extract and quantify personality traits from client descriptions.`;
      
      // Select the model - use GPT-4o for brand personality detection (part of analytics)
      const model = selectModelForFeature(AIFeatureType.DataAnalytics);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.3,
          model
        },
      });
      
      if (error) throw error;
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error("Error detecting brand personality:", error);
      return {
        minimal: 0.5,
        professional: 0.5,
        friendly: 0.5
      };
    }
  },
  
  /**
   * Identifies contradictions in client requirements
   */
  identifyContradictions: async (responses: Record<string, string>): Promise<string[]> => {
    try {
      const promptContent = `
        Analyze these client responses and identify any contradictions or inconsistencies in their requirements:
        
        ${Object.entries(responses)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Return a list of contradictions, if any exist. Format as a JSON array of strings.
        If no contradictions are found, return an empty array.
      `;
      
      const systemPrompt = `You are an expert at identifying contradictions in design requirements. 
        Your goal is to flag any inconsistencies in client requests to help create clear design directions.`;
      
      // Select the model - use GPT-4o for contradiction detection (part of analytics)
      const model = selectModelForFeature(AIFeatureType.DataAnalytics);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.3,
          model
        },
      });
      
      if (error) throw error;
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error("Error identifying contradictions:", error);
      return ["Error identifying contradictions"];
    }
  }
};
