import { useState, useCallback, useRef, useEffect } from 'react';
import { AIGeneratorService } from '@/services/ai';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

interface ContentRequest {
  type: 'header' | 'tagline' | 'cta' | 'description';
  context?: string;
  tone?: string;
  maxLength?: number;
  keywords?: string[];
}

/**
 * Enterprise-grade hook for AI content generation with database caching,
 * timeout handling, retries, and performance optimization
 */
export function useAIContent(options: UseAIContentOptions = {}) {
  const {
    autoRetry = true,
    maxRetries = 2,
    timeout = 10000, // Increased timeout for better reliability
    showToasts = false,
    cacheTTL = 30 * 60 * 1000, // 30 minutes
    useFallbacks = true
  } = options;
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          toast.error('AI content generation timed out');
        }
      }
    }, timeout);
    
    // Function to attempt generation with retry logic
    const attemptGeneration = async (retryCount: number): Promise<string> => {
      try {
        // Generate cache key based on request
        const cacheKey = `ai-content-${request.type}-${request.context}-${request.tone}-${retryCount}`;
        
        const content = await AIGeneratorService.generateContent({
          ...request,
          cacheKey
        });
        
        // Clear timeout on success
        if (requestTimeoutRef.current) {
          clearTimeout(requestTimeoutRef.current);
          requestTimeoutRef.current = null;
        }
        
        return content;
      } catch (error) {
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
        toast.error('Failed to generate AI content');
      }
      
      // Return fallback content if fallbacks are enabled
      if (useFallbacks) {
        const fallbacks = {
          header: `Example ${request.type || 'header'}`,
          tagline: "Brief, compelling tagline example",
          cta: "Sign up for free",
          description: `Sample description for ${request.context || 'this field'}`
        };
        return fallbacks[request.type] || `Example ${request.type}`;
      }
      
      // Otherwise, re-throw the error
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [autoRetry, maxRetries, timeout, showToasts, useFallbacks]);

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

  // Function to manually trigger cache cleanup (for admin/development purposes)
  const cleanupCache = useCallback(async (): Promise<{success: boolean, message: string, entriesRemoved?: number}> => {
    try {
      setIsCleaningUp(true);
      const { data, error } = await supabase.functions.invoke("cleanup-expired-cache");
      
      setIsCleaningUp(false);
      
      if (error) {
        console.error("Failed to trigger cache cleanup:", error);
        if (showToasts) {
          toast.error("Cache cleanup failed");
        }
        return { 
          success: false, 
          message: `Failed to clean up cache: ${error.message}`
        };
      }
      
      if (showToasts) {
        toast.success(`Cache cleanup complete. Removed ${data?.entriesRemoved || 0} entries.`);
      }
      
      return { 
        success: true, 
        message: "Cache cleanup successful",
        entriesRemoved: data?.entriesRemoved
      };
    } catch (error) {
      setIsCleaningUp(false);
      console.error("Error triggering cache cleanup:", error);
      if (showToasts) {
        toast.error("Cache cleanup failed");
      }
      return { 
        success: false, 
        message: `Error cleaning up cache: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }, [showToasts]);

  // Schedule regular cache cleanup (for admin users)
  const scheduleRegularCleanup = useCallback(async (intervalMinutes: number = 60): Promise<NodeJS.Timeout> => {
    // First immediate run
    await cleanupCache();
    
    // Then schedule recurring cleanup
    return setInterval(async () => {
      console.log(`Running scheduled cache cleanup (every ${intervalMinutes} minutes)`);
      await cleanupCache();
    }, intervalMinutes * 60 * 1000);
  }, [cleanupCache]);

  return {
    generate,
    cancelGeneration,
    cleanupCache,
    scheduleRegularCleanup,
    isGenerating,
    isCleaningUp,
    error: lastError
  };
}
