
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type MaintenanceAction = 'vacuum' | 'analyze' | 'reindex';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Parse the request body
    const { action, tables } = await req.json() as { 
      action: MaintenanceAction;
      tables?: string[];
    };
    
    if (!action) {
      throw new Error('Missing required parameter: action');
    }
    
    // Default to specific tables for safety, never run on all tables automatically
    const tablesToProcess = tables || ['profiles'];
    const results = [];
    
    for (const table of tablesToProcess) {
      console.log(`Processing ${action} on table ${table}`);
      let query;
      let success = false;
      
      switch (action) {
        case 'vacuum':
          try {
            // Direct SQL execution for VACUUM since it can't run in a transaction
            // Using pg_catalog.pg_stat_get_live_tuples to ensure the table exists
            query = `
              DO $$
              BEGIN
                IF EXISTS (
                  SELECT 1 FROM information_schema.tables 
                  WHERE table_schema = 'public' AND table_name = '${table}'
                ) THEN
                  EXECUTE 'VACUUM ANALYZE public."${table}"';
                END IF;
              END
              $$;
            `;
            
            const { error: execError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: query 
            });
            
            if (execError) {
              console.error(`Error during VACUUM on table ${table}:`, execError);
              throw new Error(`Error vacuuming table ${table}: ${execError.message}`);
            }
            
            success = true;
          } catch (error) {
            console.error(`Error executing VACUUM on table ${table}:`, error);
            throw new Error(`Failed to vacuum table ${table}: ${error.message}`);
          }
          break;
          
        case 'analyze':
          try {
            // Direct SQL execution for ANALYZE
            query = `
              DO $$
              BEGIN
                IF EXISTS (
                  SELECT 1 FROM information_schema.tables 
                  WHERE table_schema = 'public' AND table_name = '${table}'
                ) THEN
                  EXECUTE 'ANALYZE public."${table}"';
                END IF;
              END
              $$;
            `;
            
            const { error: analyzeError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: query 
            });
            
            if (analyzeError) {
              console.error(`Error during ANALYZE on table ${table}:`, analyzeError);
              throw new Error(`Error analyzing table ${table}: ${analyzeError.message}`);
            }
            
            success = true;
          } catch (error) {
            console.error(`Error executing ANALYZE on table ${table}:`, error);
            throw new Error(`Failed to analyze table ${table}: ${error.message}`);
          }
          break;
          
        case 'reindex':
          try {
            // Direct SQL execution for REINDEX
            query = `
              DO $$
              BEGIN
                IF EXISTS (
                  SELECT 1 FROM information_schema.tables 
                  WHERE table_schema = 'public' AND table_name = '${table}'
                ) THEN
                  EXECUTE 'REINDEX TABLE public."${table}"';
                END IF;
              END
              $$;
            `;
            
            const { error: reindexError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: query 
            });
            
            if (reindexError) {
              console.error(`Error during REINDEX on table ${table}:`, reindexError);
              throw new Error(`Error reindexing table ${table}: ${reindexError.message}`);
            }
            
            success = true;
          } catch (error) {
            console.error(`Error executing REINDEX on table ${table}:`, error);
            throw new Error(`Failed to reindex table ${table}: ${error.message}`);
          }
          break;
          
        default:
          throw new Error(`Unsupported action: ${action}`);
      }
      
      if (success) {
        results.push(table);
      }
    }
    
    // Log the maintenance operation
    await supabaseClient
      .from('system_monitoring')
      .insert({
        event_type: 'database_maintenance',
        component: 'database',
        status: 'normal',
        message: `${action.toUpperCase()} completed on tables: ${results.join(', ')}`,
        metadata: { tables: results, action }
      });
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `${action.toUpperCase()} completed successfully`,
        tables: results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error during database maintenance:`, error);
    
    // Try to log the error
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      await supabaseClient
        .from('system_monitoring')
        .insert({
          event_type: 'database_maintenance_error',
          component: 'database',
          status: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
    } catch (logError) {
      console.error('Failed to log maintenance error:', logError);
    }
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
