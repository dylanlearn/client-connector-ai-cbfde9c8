
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
    console.log("Database maintenance function triggered");
    
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
    
    console.log(`Requested action: ${action}, tables:`, tables);
    
    if (!action) {
      throw new Error('Missing required parameter: action');
    }
    
    // Default to specific tables for safety, never run on all tables automatically
    const tablesToProcess = tables || ['profiles'];
    const results = [];
    const failedTables = [];
    let tableStats = [];
    
    for (const table of tablesToProcess) {
      console.log(`Processing ${action} on table ${table}`);
      let query;
      let success = false;
      
      // First, verify the table exists to prevent SQL injection
      const { data: tableExists, error: tableCheckError } = await supabaseClient
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .eq('tablename', table)
        .maybeSingle();
      
      if (tableCheckError) {
        console.error(`Error checking if table ${table} exists:`, tableCheckError);
        failedTables.push({ table, error: 'Table check failed' });
        continue;
      }
      
      if (!tableExists) {
        console.error(`Table ${table} does not exist`);
        failedTables.push({ table, error: 'Table does not exist' });
        continue;
      }
      
      switch (action) {
        case 'vacuum':
          try {
            // Direct SQL execution for VACUUM since it can't run in a transaction
            // Using DO block for safety with dynamic table names
            query = `
              DO $$
              BEGIN
                EXECUTE 'VACUUM ANALYZE public."${table}"';
                RAISE NOTICE 'VACUUM completed on table %', '${table}';
              EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error during VACUUM: %', SQLERRM;
              END
              $$;
            `;
            
            console.log("Executing VACUUM query:", query);
            
            const { error: execError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: query 
            });
            
            if (execError) {
              console.error(`Error during VACUUM on table ${table}:`, execError);
              failedTables.push({ table, error: execError.message });
              throw new Error(`Error vacuuming table ${table}: ${execError.message}`);
            }
            
            console.log(`VACUUM completed successfully on table ${table}`);
            success = true;
          } catch (error) {
            console.error(`Error executing VACUUM on table ${table}:`, error);
            failedTables.push({ table, error: error.message });
            // Continue with other tables instead of throwing
          }
          break;
          
        case 'analyze':
          try {
            // Direct SQL execution for ANALYZE
            query = `
              DO $$
              BEGIN
                EXECUTE 'ANALYZE public."${table}"';
                RAISE NOTICE 'ANALYZE completed on table %', '${table}';
              EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error during ANALYZE: %', SQLERRM;
              END
              $$;
            `;
            
            console.log("Executing ANALYZE query:", query);
            
            const { error: analyzeError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: query 
            });
            
            if (analyzeError) {
              console.error(`Error during ANALYZE on table ${table}:`, analyzeError);
              failedTables.push({ table, error: analyzeError.message });
              throw new Error(`Error analyzing table ${table}: ${analyzeError.message}`);
            }
            
            console.log(`ANALYZE completed successfully on table ${table}`);
            success = true;
          } catch (error) {
            console.error(`Error executing ANALYZE on table ${table}:`, error);
            failedTables.push({ table, error: error.message });
            // Continue with other tables instead of throwing
          }
          break;
          
        case 'reindex':
          try {
            // Direct SQL execution for REINDEX
            query = `
              DO $$
              BEGIN
                EXECUTE 'REINDEX TABLE public."${table}"';
                RAISE NOTICE 'REINDEX completed on table %', '${table}';
              EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error during REINDEX: %', SQLERRM;
              END
              $$;
            `;
            
            console.log("Executing REINDEX query:", query);
            
            const { error: reindexError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: query 
            });
            
            if (reindexError) {
              console.error(`Error during REINDEX on table ${table}:`, reindexError);
              failedTables.push({ table, error: reindexError.message });
              throw new Error(`Error reindexing table ${table}: ${reindexError.message}`);
            }
            
            console.log(`REINDEX completed successfully on table ${table}`);
            success = true;
          } catch (error) {
            console.error(`Error executing REINDEX on table ${table}:`, error);
            failedTables.push({ table, error: error.message });
            // Continue with other tables instead of throwing
          }
          break;
          
        default:
          throw new Error(`Unsupported action: ${action}`);
      }
      
      if (success) {
        results.push(table);
      }
    }
    
    // After maintenance operations, get the current database performance stats
    console.log("Retrieving updated table statistics");
    try {
      const { data: performanceData, error: statsError } = await supabaseClient.rpc('check_database_performance');
      
      if (statsError) {
        console.error("Error fetching database performance stats:", statsError);
      } else if (performanceData) {
        console.log("Performance data retrieved:", performanceData);
        tableStats = performanceData.table_stats || [];
      }
    } catch (error) {
      console.error("Error retrieving database stats:", error);
    }
    
    // Log the maintenance operation
    try {
      await supabaseClient
        .from('system_monitoring')
        .insert({
          event_type: 'database_maintenance',
          component: 'database',
          status: failedTables.length > 0 ? 'warning' : 'normal',
          message: `${action.toUpperCase()} completed on tables: ${results.join(', ')}${failedTables.length > 0 ? '. Failed tables: ' + failedTables.map(ft => ft.table).join(', ') : ''}`,
          metadata: { 
            success_tables: results, 
            failed_tables: failedTables,
            action 
          }
        });
    } catch (logError) {
      console.error('Failed to log maintenance operation:', logError);
    }
    
    // Return full information including any failures
    return new Response(
      JSON.stringify({
        success: results.length > 0,
        message: `${action.toUpperCase()} operation results`,
        success_tables: results,
        failed_tables: failedTables,
        table_stats: tableStats
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
    
    // Return error response with 200 status to prevent function client from throwing
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Use 200 even for errors to ensure data comes back to client
      }
    );
  }
});
