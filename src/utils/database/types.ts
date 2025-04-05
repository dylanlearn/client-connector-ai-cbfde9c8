
/**
 * Basic response format for maintenance operations
 */
export interface MaintenanceResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Statistics for a single database table
 */
export interface TableStatistics {
  table: string;
  live_rows: number;
  dead_rows: number;
  dead_row_ratio: number;
  last_vacuum: string | null;
  last_analyze: string | null;
  table_size: string;
}

/**
 * Complete database statistics response
 */
export interface DatabaseStatistics {
  timestamp: string;
  table_stats: TableStatistics[];
  high_vacuum_tables?: string[];
  database_size?: string;
  total_tables?: number;
}

/**
 * Result of verifying dead row percentages
 */
export interface DeadRowVerificationResult {
  accurate: boolean;
  tableStats: {
    table: string;
    actualPercentage: number;
    uiPercentage?: number;
    discrepancy?: number | null;
  }[];
}

/**
 * Database maintenance options
 */
export interface MaintenanceOptions {
  tables?: string[];
  action: 'vacuum' | 'analyze' | 'reindex';
  full?: boolean;
}
