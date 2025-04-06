
import { ContentRequest } from "../types";

export interface UseGenerationOptions {
  /**
   * Whether to automatically retry failed generations
   * @default true
   */
  autoRetry?: boolean;
  
  /**
   * Maximum number of retries for failed generations
   * @default 1
   */
  maxRetries?: number;
  
  /**
   * Timeout for generation requests in milliseconds
   * @default 8000
   */
  timeout?: number;
  
  /**
   * Whether to show toast notifications for generation status
   * @default false
   */
  showToasts?: boolean;
  
  /**
   * Whether to use fallback content when generation fails
   * @default true
   */
  useFallbacks?: boolean;
  
  /**
   * Whether to enable A/B testing for generation prompts
   * @default false
   */
  enableABTesting?: boolean;
}

export interface UseGenerationReturn {
  /**
   * Generate content based on the provided request
   */
  generate: (request: ContentRequest) => Promise<string>;
  
  /**
   * Cancel the current generation request
   */
  cancelGeneration: () => void;
  
  /**
   * Clear the generation cache
   * @param type Optional content type to clear specifically
   */
  clearCache: (type?: string) => void;
  
  /**
   * Whether content is currently being generated
   */
  isGenerating: boolean;
  
  /**
   * The last error that occurred during generation, if any
   */
  error: Error | null;
}

export interface FallbackContentMap {
  [key: string]: string | ((context?: string) => string);
}
