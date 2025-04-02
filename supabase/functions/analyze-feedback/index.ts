
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders } from "../send-client-link/types.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

// Types for feedback analysis
interface FeedbackAnalysisRequest {
  feedbackText: string;
}

interface FeedbackAnalysisResult {
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
  summary: string;
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
  vague: boolean;
  critical: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    const { feedbackText } = await req.json() as FeedbackAnalysisRequest;

    if (!feedbackText) {
      return new Response(
        JSON.stringify({ error: "Feedback text is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the prompt for analyzing feedback
    const prompt = `
    You are an expert at analyzing design feedback for actionable insights.
    Analyze this feedback text and extract:
    1. A list of specific action items with priority (high/medium/low) and urgency level (0-100)
    2. A tone analysis showing positive/neutral/negative sentiment percentages (should sum to 1.0)
    3. A brief 1-2 sentence summary of the feedback
    4. Also detect if the feedback is urgent, vague, or contains critical issues
    
    Format your response as a valid JSON with the following structure:
    {
      "actionItems": [
        {"task": "specific task description", "priority": "high|medium|low", "urgency": number}
      ],
      "toneAnalysis": {
        "positive": number,
        "neutral": number, 
        "negative": number,
        "urgent": boolean,
        "vague": boolean,
        "critical": boolean
      },
      "summary": "brief summary"
    }
    
    Feedback:
    ${feedbackText}
    `;

    // Call OpenAI API
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.data.choices[0]?.text?.trim() || "";
    
    // Parse the response as JSON
    let result: FeedbackAnalysisResult;
    try {
      result = JSON.parse(content);
    } catch (error) {
      throw new Error("Failed to parse AI response to valid JSON");
    }

    // Return the analysis result
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
