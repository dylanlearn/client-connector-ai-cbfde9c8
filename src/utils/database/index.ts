
// Main entry point for database maintenance functionality

// Export types
export * from './types';

// Export utilities
export { subscribeToDbRefresh } from './event-bus';
export { recordTableVacuumed, getTableMaintenanceState } from './maintenance-tracker';
export { refreshDatabaseStatistics, verifyDeadRowPercentages } from './statistics-service';
export { vacuumTable, cleanupFullDatabase, AUTO_VACUUM_THRESHOLD } from './vacuum-service';
export { checkMaintenanceNeeds } from './notification-service';
export { checkDatabaseHealth, initDatabaseHealthMonitoring } from './health-monitor';
