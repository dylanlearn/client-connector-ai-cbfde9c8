
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  metadata?: Record<string, unknown>;
  timestamp?: boolean;
  grouping?: boolean;
}

export const DebugLogger = {
  isDebugMode: process.env.NODE_ENV === 'development',

  log(level: LogLevel, message: string, options: LogOptions = {}) {
    if (!this.isDebugMode) return;

    const { context, metadata, timestamp = true, grouping = false } = options;
    const logData = {
      message,
      ...(timestamp ? { timestamp: new Date().toISOString() } : {}),
      ...(context ? { context } : {}),
      ...(metadata || {})
    };

    if (grouping) console.group(`[${level.toUpperCase()}] ${context || 'Debug Log'}`);
    
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
        break;
    }

    if (grouping) console.groupEnd();
  },

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
    this.log('error', message, options);
  }
};

