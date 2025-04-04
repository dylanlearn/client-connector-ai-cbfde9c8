
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, FeedbackAnalysisRequest, FeedbackAnalysisResult, ActionItem, ToneAnalysis } from "./types.ts";

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

    // Create the system prompt for analyzing feedback
    const systemPrompt = `
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
    `;

    // Call OpenAI API with updated format
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: feedbackText }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message.content?.trim() || "";
    
    // Parse the response as JSON
    let result: FeedbackAnalysisResult;
    try {
      result = JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse AI response:", content);
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
    console.error("Error in analyze-feedback:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
