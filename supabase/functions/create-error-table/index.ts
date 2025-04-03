
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 200 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create client_errors table if it doesn't exist
    const { error: tableError } = await supabase.rpc(
      "query_interaction_events",
      {
        query_text: `
          CREATE TABLE IF NOT EXISTS public.client_errors (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            error_message TEXT NOT NULL,
            error_stack TEXT,
            component_name TEXT,
            user_id UUID REFERENCES auth.users(id),
            browser_info TEXT,
            url TEXT,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
            resolved BOOLEAN DEFAULT false,
            resolution_notes TEXT
          );

          -- Add index for faster queries
          CREATE INDEX IF NOT EXISTS client_errors_timestamp_idx ON public.client_errors(timestamp);
          CREATE INDEX IF NOT EXISTS client_errors_user_id_idx ON public.client_errors(user_id);
        `
      }
    );

    if (tableError) {
      throw new Error(`Error creating table: ${tableError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Error monitoring table created successfully" }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers, status: 500 }
    );
  }
});
