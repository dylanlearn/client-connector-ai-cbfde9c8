
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches profile query statistics correctly grouped and aggregated
 */
export const getProfileQueryStatistics = async () => {
  try {
    const { data, error } = await supabase.rpc('get_profile_query_stats');
    
    if (error) {
      console.error("Error fetching profile query stats:", error);
      return null;
    }
    
    // If no queries were found, provide a fallback with empty array but still valid timestamp
    if (!data || !data.queries || data.queries.length === 0) {
      return {
        timestamp: new Date().toISOString(),
        queries: []
      };
    }
    
    return data;
  } catch (error) {
    console.error("Exception in getProfileQueryStatistics:", error);
    return null;
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
    const { data, error } = await supabase
      .from('pg_extension')
      .select('*')
      .eq('extname', 'pg_stat_statements')
      .single();
    
    if (error) {
      console.error("Error checking pg_stat_statements extension:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking pg_stat_statements extension:", error);
    return false;
  }
};
