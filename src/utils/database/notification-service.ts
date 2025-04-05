
import { toast } from "sonner";
import { getTableMaintenanceState, wasRecentlyVacuumed } from "./maintenance-tracker";
import { AUTO_VACUUM_THRESHOLD, MIN_RECOMMENDATION_INTERVAL } from "./vacuum/types";

/**
 * Check database tables for maintenance needs and notify the user if needed
 */
export function checkMaintenanceNeeds(tableStats: any[]): string[] {
  if (!tableStats || !tableStats.length) {
    return [];
  }

  const tableState = getTableMaintenanceState();
  const tablesNeedingMaintenance: string[] = [];
  
  // Find tables with high dead row ratios
  for (const table of tableStats) {
    const { table: tableName, dead_row_ratio } = table;
    
    // Check if the table has a high ratio of dead rows
    if (dead_row_ratio >= AUTO_VACUUM_THRESHOLD) {
      // Only recommend if we haven't recently vacuumed this table
      if (!wasRecentlyVacuumed(tableName, MIN_RECOMMENDATION_INTERVAL / 60000)) {
        tablesNeedingMaintenance.push(tableName);
      }
    }
  }
  
  // Show notification if tables need maintenance
  if (tablesNeedingMaintenance.length > 0) {
    const messageTitle = tablesNeedingMaintenance.length === 1
      ? "Database maintenance recommended"
      : `${tablesNeedingMaintenance.length} tables need maintenance`;
      
    const messageBody = tablesNeedingMaintenance.length === 1
      ? `Table ${tablesNeedingMaintenance[0]} has high dead row ratio`
      : `Tables with high dead rows: ${tablesNeedingMaintenance.join(', ')}`;
    
    toast.warning(messageTitle, {
      description: messageBody,
      duration: 10000
    });
  }
  
  return tablesNeedingMaintenance;
}
