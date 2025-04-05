
// Main entry point for database maintenance functionality

// Export types
export * from './types';

// Export utilities
export { subscribeToDbRefresh, notifyDbRefreshListeners } from './event-bus';
export { recordTableVacuumed, getTableMaintenanceState, wasRecentlyVacuumed, updateTableDeadRowRatio } from './maintenance-tracker';
export { refreshDatabaseStatistics, verifyDeadRowPercentages } from './statistics-service';
export { vacuumTable, cleanupFullDatabase, vacuumRecommendedTables } from './vacuum-service';
export { checkMaintenanceNeeds } from './notification-service';
export { checkDatabaseHealth, initDatabaseHealthMonitoring } from './health-monitor';
export { AUTO_VACUUM_THRESHOLD, MIN_RECOMMENDATION_INTERVAL } from './vacuum/types';
