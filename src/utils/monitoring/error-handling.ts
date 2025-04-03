
import { recordClientError } from "./api-usage";

/**
 * Initialize global error handling
 */
export function initializeErrorHandling(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    console.error('Unhandled Promise Rejection:', error);
    
    recordClientError(
      error.message || 'Unhandled Promise Rejection',
      error.stack,
      'UnhandledRejection'
    ).catch(console.error);
  });
  
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    // Prevent logging of the same error twice
    if (event.error) {
      console.error('Uncaught Error:', event.error);
      
      recordClientError(
        event.error.message || 'Uncaught Error',
        event.error.stack,
        'GlobalErrorHandler'
      ).catch(console.error);
    }
  });
  
  // Handle network errors
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      // Log failed requests
      if (!response.ok) {
        const requestUrl = typeof args[0] === 'string' ? args[0] : args[0].url;
        console.warn(`Failed fetch request to ${requestUrl}, status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      // Log network errors
      console.error('Fetch error:', error);
      recordClientError(
        `Network request failed: ${error.message}`,
        error.stack,
        'FetchError'
      ).catch(console.error);
      
      throw error;
    }
  };
  
  console.log('Global error handling initialized');
}
