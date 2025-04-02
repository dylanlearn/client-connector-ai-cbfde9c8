
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

export interface FeedbackAnalysisResult {
  actionItems: Array<{
    task: string;
    priority: 'high' | 'medium' | 'low';
    urgency: number; // 0-100 scale
  }>;
  toneAnalysis: {
    positive: number; // 0-1 scale
    negative: number; // 0-1 scale
    neutral: number; // 0-1 scale
    urgent: boolean;
    vague: boolean;
    critical: boolean;
  };
  summary: string;
}

/**
 * Enterprise-grade service for analyzing feedback using OpenAI
 * - Extracts actionable items
 * - Analyzes tone and sentiment
 * - Detects urgency levels
 */
export const FeedbackAnalysisService = {
  /**
   * Analyze client feedback to extract action items and tone analysis
   * @param feedback The raw feedback text to analyze
   * @returns Structured analysis with action items and tone metrics
   */
  analyzeFeedback: async (feedback: string): Promise<FeedbackAnalysisResult> => {
    try {
      const promptContent = `
        Analyze the following client feedback in detail:
        
        ${feedback}
        
        Return a JSON object with:
        1. "actionItems": an array of task objects with:
           - "task": a clear, specific, actionable description
           - "priority": either "high", "medium", or "low"
           - "urgency": number from 0-100 (100 being most urgent)
        
        2. "toneAnalysis": object with:
           - "positive": number from 0-1 representing positive sentiment
           - "negative": number from 0-1 representing negative sentiment
           - "neutral": number from 0-1 representing neutral sentiment
           - "urgent": boolean, true if feedback has time-sensitive needs
           - "vague": boolean, true if feedback lacks specificity
           - "critical": boolean, true if feedback highlights serious issues
        
        3. "summary": a concise 1-2 sentence summary of the feedback
        
        Focus on extracting concrete, actionable tasks with clear next steps. 
        Prioritize items based on impact and urgency.
      `;
      
      const systemPrompt = `
        You are an expert feedback analyst with experience in design, development and client relations.
        Your specialty is extracting actionable insights from client feedback and accurately determining
        sentiment, urgency and clarity. Maintain a professional, objective perspective while analyzing feedback.
      `;
      
      // Use GPT-4o for high-quality analysis of client feedback
      const model = selectModelForFeature(AIFeatureType.DataAnalytics);
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.3, // Low temperature for more consistent analysis
          model
        },
      });
      
      if (error) throw error;
      
      // Parse and validate the response
      const result = JSON.parse(data.response);
      
      // Validate the structure and return defaults if missing
      return {
        actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],
        toneAnalysis: {
          positive: typeof result.toneAnalysis?.positive === 'number' ? result.toneAnalysis.positive : 0,
          negative: typeof result.toneAnalysis?.negative === 'number' ? result.toneAnalysis.negative : 0,
          neutral: typeof result.toneAnalysis?.neutral === 'number' ? result.toneAnalysis.neutral : 0,
          urgent: !!result.toneAnalysis?.urgent,
          vague: !!result.toneAnalysis?.vague,
          critical: !!result.toneAnalysis?.critical
        },
        summary: typeof result.summary === 'string' ? result.summary : 'No summary available'
      };
    } catch (error) {
      console.error("Error analyzing feedback:", error);
      
      // Return fallback values in case of error
      return {
        actionItems: [{ 
          task: "Review client feedback manually", 
          priority: "high", 
          urgency: 90 
        }],
        toneAnalysis: {
          positive: 0,
          negative: 0,
          neutral: 1,
          urgent: false,
          vague: false,
          critical: false
        },
        summary: "Error analyzing feedback. Please review manually."
      };
    }
  }
};
