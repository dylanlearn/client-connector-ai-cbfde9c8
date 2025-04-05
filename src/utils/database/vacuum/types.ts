
/**
 * Constants and types used by the vacuum service
 */

// Threshold percentage of dead rows to trigger auto vacuum recommendation
export const AUTO_VACUUM_THRESHOLD = 20;

// Minimum time (milliseconds) between vacuum recommendations for the same table
export const MIN_RECOMMENDATION_INTERVAL = 60 * 60 * 1000; // 1 hour

export interface VacuumOptions {
  full?: boolean;
  analyze?: boolean;
  freeze?: boolean;
}

export interface VacuumResult {
  success: boolean;
  message: string;
  details?: any;
}
