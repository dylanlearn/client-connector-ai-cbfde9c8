
import { refreshDatabaseStatistics } from "./statistics-service";
import { checkPgStatStatementsEnabled } from "../monitoring/query-stats";
import { toast } from "sonner";

/**
 * Initialize database health monitoring with a focus on profile queries
 */
export async function initDatabaseHealthMonitoring(): Promise<void> {
  try {
    console.log("Initializing database health monitoring...");
    
    // Check if pg_stat_statements extension is enabled
    const isExtensionEnabled = await checkPgStatStatementsEnabled();
    
    if (isExtensionEnabled) {
      console.log("pg_stat_statements extension is enabled and working correctly");
    } else {
      console.warn("pg_stat_statements extension appears to be disabled. Profile query monitoring will not work correctly.");
      // We don't show a toast here since the user might be on a page where this isn't relevant
    }
    
    // Perform initial database statistics refresh
    await refreshDatabaseStatistics(false);
    
    // Schedule regular refreshes
    setInterval(async () => {
      await refreshDatabaseStatistics(false);
    }, 30 * 60 * 1000); // Every 30 minutes
    
    console.log("Database health monitoring initialized successfully");
  } catch (error) {
    console.error("Error initializing database health monitoring:", error);
  }
}

/**
 * Force a check of the pg_stat_statements extension status
 * Useful for manually verifying if the extension is working
 */
export async function checkPgStatStatementsStatus(): Promise<boolean> {
  try {
    const isEnabled = await checkPgStatStatementsEnabled();
    
    if (isEnabled) {
      toast.success("Extension check completed successfully", {
        description: "The pg_stat_statements extension is properly configured and accessible."
      });
    } else {
      toast.error("Extension not available", { 
        description: "The pg_stat_statements extension is not properly configured or accessible."
      });
    }
    
    return isEnabled;
  } catch (error) {
    console.error("Error checking pg_stat_statements status:", error);
    toast.error("Extension check failed", {
      description: "An error occurred while checking the extension status."
    });
    return false;
  }
}
