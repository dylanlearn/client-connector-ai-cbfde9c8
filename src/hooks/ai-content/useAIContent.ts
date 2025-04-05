
import { useCallback } from 'react';
import { UseAIContentOptions, UseAIContentReturn, ContentRequest, CacheCleanupResult } from './types';
import { useGeneration } from './useGeneration';
import { useCache } from './useCache';

/**
 * Enterprise-grade hook for AI content generation with database caching,
 * timeout handling, retries, and performance optimization
 */
export function useAIContent(options: UseAIContentOptions = {}): UseAIContentReturn {
  const {
    autoRetry = true,
    maxRetries = 2,
    timeout = 10000,
    showToasts = false,
    useFallbacks = true,
    enableABTesting = true
  } = options;
  
  // Use the generation hook for content generation logic
  const { 
    generate,
    cancelGeneration,
    isGenerating,
    error
  } = useGeneration({
    autoRetry,
    maxRetries,
    timeout,
    showToasts,
    useFallbacks,
    enableABTesting
  });
  
  // Use the cache hook for cache management
  const {
    isCleaningUp,
    cleanupCache,
    scheduleRegularCleanup
  } = useCache(showToasts);

  return {
    generate,
    cancelGeneration,
    cleanupCache,
    scheduleRegularCleanup,
    isGenerating,
    isCleaningUp,
    error
  };
}
