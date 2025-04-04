
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { ActionItem, FeedbackAnalysisRequest, FeedbackAnalysisResult, ToneAnalysis } from "./types.ts";

// OpenAI API configuration
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const MODEL = "gpt-3.5-turbo"; // Can be upgraded to GPT-4 for better analysis if needed

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get feedback text from request
    const { feedbackText } = await req.json() as FeedbackAnalysisRequest;
    
    if (!feedbackText) {
      return new Response(
        JSON.stringify({ error: "Feedback text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    // Analyze the feedback using OpenAI
    const result = await analyzeFeedback(feedbackText);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-feedback function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while analyzing feedback" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Analyzes feedback text using OpenAI
 */
async function analyzeFeedback(feedbackText: string): Promise<FeedbackAnalysisResult> {
  // Prompt for generating actionable tasks from feedback
  const prompt = `
    Analyze the following client feedback:
    
    "${feedbackText}"
    
    Provide:
    1. A brief summary (2-3 sentences)
    2. A list of actionable tasks with priorities (high/medium/low) and urgency score (1-10)
    3. Tone analysis with percentages for positive, neutral, and negative sentiments
    4. Flags for urgent, critical, or vague feedback
    
    Format as JSON with:
    {
      "summary": "...",
      "actionItems": [{"task": "...", "priority": "high|medium|low", "urgency": number}],
      "toneAnalysis": {
        "positive": number, // decimal between 0-1
        "neutral": number, // decimal between 0-1
        "negative": number, // decimal between 0-1
        "urgent": boolean,
        "critical": boolean,
        "vague": boolean
      }
    }
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing client feedback and extracting actionable insights. Provide detailed analysis in the requested JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${responseText}`);
  }

  const responseData = await response.json();
  const content = responseData.choices[0].message.content;
  
  // Parse the JSON response
  try {
    // Extract JSON from the response (in case there's any non-JSON text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    const result = JSON.parse(jsonString) as FeedbackAnalysisResult;
    
    // Validate the parsed result
    validateResult(result);
    
    return result;
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    console.log("Raw response:", content);
    
    // Return a fallback result if parsing fails
    return generateFallbackResult(feedbackText);
  }
}

/**
 * Validates that the result has all required properties
 */
function validateResult(result: any): asserts result is FeedbackAnalysisResult {
  if (!result.summary || typeof result.summary !== 'string') {
    throw new Error("Missing or invalid summary");
  }
  
  if (!Array.isArray(result.actionItems)) {
    throw new Error("Missing or invalid actionItems array");
  }
  
  if (!result.toneAnalysis || typeof result.toneAnalysis !== 'object') {
    throw new Error("Missing or invalid toneAnalysis object");
  }
}

/**
 * Generates a fallback result when OpenAI analysis fails
 */
function generateFallbackResult(feedbackText: string): FeedbackAnalysisResult {
  return {
    summary: "Automated analysis failed. This is a basic summary of the feedback.",
    actionItems: [
      {
        task: "Review feedback manually",
        priority: "high",
        urgency: 10
      },
      {
        task: "Investigate analysis failure",
        priority: "medium",
        urgency: 7
      }
    ],
    toneAnalysis: {
      positive: 0.33,
      neutral: 0.34,
      negative: 0.33,
      urgent: false,
      critical: false,
      vague: false
    }
  };
}
