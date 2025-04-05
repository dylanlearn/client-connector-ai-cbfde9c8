
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { AIGeneratorService } from '@/services/ai';
import { ContentRequest } from './types';
import { 
  UseGenerationOptions, 
  UseGenerationReturn 
} from './types/generation-types';
import { 
  createTimeoutController,
  calculateBackoffDelay 
} from './utils/retry-utils';
import { 
  getFallbackContent 
} from './utils/fallback-utils';
import { 
  getTestVariant,
  recordTestSuccess,
  recordTestFailure 
} from './utils/test-variant-utils';
import { useAuth } from '@/hooks/use-auth';

/**
 * Hook for managing AI content generation with retries and timeout handling
 */
export function useGeneration({
  autoRetry = true,
  maxRetries = 2,
  timeout = 10000,
  showToasts = false,
  useFallbacks = true,
  enableABTesting = true
}: UseGenerationOptions = {}): UseGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

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

  // Function to attempt generation with retry logic
  const attemptGeneration = useCallback(async (
    request: ContentRequest,
    retryCount: number,
    testInfo?: { activeTestId?: string; testVariantId?: string }
  ): Promise<string> => {
    try {
      const cacheKey = `ai-content-${request.type}-${request.context || ''}-${request.tone || ''}-${testInfo?.testVariantId || 'default'}-${retryCount}`;
      
      const startTime = Date.now();
      
      // Make sure we're passing the correct type for content generation
      const generationOptions = {
        type: request.type,
        context: request.context,
        tone: request.tone,
        maxLength: request.maxLength,
        cacheKey: cacheKey,
        testVariantId: testInfo?.testVariantId
      };
      
      const content = await AIGeneratorService.generateContent(generationOptions);
      
      const latencyMs = Date.now() - startTime;
      
      // Record test success if A/B testing is enabled
      if (testInfo?.activeTestId && testInfo?.testVariantId && user) {
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
      
      return content;
    } catch (error) {
      // Record test failure if A/B testing is enabled
      if (testInfo?.activeTestId && testInfo?.testVariantId && user) {
        await recordTestFailure(
          testInfo.activeTestId,
          testInfo.testVariantId,
          user.id,
          error instanceof Error ? error.name : 'UnknownError'
        );
      }
      
      // Retry logic
      if (autoRetry && retryCount < maxRetries) {
        console.log(`Retrying AI generation (${retryCount + 1}/${maxRetries})...`);
        
        // Exponential backoff
        const backoffDelay = calculateBackoffDelay(retryCount);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        return attemptGeneration(request, retryCount + 1, testInfo);
      }
      
      throw error;
    }
  }, [autoRetry, maxRetries, user]);

  const generate = useCallback(async (request: ContentRequest): Promise<string> => {
    setIsGenerating(true);
    setLastError(null);
    retryCountRef.current = 0;
    
    // Reset previous abort controller if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const { controller, clearTimeoutFn } = createTimeoutController(timeout, () => {
      setLastError(new Error('Request timed out'));
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
    const testInfo = user?.id && enableABTesting 
      ? await getTestVariant(request.type, user.id, enableABTesting)
      : undefined;
    
    try {
      const result = await attemptGeneration(request, 0, testInfo);
      clearTimeoutFn(); // Clear the timeout on success
      return result;
    } catch (error) {
      console.error('AI content generation failed:', error);
      setLastError(error instanceof Error ? error : new Error('Unknown error'));
      
      if (showToasts) {
        toast.error("Generation Failed", {
          description: "Failed to generate AI content"
        });
      }
      
      // Return fallback content if enabled
      if (useFallbacks) {
        return getFallbackContent(request.type, request.context);
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [attemptGeneration, enableABTesting, showToasts, timeout, useFallbacks, user]);

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

  return {
    generate,
    cancelGeneration,
    isGenerating,
    error: lastError
  };
}
