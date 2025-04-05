
import { DatabaseStatistics } from "./types";

type RefreshListener = (stats: DatabaseStatistics) => void;

// Array to store all listener functions
const refreshListeners: RefreshListener[] = [];

/**
 * Subscribe to database refresh events
 * This allows components to be notified when database stats are refreshed
 */
export function subscribeToDbRefresh(callback: RefreshListener): () => void {
  refreshListeners.push(callback);
  
  // Return an unsubscribe function
  return () => {
    const index = refreshListeners.indexOf(callback);
    if (index !== -1) {
      refreshListeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners when database statistics are refreshed
 */
export function notifyDbRefreshListeners(stats: DatabaseStatistics): void {
  refreshListeners.forEach(listener => {
    try {
      listener(stats);
    } catch (error) {
      console.error("Error in database refresh listener:", error);
    }
  });
}
