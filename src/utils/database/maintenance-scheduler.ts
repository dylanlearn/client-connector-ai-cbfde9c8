
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Table maintenance state that tracks when tables were last maintained
 */
interface TableMaintenanceState {
  [tableName: string]: {
    lastVacuumed: Date | null;
    lastAnalyzed: Date | null;
    lastReindexed: Date | null;
    deadRowRatio: number | null;
  };
}

// Store table maintenance state
let tableMaintenanceState: TableMaintenanceState = {};

/**
 * Auto vacuum recommendation threshold (20% dead rows)
 * Tables with dead rows above this percentage will trigger recommendations
 */
const AUTO_VACUUM_THRESHOLD = 20;

/**
 * Minimum time between maintenance recommendations (6 hours)
 * This prevents spam notifications for the same tables
 */
const MIN_RECOMMENDATION_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Event bus for coordinating database health updates across components
 */
type DatabaseRefreshListener = (stats: any) => void;
const databaseRefreshListeners: DatabaseRefreshListener[] = [];

/**
 * Subscribe to database refresh events
 */
export function subscribeToDbRefresh(callback: DatabaseRefreshListener): () => void {
  databaseRefreshListeners.push(callback);
  return () => {
    const index = databaseRefreshListeners.indexOf(callback);
    if (index > -1) {
      databaseRefreshListeners.splice(index, 1);
    }
  };
}

/**
 * Notify all subscribers of new database statistics
 */
function notifyDbRefreshListeners(stats: any) {
  for (const listener of databaseRefreshListeners) {
    listener(stats);
  }
}

/**
 * Refresh database statistics and notify all listeners
 * This is the main entry point for coordinated refresh across the application
 */
export async function refreshDatabaseStatistics(showToast: boolean = false): Promise<any> {
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
      
      // Get or initialize maintenance state for this table
      const tableState = tableMaintenanceState[tableName] || {
        lastVacuumed: null,
        lastAnalyzed: null,
        lastReindexed: null,
        deadRowRatio: null
      };
      
      // Update tracked state with accurate values from database
      tableState.deadRowRatio = deadRowRatio;
      tableMaintenanceState[tableName] = tableState;
    }
    
    // Store high vacuum tables for better tracking
    data.high_vacuum_tables = data.table_stats
      .filter((table: any) => table.dead_row_ratio > AUTO_VACUUM_THRESHOLD)
      .map((table: any) => table.table);
    
    // Notify all components that have subscribed to refresh events
    notifyDbRefreshListeners(data);
    
    // Show success toast if requested
    if (showToast) {
      toast.success("Database statistics refreshed", {
        description: `Updated stats for ${data.table_stats.length} tables`
      });
    }
    
    // Check for tables needing maintenance - but with reduced notifications
    checkMaintenanceNeeds(data);
    
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
 * Private helper to check for tables needing maintenance
 * Reduces notification frequency to prevent spam
 */
