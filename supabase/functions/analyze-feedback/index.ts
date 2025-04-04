
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import OpenAI from "https://esm.sh/openai@4.0.0";

// Define the interfaces needed for the feedback analysis 
interface ActionItem {
  task: string;
  priority: "high" | "medium" | "low";
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

serve(async (req) => {
  // Set up CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey, content-type",
    "Content-Type": "application/json"
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  try {
    // Get the request body and validate it
    const body = await req.json() as RequestBody;
    const { feedbackText } = body;

    if (!feedbackText) {
      return new Response(
        JSON.stringify({ error: "Feedback text is required" }),
        { headers, status: 400 }
      );
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create an OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY") as string,
    });

    // Analyze the feedback using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the latest model for best results
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing client feedback and extracting actionable insights.
            Analyze the following client feedback and structure your response as a JSON object with the following properties:
            1. summary: A concise summary of the feedback in 1-2 sentences.
            2. actionItems: An array of objects with {task, priority, urgency} where:
              - task is a clear actionable task
              - priority is one of: "high", "medium", "low"
              - urgency is a number from 1-10
            3. toneAnalysis: An object with:
              - positive: A number 0-1 representing positive sentiment
              - neutral: A number 0-1 representing neutral sentiment
              - negative: A number 0-1 representing negative sentiment
              - urgent: Boolean indicating if the feedback has urgent language
              - critical: Boolean indicating if the feedback is critical
              - vague: Boolean indicating if the feedback lacks specificity
              
            The sum of positive, neutral, and negative should equal 1.
            `
        },
        {
          role: "user",
          content: feedbackText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4, // Lower temperature for more consistent analysis
    });

    // Parse the completion to get the analysis
    const analysisText = response.choices[0]?.message?.content || "";
    const analysis = JSON.parse(analysisText) as FeedbackAnalysisResult;

    // Log basic information for monitoring
    console.log(`Analyzed feedback of length ${feedbackText.length} characters`);
    console.log(`Identified ${analysis.actionItems.length} action items`);

    return new Response(JSON.stringify(analysis), { headers, status: 200 });
  } catch (error) {
    console.error("Error processing feedback:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to analyze feedback", 
        details: error.message 
      }),
      { headers, status: 500 }
    );
  }
});
