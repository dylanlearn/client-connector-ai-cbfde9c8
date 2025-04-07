import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { AIGeneratorService } from '@/services/ai';
import { ContentRequest } from './types';
import { UseGenerationOptions, UseGenerationReturn } from './types/generation-types';
import { createTimeoutController, calculateBackoffDelay } from './utils/retry-utils';
import { getFallbackContent } from './utils/fallback-utils';
import { getTestVariant, recordTestSuccess, recordTestFailure } from './utils/test-variant-utils';
import { useAuth } from '@/hooks/use-auth';

// Improved error types for better error classification and handling
class AIGenerationError extends Error {
  constructor(message = 'Error during AI content generation', public cause?: Error) {
    super(message);
    this.name = 'AIGenerationError';
    // Maintain error stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AIGenerationError);
    }
  }
}

class TimeoutError extends AIGenerationError {
  constructor(message = 'Request timed out', timeoutMs?: number) {
    super(timeoutMs ? `Request timed out after ${timeoutMs}ms` : message);
    this.name = 'TimeoutError';
  }
}

class NetworkError extends AIGenerationError {
  constructor(message = 'Network connection error', public statusCode?: number, public originalError?: Error) {
    super(message, originalError);
    this.name = 'NetworkError';
  }
}

class AuthorizationError extends AIGenerationError {
  constructor(message = 'Authorization failed') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

class ServiceUnavailableError extends AIGenerationError {
  constructor(message = 'Service is currently unavailable') {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

class RateLimitError extends AIGenerationError {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Optimized hook for managing AI content generation with improved performance
 */
export function useGeneration({
  autoRetry = true,
  maxRetries = 1,
  timeout = 8000,
  showToasts = false,
  useFallbacks = true,
  enableABTesting = false
}: UseGenerationOptions = {}): UseGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  // Memoized cache for previous requests to avoid redundant API calls
  const requestCacheRef = useRef<Map<string, string>>(new Map());

  // Cleanup function for abort controller and timeout
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  // Improved error handler for classifying errors
  const classifyError = (error: unknown): AIGenerationError => {
    // Already classified error
    if (error instanceof AIGenerationError) {
      return error;
    }
    
    // Network errors
    if (error instanceof TypeError && (error.message.includes('networkerror') || error.message.includes('failed to fetch'))) {
      return new NetworkError(
        'Network connection failed. Please check your internet connection.',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
    
    // Aborted requests
    if (error instanceof DOMException && error.name === 'AbortError') {
      return new AIGenerationError('Request was canceled');
    }
    
    // Handle HTTP error status codes
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      
      if (status === 401 || status === 403) {
        return new AuthorizationError('API authorization failed. Please check your credentials.');
      }
      
      if (status === 429) {
        return new RateLimitError('Too many requests. Please try again later.');
      }
      
      if (status >= 500) {
        return new ServiceUnavailableError('Service is currently unavailable. Please try again later.');
      }
      
      return new NetworkError(`HTTP error: ${status}`, status);
    }
    
    // Unknown errors
    return new AIGenerationError(
      error instanceof Error ? error.message : 'Unknown error during content generation',
      error instanceof Error ? error : undefined
    );
  };

  // Handler for network or connectivity errors
  const handleNetworkError = (error: unknown): NetworkError => {
    console.error('Network error during generation:', error);
    const networkError = new NetworkError(
      error instanceof Error ? `Network error: ${error.message}` : 'Network connection failed'
    );
    
    if (showToasts) {
      toast.error("Network Error", {
        description: "Please check your internet connection"
      });
    }
    
    return networkError;
  };

  // Handler for timeouts
  const handleTimeoutError = (): TimeoutError => {
    const timeoutError = new TimeoutError(`Request timed out after ${timeout}ms`);
    
    if (showToasts) {
      toast.error("Request Timeout", {
        description: "The AI generation request took too long"
      });
    }
    
    return timeoutError;
  };

  // Function to attempt generation with retry logic
  const attemptGeneration = useCallback(async (
    request: ContentRequest,
    retryCount: number,
    testInfo?: { activeTestId?: string; testVariantId?: string }
  ): Promise<string> => {
    try {
      const cacheKey = `ai-content-${request.type}-${request.context || ''}-${request.tone || ''}`;
      
      // Check cache first for instant response
      const cachedContent = requestCacheRef.current.get(cacheKey);
      if (cachedContent) {
        console.log('Using cached AI content');
        return cachedContent;
      }
      
      const startTime = Date.now();
      
      // Make sure we're passing the correct type for content generation
      const generationOptions = {
        type: request.type,
        context: request.context,
        tone: request.tone,
        maxLength: request.maxLength,
        cacheKey: `ai-content-${request.type}-${request.context || ''}-${request.tone || ''}`,
        testVariantId: testInfo?.testVariantId
      };
      
      // Check for abort signal
      if (abortControllerRef.current?.signal.aborted) {
        throw new AIGenerationError('Request was canceled');
      }
      
      // Use a try-catch with specific error type handling
      try {
        const content = await AIGeneratorService.generateContent(generationOptions);
        const latencyMs = Date.now() - startTime;
        
        // Record test success if A/B testing is enabled
        if (enableABTesting && testInfo?.activeTestId && testInfo?.testVariantId && user) {
          await recordTestSuccess(
            testInfo.activeTestId,
            testInfo.testVariantId,
            user.id,
            latencyMs
          );
        }
        
        // Clear timeout on success
        if (requestTimeoutRef.current) {
          clearTimeout(requestTimeoutRef.current);
          requestTimeoutRef.current = null;
        }
        
        // Cache the successful result
        requestCacheRef.current.set(generationOptions.cacheKey, content);
        
        return content;
      } catch (error) {
        // Classify the error using our new error classifier
        throw classifyError(error);
      }
    } catch (error) {
      // Improved error logging with more details
      if (error instanceof TimeoutError) {
        console.warn('Generation timed out:', error.message);
      } else if (error instanceof NetworkError) {
        console.error('Network error:', error.message, error.statusCode);
      } else if (error instanceof RateLimitError) {
        console.error('Rate limit exceeded:', error.message);
      } else if (error instanceof AuthorizationError) {
        console.error('Authorization failed:', error.message);
      } else if (error instanceof ServiceUnavailableError) {
        console.error('Service unavailable:', error.message);
      } else if (error instanceof AIGenerationError) {
        console.error('AI generation error:', error.message, error.cause);
      } else {
        console.error('Unknown error during generation:', error);
      }
      
      // Record test failure if A/B testing is enabled
      if (enableABTesting && testInfo?.activeTestId && testInfo?.testVariantId && user) {
        await recordTestFailure(
          testInfo.activeTestId,
          testInfo.testVariantId,
          user.id,
          error instanceof Error ? error.name : 'UnknownError'
        );
      }
      
      // Improved retry logic based on error type
      if (autoRetry && retryCount < maxRetries) {
        console.log(`Retrying AI generation (${retryCount + 1}/${maxRetries})...`);
        
        // Different backoff strategies based on error type
        let backoffDelay: number;
        
        if (error instanceof NetworkError) {
          // Network errors get a longer delay
          backoffDelay = calculateBackoffDelay(retryCount, 1000, 1.5);
        } else if (error instanceof TimeoutError) {
          // Timeout errors get a more aggressive delay
          backoffDelay = calculateBackoffDelay(retryCount, 1500, 2);
        } else if (error instanceof ServiceUnavailableError) {
          // Server errors need longer backoff
          backoffDelay = calculateBackoffDelay(retryCount, 2000, 2);
        } else if (error instanceof RateLimitError) {
          // Rate limit errors need much longer backoff
          backoffDelay = calculateBackoffDelay(retryCount, 3000, 2.5);
        } else {
          // Standard backoff for other errors
          backoffDelay = calculateBackoffDelay(retryCount);
        }
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        return attemptGeneration(request, retryCount + 1, testInfo);
      }
      
      throw error;
    }
  }, [autoRetry, maxRetries, user, enableABTesting, showToasts, timeout]);

  const generate = useCallback(async (request: ContentRequest): Promise<string> => {
    setIsGenerating(true);
    setLastError(null);
    retryCountRef.current = 0;
    
    // Reset previous abort controller if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const { controller, clearTimeoutFn } = createTimeoutController(timeout, () => {
      setLastError(new TimeoutError());
      setIsGenerating(false);
      
      if (showToasts) {
        toast.error("Generation Failed", {
          description: "AI content generation timed out"
        });
      }
    });
    
    abortControllerRef.current = controller;
    
    // Clear previous timeout if exists
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
    }
    
    // Get test variant information if A/B testing is enabled
    const testInfo = enableABTesting && user?.id 
      ? await getTestVariant(request.type, user.id, enableABTesting)
      : undefined;
    
    try {
      const result = await attemptGeneration(request, 0, testInfo);
      clearTimeoutFn(); // Clear the timeout on success
      return result;
    } catch (error) {
      // More specific error handling based on error type
      if (error instanceof TimeoutError) {
        setLastError(error);
      } else if (error instanceof NetworkError) {
        setLastError(error);
      } else if (error instanceof AIGenerationError) {
        setLastError(error);
      } else {
        setLastError(error instanceof Error ? error : new Error('Unknown error'));
      }
      
      // Return fallback content if enabled
      if (useFallbacks) {
        console.log('Using fallback content due to error');
        return getFallbackContent(request.type, request.context);
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [attemptGeneration, timeout, showToasts, useFallbacks, user, enableABTesting]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
    
    setIsGenerating(false);
  }, []);

  // Add a function to clear cache for specific types
  const clearCache = useCallback((type?: string) => {
    if (type) {
      // Clear only specific type entries
      const keysToDelete: string[] = [];
      requestCacheRef.current.forEach((_, key) => {
        if (key.includes(`ai-content-${type}`)) {
          keysToDelete.push(key);
        }
      });
      
      keysToDelete.forEach(key => requestCacheRef.current.delete(key));
    } else {
      // Clear the entire cache
      requestCacheRef.current.clear();
    }
  }, []);

  return {
    generate,
    cancelGeneration,
    clearCache,
    isGenerating,
    error: lastError
  };
}