function checkMaintenanceNeeds(data: any) {
  // If no data provided, do nothing
  if (!data || !data.table_stats) return;
  
  const tablesNeedingMaintenance = [];
  const now = new Date();

  // Check each table for maintenance needs
  for (const table of data.table_stats) {
    const tableName = table.table;
    const deadRowRatio = table.dead_row_ratio;
    
    // Get the maintenance state for this table
    const tableState = tableMaintenanceState[tableName];
    
    // Check if this table exceeds the vacuum threshold
    if (deadRowRatio > AUTO_VACUUM_THRESHOLD) {
      // Only recommend vacuum if it hasn't been vacuumed recently
      // and we haven't shown a notification recently
      const lastVacuumed = tableState?.lastVacuumed;
      if (!lastVacuumed || (now.getTime() - lastVacuumed.getTime() > MIN_RECOMMENDATION_INTERVAL)) {
        tablesNeedingMaintenance.push({
          name: tableName,
          deadRowRatio: deadRowRatio
        });
      }
    }
  }

  // Only show toast notification if there are tables needing maintenance
  // and we haven't already shown one for these tables recently
  if (tablesNeedingMaintenance.length > 0) {
    // Get a count of all tables with elevated dead rows for good context
    const totalTablesNeeding = data.table_stats.filter((t: any) => t.dead_row_ratio > AUTO_VACUUM_THRESHOLD).length;
    
    // Get the 3 tables with the highest dead row ratios to display
    const topTables = [...tablesNeedingMaintenance]
      .sort((a, b) => b.deadRowRatio - a.deadRowRatio)
      .slice(0, 3);
    
    const tableList = topTables
      .map(t => `${t.name} (${Math.round(t.deadRowRatio)}%)`)
      .join(', ');
    
    const additionalTables = totalTablesNeeding > 3 
      ? ` and ${totalTablesNeeding - 3} more` 
      : '';
    
    toast.warning("Database maintenance recommended", {
      description: `Tables with high dead rows: ${tableList}${additionalTables}`,
      duration: 8000,
      action: {
        label: "Clean Now",
        onClick: () => {
          // Automatically vacuum all tables that need maintenance
          const allTablesNeedingMaintenance = data.table_stats
            .filter((t: any) => t.dead_row_ratio > AUTO_VACUUM_THRESHOLD)
            .map((t: any) => t.table);
          
          vacuumRecommendedTables(allTablesNeedingMaintenance);
        }
      }
    });
  }
}

/**
 * Automatically vacuum tables that need maintenance
 */
