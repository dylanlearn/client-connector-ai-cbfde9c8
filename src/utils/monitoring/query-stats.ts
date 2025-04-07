
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches profile query statistics correctly grouped and aggregated
 */
export const getProfileQueryStatistics = async () => {
  try {
    // First check if the extension is enabled
    const isEnabled = await checkPgStatStatementsEnabled();
    
    if (!isEnabled) {
      console.warn("pg_stat_statements extension is not detected as enabled");
      return {
        timestamp: new Date().toISOString(),
        extension_enabled: false,
        queries: []
      };
    }
    
    // If extension is enabled, try to get the stats
    const { data, error } = await supabase.rpc('get_profile_query_stats');
    
    if (error) {
      console.error("Error fetching profile query stats:", error);
      return {
        timestamp: new Date().toISOString(),
        extension_enabled: true,
        error: error.message,
        queries: []
      };
    }
    
    // If no queries were found, provide a fallback with empty array but still valid timestamp
    if (!data || !data.queries || data.queries.length === 0) {
      return {
        timestamp: new Date().toISOString(),
        extension_enabled: true,
        queries: []
      };
    }
    
    return data;
  } catch (error) {
    console.error("Exception in getProfileQueryStatistics:", error);
    return {
      timestamp: new Date().toISOString(),
      extension_enabled: false,
      error: error instanceof Error ? error.message : "Unknown error",
      queries: []
    };
  }
};

/**
 * Helper function to format query time in appropriate units
 */
export const formatQueryTime = (ms: number) => {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)} µs`;
  }
  return `${ms.toFixed(2)} ms`;
};

/**
 * Check if pg_stat_statements extension is enabled
 * This helps diagnose when the extension isn't collecting data
 */
export const checkPgStatStatementsEnabled = async (): Promise<boolean> => {
  try {
    // First try using a simpler direct query to check if extension exists
    const { data: extensionData, error: extensionError } = await supabase.rpc(
      'get_profile_query_stats'
    );
    
    if (!extensionError && extensionData && extensionData.extension_enabled === true) {
      return true;
    }
    
    // If that doesn't work, try a more direct approach
    const { data, error } = await supabase
      .from('pg_extension')
      .select('*')
      .eq('extname', 'pg_stat_statements')
      .maybeSingle();
    
    if (error) {
      // If this errors, likely the pg_extension table isn't accessible, which is normal
      console.warn("Error checking pg_stat_statements with direct query:", error);
      
      // Try one more alternative approach
      const { data: funcData, error: funcError } = await supabase
        .rpc('check_database_performance');
      
      // If this function works, we'll assume the extension is available
      if (!funcError && funcData) {
        return true;
      }
      
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking pg_stat_statements extension:", error);
    return false;
  }
};
