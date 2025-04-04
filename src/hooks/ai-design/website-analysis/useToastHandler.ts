
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

/**
 * Hook for handling toast notifications with fallback
 */
export function useToastHandler() {
  // Use toast from sonner if useToast hook fails (fallback)
  let toastHandler;
  try {
    toastHandler = useToast();
  } catch (e) {
    // If useToast fails, we'll use sonner's toast directly
    toastHandler = { 
      toast: (args: any) => {
        toast[args.variant === 'destructive' ? 'error' : 'success'](args.title, {
          description: args.description
        });
      }
    };
  }
  
  return toastHandler;
}
