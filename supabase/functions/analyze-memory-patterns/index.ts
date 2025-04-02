
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { category, limit = 100 } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch memories for analysis
    const { data: memories, error } = await supabase
      .from("global_memories")
      .select("*")
      .eq("category", category)
      .order("relevance_score", { ascending: false })
      .order("frequency", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching memories: ${error.message}`);
    }

    // If no memories found, return a default response
    if (!memories || memories.length === 0) {
      return new Response(
        JSON.stringify({
          insights: ["Not enough data to extract insights"],
          sourceCount: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Generate insights from memories
    // In a real implementation, this would likely call a more sophisticated
    // AI service like OpenAI to analyze patterns
    const insights = analyzeMemoriesForInsights(memories, category);
    
    // Store analysis results
    const { error: insertError } = await supabase
      .from("memory_analysis_results")
      .insert({
        category,
        insights: { results: insights },
        source_count: memories.length,
      });

    if (insertError) {
      console.error("Error storing analysis results:", insertError);
      // Continue anyway, as we still want to return insights
    }

    return new Response(
      JSON.stringify({
        insights,
        sourceCount: memories.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in analyze-memory-patterns function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        insights: ["Error analyzing memory patterns"],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

/**
 * Analyze memories to extract insights
 * This is a simplified version that could be replaced with a more sophisticated AI analysis
 */
function analyzeMemoriesForInsights(memories: any[], category: string): string[] {
  // Count common patterns in memory content
  const contentPatterns: Record<string, number> = {};
  
  // Extract key phrases and count occurrences
  memories.forEach(memory => {
    const content = memory.content.toLowerCase();
    
    // Simple keyword extraction (in real implementation, use NLP)
    const keyPhrases = extractKeyPhrases(content);
    
    keyPhrases.forEach(phrase => {
      contentPatterns[phrase] = (contentPatterns[phrase] || 0) + 1;
    });
  });
  
  // Generate insights based on category
  let insights: string[] = [];
  const sortedPatterns = Object.entries(contentPatterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => key);
  
  switch (category) {
    case "tone_preference":
      insights = [
        `Users generally prefer ${sortedPatterns[0] || 'formal'} communication tone`,
        `${sortedPatterns[1] || 'Professional'} tone is often highly rated`,
        `Content with ${sortedPatterns[2] || 'clear'} tone gets better feedback`
      ];
      break;
    case "layout_preference":
      insights = [
        `${sortedPatterns[0] || 'Clean'} layouts are consistently preferred`,
        `Designs with ${sortedPatterns[1] || 'minimal'} elements perform better`,
        `${sortedPatterns[2] || 'Structured'} navigation improves user experience`
      ];
      break;
    case "color_preference":
      insights = [
        `${sortedPatterns[0] || 'Blue-based'} color schemes are popular`,
        `${sortedPatterns[1] || 'High contrast'} palettes improve readability`,
        `${sortedPatterns[2] || 'Consistent'} color themes are preferred across sections`
      ];
      break;
    case "client_feedback":
      insights = [
        `Clients frequently mention "${sortedPatterns[0] || 'clarity'}" in positive feedback`,
        `"${sortedPatterns[1] || 'Responsiveness'}" is a common point in feedback`,
        `Improvement opportunities often relate to "${sortedPatterns[2] || 'speed'}" aspects`
      ];
      break;
    default:
      insights = [
        `Common pattern observed: ${sortedPatterns[0] || 'user engagement'}`,
        `Frequently occurring theme: ${sortedPatterns[1] || 'simplicity'}`,
        `Notable trend: ${sortedPatterns[2] || 'personalization'} is important`
      ];
  }
  
  return insights;
}

/**
 * Extract key phrases from content
 * This is a simplistic implementation that would be replaced with proper NLP in production
 */
function extractKeyPhrases(content: string): string[] {
  // Simple implementation that looks for common adjectives and nouns
  const commonPatterns = [
    "clean", "minimal", "modern", "professional", "friendly",
    "structured", "intuitive", "responsive", "fast", "elegant",
    "bold", "subtle", "balanced", "innovative", "traditional",
    "dark mode", "light theme", "high contrast", "accessible",
    "navigation", "layout", "design", "colors", "typography",
    "spacing", "alignment", "consistency", "clarity", "simplicity"
  ];
  
  return commonPatterns.filter(pattern => content.includes(pattern));
}
