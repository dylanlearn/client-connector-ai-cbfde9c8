
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';

interface HistoryState {
  json: string;
  name: string;
  timestamp: number;
}

interface UseCanvasHistoryOptions {
  canvas: fabric.Canvas | null;
  maxHistorySteps?: number;
  saveInitialState?: boolean;
}

export default function useCanvasHistory({
  canvas,
  maxHistorySteps = 50,
  saveInitialState = false
}: UseCanvasHistoryOptions) {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isHistoryAction, setIsHistoryAction] = useState<boolean>(false);

  // Save the current state to history
  const saveHistoryState = useCallback((name: string = 'Canvas state') => {
    if (!canvas) return;
    
    const canvasJSON = JSON.stringify(canvas.toJSON(['id', 'name', 'data']));
    
    setHistory(prevHistory => {
      // Get the current history up to currentIndex
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push({
        json: canvasJSON,
        name,
        timestamp: Date.now()
      });
      
      // Limit history size
      if (newHistory.length > maxHistorySteps) {
        return newHistory.slice(newHistory.length - maxHistorySteps);
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      return Math.min(newIndex, maxHistorySteps - 1);
    });
  }, [canvas, currentIndex, maxHistorySteps]);
  
  // Undo the last action
  const undo = useCallback(() => {
    if (!canvas || currentIndex <= 0) return;
    
    setIsHistoryAction(true);
    
    const newIndex = currentIndex - 1;
    const stateToRestore = history[newIndex];
    
    if (stateToRestore) {
      canvas.loadFromJSON(JSON.parse(stateToRestore.json), () => {
        canvas.renderAll();
        setCurrentIndex(newIndex);
        setIsHistoryAction(false);
      });
    } else {
      setIsHistoryAction(false);
    }
  }, [canvas, currentIndex, history]);
  
  // Redo the last undone action
  const redo = useCallback(() => {
    if (!canvas || currentIndex >= history.length - 1) return;
    
    setIsHistoryAction(true);
    
    const newIndex = currentIndex + 1;
    const stateToRestore = history[newIndex];
    
    if (stateToRestore) {
      canvas.loadFromJSON(JSON.parse(stateToRestore.json), () => {
        canvas.renderAll();
        setCurrentIndex(newIndex);
        setIsHistoryAction(false);
      });
    } else {
      setIsHistoryAction(false);
    }
  }, [canvas, currentIndex, history]);
  
  // Initialize with canvas
  useEffect(() => {
    if (canvas && saveInitialState && history.length === 0) {
      saveHistoryState('Initial state');
    }
  }, [canvas, saveInitialState, history.length, saveHistoryState]);
  
  // Track whether undo/redo are available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  return {
    history,
    currentIndex,
    saveHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
    isHistoryAction
  };
}
