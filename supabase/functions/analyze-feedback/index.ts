
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface FeedbackRequest {
  feedbackText: string;
}

interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

interface AnalysisResponse {
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
    urgent: boolean;
    critical: boolean;
    vague: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { feedbackText } = await req.json() as FeedbackRequest;
    
    // Validate request
    if (!feedbackText || feedbackText.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid feedback text" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // For now, we'll implement a basic analysis engine
    // In a production environment, this would call an AI service like OpenAI
    const analysis = analyzeFeedback(feedbackText);
    
    return new Response(
      JSON.stringify(analysis),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process feedback" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

/**
 * Simple feedback analysis engine
 * This is a placeholder that could be replaced with a real ML model
 */
function analyzeFeedback(text: string): AnalysisResponse {
  // Convert to lowercase for simple text analysis
  const lowerText = text.toLowerCase();
  
  // Simple sentiment indicators
  const positiveWords = ['great', 'good', 'excellent', 'amazing', 'love', 'helpful', 'impressed'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'disappointed', 'frustrating'];
  const urgentWords = ['asap', 'urgent', 'immediately', 'critical', 'emergency'];
  
  // Count word occurrences
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  const urgentCount = urgentWords.filter(word => lowerText.includes(word)).length;
  
  // Calculate basic sentiment scores
  const totalIndicators = positiveCount + negativeCount + 1; // Avoid division by zero
  const positiveScore = positiveCount / totalIndicators;
  const negativeScore = negativeCount / totalIndicators;
  const neutralScore = 1 - (positiveScore + negativeScore);
  
  // Extract potential action items (sentences with action words)
  const actionWords = ['need', 'should', 'must', 'fix', 'improve', 'update', 'change', 'add'];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  const actionItems: ActionItem[] = sentences
    .filter(sentence => actionWords.some(word => sentence.toLowerCase().includes(word)))
    .map(sentence => {
      // Determine priority based on urgent words and negative sentiment
      const containsUrgent = urgentWords.some(word => sentence.toLowerCase().includes(word));
      const containsNegative = negativeWords.some(word => sentence.toLowerCase().includes(word));
      let priority: 'high' | 'medium' | 'low' = 'medium';
      
      if (containsUrgent) {
        priority = 'high';
      } else if (containsNegative) {
        priority = 'medium';
      } else {
        priority = 'low';
      }
      
      return {
        task: sentence.trim(),
        priority,
        urgency: containsUrgent ? 8 : containsNegative ? 5 : 3
      };
    })
    .slice(0, 5); // Limit to top 5 action items
  
  // Generate a simple summary
  let summary = '';
  if (positiveScore > negativeScore + 0.2) {
    summary = "Overall positive feedback with some suggestions for improvement.";
  } else if (negativeScore > positiveScore + 0.2) {
    summary = "Feedback indicates several areas of concern that need attention.";
  } else {
    summary = "Balanced feedback with both positive aspects and areas for improvement.";
  }
  
  return {
    summary,
    actionItems,
    toneAnalysis: {
      positive: parseFloat(positiveScore.toFixed(2)),
      neutral: parseFloat(neutralScore.toFixed(2)),
      negative: parseFloat(negativeScore.toFixed(2)),
      urgent: urgentCount > 0,
      critical: negativeScore > 0.6,
      vague: sentences.length < 3 || text.length < 50
    }
  };
}
