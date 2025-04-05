
import { supabase } from "@/integrations/supabase/client";

/**
 * Analyzes profile query performance from pg_stat_statements
 */
export const analyzeProfileQueries = async () => {
  try {
    const { data, error } = await supabase.rpc('analyze_profile_queries');
    
    if (error) {
      console.error("Error analyzing profile queries:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception in analyzeProfileQueries:", error);
    return null;
  }
};

/**
 * Gets the current profile table statistics
 */
export const getProfileTableStats = async () => {
  try {
    const { data, error } = await supabase
      .from('pg_stat_user_tables')
      .select('*')
      .eq('relname', 'profiles')
      .single();
    
    if (error) {
      console.error("Error getting profile table statistics:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception in getProfileTableStats:", error);
    return null;
  }
};

/**
 * Monitor and log a warning if there are too many profile queries
 */
export const monitorProfileQueryRate = () => {
  // Store the last query count to track increases
  let lastQueryCount = 0;
  let lastCheckTime = Date.now();
  const MONITOR_INTERVAL = 60000; // Check every minute
  const WARNING_THRESHOLD = 100; // Warn if more than 100 queries per minute
  
  setInterval(async () => {
    const stats = await analyzeProfileQueries();
    if (!stats || !stats.queries) return;
    
    // Sum up the calls for all profile-related queries
    const totalCalls = stats.queries.reduce((sum, query) => sum + query.calls, 0);
    const timeElapsed = (Date.now() - lastCheckTime) / 1000; // seconds
    const queryRate = lastQueryCount > 0 ? (totalCalls - lastQueryCount) / timeElapsed : 0;
    
    if (queryRate > WARNING_THRESHOLD) {
      console.warn(`High profile query rate detected: ${queryRate.toFixed(2)} queries/second`);
      console.warn("Query details:", stats.queries.slice(0, 5)); // Show top 5 queries
    }
    
    lastQueryCount = totalCalls;
    lastCheckTime = Date.now();
  }, MONITOR_INTERVAL);
};

export default {
  analyzeProfileQueries,
  getProfileTableStats,
  monitorProfileQueryRate
};
