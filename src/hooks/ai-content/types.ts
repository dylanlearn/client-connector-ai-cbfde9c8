
/**
 * Interface for content generation requests
 */
export interface ContentRequest {
  type: 'header' | 'tagline' | 'cta' | 'description';
  context?: string;
  tone?: string;
  keywords?: string[];
  maxLength?: number;
}

/**
 * Options for AI content generation
 */
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
   * When true, fallback content will be returned on error
   * rather than throwing
   * @default true
   */
  useFallbacks?: boolean;
  
  /**
   * Enable/disable A/B testing for prompts
   * @default true
   */
  enableABTesting?: boolean;
}

/**
 * Return type for useAIContent hook
 */
export interface UseAIContentReturn {
  generate: (request: ContentRequest) => Promise<string>;
  cancelGeneration: () => void;
  cleanupCache: () => Promise<CacheCleanupResult>;
  scheduleRegularCleanup: (intervalMinutes?: number) => Promise<NodeJS.Timeout>;
  isGenerating: boolean;
  isCleaningUp: boolean;
  error: Error | null;
}

/**
 * Interface for test result data
 */
export interface TestResultData {
  variantId: string;
  successRate: number;
  averageLatency: number;
  sampleSize: number;
}

/**
 * Type for toast adapter to allow mocking in tests
 */
export interface ToastAdapter {
  toast: (props: any) => { id: string; dismiss: () => void; update: (props: any) => void };
}

// Re-export from generation-types for backwards compatibility
// Fix: Use 'export type' for type re-exports when isolatedModules is enabled
export type { UseGenerationOptions, UseGenerationReturn, FallbackContentMap } from './types/generation-types';

// Re-export from cache-types for backwards compatibility
export type { CacheCleanupResult, UseCacheReturn } from './types/cache-types';
