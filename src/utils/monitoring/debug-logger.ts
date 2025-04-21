
/**
 * Utility for structured debug logging
 */
export const DebugLogger = {
  /**
   * Log informational message
   */
  info(message: string, options?: { context?: string; metadata?: Record<string, any> }): void {
    console.info(`[INFO] ${message}`, options?.metadata || {});
  },
  
  /**
   * Log warning message
   */
  warn(message: string, options?: { context?: string; metadata?: Record<string, any> }): void {
    console.warn(`[WARN] ${message}`, options?.metadata || {});
  },
  
  /**
   * Log error message
   */
  error(message: string, options?: { context?: string; metadata?: Record<string, any> }): void {
    console.error(`[ERROR] ${message}`, options?.metadata || {});
  },
  
  /**
   * Start a timer for performance tracking
   */
  startTimer(id: string): void {
    console.time(id);
  },
  
  /**
   * End a timer and log the duration
   */
  endTimer(id: string): void {
    console.timeEnd(id);
  }
};
