
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
 * Threshold for auto vacuum recommendation (20% dead rows)
 */
const AUTO_VACUUM_THRESHOLD = 20;

/**
 * Maximum allowed percentage to display for dead row ratio
 * to prevent unreasonably high percentages on small tables
 */
const MAX_DISPLAY_PERCENTAGE = 100;

/**
 * Minimum time between auto vacuum recommendations (24 hours)
 */
const MIN_RECOMMENDATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
 * Normalize dead row ratio to a reasonable percentage
 * Prevents extremely high values in tables with few rows
 */
function normalizeDeadRowRatio(ratio: number): number {
  // For tables with few rows, PostgreSQL can report very high dead row ratios
  // This caps the display value to a reasonable percentage
  return Math.min(ratio, MAX_DISPLAY_PERCENTAGE);
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
    
    // Process and normalize the received statistics 
    const processedStats = {
      ...data,
      table_stats: data.table_stats.map((table: any) => {
        // Normalize the dead row ratio to a reasonable percentage
        return {
          ...table,
          dead_row_ratio: normalizeDeadRowRatio(table.dead_row_ratio)
        };
      })
    };
    
    // Update our in-memory state with fresh data
    for (const table of processedStats.table_stats) {
      const tableName = table.table;
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
    
    // Notify all components that have subscribed to refresh events
    notifyDbRefreshListeners(processedStats);
    
    // Show success toast if requested
    if (showToast) {
      toast.success("Database statistics refreshed", {
        description: `Updated stats for ${processedStats.table_stats.length} tables`
      });
    }
    
    // Check for tables needing maintenance
    checkMaintenanceNeeds(processedStats);
    
    return processedStats;
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
      const lastVacuumed = tableState?.lastVacuumed;
      if (!lastVacuumed || (now.getTime() - lastVacuumed.getTime() > MIN_RECOMMENDATION_INTERVAL)) {
        tablesNeedingMaintenance.push({
          name: tableName,
          deadRowRatio: deadRowRatio
        });
      }
    }
  }

  // Show toast notification if tables need maintenance
  if (tablesNeedingMaintenance.length > 0) {
    const tableList = tablesNeedingMaintenance
      .slice(0, 3)
      .map(t => `${t.name} (${t.deadRowRatio.toFixed(1)}%)`)
      .join(', ');
    
    const additionalTables = tablesNeedingMaintenance.length > 3 
      ? `and ${tablesNeedingMaintenance.length - 3} more` 
      : '';
    
    toast.warning("Database maintenance recommended", {
      description: `Tables with high dead rows: ${tableList} ${additionalTables}`,
      duration: 8000,
      action: {
        label: "View",
        onClick: () => {
          // Navigate to database tab - we could implement this if we had a router
          window.location.href = '/admin/audit-and-monitoring?tab=database';
        }
      }
    });
  }
}

/**
 * Check database performance and recommend maintenance if needed
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
    normalizedPercentage: number;
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
        const normalizedPercentage = normalizeDeadRowRatio(actualPercentage);
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
          normalizedPercentage,
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
 */
export function initDatabaseHealthMonitoring(): void {
  // Check immediately on app start
  setTimeout(() => {
    checkDatabaseHealth();
  }, 10000); // 10 second delay on startup
  
  // Then check periodically
  setInterval(() => {
    checkDatabaseHealth();
  }, 4 * 60 * 60 * 1000); // Every 4 hours
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

export default {
  checkDatabaseHealth,
  recordTableVacuumed,
  initDatabaseHealthMonitoring,
  vacuumTable,
  verifyDeadRowPercentages,
  refreshDatabaseStatistics,
  subscribeToDbRefresh
};
