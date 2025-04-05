
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DatabaseStatistics, DeadRowVerificationResult, MaintenanceOptions } from "./types";
import { notifyDbRefreshListeners } from "./event-bus";
import { getTableMaintenanceState, updateTableDeadRowRatio } from "./maintenance-tracker";

/**
 * Refresh database statistics and notify all listeners
 * This is the main entry point for coordinated refresh across the application
 */
export async function refreshDatabaseStatistics(showToast: boolean = false): Promise<DatabaseStatistics | null> {
  try {
    // Show a loading toast if requested
    const toastId = showToast ? 
      toast.loading("Refreshing database statistics...") : 
      undefined;
    
    // Get current database performance directly from PostgreSQL
    const { data, error } = await supabase.rpc('check_database_performance');

    // Clear the toast
    if (toastId) toast.dismiss(toastId);
    
    if (error) {
      console.error("Database refresh failed:", error);
      if (showToast) {
        toast.error("Refresh failed", { 
          description: error.message || "Could not retrieve database statistics" 
        });
      }
      return null;
    }

    if (!data || !data.table_stats) {
      console.warn("No table statistics returned from database refresh");
      if (showToast) {
        toast.error("Refresh failed", { 
          description: "No statistics data received from database" 
        });
      }
      return null;
    }
    
    // Update our in-memory state with fresh data - use actual values
    for (const table of data.table_stats) {
      const tableName = table.table;
      // Use the actual dead row ratio from the database, no normalization
      const deadRowRatio = table.dead_row_ratio;
      
      // Update tracked state with accurate values from database
      updateTableDeadRowRatio(tableName, deadRowRatio);
    }
    
    // Store high vacuum tables for better tracking
    data.high_vacuum_tables = data.table_stats
      .filter((table: any) => table.dead_row_ratio > 20)
      .map((table: any) => table.table);
    
    // Notify all components that have subscribed to refresh events
    notifyDbRefreshListeners(data);
    
    // Show success toast if requested
    if (showToast) {
      toast.success("Database statistics refreshed", {
        description: `Updated stats for ${data.table_stats.length} tables`
      });
    }
    
    return data;
  } catch (error) {
    console.error("Error refreshing database statistics:", error);
    if (showToast) {
      toast.error("Refresh failed", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
    }
    return null;
  }
}

/**
 * Independently verify dead row percentages by directly querying pg_stat_user_tables
 * This provides a second source of truth to validate what's shown in the UI
 */
export async function verifyDeadRowPercentages(): Promise<DeadRowVerificationResult> {
  try {
    // Make a direct query to get the actual statistics from PostgreSQL
    const { data: pgStats, error: pgError } = await supabase.rpc('check_database_performance');
    
    if (pgError) {
      console.error("Error fetching actual database statistics:", pgError);
      throw pgError;
    }
    
    const tableMaintenanceState = getTableMaintenanceState();
    
    // Compare the stats from the database with what we have stored in memory
    const tableStats = [];
    let hasDiscrepancies = false;
    
    if (pgStats && pgStats.table_stats) {
      for (const tableStat of pgStats.table_stats) {
        const tableName = tableStat.table;
        const actualPercentage = tableStat.dead_row_ratio;
        const uiPercentage = tableMaintenanceState[tableName]?.deadRowRatio;
        
        // Calculate discrepancy if we have both values
        let discrepancy = null;
        if (uiPercentage !== null && uiPercentage !== undefined) {
          discrepancy = Math.abs(actualPercentage - uiPercentage);
          // If discrepancy is more than 1%, consider it significant
          if (discrepancy > 1) {
            hasDiscrepancies = true;
          }
        }
        
        tableStats.push({
          table: tableName,
          uiPercentage,
          actualPercentage,
          discrepancy
        });
      }
    }
    
    return {
      accurate: !hasDiscrepancies,
      tableStats
    };
  } catch (error) {
    console.error("Error verifying dead row percentages:", error);
    throw error;
  }
}
