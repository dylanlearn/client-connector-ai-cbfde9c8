
import { useState, useCallback } from 'react';
import { WireframeData, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';

export interface UseWireframeStateProps {
  initialWireframe?: WireframeData | null;
  onWireframeUpdate?: (wireframe: WireframeData) => void;
}

export function useWireframeState({ 
  initialWireframe = null,
  onWireframeUpdate
}: UseWireframeStateProps = {}) {
  const [wireframe, setWireframe] = useState<WireframeData | null>(initialWireframe);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateWireframe = useCallback((newWireframe: WireframeData) => {
    setWireframe(newWireframe);
    onWireframeUpdate?.(newWireframe);
  }, [onWireframeUpdate]);

  const setGenerating = useCallback((generating: boolean) => {
    setIsGenerating(generating);
  }, []);

  const setErrorState = useCallback((error: Error | null) => {
    setError(error);
  }, []);

  return {
    wireframe,
    isGenerating,
    error,
    updateWireframe,
    setGenerating,
    setErrorState
  };
}
