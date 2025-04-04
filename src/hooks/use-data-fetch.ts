
import { useState, useEffect, useCallback, useRef } from "react";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  retryCount: number;
}

interface DataFetchOptions {
  /**
   * Whether to fetch data immediately on mount
   * @default true
   */
  fetchOnMount?: boolean;
  
  /**
   * Dependencies array for refetching when values change
   * @default []
   */
  dependencies?: any[];
  
  /**
   * Whether to automatically refetch on error
   * @default false
   */
  retryOnError?: boolean;
  
  /**
   * Maximum number of retries
   * @default 3
   */
  maxRetries?: number;
  
  /**
   * Base delay for exponential backoff in milliseconds
   * @default 1000
   */
  retryDelay?: number;
  
  /**
   * Whether to cache successful results
   * @default false
   */
  cacheResults?: boolean;
  
  /**
   * Optional cache key for persistent caching
   */
  cacheKey?: string;
  
  /**
   * Time to live for cached data in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheTtl?: number;
}

/**
 * Generic hook for consistent data fetching patterns with enhanced error handling,
 * retry logic, and optional caching
 * 
 * @param fetchFn The async function that fetches data
 * @param options Configuration options for the fetch behavior
 * @returns Fetch state and control functions
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: DataFetchOptions = {}
) {
  const { 
    fetchOnMount = true, 
    dependencies = [], 
    retryOnError = false,
    maxRetries = 3,
    retryDelay = 1000,
    cacheResults = false,
    cacheKey,
    cacheTtl = 300000, // 5 minutes
  } = options;
  
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
    retryCount: 0
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);
  
  // Clear any pending retries on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Load data from cache if available
  useEffect(() => {
    if (cacheResults && cacheKey) {
      try {
        const cachedData = localStorage.getItem(`data-fetch-${cacheKey}`);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const cachedTime = new Date(timestamp).getTime();
          const now = new Date().getTime();
          
          // Use cache if it's still valid
          if (now - cachedTime < cacheTtl) {
            setState({
              data,
              isLoading: false,
              error: null,
              lastUpdated: new Date(timestamp),
              retryCount: 0
            });
          }
        }
      } catch (error) {
        console.warn("Error reading from cache:", error);
        // Continue with normal fetch if cache read fails
      }
    }
  }, [cacheKey, cacheResults, cacheTtl]);
  
  const fetchData = useCallback(async (retryAttempt = 0) => {
    // Abort any existing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      retryCount: retryAttempt
    }));
    
    try {
      const result = await Promise.race([
        fetchFn(),
        new Promise<never>((_, reject) => {
          signal.addEventListener('abort', () => reject(new Error('Request aborted')));
        })
      ]);
      
      // Check if component is still mounted before updating state
      if (isMountedRef.current) {
        const lastUpdated = new Date();
        setState({
          data: result,
          isLoading: false,
          error: null,
          lastUpdated,
          retryCount: 0
        });
        
        // Cache successful result if enabled
        if (cacheResults && cacheKey) {
          try {
            localStorage.setItem(`data-fetch-${cacheKey}`, JSON.stringify({
              data: result,
              timestamp: lastUpdated.toISOString()
            }));
          } catch (error) {
            console.warn("Error saving to cache:", error);
            // Continue anyway as this is a non-critical feature
          }
        }
      }
    } catch (error) {
      // Only handle error if not aborted and component still mounted
      if (error.name !== 'AbortError' && isMountedRef.current) {
        console.error("Error fetching data:", error);
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error("An error occurred while fetching data"),
          retryCount: retryAttempt
        }));
        
        // Handle retry logic
        if (retryOnError && retryAttempt < maxRetries) {
          const nextRetryDelay = retryDelay * Math.pow(2, retryAttempt);
          
          // Store timeout ID for cleanup
          retryTimeoutRef.current = window.setTimeout(() => {
            if (isMountedRef.current) {
              fetchData(retryAttempt + 1);
            }
          }, nextRetryDelay);
        }
      }
    }
  }, [fetchFn, retryOnError, maxRetries, retryDelay, cacheResults, cacheKey]);
  
  // Initial fetch on mount
  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, fetchOnMount]);
  
  // Refetch when dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  
  return {
    ...state,
    refetch: () => fetchData(0),
    cancelRequest: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    },
    resetState: () => setState({
      data: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      retryCount: 0
    }),
    clearCache: () => {
      if (cacheKey) {
        localStorage.removeItem(`data-fetch-${cacheKey}`);
      }
    }
  };
}
