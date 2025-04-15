
/**
 * Debug Logger - Unified logging utility for the application
 */
export class DebugLogger {
  private static timers: Record<string, number> = {};
  private static isDebugMode = process.env.NODE_ENV !== 'production';

  /**
   * Log an informational message
   */
  static info(message: string, context?: { context?: string; metadata?: Record<string, any> }): void {
    if (!this.isDebugMode) return;
    
    console.log(
      `%c[INFO]%c ${message}`,
      'color: #3182ce; font-weight: bold',
      'color: inherit',
      context ? context : ''
    );
  }

  /**
   * Log a warning message
   */
  static warn(message: string, context?: { context?: string; metadata?: Record<string, any> }): void {
    console.warn(
      `%c[WARN]%c ${message}`,
      'color: #f59e0b; font-weight: bold',
      'color: inherit',
      context ? context : ''
    );
  }

  /**
   * Log an error message
   */
  static error(
    message: string, 
    context?: { context?: string; metadata?: Record<string, any> }
  ): void {
    console.error(
      `%c[ERROR]%c ${message}`,
      'color: #e53e3e; font-weight: bold',
      'color: inherit',
      context ? context : ''
    );
  }

  /**
   * Start a timer for performance measurement
   */
  static startTimer(id: string): void {
    if (!this.isDebugMode) return;
    this.timers[id] = performance.now();
  }

  /**
   * End a timer and log the elapsed time
   */
  static endTimer(id: string): number | null {
    if (!this.isDebugMode) return null;
    
    if (!this.timers[id]) {
      this.warn(`Timer "${id}" does not exist`);
      return null;
    }

    const elapsed = performance.now() - this.timers[id];
    const formattedTime = elapsed.toFixed(2);
    
    this.info(`${id}: ${formattedTime}ms`);
    
    delete this.timers[id];
    return elapsed;
  }

  /**
   * Group related logs together
   */
  static group(label: string, callback: () => void): void {
    if (!this.isDebugMode) {
      callback();
      return;
    }
    
    console.group(label);
    callback();
    console.groupEnd();
  }
}

// Export as singleton instance and directly
export default DebugLogger;
