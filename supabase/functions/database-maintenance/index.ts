
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { corsHeaders } from "./cors-headers.ts";
import { MaintenanceAction, MaintenanceParams, TableResult } from "./types.ts";
import { 
  executeVacuum, 
  executeAnalyze, 
  executeReindex, 
  validateTables,
  getTableStatistics,
  logMaintenanceOperation
} from "./table-operations.ts";

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
    const { action, tables } = await req.json() as MaintenanceParams;
    
    console.log(`Requested action: ${action}, tables:`, tables);
    
    if (!action) {
      throw new Error('Missing required parameter: action');
    }
    
    // Validate input
    if (!tables || tables.length === 0) {
      throw new Error('No tables specified for maintenance operation');
    }
    
    // Validate tables exist in the database
    const validTablesToProcess = await validateTables(supabaseClient, tables);
    console.log('Tables to process:', tables);
    console.log('Valid tables found:', validTablesToProcess);
    
    if (validTablesToProcess.length === 0) {
      throw new Error(`None of the specified tables exist in the public schema: ${tables.join(', ')}`);
    }
    
    const results: string[] = [];
    const failedTables: TableResult[] = [];
    
    // Process each valid table
    for (const table of validTablesToProcess) {
      console.log(`Processing ${action} on table ${table}`);
      
      try {
        let success = false;
        
        switch (action) {
          case 'vacuum':
            success = await executeVacuum(supabaseClient, table);
            break;
            
          case 'analyze':
            success = await executeAnalyze(supabaseClient, table);
            break;
            
          case 'reindex':
            success = await executeReindex(supabaseClient, table);
            break;
            
          default:
            throw new Error(`Unsupported action: ${action}`);
        }
        
        if (success) {
          results.push(table);
        } else {
          failedTables.push({ table, error: "Operation failed" });
        }
      } catch (error) {
        console.error(`Error executing ${action} on table ${table}:`, error);
        failedTables.push({ 
          table, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }
    
    // Get updated table statistics
    const tableStats = await getTableStatistics(supabaseClient);
    
    // Log the maintenance operation
    await logMaintenanceOperation(
      supabaseClient,
      action,
      results,
      failedTables,
      tables
    );
    
    // Return full information including any failures
    return new Response(
      JSON.stringify({
        success: results.length > 0,
        message: `${action.toUpperCase()} operation results`,
        success_tables: results,
        failed_tables: failedTables,
        table_stats: tableStats,
        requested_tables: tables,
        valid_tables_found: validTablesToProcess
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
