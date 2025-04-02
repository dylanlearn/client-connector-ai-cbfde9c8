
import { useState, useEffect, useCallback } from "react";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
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
}

/**
 * Generic hook for consistent data fetching patterns
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
    maxRetries = 3 
  } = options;
  
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  });
  
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await fetchFn();
      setState({
        data: result,
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      });
      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("An error occurred while fetching data")
      }));
      
      // Handle retry logic
      if (retryOnError && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        // Exponential backoff for retries
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(fetchData, delay);
      }
    }
  }, [fetchFn, retryOnError, maxRetries, retryCount]);
  
  // Initial fetch on mount
  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchData, fetchOnMount]);
  
  // Refetch when dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      fetchData();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    ...state,
    refetch: fetchData,
    resetState: () => setState({
      data: null,
      isLoading: false,
      error: null,
      lastUpdated: null
    })
  };
}
