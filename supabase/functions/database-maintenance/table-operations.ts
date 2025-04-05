
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { TableResult } from "./types.ts";

/**
 * Execute vacuum operation on a database table
 */
export async function executeVacuum(
  supabaseClient: any, 
  table: string
): Promise<boolean> {
  const vacuumQuery = `
    DO $$
    BEGIN
      EXECUTE 'VACUUM ANALYZE public."${table}"';
      RAISE NOTICE 'VACUUM completed on table %', '${table}';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error during VACUUM: %', SQLERRM;
      RAISE;
    END
    $$;
  `;
  
  console.log("Executing VACUUM query:", vacuumQuery);
  
  const { error: vacuumError } = await supabaseClient.rpc('exec_sql', { 
    sql_query: vacuumQuery 
  });
  
  if (vacuumError) {
    console.error(`Error during VACUUM on table ${table}:`, vacuumError);
    return false;
  }
  
  console.log(`VACUUM completed successfully on table ${table}`);
  return true;
}

/**
 * Execute analyze operation on a database table
 */
export async function executeAnalyze(
  supabaseClient: any, 
  table: string
): Promise<boolean> {
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
    return false;
  }
  
  console.log(`ANALYZE completed successfully on table ${table}`);
  return true;
}

/**
 * Execute reindex operation on a database table
 */
export async function executeReindex(
  supabaseClient: any, 
  table: string
): Promise<boolean> {
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
    return false;
  }
  
  console.log(`REINDEX completed successfully on table ${table}`);
  return true;
}

/**
 * Validate that tables exist in the database
 */
export async function validateTables(
  supabaseClient: any, 
  tables: string[]
): Promise<string[]> {
  // Get a list of all public tables to check against
  const { data: allTables, error: tablesError } = await supabaseClient
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');
  
  if (tablesError) {
    console.error('Error fetching tables list:', tablesError);
    throw new Error(`Failed to get tables list: ${tablesError.message}`);
  }
  
  // Create a set of valid table names for quick lookup
  const validTableNames = new Set(allTables.map((t: any) => t.tablename));
  
  // Filter to only process valid tables
  return tables.filter(t => validTableNames.has(t));
}

/**
 * Get current table statistics from the database
 */
export async function getTableStatistics(supabaseClient: any): Promise<any[]> {
  try {
    const { data: performanceData, error: statsError } = await supabaseClient.rpc('check_database_performance');
    
    if (statsError) {
      console.error("Error fetching database performance stats:", statsError);
      return [];
    } 
    
    return performanceData?.table_stats || [];
  } catch (error) {
    console.error("Error retrieving database stats:", error);
    return [];
  }
}

/**
 * Log maintenance operation to system monitoring
 */
export async function logMaintenanceOperation(
  supabaseClient: any,
  action: string,
  results: string[],
  failedTables: TableResult[],
  requestedTables: string[]
): Promise<void> {
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
          action,
          requested_tables: requestedTables
        }
      });
  } catch (logError) {
    console.error('Failed to log maintenance operation:', logError);
  }
}
