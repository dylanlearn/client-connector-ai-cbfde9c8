
export interface UseAIContentOptions {
  /**
   * Enable/disable automatic retries on failure
   * @default true
   */
  autoRetry?: boolean;
  
  /**
   * Maximum number of retry attempts
   * @default 2
   */
  maxRetries?: number;
  
  /**
   * Timeout in milliseconds before giving up
   * @default 10000
   */
  timeout?: number;
  
  /**
   * Whether to show toast notifications for errors
   * @default false
   */
  showToasts?: boolean;
  
  /**
   * Time in milliseconds to consider cached content valid
   * @default 1800000 (30 minutes)
   */
  cacheTTL?: number;
  
  /**
   * When true, fallback content will be returned on error
   * rather than throwing
   * @default true
   */
  useFallbacks?: boolean;
}

export interface ContentRequest {
  type: 'header' | 'tagline' | 'cta' | 'description';
  context?: string;
  tone?: string;
  maxLength?: number;
  keywords?: string[];
}

export interface UseAIContentReturn {
  generate: (request: ContentRequest) => Promise<string>;
  cancelGeneration: () => void;
  cleanupCache: () => Promise<{success: boolean, message: string, entriesRemoved?: number}>;
  scheduleRegularCleanup: (intervalMinutes?: number) => Promise<NodeJS.Timeout>;
  isGenerating: boolean;
  isCleaningUp: boolean;
  error: Error | null;
}
