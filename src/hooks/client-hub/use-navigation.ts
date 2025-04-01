
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

/**
 * Hook that handles navigation for client hub
 */
export function useNavigation() {
  const navigate = useNavigate();
  const [navigationError, setNavigationError] = useState<Error | null>(null);

  const navigateTo = (
    path: string, 
    clientToken: string | null, 
    designerId: string | null, 
    taskId: string
  ) => {
    try {
      setNavigationError(null);
      
      if (!path) {
        throw new Error('Navigation path is required');
      }
      
      if (!clientToken || !designerId) {
        throw new Error('Client token and designer ID are required for navigation');
      }
      
      if (!taskId) {
        throw new Error('Task ID is required for navigation');
      }
      
      navigate(`${path}?clientToken=${clientToken}&designerId=${designerId}&taskId=${taskId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      setNavigationError(error instanceof Error ? error : new Error('Unknown navigation error'));
    }
  };
  
  return { 
    navigateTo,
    navigationError
  };
}
