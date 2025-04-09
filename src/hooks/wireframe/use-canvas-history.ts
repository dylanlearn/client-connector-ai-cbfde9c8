
import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

interface UseCanvasHistoryOptions {
  canvas: fabric.Canvas | null;
  maxHistorySteps?: number;
  debounceMs?: number;
  saveInitialState?: boolean;
}

interface HistoryEntry {
  id: string;
  state: string;
  timestamp: number;
  description: string;
}

export default function useCanvasHistory({
  canvas,
  maxHistorySteps = 30,
  debounceMs = 500,
  saveInitialState = true
}: UseCanvasHistoryOptions) {
  const [historyStack, setHistoryStack] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  
  const pendingSaveRef = useRef<NodeJS.Timeout | null>(null);
  const ignoreChanges = useRef<boolean>(false);
  
  // Initialize history with current canvas state
  useEffect(() => {
    if (canvas && saveInitialState) {
      saveHistoryState('Initial state');
    }
  }, [canvas, saveInitialState]);
  
  // Update undo/redo availability
  useEffect(() => {
    setCanUndo(historyIndex > 0);
    setCanRedo(historyIndex < historyStack.length - 1);
  }, [historyIndex, historyStack.length]);
  
  // Set up canvas event listeners
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectModified = () => {
      if (ignoreChanges.current) return;
      debounceSaveHistory('Object modified');
    };
    
    const handleObjectAdded = (e: fabric.IEvent) => {
      if (ignoreChanges.current) return;
      
      // Skip temporary objects like selection borders
      if ((e.target as any)?.temporary) return;
      
      debounceSaveHistory('Object added');
    };
    
    const handleObjectRemoved = () => {
      if (ignoreChanges.current) return;
      debounceSaveHistory('Object removed');
    };
    
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas]);
  
  const debounceSaveHistory = useCallback((description: string) => {
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current);
    }
    
    pendingSaveRef.current = setTimeout(() => {
      saveHistoryState(description);
      pendingSaveRef.current = null;
    }, debounceMs);
  }, [debounceMs]);
  
  const saveHistoryState = useCallback((description: string = 'Canvas state') => {
    if (!canvas) return;
    
    const state = JSON.stringify(canvas.toJSON(['id', 'name', 'data']));
    const entry: HistoryEntry = {
      id: uuidv4(),
      state,
      timestamp: Date.now(),
      description
    };
    
    setHistoryStack(prevStack => {
      // If we're not at the end of the stack, remove future states
      const newStack = prevStack.slice(0, historyIndex + 1);
      
      // Add new state
      const updatedStack = [...newStack, entry];
      
      // Limit stack size
      if (updatedStack.length > maxHistorySteps) {
        return updatedStack.slice(updatedStack.length - maxHistorySteps);
      }
      
      return updatedStack;
    });
    
    setHistoryIndex(prev => {
      const newIndex = Math.min(prev + 1, maxHistorySteps - 1);
      return newIndex;
    });
  }, [canvas, historyIndex, maxHistorySteps]);
  
  const undo = useCallback(() => {
    if (!canvas || !canUndo) return;
    
    const newIndex = historyIndex - 1;
    const entry = historyStack[newIndex];
    
    if (entry) {
      ignoreChanges.current = true;
      
      canvas.loadFromJSON(JSON.parse(entry.state), () => {
        canvas.renderAll();
        ignoreChanges.current = false;
        setHistoryIndex(newIndex);
      });
    }
  }, [canvas, canUndo, historyIndex, historyStack]);
  
  const redo = useCallback(() => {
    if (!canvas || !canRedo) return;
    
    const newIndex = historyIndex + 1;
    const entry = historyStack[newIndex];
    
    if (entry) {
      ignoreChanges.current = true;
      
      canvas.loadFromJSON(JSON.parse(entry.state), () => {
        canvas.renderAll();
        ignoreChanges.current = false;
        setHistoryIndex(newIndex);
      });
    }
  }, [canvas, canRedo, historyIndex, historyStack]);
  
  const clearHistory = useCallback(() => {
    setHistoryStack([]);
    setHistoryIndex(-1);
  }, []);
  
  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory,
    saveHistoryState,
    historyStack,
    historyIndex
  };
}
