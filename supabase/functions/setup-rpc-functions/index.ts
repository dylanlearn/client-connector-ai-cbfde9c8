
// This edge function sets up necessary RPC functions for the application
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Setup RPC functions for realtime
    await setupRealtimeFunctions(supabase);
    
    // Setup functions for link expiration
    await setupLinkExpirationFunction(supabase);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error("Error setting up RPC functions:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});

async function setupRealtimeFunctions(supabase: any) {
  // Create function to set REPLICA IDENTITY
  await supabase.rpc(
    'stored_procedure',
    {
      sql: `
        CREATE OR REPLACE FUNCTION alter_table_replica_identity(table_name text, identity_type text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE format('ALTER TABLE %I REPLICA IDENTITY %s', table_name, identity_type);
        END;
        $$;
      `
    }
  );

  // Create function to add table to publication
  await supabase.rpc(
    'stored_procedure',
    {
      sql: `
        CREATE OR REPLACE FUNCTION add_table_to_publication(table_name text, publication_name text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE format('ALTER PUBLICATION %I ADD TABLE %I', publication_name, table_name);
        END;
        $$;
      `
    }
  );
}

async function setupLinkExpirationFunction(supabase: any) {
  // Create function to check for expired links
  await supabase.rpc(
    'stored_procedure',
    {
      sql: `
        CREATE OR REPLACE FUNCTION check_and_expire_client_links()
        RETURNS integer
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          expired_count integer;
        BEGIN
          UPDATE client_access_links
          SET status = 'expired'
          WHERE expires_at < NOW()
          AND status = 'active';
          
          GET DIAGNOSTICS expired_count = ROW_COUNT;
          RETURN expired_count;
        END;
        $$;
      `
    }
  );
}