async function vacuumRecommendedTables(tableNames: string[]): Promise<void> {
  if (!tableNames.length) return;
  
  toast.loading(`Cleaning ${tableNames.length} tables with high dead rows...`);
  
  try {
    // Call database-maintenance edge function to vacuum all tables in one go
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { 
        action: 'vacuum', 
        tables: tableNames 
      }
    });
    
    if (error) {
      console.error("Error vacuuming recommended tables:", error);
      toast.error("Failed to clean tables", {
        description: error.message
      });
      return;
    }
    
    const successCount = data?.success_tables?.length || 0;
    const failCount = data?.failed_tables?.length || 0;
    
    if (successCount > 0) {
      // Record each successfully vacuumed table
      if (data?.success_tables) {
        data.success_tables.forEach((tableName: string) => {
          recordTableVacuumed(tableName);
        });
      }
      
      // Show success message
      toast.success(`Database cleanup complete`, {
        description: `Successfully cleaned ${successCount} tables${failCount ? `, ${failCount} failed` : ''}`
      });
      
      // Refresh database statistics to show updated dead row counts
      await refreshDatabaseStatistics(false);
    } else {
      toast.error("Database cleanup failed", {
        description: "No tables were successfully cleaned"
      });
    }
  } catch (error) {
    console.error("Error during automatic vacuum:", error);
    toast.error("Database cleanup failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}

/**
 * Check database performance and recommend maintenance if needed
 * With reduced notification frequency
 */
export async function checkDatabaseHealth(showToasts: boolean = true): Promise<boolean> {
  try {
    // Use our central refresh function to update stats
    const data = await refreshDatabaseStatistics(false);
    return !!data;
  } catch (error) {
    console.error("Error checking database health:", error);
    return false;
  }
}

/**
 * Independently verify dead row percentages by directly querying pg_stat_user_tables
 * This provides a second source of truth to validate what's shown in the UI
 */
export async function verifyDeadRowPercentages(): Promise<{ 
  accurate: boolean; 
  tableStats: Array<{ 
    table: string; 
    uiPercentage?: number | null; 
    actualPercentage: number;
    discrepancy?: number;
  }>;
}> {
  try {
    // Make a direct query to get the actual statistics from PostgreSQL
    const { data: pgStats, error: pgError } = await supabase.rpc('check_database_performance');
    
    if (pgError) {
      console.error("Error fetching actual database statistics:", pgError);
      throw pgError;
    }
    
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

/**
 * Record that a table has been vacuumed
 */
export function recordTableVacuumed(tableName: string): void {
  if (!tableMaintenanceState[tableName]) {
    tableMaintenanceState[tableName] = {
      lastVacuumed: null,
      lastAnalyzed: null,
      lastReindexed: null,
      deadRowRatio: null
    };
  }
  
  tableMaintenanceState[tableName].lastVacuumed = new Date();
}

/**
 * Initialize database health monitoring with periodic checks
 * and run initial cleanup if necessary
 */
export function initDatabaseHealthMonitoring(): void {
  // Check immediately on app start
  setTimeout(async () => {
    // First check database health
    await checkDatabaseHealth();
    
    // Then, automatically vacuum tables that need maintenance
    const { data } = await supabase.rpc('check_database_performance');
    if (data && data.table_stats) {
      const highDeadRowTables = data.table_stats
        .filter((table: any) => table.dead_row_ratio > AUTO_VACUUM_THRESHOLD)
        .map((table: any) => table.table);
      
      if (highDeadRowTables.length > 0) {
        console.log(`Found ${highDeadRowTables.length} tables with high dead rows, performing automatic cleanup`);
        vacuumRecommendedTables(highDeadRowTables);
      }
    }
  }, 5000); // 5 second delay on startup for initial check
  
  // Then check periodically, but less frequently to reduce notification spam
  setInterval(() => {
    checkDatabaseHealth();
  }, 6 * 60 * 60 * 1000); // Every 6 hours
}

/**
 * Run vacuum on a specific table
 */
export async function vacuumTable(tableName: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log(`Running VACUUM on table: ${tableName}`);
    
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { action: 'vacuum', tables: [tableName] }
    });

    if (error) {
      console.error('Error vacuuming table:', error);
      throw error;
    }

    if (data?.failed_tables && data.failed_tables.length > 0) {
      throw new Error(`Failed to vacuum table ${tableName}: ${data.failed_tables[0]?.error || 'Unknown error'}`);
    }

    if (data?.success_tables && data.success_tables.includes(tableName)) {
      // Record successful vacuum
      recordTableVacuumed(tableName);
      
      // Refresh database statistics after vacuum
      await refreshDatabaseStatistics(false);
      
      return {
        success: true,
        message: `VACUUM completed successfully on table: ${tableName}`,
        details: data
      };
    } else {
      throw new Error(`VACUUM operation didn't report success for table ${tableName}`);
    }
  } catch (error) {
    console.error('Error vacuuming table:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Run full database cleanup (vacuum all tables)
 */
export async function cleanupFullDatabase(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Get the list of all tables first
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (tablesError) {
      console.error('Error fetching tables list:', tablesError);
      throw tablesError;
    }
    
    if (!tablesData || tablesData.length === 0) {
      return {
        success: false,
        message: 'No tables found in public schema'
      };
    }
    
    const allTables = tablesData.map(t => t.tablename);
    console.log(`Running VACUUM on all ${allTables.length} tables:`, allTables);
    
    toast.loading(`Cleaning all ${allTables.length} database tables...`);
    
    // Call the database-maintenance function to vacuum all tables
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { 
        action: 'vacuum', 
        tables: allTables 
      }
    });

    if (error) {
      console.error('Error running full database cleanup:', error);
      toast.error("Database cleanup failed", {
        description: error.message
      });
      throw error;
    }

    const successCount = data?.success_tables?.length || 0;
    const failCount = data?.failed_tables?.length || 0;
    
    // Record successfully vacuumed tables
    if (data?.success_tables) {
      data.success_tables.forEach((tableName: string) => {
        recordTableVacuumed(tableName);
      });
    }
    
    // Refresh database statistics after cleanup
    await refreshDatabaseStatistics(false);
    
    toast.success(`Database cleanup complete`, {
      description: `Successfully cleaned ${successCount} tables${failCount ? `, ${failCount} failed` : ''}`
    });
    
    return {
      success: successCount > 0,
      message: `VACUUM completed on ${successCount} tables, ${failCount} failed`,
      details: data
    };
  } catch (error) {
    console.error('Error running full database cleanup:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

export default {
  checkDatabaseHealth,
  recordTableVacuumed,
  initDatabaseHealthMonitoring,
  vacuumTable,
  verifyDeadRowPercentages,
  refreshDatabaseStatistics,
  subscribeToDbRefresh,
  cleanupFullDatabase
};
