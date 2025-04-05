
/**
 * Type definitions for database maintenance operations
 */

/**
 * Type of maintenance action to perform
 */
export type MaintenanceAction = 'vacuum' | 'analyze' | 'reindex';

/**
 * Input parameters for database maintenance
 */
export interface MaintenanceParams {
  action: MaintenanceAction;
  tables?: string[];
}

/**
 * Table processing result
 */
export interface TableResult {
  table: string;
  error?: string;
}

/**
 * Results of a maintenance operation
 */
export interface MaintenanceResults {
  success: boolean;
  message: string;
  success_tables?: string[];
  failed_tables?: TableResult[];
  table_stats?: any[];
  requested_tables?: string[];
  valid_tables_found?: string[];
}
