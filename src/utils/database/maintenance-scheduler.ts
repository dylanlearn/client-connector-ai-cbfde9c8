
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
 * Minimum time between auto vacuum recommendations (24 hours)
 */
const MIN_RECOMMENDATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check database performance and recommend maintenance if needed
 */
export async function checkDatabaseHealth(showToasts: boolean = true): Promise<boolean> {
  try {
    // Get current database performance
    const { data, error } = await supabase.rpc('check_database_performance');

    if (error) {
      console.error("Database health check failed:", error);
      return false;
    }

    if (!data || !data.table_stats) {
      console.warn("No table statistics returned from database health check");
      return false;
    }

    const tablesNeedingMaintenance = [];
    const now = new Date();

    // Check each table for maintenance needs
    for (const table of data.table_stats) {
      const tableName = table.table;
      const deadRowRatio = table.dead_row_ratio;
      
      // Get or initialize maintenance state for this table
      const tableState = tableMaintenanceState[tableName] || {
        lastVacuumed: null,
        lastAnalyzed: null,
        lastReindexed: null,
        deadRowRatio: null
      };
      
      // Update tracked state
      tableState.deadRowRatio = deadRowRatio;
      tableMaintenanceState[tableName] = tableState;
      
      // Check if this table exceeds the vacuum threshold
      if (deadRowRatio > AUTO_VACUUM_THRESHOLD) {
        // Only recommend vacuum if it hasn't been vacuumed recently
        const lastVacuumed = tableState.lastVacuumed;
        if (!lastVacuumed || (now.getTime() - lastVacuumed.getTime() > MIN_RECOMMENDATION_INTERVAL)) {
          tablesNeedingMaintenance.push({
            name: tableName,
            deadRowRatio: deadRowRatio
          });
        }
      }
    }

    // Show toast notification if tables need maintenance
    if (showToasts && tablesNeedingMaintenance.length > 0) {
      const tableList = tablesNeedingMaintenance
        .slice(0, 3)
        .map(t => `${t.name} (${t.deadRowRatio.toFixed(1)}%)`)
        .join(', ');
      
      const additionalTables = tablesNeedingMaintenance.length > 3 
        ? `and ${tablesNeedingMaintenance.length - 3} more` 
        : '';
      
      toast.warning("Database maintenance recommended", {
        description: `Tables with high dead row ratios: ${tableList} ${additionalTables}`,
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

    return true;
  } catch (error) {
    console.error("Error checking database health:", error);
    return false;
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
  vacuumTable
};
