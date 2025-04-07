
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
