
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
  throw new Error('Required environment variables are not set');
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, limit = 100 } = await req.json();

    // Fetch the global memories for the specified category
    const { data: memories, error } = await supabase
      .from('global_memories')
      .select('*')
      .eq('category', category)
      .order('relevanceScore', { ascending: false })
      .order('frequency', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (!memories || memories.length === 0) {
      return new Response(
        JSON.stringify({ insights: ["Not enough data to extract insights"] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract content from memories
    const memoryContents = memories.map(m => m.content).join("\n");

    // Analyze patterns using OpenAI
    const promptContent = `
      Analyze the following collection of anonymized design insights and extract key patterns,
      trends, and actionable recommendations:
      
      ${memoryContents}
      
      Return a JSON array of string insights that summarize the most valuable patterns
      found in these data points. Focus on insights that could improve design recommendations.
    `;

    const systemPrompt = `You are an analytics expert specialized in extracting 
      meaningful patterns from design data. Focus on identifying actionable insights 
      that can improve design recommendations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptContent }
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const insights = JSON.parse(data.choices[0].message.content);

    // Store the analysis results
    const timestamp = new Date().toISOString();
    const analysisId = crypto.randomUUID();

    await supabase
      .from('memory_analysis_results')
      .insert({
        id: analysisId,
        category: category,
        insights: insights,
        analyzed_at: timestamp,
        source_count: memories.length
      });

    return new Response(
      JSON.stringify({ 
        insights,
        analysisId,
        analyzedAt: timestamp,
        sourceCount: memories.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-memory-patterns function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
