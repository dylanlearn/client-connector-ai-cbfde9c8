
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';

export function useWireframeState() {
  const [wireframe, setWireframe] = useState<WireframeData | null>(null);
  const [isGenerating, setGenerating] = useState(false);
  const [error, setErrorState] = useState<Error | null>(null);
  const { toast } = useToast();

  const updateWireframe = useCallback((data: WireframeData | null) => {
    setWireframe(data);
    if (data) {
      toast({
        title: "Wireframe Updated",
        description: "Changes have been applied successfully"
      });
    }
  }, [toast]);

  const setError = useCallback((error: Error | null) => {
    setErrorState(error);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    wireframe,
    isGenerating,
    error,
    updateWireframe,
    setGenerating,
    setError
  };
}
