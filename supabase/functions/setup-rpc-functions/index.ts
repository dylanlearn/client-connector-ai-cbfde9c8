
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
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
    // Create the necessary database functions for realtime support
    await createRealtimeSupportFunctions();
    
    // Enable realtime for profiles table
    await enableRealtimeForProfiles();
    
    return new Response(JSON.stringify({
      success: true,
      message: "Successfully set up realtime functions and enabled realtime for profiles"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in setup-rpc-functions:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function createRealtimeSupportFunctions() {
  // Create function to alter replica identity
  const alterReplicaFunctionSql = `
    CREATE OR REPLACE FUNCTION alter_table_replica_identity(table_name text, identity_type text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE 'ALTER TABLE ' || quote_ident(table_name) || ' REPLICA IDENTITY ' || identity_type;
    END;
    $$;
  `;

  // Create function to add table to publication
  const addToPublicationFunctionSql = `
    CREATE OR REPLACE FUNCTION add_table_to_publication(table_name text, publication_name text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE 'ALTER PUBLICATION ' || quote_ident(publication_name) || ' ADD TABLE ' || quote_ident(table_name);
    END;
    $$;
  `;

  // Execute the SQL to create functions
  const { error: alterFunctionError } = await supabase.rpc('exec_sql', { 
    sql: alterReplicaFunctionSql 
  });
  
  if (alterFunctionError) {
    console.error('Error creating alter_table_replica_identity function:', alterFunctionError);
    throw new Error(`Failed to create alter_table_replica_identity function: ${alterFunctionError.message}`);
  }
  
  const { error: addFunctionError } = await supabase.rpc('exec_sql', { 
    sql: addToPublicationFunctionSql 
  });
  
  if (addFunctionError) {
    console.error('Error creating add_table_to_publication function:', addFunctionError);
    throw new Error(`Failed to create add_table_to_publication function: ${addFunctionError.message}`);
  }
  
  console.log('Successfully created realtime support functions');
}

async function enableRealtimeForProfiles() {
  try {
    // Set REPLICA IDENTITY to FULL
    const { error: replicaError } = await supabase.rpc('exec_sql', { 
      sql: "ALTER TABLE profiles REPLICA IDENTITY FULL;" 
    });
    
    if (replicaError) {
      console.error('Error setting REPLICA IDENTITY for profiles:', replicaError);
      throw new Error(`Failed to set REPLICA IDENTITY: ${replicaError.message}`);
    }
    
    // Add to publication
    const { error: pubError } = await supabase.rpc('exec_sql', { 
      sql: "ALTER PUBLICATION supabase_realtime ADD TABLE profiles;" 
    });
    
    if (pubError) {
      console.error('Error adding profiles to publication:', pubError);
      throw new Error(`Failed to add to publication: ${pubError.message}`);
    }
    
    console.log('Successfully enabled realtime for profiles table');
  } catch (error) {
    console.error('Error enabling realtime for profiles:', error);
    throw error;
  }
}
