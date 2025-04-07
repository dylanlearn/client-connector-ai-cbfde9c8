
import { refreshDatabaseStatistics } from "./statistics-service";
import { checkPgStatStatementsEnabled } from "../monitoring/query-stats";

/**
 * Initialize database health monitoring with a focus on profile queries
 */
export async function initDatabaseHealthMonitoring(): Promise<void> {
  try {
    // Check if pg_stat_statements extension is enabled
    const isExtensionEnabled = await checkPgStatStatementsEnabled();
    
    if (!isExtensionEnabled) {
      console.warn("pg_stat_statements extension appears to be disabled. Profile query monitoring will not work correctly.");
    }
    
    // Perform initial database statistics refresh
    await refreshDatabaseStatistics(false);
    
    // Schedule regular refreshes
    setInterval(async () => {
      await refreshDatabaseStatistics(false);
    }, 30 * 60 * 1000); // Every 30 minutes
    
  } catch (error) {
    console.error("Error initializing database health monitoring:", error);
  }
}
