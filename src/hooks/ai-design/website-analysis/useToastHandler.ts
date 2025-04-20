
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useToastHandler() {
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, []);

  return { toast: showToast };
}
