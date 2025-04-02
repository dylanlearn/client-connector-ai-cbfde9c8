
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
    
    // Create interaction tracking RPC functions
    const setupFunctions = async () => {
      // Create track_interaction function
      await supabase.rpc('stored_procedure', {
        sql: `
          CREATE OR REPLACE FUNCTION track_interaction(
            p_user_id UUID,
            p_event_type TEXT,
            p_page_url TEXT,
            p_x_position INT,
            p_y_position INT,
            p_element_selector TEXT DEFAULT '',
            p_session_id TEXT DEFAULT '',
            p_metadata JSONB DEFAULT '{}'
          )
          RETURNS VOID
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            INSERT INTO interaction_events (
              user_id,
              event_type,
              page_url,
              x_position,
              y_position,
              element_selector,
              session_id,
              metadata
            ) VALUES (
              p_user_id,
              p_event_type,
              p_page_url,
              p_x_position,
              p_y_position,
              p_element_selector,
              p_session_id,
              p_metadata
            );
          END;
          $$;
        `
      });
      
      // Create get_interaction_events function
      await supabase.rpc('stored_procedure', {
        sql: `
          CREATE OR REPLACE FUNCTION get_interaction_events(
            p_user_id UUID,
            p_event_type TEXT DEFAULT NULL,
            p_page_url TEXT DEFAULT NULL,
            p_limit INT DEFAULT 100
          )
          RETURNS SETOF interaction_events
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            query_text TEXT;
          BEGIN
            query_text := 'SELECT * FROM interaction_events WHERE user_id = ''' || p_user_id || '''';
            
            IF p_event_type IS NOT NULL THEN
              query_text := query_text || ' AND event_type = ''' || p_event_type || '''';
            END IF;
            
            IF p_page_url IS NOT NULL THEN
              query_text := query_text || ' AND page_url = ''' || p_page_url || '''';
            END IF;
            
            query_text := query_text || ' ORDER BY timestamp DESC LIMIT ' || p_limit;
            
            RETURN QUERY EXECUTE query_text;
          END;
          $$;
        `
      });
    };
    
    await setupFunctions();
    
    return new Response(
      JSON.stringify({ success: true, message: "Interaction tracking functions created successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating functions:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
