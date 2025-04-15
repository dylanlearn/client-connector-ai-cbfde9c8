
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  metadata?: Record<string, unknown>;
  timestamp?: boolean;
  grouping?: boolean;
  stackTrace?: boolean;
}

interface TimerMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
}

export const DebugLogger = {
  isDebugMode: process.env.NODE_ENV === 'development',
  logLevel: 'info' as LogLevel,
  activeTimers: new Map<string, TimerMetrics>(),

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  },

  shouldLog(level: LogLevel): boolean {
    if (!this.isDebugMode) return false;
    
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    return levels[level] >= levels[this.logLevel];
  },

  log(level: LogLevel, message: string, options: LogOptions = {}) {
    if (!this.shouldLog(level)) return;

    const { context, metadata, timestamp = true, grouping = false, stackTrace = false } = options;
    const logData = {
      message,
      ...(timestamp ? { timestamp: new Date().toISOString() } : {}),
      ...(context ? { context } : {}),
      ...(metadata || {})
    };

    const groupTitle = `[${level.toUpperCase()}]${context ? ` ${context}` : ''} - ${message}`;
    
    if (grouping) console.group(groupTitle);
    
    switch (level) {
      case 'debug':
        console.debug(logData);
        break;
      case 'info':
        console.info(logData);
        break;
      case 'warn':
        console.warn(logData);
        break;
      case 'error':
        console.error(logData);
        if (stackTrace && metadata?.error instanceof Error) {
          console.error('Stack trace:', (metadata.error as Error).stack);
        }
        break;
    }

    if (grouping) console.groupEnd();
  },

  // Simplified logging methods
  debug(message: string, options?: LogOptions) {
    this.log('debug', message, options);
  },

  info(message: string, options?: LogOptions) {
    this.log('info', message, options);
  },

  warn(message: string, options?: LogOptions) {
    this.log('warn', message, options);
  },

  error(message: string, options?: LogOptions) {
    this.log('error', message, {
      ...options,
      stackTrace: true,
      grouping: true
    });
  },
  
  // Enhanced performance monitoring
  startTimer(label: string) {
    if (!this.isDebugMode) return;
    
    this.activeTimers.set(label, {
      startTime: performance.now()
    });
    
    this.debug(`Timer started: ${label}`);
  },
  
  endTimer(label: string) {
    if (!this.isDebugMode) return;
    
    const timer = this.activeTimers.get(label);
    if (!timer) {
      this.warn(`Timer "${label}" not found`);
      return;
    }
    
    timer.endTime = performance.now();
    timer.duration = timer.endTime - timer.startTime;
    
    this.info(`Timer "${label}" completed`, {
      metadata: {
        duration: `${timer.duration.toFixed(2)}ms`,
        label
      }
    });
    
    this.activeTimers.delete(label);
  },
  
  // Group logs for better organization
  group(label: string) {
    if (!this.isDebugMode) return;
    console.group(label);
  },
  
  groupEnd() {
    if (!this.isDebugMode) return;
    console.groupEnd();
  }
};
