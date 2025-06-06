
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

export function useWireframeHistory(initialData: WireframeData | null = null) {
  const [history, setHistory] = useState<WireframeData[]>(initialData ? [initialData] : []);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentData = history[historyIndex];

  // Update wireframe function that accepts a message parameter for tracking changes
  const updateWireframe = useCallback((newData: WireframeData, message?: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newData];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history.length]);

  // Add aliases for the test
  const goBack = undo;
  const goForward = redo;

  // Clear history function
  const clearHistory = useCallback(() => {
    const current = currentData;
    setHistory(current ? [current] : []);
    setHistoryIndex(0);
  }, [currentData]);

  return {
    currentData,
    history,
    historyIndex,
    updateWireframe,
    undo,
    redo,
    // Add aliases for test compatibility
    goBack,
    goForward,
    clearHistory,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
}
