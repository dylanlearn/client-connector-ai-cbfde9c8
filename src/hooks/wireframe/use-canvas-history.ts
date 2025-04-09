
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { CanvasHistoryEntry } from '@/components/wireframe/utils/types';
import { v4 as uuidv4 } from 'uuid';

export interface UseCanvasHistoryOptions {
  canvas: fabric.Canvas | null;
  maxHistorySteps?: number;
  debounceTime?: number;
  onChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export function useCanvasHistory({
  canvas,
  maxHistorySteps = 30,
  debounceTime = 300,
  onChange
}: UseCanvasHistoryOptions) {
  const [history, setHistory] = useState<CanvasHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  const canUndo = currentIndex > 0;
  const canRedo = history.length > 0 && currentIndex < history.length - 1;
  
  // Notify parent component when undo/redo availability changes
  useEffect(() => {
    if (onChange) {
      onChange(canUndo, canRedo);
    }
  }, [canUndo, canRedo, onChange]);

  // Save the canvas state to history
  const saveHistoryState = useCallback((description = 'Canvas updated') => {
    if (!canvas || isSaving) return;
    
    // Generate canvas JSON
    const json = canvas.toJSON(['id', 'name', 'data', 'selectable', 'evented']);
    const snapshot = JSON.stringify(json);
    
    setHistory(prev => {
      // Create new history entry
      const newEntry: CanvasHistoryEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        snapshot: snapshot,
        description
      };
      
      // Remove any future history entries if we've performed an action after undoing
      const historyCut = prev.slice(0, currentIndex + 1);
      
      // Add the new entry and limit history size
      const newHistory = [...historyCut, newEntry].slice(-maxHistorySteps);
      
      // Update the current index
      setCurrentIndex(newHistory.length - 1);
      
      return newHistory;
    });
  }, [canvas, currentIndex, isSaving, maxHistorySteps]);
  
  // Debounced history save to prevent too many saves during operations like dragging
  const debouncedSaveHistoryState = useCallback((description: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      saveHistoryState(description);
    }, debounceTime);
    
    setDebounceTimeout(timeout);
  }, [debounceTimeout, debounceTime, saveHistoryState]);
  
  // Undo last action
  const undo = useCallback(() => {
    if (!canvas || !canUndo) return;
    
    setIsSaving(true);
    const newIndex = currentIndex - 1;
    const historyEntry = history[newIndex];
    
    try {
      canvas.loadFromJSON(JSON.parse(historyEntry.snapshot), () => {
        canvas.renderAll();
        setCurrentIndex(newIndex);
        setIsSaving(false);
      });
    } catch (error) {
      console.error('Error during undo operation:', error);
      setIsSaving(false);
    }
  }, [canvas, canUndo, currentIndex, history]);
  
  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas || !canRedo) return;
    
    setIsSaving(true);
    const newIndex = currentIndex + 1;
    const historyEntry = history[newIndex];
    
    try {
      canvas.loadFromJSON(JSON.parse(historyEntry.snapshot), () => {
        canvas.renderAll();
        setCurrentIndex(newIndex);
        setIsSaving(false);
      });
    } catch (error) {
      console.error('Error during redo operation:', error);
      setIsSaving(false);
    }
  }, [canvas, canRedo, currentIndex, history]);
  
  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);
  
  // Set up canvas event listeners for automatic history tracking
  useEffect(() => {
    if (!canvas) return;
    
    // Save initial state when canvas is ready
    if (history.length === 0) {
      saveHistoryState('Initial state');
    }
    
    // Save state after object modifications
    const handleObjectModified = (e: any) => {
      debouncedSaveHistoryState('Object modified');
    };
    
    // Save state after adding objects
    const handleObjectAdded = (e: any) => {
      // Don't save history for temporary objects or guides
      if (e.target && (e.target.isGuide || e.target.temporary)) return;
      
      debouncedSaveHistoryState('Object added');
    };
    
    // Save state after removing objects
    const handleObjectRemoved = (e: any) => {
      debouncedSaveHistoryState('Object removed');
    };
    
    // Add event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Clean up event listeners
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [canvas, debouncedSaveHistoryState, debounceTimeout, history.length, saveHistoryState]);
  
  return {
    history,
    currentIndex,
    saveHistoryState,
    debouncedSaveHistoryState,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo
  };
}

export default useCanvasHistory;
