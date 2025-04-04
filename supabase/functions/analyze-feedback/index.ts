
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders } from "../_shared/cors.ts";
import { FeedbackAnalysisRequest, FeedbackAnalysisResult, ActionItem, ToneAnalysis } from "./types.ts";

// Initialize OpenAI
const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';

// Initialize Supabase client with service role for admin access
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract feedback text from request
    const { feedbackText }: FeedbackAnalysisRequest = await req.json();
    
    if (!feedbackText || typeof feedbackText !== 'string') {
      throw new Error('Missing or invalid feedback text');
    }

    console.log('Analyzing feedback:', feedbackText.substring(0, 50) + '...');
    
    // Get feedback analysis using OpenAI
    const analysisResult = await analyzeFeedback(feedbackText);
    
    // Store analysis result in database for auditing and insights
    await storeAnalysisResult(analysisResult, feedbackText);
    
    // Return the analysis
    return new Response(JSON.stringify(analysisResult), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    });
  } catch (error) {
    console.error('Error in analyze-feedback function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred during feedback analysis' 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500 
    });
  }
});

/**
 * Analyze feedback text using OpenAI
 */
async function analyzeFeedback(feedbackText: string): Promise<FeedbackAnalysisResult> {
  try {
    // If no OpenAI key, return mock data for development
    if (!openaiApiKey) {
      console.warn('No OpenAI API key found. Using mock data.');
      return getMockAnalysisResult(feedbackText);
    }
    
    // Call OpenAI API to analyze the feedback
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes client feedback and extracts actionable insights. 
            Analyze the feedback and provide:
            1. A list of actionable items with priority levels (high, medium, low) and urgency score (1-10)
            2. A tone analysis with metrics (positive: 0-1, neutral: 0-1, negative: 0-1, and flags for urgent, vague, or critical)
            3. A brief summary of the feedback
            Format your response as JSON matching this exact structure:
            {
              "actionItems": [{"task": "string", "priority": "high|medium|low", "urgency": number}],
              "toneAnalysis": {"positive": number, "neutral": number, "negative": number, "urgent": boolean, "vague": boolean, "critical": boolean},
              "summary": "string"
            }`
          },
          { role: 'user', content: feedbackText }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }
    
    // Parse the response as JSON
    const analysisResult = JSON.parse(data.choices[0].message.content) as FeedbackAnalysisResult;
    
    return analysisResult;
  } catch (error) {
    console.error('Error analyzing feedback with OpenAI:', error);
    throw new Error(`Failed to analyze feedback: ${error.message}`);
  }
}

/**
 * Store analysis result in database for future reference and pattern analysis
 */
async function storeAnalysisResult(result: FeedbackAnalysisResult, originalFeedback: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('feedback_analysis')
      .insert({
        original_feedback: originalFeedback,
        action_items: result.actionItems,
        tone_analysis: result.toneAnalysis,
        summary: result.summary,
      });
      
    if (error) {
      console.error('Error storing feedback analysis:', error);
    }
  } catch (error) {
    console.error('Exception storing feedback analysis:', error);
    // Continue execution even if storage fails
  }
}

/**
 * Get mock analysis result for development without OpenAI API key
 */
function getMockAnalysisResult(feedbackText: string): FeedbackAnalysisResult {
  return {
    actionItems: [
      {
        task: "Implement suggested improvements based on feedback",
        priority: "medium",
        urgency: 5
      }
    ],
    toneAnalysis: {
      positive: 0.4,
      neutral: 0.5,
      negative: 0.1,
      urgent: false,
      vague: false,
      critical: false
    },
    summary: "This is a mock analysis of the feedback text for development purposes."
  };
}
