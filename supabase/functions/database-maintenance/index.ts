
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
    
    // First, get a list of all public tables to check against
    const { data: allTables, error: tablesError } = await supabaseClient
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error fetching tables list:', tablesError);
      throw new Error(`Failed to get tables list: ${tablesError.message}`);
    }
    
    // Create a set of valid table names for quick lookup
    const validTableNames = new Set(allTables.map(t => t.tablename));
    console.log('Valid tables in database:', Array.from(validTableNames));
    
    for (const table of tablesToProcess) {
      console.log(`Processing ${action} on table ${table}`);
      let success = false;
      
      // Check if table exists in the valid tables list
      if (!validTableNames.has(table)) {
        console.error(`Table ${table} does not exist in public schema`);
        failedTables.push({ table, error: 'Table does not exist in public schema' });
        continue;
      }
      
      try {
        switch (action) {
          case 'vacuum':
            // Direct SQL execution for VACUUM
            const vacuumQuery = `
              DO $$
              BEGIN
                EXECUTE 'VACUUM ANALYZE public."${table}"';
                RAISE NOTICE 'VACUUM completed on table %', '${table}';
              EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error during VACUUM: %', SQLERRM;
              END
              $$;
            `;
            
            console.log("Executing VACUUM query:", vacuumQuery);
            
            const { error: vacuumError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: vacuumQuery 
            });
            
            if (vacuumError) {
              console.error(`Error during VACUUM on table ${table}:`, vacuumError);
              failedTables.push({ table, error: vacuumError.message });
              continue;
            }
            
            console.log(`VACUUM completed successfully on table ${table}`);
            success = true;
            break;
            
          case 'analyze':
            // Direct SQL execution for ANALYZE
            const analyzeQuery = `
              DO $$
              BEGIN
                EXECUTE 'ANALYZE public."${table}"';
                RAISE NOTICE 'ANALYZE completed on table %', '${table}';
              EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error during ANALYZE: %', SQLERRM;
              END
              $$;
            `;
            
            console.log("Executing ANALYZE query:", analyzeQuery);
            
            const { error: analyzeError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: analyzeQuery 
            });
            
            if (analyzeError) {
              console.error(`Error during ANALYZE on table ${table}:`, analyzeError);
              failedTables.push({ table, error: analyzeError.message });
              continue;
            }
            
            console.log(`ANALYZE completed successfully on table ${table}`);
            success = true;
            break;
            
          case 'reindex':
            // Direct SQL execution for REINDEX
            const reindexQuery = `
              DO $$
              BEGIN
                EXECUTE 'REINDEX TABLE public."${table}"';
                RAISE NOTICE 'REINDEX completed on table %', '${table}';
              EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error during REINDEX: %', SQLERRM;
              END
              $$;
            `;
            
            console.log("Executing REINDEX query:", reindexQuery);
            
            const { error: reindexError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: reindexQuery 
            });
            
            if (reindexError) {
              console.error(`Error during REINDEX on table ${table}:`, reindexError);
              failedTables.push({ table, error: reindexError.message });
              continue;
            }
            
            console.log(`REINDEX completed successfully on table ${table}`);
            success = true;
            break;
            
          default:
            throw new Error(`Unsupported action: ${action}`);
        }
      } catch (error) {
        console.error(`Error executing ${action} on table ${table}:`, error);
        failedTables.push({ table, error: error.message });
        continue;
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
