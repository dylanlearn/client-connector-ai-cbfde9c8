
import { refreshDatabaseStatistics } from "./statistics-service";
import { checkMaintenanceNeeds } from "./notification-service";
import { vacuumRecommendedTables } from "./vacuum-service";

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
 * Initialize database health monitoring with periodic checks
 * and run initial cleanup if necessary
 */
export function initDatabaseHealthMonitoring(): void {
  // Check immediately on app start
  setTimeout(async () => {
    // First check database health
    await checkDatabaseHealth();
    
    // Then, automatically vacuum tables that need maintenance
    const data = await refreshDatabaseStatistics(false);
    if (data && data.table_stats) {
      const highDeadRowTables = data.table_stats
        .filter(table => table.dead_row_ratio > 20)
        .map(table => table.table);
      
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
