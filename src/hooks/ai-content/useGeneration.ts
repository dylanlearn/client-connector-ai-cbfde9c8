
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { AIGeneratorService } from '@/services/ai';
import { ContentRequest } from './types';
import { usePromptTesting } from './usePromptTesting';
import { useAuth } from '@/hooks/use-auth';

interface UseGenerationOptions {
  autoRetry?: boolean;
  maxRetries?: number;
  timeout?: number;
  showToasts?: boolean;
  useFallbacks?: boolean;
  enableABTesting?: boolean;
}

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
}: UseGenerationOptions = {}) {
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

  const generate = useCallback(async (request: ContentRequest): Promise<string> => {
    setIsGenerating(true);
    setLastError(null);
    retryCountRef.current = 0;
    
    // Reset previous abort controller if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // Clear previous timeout if exists
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
    }
    
    // Set up timeout for the request
    requestTimeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setLastError(new Error('Request timed out'));
        setIsGenerating(false);
        
        if (showToasts) {
          toast.error("Generation Failed", {
            description: "AI content generation timed out"
          });
        }
      }
    }, timeout);
    
    let testVariantId: string | undefined;
    let activeTestId: string | undefined;
    
    // Handle A/B testing if enabled
    if (enableABTesting && user) {
      try {
        const test = await AIGeneratorService.getActivePromptTest(request.type);
        if (test) {
          activeTestId = test.id; // Store test ID for recording results
          const variant = await AIGeneratorService.selectPromptVariant(request.type, user.id);
          if (variant) {
            testVariantId = variant.id;
          }
        }
      } catch (error) {
        console.error("Error getting A/B test variant:", error);
      }
    }
    
    // Function to attempt generation with retry logic
    const attemptGeneration = async (retryCount: number): Promise<string> => {
      try {
        const cacheKey = `ai-content-${request.type}-${request.context || ''}-${request.tone || ''}-${testVariantId || 'default'}-${retryCount}`;
        
        const startTime = Date.now();
        
        const content = await AIGeneratorService.generateContent({
          ...request,
          cacheKey,
          testVariantId
        });
        
        const latencyMs = Date.now() - startTime;
        
        // Record test success if A/B testing is enabled
        if (testVariantId && activeTestId && user) {
          await AIGeneratorService.recordPromptTestSuccess(
            activeTestId, 
            testVariantId, 
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
        if (testVariantId && activeTestId && user) {
          await AIGeneratorService.recordPromptTestFailure(
            activeTestId,
            testVariantId, 
            user.id, 
            error instanceof Error ? error.name : 'UnknownError'
          );
        }
        
        // Retry logic
        if (autoRetry && retryCount < maxRetries) {
          console.log(`Retrying AI generation (${retryCount + 1}/${maxRetries})...`);
          
          // Exponential backoff
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          
          return attemptGeneration(retryCount + 1);
        }
        
        throw error;
      }
    };
    
    try {
      const result = await attemptGeneration(0);
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
        const fallbacks = {
          header: `Example ${request.type || 'header'}`,
          tagline: "Brief, compelling tagline example",
          cta: "Sign up for free",
          description: `Sample description for ${request.context || 'this field'}`
        };
        return fallbacks[request.type as keyof typeof fallbacks] || `Example ${request.type}`;
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [autoRetry, maxRetries, timeout, showToasts, useFallbacks, enableABTesting, user]);

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
