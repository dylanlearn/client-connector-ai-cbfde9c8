
import { recordClientError } from "./api-usage";
import { getErrorHandlingConfig } from "./error-config";

/**
 * Initialize global error handling
 */
export function initializeErrorHandling(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', async (event) => {
    const error = event.reason;
    console.error('Unhandled Promise Rejection:', error);
    
    // Check if we have custom handling config for this error type
    const config = await getErrorHandlingConfig('Global', 'UnhandledRejection');
    
    // Record the client error with appropriate metadata
    recordClientError(
      error.message || 'Unhandled Promise Rejection',
      error.stack
    ).catch(console.error);
  });
  
  // Handle uncaught errors
  window.addEventListener('error', async (event) => {
    // Prevent logging of the same error twice
    if (event.error) {
      console.error('Uncaught Error:', event.error);
      
      // Check if we have custom handling config for this error type
      const config = await getErrorHandlingConfig('Global', 'UncaughtError');
      
      recordClientError(
        event.error.message || 'Uncaught Error',
        event.error.stack
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
        const requestUrl = typeof args[0] === 'string' 
          ? args[0] 
          : args[0] instanceof URL 
            ? args[0].href 
            : (args[0] as Request).url;
            
        // Check if we have custom handling config for network errors
        const config = await getErrorHandlingConfig('API', 'network');
        
        console.warn(`Failed fetch request to ${requestUrl}, status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      // Log network errors
      console.error('Fetch error:', error);
      
      // Check if we have custom handling config for network errors
      const config = await getErrorHandlingConfig('API', 'network');
      
      recordClientError(
        `Network request failed: ${(error as Error).message}`,
        (error as Error).stack
      ).catch(console.error);
      
      throw error;
    }
  };
  
  console.log('Global error handling initialized with dynamic configuration');
}
