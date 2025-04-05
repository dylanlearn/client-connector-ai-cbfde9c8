
/**
 * Records client errors to the monitoring service
 */
export const recordClientError = async (
  errorMessage: string,
  errorStack?: string | null,
  source?: string
): Promise<void> => {
  try {
    console.error(`[Client Error] ${source || 'Unknown'}: ${errorMessage}`);
    
    // In a production environment, you would send this to your backend
    // For now we'll just log it locally
    const errorData = {
      message: errorMessage,
      stack: errorStack || 'No stack trace available',
      source: source || 'Unknown',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Store in local storage for debugging (limit to last 10 errors)
    const storedErrors = JSON.parse(localStorage.getItem('clientErrors') || '[]');
    storedErrors.unshift(errorData);
    localStorage.setItem('clientErrors', JSON.stringify(storedErrors.slice(0, 10)));
    
  } catch (error) {
    // Don't let monitoring errors cause more issues
    console.error('Error recording client error:', error);
  }
};
