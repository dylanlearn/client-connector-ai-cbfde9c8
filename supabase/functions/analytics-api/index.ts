
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Handler imports
import { handleDesignPatterns } from "./design-patterns-handler.ts";
import { handleFeedbackAnalysis } from "./feedback-analysis-handler.ts";
import { handleInteractionPatterns } from "./interaction-patterns-handler.ts";
import { handleMemoryPatterns } from "./memory-patterns-handler.ts";

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
    const { action, ...payload } = await req.json();
    
    // Initialize Supabase client using environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Route to the appropriate handler based on action
    let result;
    
    switch (action) {
      case 'analyze_design_patterns':
        result = await handleDesignPatterns(req, payload, supabase);
        break;
        
      case 'analyze_feedback':
        result = await handleFeedbackAnalysis(req, payload, supabase);
        break;
        
      case 'analyze_interaction_patterns':
        result = await handleInteractionPatterns(req, payload, supabase);
        break;
        
      case 'analyze_memory_patterns':
        result = await handleMemoryPatterns(req, payload, supabase);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error in analytics-api:`, error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
