
import { supabase } from "@/integrations/supabase/client";
import { AIAnalysis } from "@/types/ai";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for analyzing questionnaire responses
 */
export const AIResponsesAnalyzerService = {
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
      
      // Use GPT-4o for data analytics (high quality)
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
        const parsedData = JSON.parse(data.response);
        return {
          toneAnalysis: parsedData.toneAnalysis,
          clarity: parsedData.clarity,
          suggestionCount: parsedData.suggestionCount,
          keyInsights: parsedData.keyInsights || [],
          contradictions: parsedData.contradictions || [] // Ensure contradictions is properly handled
        };
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        
        // Return a basic structure if parsing fails
        return {
          keyInsights: ["Error analyzing responses"],
          contradictions: [] // Include empty contradictions array
        };
      }
    } catch (error) {
      console.error("Error in AIAnalyzerService:", error);
      return {
        keyInsights: ["Error analyzing responses"],
        contradictions: [] // Include empty contradictions array
      };
    }
  }
};
