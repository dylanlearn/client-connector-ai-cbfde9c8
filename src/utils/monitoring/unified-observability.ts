/**
 * Unified observability module for tracking application performance and errors
 */

// Performance data interface
interface PerformanceData {
  route: string;
  duration: number;
  success: boolean;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Error data interface
interface ErrorData {
  message: string;
  stack?: string;
  type: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

// Request data interface
interface RequestData {
  url: string;
  method: string;
  duration: number;
  status?: number;
  success: boolean;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Resource data interface
interface ResourceData {
  name: string;
  type: string;
  duration: number;
  size?: number;
  timestamp: number;
}

// Configuration interface
interface ObservabilityConfig {
  endpoint?: string;
  sampleRate?: number;
  flushInterval?: number;
  maxQueueSize?: number;
  debug?: boolean;
}

// Default configuration
const DEFAULT_CONFIG: ObservabilityConfig = {
  endpoint: '/api/telemetry',
  sampleRate: 0.1, // 10% of events
  flushInterval: 30000, // 30 seconds
  maxQueueSize: 100,
  debug: false
};

// Internal state
let config = { ...DEFAULT_CONFIG };
let queue: Array<PerformanceData | ErrorData | RequestData | ResourceData> = [];
let flushTimerId: number | null = null;
let isInitialized = false;

/**
 * Initialize the observability system with custom configuration
 */
export function initializeObservability(customConfig: Partial<ObservabilityConfig> = {}): void {
  if (isInitialized) {
    console.warn('Observability system already initialized');
    return;
  }
  
  // Merge custom config with defaults
  config = {
    ...DEFAULT_CONFIG,
    ...customConfig
  };
  
  // Start automatic flushing
  startFlushing();
  
  // Listen for page visibility changes to flush before unloading
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  });
  
  // Set as initialized
  isInitialized = true;
  
  if (config.debug) {
    console.log('Observability system initialized', config);
  }
}

/**
 * Track a route change or page load
 */
export function trackPageView(route: string, duration?: number): void {
  if (!shouldSample()) return;
  
  addToQueue({
    route,
    duration: duration ?? 0,
    success: true,
    timestamp: Date.now()
  } as PerformanceData);
}

/**
 * Track an error that occurred
 */
export function trackError(error: Error, type: string = 'unknown', metadata?: Record<string, any>): void {
  // Always track errors, regardless of sampling
  addToQueue({
    message: error.message,
    stack: error.stack,
    type,
    metadata,
    timestamp: Date.now()
  } as ErrorData);
  
  // Flush immediately for errors to ensure they're sent
  flush();
}

/**
 * Track an API or fetch request
 */
export function trackRequest(
  url: string, 
  method: string = 'GET',
  duration: number,
  status?: number,
  success: boolean = true,
  metadata?: Record<string, any>
): void {
  if (!shouldSample()) return;
  
  addToQueue({
    url,
    method,
    duration,
    status,
    success,
    timestamp: Date.now(),
    metadata
  } as RequestData);
}

/**
 * Track a resource load
 */
export function trackResource(name: string, type: string, duration: number, size?: number): void {
  if (!shouldSample()) return;
  
  addToQueue({
    name,
    type,
    duration,
    size,
    timestamp: Date.now()
  } as ResourceData);
}

/**
 * Add an item to the queue and check if we should flush
 */
function addToQueue(item: PerformanceData | ErrorData | RequestData | ResourceData): void {
  queue.push(item);
  
  if (queue.length >= (config.maxQueueSize || DEFAULT_CONFIG.maxQueueSize!)) {
    flush();
  }
}

/**
 * Flush the queue to the server
 */
function flush(): void {
  if (queue.length === 0) return;
  
  const dataToSend = [...queue];
  queue = [];
  
  // Add user ID if available
  const enhancedData = dataToSend.map(item => ({
    ...item,
    sessionId: getSessionId()
  }));
  
  if (config.debug) {
    console.log('Flushing observability data', enhancedData);
  }
  
  // Don't actually send in development environment
  if (process.env.NODE_ENV !== 'development') {
    fetch(config.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enhancedData),
      // Use keepalive to ensure the request completes even if the page is unloading
      keepalive: true
    }).catch(error => {
      console.error('Failed to send observability data', error);
    });
  }
}

/**
 * Start the automatic flushing interval
 */
function startFlushing(): void {
  if (flushTimerId !== null) {
    clearInterval(flushTimerId);
  }
  
  flushTimerId = window.setInterval(flush, config.flushInterval);
}

/**
 * Determine if we should sample this event based on the configured sample rate
 */
function shouldSample(): boolean {
  return Math.random() < (config.sampleRate || DEFAULT_CONFIG.sampleRate!);
}

/**
 * Get a unique session ID for grouping events
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('observability_session_id');
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('observability_session_id', sessionId);
  }
  
  return sessionId;
}

// Export the PerformanceData type with a namespace to avoid conflicts
export type { PerformanceData, ErrorData, RequestData, ResourceData, ObservabilityConfig };

// Export a PerfDataType alias to avoid conflict
export type PerfDataType = PerformanceData;
