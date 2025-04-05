
import { TableMaintenanceState } from './types';

// Store table maintenance state
const tableMaintenanceState: TableMaintenanceState = {};

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
 * Get the current maintenance state for all tables
 */
export function getTableMaintenanceState(): TableMaintenanceState {
  return tableMaintenanceState;
}

/**
 * Update dead row ratio for a table
 */
export function updateTableDeadRowRatio(tableName: string, deadRowRatio: number): void {
  if (!tableMaintenanceState[tableName]) {
    tableMaintenanceState[tableName] = {
      lastVacuumed: null,
      lastAnalyzed: null,
      lastReindexed: null,
      deadRowRatio: null
    };
  }
  
  tableMaintenanceState[tableName].deadRowRatio = deadRowRatio;
}
