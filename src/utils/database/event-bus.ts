
import { DatabaseRefreshListener, DatabaseStatistics } from './types';

/**
 * Event bus for coordinating database health updates across components
 */
const databaseRefreshListeners: DatabaseRefreshListener[] = [];

/**
 * Subscribe to database refresh events
 */
export function subscribeToDbRefresh(callback: DatabaseRefreshListener): () => void {
  databaseRefreshListeners.push(callback);
  return () => {
    const index = databaseRefreshListeners.indexOf(callback);
    if (index > -1) {
      databaseRefreshListeners.splice(index, 1);
    }
  };
}

/**
 * Notify all subscribers of new database statistics
 */
export function notifyDbRefreshListeners(stats: DatabaseStatistics): void {
  for (const listener of databaseRefreshListeners) {
    listener(stats);
  }
}
