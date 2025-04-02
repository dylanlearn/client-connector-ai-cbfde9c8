
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create SQL functions for interaction events
    const setupRpcFunctions = async () => {
      // Create query_interaction_events function
      await supabase.rpc('create_query_interaction_events_function', {});
      
      // Create insert_interaction_event function
      await supabase.rpc('create_insert_interaction_event_function', {});
      
      // Create get_interaction_events function
      await supabase.rpc('create_get_interaction_events_function', {});
      
      // Create track_interaction function
      await supabase.rpc('create_track_interaction_function', {});
    };
    
    await setupRpcFunctions();
    
    return new Response(
      JSON.stringify({ success: true, message: "RPC functions created successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating RPC functions:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
