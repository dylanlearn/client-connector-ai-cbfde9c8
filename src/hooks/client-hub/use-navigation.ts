
import { useNavigate } from 'react-router-dom';

/**
 * Hook that handles navigation for client hub
 */
export function useNavigation() {
  const navigate = useNavigate();

  const navigateTo = (
    path: string, 
    clientToken: string | null, 
    designerId: string | null, 
    taskId: string
  ) => {
    if (clientToken && designerId) {
      navigate(`${path}?clientToken=${clientToken}&designerId=${designerId}&taskId=${taskId}`);
    }
  };
  
  return { navigateTo };
}
