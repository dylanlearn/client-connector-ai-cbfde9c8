
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

export function useWireframeHistory(initialData: WireframeData | null = null) {
  const [history, setHistory] = useState<WireframeData[]>(initialData ? [initialData] : []);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentData = history[historyIndex];

  const updateWireframe = useCallback((newData: WireframeData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newData];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history.length]);

  return {
    currentData,
    history,
    historyIndex,
    updateWireframe,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
}
