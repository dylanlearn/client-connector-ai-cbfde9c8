
import { MaintenanceResult } from "../types";

/**
 * Auto vacuum recommendation threshold (20% dead rows)
 * Tables with dead rows above this percentage will trigger recommendations
 */
export const AUTO_VACUUM_THRESHOLD = 20;

/**
 * Minimum time between maintenance recommendations (10 minutes)
 * This prevents spam notifications for the same tables
 */
export const MIN_RECOMMENDATION_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
