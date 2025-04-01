
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook for client hub navigation with error handling
 */
export function useNavigation() {
  const navigate = useNavigate();
  const [navigationError, setNavigationError] = useState<Error | null>(null);

  const navigateTo = (
    path: string,
    clientToken: string | null,
    designerId: string | null,
    taskId: string | null
  ) => {
    try {
      if (!path) {
        throw new Error('Navigation path is required');
      }

      if (!clientToken || !designerId) {
        throw new Error('Client token and designer ID are required for navigation');
      }

      if (!taskId) {
        throw new Error('Task ID is required for navigation');
      }

      // Build query params
      const queryParams = new URLSearchParams();
      queryParams.append('clientToken', clientToken);
      queryParams.append('designerId', designerId);
      queryParams.append('taskId', taskId);

      // Navigate with query params
      const url = `${path}?${queryParams.toString()}`;
      console.log('Navigating to:', url);
      navigate(url);
      
      // Reset error state on successful navigation
      setNavigationError(null);
    } catch (error) {
      console.error('Navigation error:', error);
      setNavigationError(error instanceof Error ? error : new Error('Unknown navigation error'));
    }
  };

  return { navigateTo, navigationError };
}
