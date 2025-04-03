
/**
 * Types for AI content generation hooks and utilities
 */

/**
 * Options for the useGeneration hook
 */
export interface UseGenerationOptions {
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
 * Return type for useGeneration hook
 */
export interface UseGenerationReturn {
  /**
   * Generate content based on request parameters
   */
  generate: (request: ContentRequest) => Promise<string>;
  
  /**
   * Cancel any ongoing generation
   */
  cancelGeneration: () => void;
  
  /**
   * Whether a generation is currently in progress
   */
  isGenerating: boolean;
  
  /**
   * The last error that occurred during generation, if any
   */
  error: Error | null;
}

/**
 * Fallback content mapping by content type
 */
export interface FallbackContentMap {
  header: string;
  tagline: string;
  cta: string;
  description: string;
  [key: string]: string;
}
