import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
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

  // Cleanup function
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
    // Reset state
    setIsGenerating(true);
    setLastError(null);
    retryCountRef.current = 0;
    
    // Create abort controller for the request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // Set timeout
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
    }
    
    requestTimeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setLastError(new Error('Request timed out'));
        setIsGenerating(false);
        
        if (showToasts) {
          toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "AI content generation timed out"
          });
        }
      }
    }, timeout);
    
    // Get A/B test prompt variant if enabled
    let testVariantId: string | undefined;
    if (enableABTesting && user) {
      try {
        const test = await AIGeneratorService.getActivePromptTest(request.type);
        if (test) {
          const variant = await AIGeneratorService.selectPromptVariant(request.type, user.id);
          if (variant) {
            testVariantId = variant.id;
          }
        }
      } catch (error) {
        console.error("Error getting A/B test variant:", error);
        // Continue with default prompt if there's an error
      }
    }
    
    // Function to attempt generation with retry logic
    const attemptGeneration = async (retryCount: number): Promise<string> => {
      try {
        // Generate cache key based on request
        const cacheKey = `ai-content-${request.type}-${request.context}-${request.tone}-${testVariantId || 'default'}-${retryCount}`;
        
        const startTime = Date.now();
        
        const content = await AIGeneratorService.generateContent({
          ...request,
          cacheKey,
          testVariantId
        });
        
        // Calculate latency for A/B test metrics
        const latencyMs = Date.now() - startTime;
        
        // Record success for A/B testing if we're using a test variant
        if (testVariantId && user) {
          await AIGeneratorService.recordPromptTestSuccess(
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
        // Record failure for A/B testing if we're using a test variant
        if (testVariantId && user) {
          await AIGeneratorService.recordPromptTestFailure(
            testVariantId, 
            user.id, 
            error instanceof Error ? error.name : 'UnknownError'
          );
        }
        
        // Handle retries
        if (autoRetry && retryCount < maxRetries) {
          console.log(`Retrying AI generation (${retryCount + 1}/${maxRetries})...`);
          
          // Exponential backoff
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          
          return attemptGeneration(retryCount + 1);
        }
        
        // We've exhausted retries or retries are disabled
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
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Failed to generate AI content"
        });
      }
      
      // Return fallback content if fallbacks are enabled
      if (useFallbacks) {
        const fallbacks = {
          header: `Example ${request.type || 'header'}`,
          tagline: "Brief, compelling tagline example",
          cta: "Sign up for free",
          description: `Sample description for ${request.context || 'this field'}`
        };
        return fallbacks[request.type as keyof typeof fallbacks] || `Example ${request.type}`;
      }
      
      // Otherwise, re-throw the error
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
