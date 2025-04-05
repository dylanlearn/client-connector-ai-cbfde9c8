
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get request params
    const { category, limit = 50, forceRefresh = false } = await req.json();
    
    if (!category) {
      throw new Error('Category parameter is required');
    }
    
    console.log(`Analyzing memory patterns for category: ${category}, limit: ${limit}`);
    
    // Check if we have recent analysis results (less than 15 minutes old)
    if (!forceRefresh) {
      const { data: existingAnalysis, error: fetchError } = await supabaseClient
        .from('memory_analysis_results')
        .select('insights, analyzed_at')
        .eq('category', category)
        .order('analyzed_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!fetchError && existingAnalysis) {
        const analysisTime = new Date(existingAnalysis.analyzed_at);
        const now = new Date();
        const timeDiff = now.getTime() - analysisTime.getTime();
        const fifteenMinutes = 15 * 60 * 1000;
        
        // If analysis is recent, return the cached results
        if (timeDiff < fifteenMinutes) {
          console.log(`Using cached analysis for ${category} from ${analysisTime.toISOString()}`);
          return new Response(
            JSON.stringify({ 
              insights: existingAnalysis.insights.results || [],
              cached: true,
              analyzedAt: analysisTime
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }
    
    // Fetch the relevant memories from global_memories
    const { data: memories, error: memoriesError } = await supabaseClient
      .from('global_memories')
      .select('*')
      .eq('category', category)
      .order('relevance_score', { ascending: false })
      .limit(limit);
      
    if (memoriesError) {
      throw new Error(`Error fetching memories: ${memoriesError.message}`);
    }
    
    if (!memories || memories.length === 0) {
      // Save an empty result if no memories found
      await supabaseClient
        .from('memory_analysis_results')
        .insert({
          category,
          source_count: 0,
          insights: { results: ['No data available for analysis'] }
        });
        
      return new Response(
        JSON.stringify({ insights: ['No data available for analysis'] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For very limited data, return basic insights without AI processing
    if (memories.length < 5) {
      const basicInsights = ['Not enough data to extract meaningful patterns'];
      
      // Save basic insights
      await supabaseClient
        .from('memory_analysis_results')
        .insert({
          category,
          source_count: memories.length,
          insights: { results: basicInsights }
        });
        
      return new Response(
        JSON.stringify({ insights: basicInsights }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Prepare memories for analysis
    const memoryContents = memories.map(m => m.content).join('\n\n');
    
    // If OpenAI API key is not available, use rule-based insights
    if (!openAIApiKey) {
      console.log('OpenAI API key not available, using rule-based insights');
      const ruleBasedInsights = [
        'Users tend to prefer consistent design patterns',
        'Clean, minimal interfaces are generally preferred',
        'Navigational clarity is important across user interactions'
      ];
      
      // Save rule-based insights
      await supabaseClient
        .from('memory_analysis_results')
        .insert({
          category,
          source_count: memories.length,
          insights: { results: ruleBasedInsights }
        });
        
      return new Response(
        JSON.stringify({ insights: ruleBasedInsights }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Analyze with OpenAI
    const prompt = `
      You are an expert design system analyst. Review the following user memories and insights 
      related to the design category "${category}":
      
      ${memoryContents}
      
      Extract 3-5 key insights based on these memories. Focus on identifying patterns, 
      preferences, and actionable design recommendations. Keep each insight concise 
      (less than 100 characters) and specific to this category.
      
      Format your response as a JSON array of strings. Each string should be one insight.
    `;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a design insights specialist.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    // Parse the insights from the AI response
    let insights: string[];
    try {
      // Try to parse directly as JSON
      insights = JSON.parse(content);
      if (!Array.isArray(insights)) {
        throw new Error('Expected array of insights');
      }
    } catch (jsonError) {
      console.error('Failed to parse AI response as JSON:', jsonError);
      
      // Fallback to text parsing - look for items that might be insights
      const lines = content.split('\n').filter(line => 
        line.trim().length > 10 && 
        (line.includes('-') || /^\d+\./.test(line.trim()))
      );
      
      if (lines.length > 0) {
        insights = lines.map(line => {
          // Clean up bullets, numbers, etc.
          return line.replace(/^[\d\.\-\*\s]+/, '').trim();
        });
      } else {
        // Use the content as is, split into sentences
        insights = content
          .split('.')
          .map(s => s.trim())
          .filter(s => s.length > 10);
      }
    }
    
    // Ensure we have insights and they're strings
    insights = (insights || ['No clear insights could be extracted'])
      .filter(Boolean)
      .map(insight => String(insight));
    
    // Save to memory_analysis_results
    const { error: insertError } = await supabaseClient
      .from('memory_analysis_results')
      .insert({
        category,
        source_count: memories.length,
        insights: { results: insights }
      });
    
    if (insertError) {
      console.error('Error saving analysis results:', insertError);
    }
    
    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing memory patterns:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
