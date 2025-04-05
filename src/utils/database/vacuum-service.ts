
/**
 * Main entry point for vacuum service
 * Re-exports functionality from smaller modules
 */

// Core constants
export { AUTO_VACUUM_THRESHOLD, MIN_RECOMMENDATION_INTERVAL } from './vacuum/types';

// Core vacuum functions
export { vacuumTable } from './vacuum/vacuum-core';
export { cleanupFullDatabase } from './vacuum/full-database-vacuum';
export { vacuumRecommendedTables } from './vacuum/table-vacuum';
