
import { ContentRequest } from '../types';

export interface UseGenerationOptions {
  autoRetry?: boolean;
  maxRetries?: number;
  timeout?: number;
  showToasts?: boolean;
  useFallbacks?: boolean;
  enableABTesting?: boolean;
}

export interface UseGenerationReturn {
  generate: (request: ContentRequest) => Promise<string>;
  cancelGeneration: () => void;
  isGenerating: boolean;
  error: Error | null;
}

export interface FallbackContentMap {
  [type: string]: {
    default: string;
    [context: string]: string;
  };
}
