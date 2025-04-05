
/**
 * Database maintenance and monitoring related type definitions
 */

/**
 * Table maintenance state that tracks when tables were last maintained
 */
export interface TableMaintenanceState {
  [tableName: string]: {
    lastVacuumed: Date | null;
    lastAnalyzed: Date | null;
    lastReindexed: Date | null;
    deadRowRatio: number | null;
  };
}

/**
 * Type for database health statistics
 */
export interface DatabaseStatistics {
  table_stats: TableStatistics[];
  high_vacuum_tables?: string[];
  timestamp?: string;
}

/**
 * Type for individual table statistics
 */
export interface TableStatistics {
  table: string;
  live_rows: number;
  dead_rows: number;
  dead_row_ratio: number;
  sequentialScans: number;
  indexScans: number;
}

/**
 * Type for database refresh event callback
 */
export type DatabaseRefreshListener = (stats: DatabaseStatistics) => void;

/**
 * Type for maintenance operation result
 */
export interface MaintenanceResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Type for dead row verification result
 */
export interface DeadRowVerificationResult {
  accurate: boolean;
  tableStats: Array<{
    table: string;
    uiPercentage?: number | null;
    actualPercentage: number;
    discrepancy?: number;
  }>;
}

/**
 * Database maintenance options
 */
export interface MaintenanceOptions {
  showToast?: boolean;
}
