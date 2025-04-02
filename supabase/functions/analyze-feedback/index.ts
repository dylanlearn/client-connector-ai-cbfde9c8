
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const { feedback } = await req.json();

    if (!feedback) {
      return new Response(
        JSON.stringify({ error: 'Feedback text is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // System prompts for specific roles
    const systemPrompt = `
      You are an expert feedback analyst with experience in design, development and client relations.
      Your specialty is extracting actionable insights from client feedback and accurately determining
      sentiment, urgency and clarity. Maintain a professional, objective perspective while analyzing feedback.
    `;

    // Prepare the user prompt
    const userPrompt = `
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

    // Log the analysis request
    console.log(`Processing feedback analysis request: ${feedback.substring(0, 50)}...`);

    const startTime = Date.now();

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Using GPT-4o for high-quality analysis
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Low temperature for consistent outputs
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const analysisResult = data.choices[0].message.content;
    
    // Parse the JSON result
    const parsedResult = JSON.parse(analysisResult);
    
    // Log performance metrics
    const processingTime = Date.now() - startTime;
    console.log(`Analysis completed in ${processingTime}ms`);
    console.log(`Found ${parsedResult.actionItems?.length || 0} action items`);

    return new Response(
      JSON.stringify({
        result: parsedResult,
        meta: {
          model: data.model,
          processingTime,
          tokensUsed: data.usage.total_tokens,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-feedback function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
