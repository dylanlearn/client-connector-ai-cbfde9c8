
import { toast } from "sonner";
import { AUTO_VACUUM_THRESHOLD, MIN_RECOMMENDATION_INTERVAL, vacuumRecommendedTables } from "./vacuum-service";
import { getTableMaintenanceState } from "./maintenance-tracker";
import { DatabaseStatistics } from "./types";

/**
 * Check for tables needing maintenance and notify user when necessary
 * Uses reduced notification frequency to prevent spam
 */
export function checkMaintenanceNeeds(data: DatabaseStatistics | null) {
  // If no data provided, do nothing
  if (!data || !data.table_stats) return;
  
  const tableMaintenanceState = getTableMaintenanceState();
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
    const totalTablesNeeding = data.table_stats.filter(t => t.dead_row_ratio > AUTO_VACUUM_THRESHOLD).length;
    
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
            .filter(t => t.dead_row_ratio > AUTO_VACUUM_THRESHOLD)
            .map(t => t.table);
          
          vacuumRecommendedTables(allTablesNeedingMaintenance);
        }
      }
    });
  }
}
