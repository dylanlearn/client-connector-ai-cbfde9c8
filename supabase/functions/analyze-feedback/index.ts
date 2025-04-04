
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

interface ToneAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  urgent: boolean;
  critical: boolean;
  vague: boolean;
}

interface FeedbackAnalysisResult {
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
}

interface RequestBody {
  feedbackText: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Helper function to create an error response
function createErrorResponse(message: string, details?: string, status = 400): Response {
  const errorBody: ErrorResponse = { error: message };
  if (details) errorBody.details = details;
  
  return new Response(
    JSON.stringify(errorBody),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  );
}

// Helper function to log and track execution
function logOperation(operation: string, metadata: Record<string, any> = {}): void {
  console.log(`[analyze-feedback] ${operation}`, metadata);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logOperation('Request received');
    
    // Get the request body and parse it
    let body: RequestBody;
    try {
      body = await req.json();
    } catch (error) {
      logOperation('JSON parse error', { error: error.message });
      return createErrorResponse('Invalid JSON in request body');
    }
    
    const { feedbackText } = body;

    // Validate input
    if (!feedbackText?.trim()) {
      logOperation('Validation error', { reason: 'Empty feedback text' });
      return createErrorResponse('Feedback text is required');
    }

    // Create an instance of Supabase client for the edge function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Get current user if authenticated
    let userId = null;
    try {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (!userError && user) {
        userId = user.id;
        logOperation('User identified', { userId });
      }
    } catch (error) {
      // Non-critical error, continue without user ID
      logOperation('Failed to identify user', { error: error.message });
    }

    // Here you would typically call an AI service to analyze the feedback
    // For now, we'll use a simple algorithm to generate results
    logOperation('Analyzing feedback', { textLength: feedbackText.length });

    // Extract sentiment based on keyword matching (simplified)
    const positiveWords = ['great', 'good', 'excellent', 'like', 'love', 'happy', 'pleased'];
    const negativeWords = ['bad', 'terrible', 'hate', 'dislike', 'poor', 'disappointed', 'issue'];
    const urgentWords = ['urgent', 'immediately', 'asap', 'critical', 'now', 'emergency'];

    const lowerText = feedbackText.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    let urgentCount = 0;

    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    urgentWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) urgentCount += matches.length;
    });

    const total = Math.max(1, positiveCount + negativeCount);
    const positive = positiveCount / total;
    const negative = negativeCount / total;
    const neutral = 1 - (positive + negative);

    // Generate a summary (simplified)
    const sentences = feedbackText.match(/[^.!?]+[.!?]+/g) || [feedbackText];
    const summary = sentences.length > 2 
      ? `${sentences[0]} ${sentences[sentences.length - 1]}`
      : feedbackText;

    // Extract action items (simplified)
    const actionItems: ActionItem[] = [];
    const patterns = [
      { pattern: /need to\s+([^.!?]+)/gi, priority: 'high' },
      { pattern: /should\s+([^.!?]+)/gi, priority: 'medium' },
      { pattern: /would like\s+([^.!?]+)/gi, priority: 'low' },
      { pattern: /can you\s+([^.!?]+)/gi, priority: 'medium' },
      { pattern: /please\s+([^.!?]+)/gi, priority: 'medium' },
    ];

    patterns.forEach(({ pattern, priority }) => {
      const matches = [...feedbackText.matchAll(pattern)];
      matches.forEach((match, index) => {
        if (match[1]) {
          actionItems.push({
            task: match[1].trim(),
            priority: priority as 'high' | 'medium' | 'low',
            urgency: priority === 'high' ? 8 : priority === 'medium' ? 5 : 3
          });
        }
      });
    });

    // If no action items were found, create a default one
    if (actionItems.length === 0) {
      actionItems.push({
        task: 'Review the feedback and determine appropriate actions',
        priority: 'medium',
        urgency: 5
      });
    }

    // Create the analysis result
    const result: FeedbackAnalysisResult = {
      summary: summary.trim(),
      actionItems,
      toneAnalysis: {
        positive,
        neutral,
        negative,
        urgent: urgentCount > 0,
        critical: negative > 0.5,
        vague: sentences.length < 2
      }
    };

    logOperation('Analysis completed', { 
      actionItemsCount: actionItems.length,
      sentimentScores: { positive, neutral, negative }
    });

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    logOperation('Error processing feedback', { 
      error: error.message,
      stack: error.stack
    });
    
    return createErrorResponse(
      'Failed to analyze feedback', 
      error.message,
      500
    );
  }
})
