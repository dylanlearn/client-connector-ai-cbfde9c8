
// In-memory state for maintenance tracking
interface TableMaintenanceState {
  lastVacuumed?: Date;
  deadRowRatio?: number;
}

// Global state to track table maintenance
const tableMaintenanceState: Record<string, TableMaintenanceState> = {};

/**
 * Record that a table has been vacuumed
 */
export function recordTableVacuumed(tableName: string): void {
  if (!tableMaintenanceState[tableName]) {
    tableMaintenanceState[tableName] = {};
  }
  tableMaintenanceState[tableName].lastVacuumed = new Date();
}

/**
 * Update the dead row ratio for a table
 */
export function updateTableDeadRowRatio(tableName: string, ratio: number): void {
  if (!tableMaintenanceState[tableName]) {
    tableMaintenanceState[tableName] = {};
  }
  tableMaintenanceState[tableName].deadRowRatio = ratio;
}

/**
 * Get the maintenance state for all tables
 */
export function getTableMaintenanceState(): Record<string, TableMaintenanceState> {
  return tableMaintenanceState;
}

/**
 * Check if a table was recently vacuumed
 * @param tableName - The name of the table
 * @param minutes - The number of minutes to consider "recent"
 */
export function wasRecentlyVacuumed(tableName: string, minutes: number = 10): boolean {
  const state = tableMaintenanceState[tableName];
  if (!state || !state.lastVacuumed) {
    return false;
  }
  
  const now = new Date();
  const minutesAgo = new Date(now.getTime() - (minutes * 60 * 1000));
  return state.lastVacuumed > minutesAgo;
}
