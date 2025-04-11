
import { useState, useCallback, useRef } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';

interface WireframeHistoryOptions {
  maxHistorySize?: number;
  autoSave?: boolean;
}

interface WireframeHistoryState {
  past: WireframeData[];
  present: WireframeData | null;
  future: WireframeData[];
}

export function useWireframeHistory(
  initialWireframe: WireframeData | null, 
  options: WireframeHistoryOptions = {}
) {
  // Set default options
  const { maxHistorySize = 50, autoSave = false } = options;
  
  // Initialize history state
  const [history, setHistory] = useState<WireframeHistoryState>({
    past: [],
    present: initialWireframe,
    future: [],
  });

  // Store the last action timestamp to prevent rapid history updates
  const lastActionTimestampRef = useRef<number>(0);
  const { toast } = useToast();
  
  // Update wireframe and add to history
  const updateWireframe = useCallback((newWireframe: WireframeData, actionName?: string) => {
    // Prevent updates if there's no current wireframe
    if (!newWireframe) return;
    
    const now = Date.now();
    // Don't add to history if update happens too quickly after the previous one (debounce)
    const shouldAddToHistory = now - lastActionTimestampRef.current > 500;
    
    setHistory((prevHistory) => {
      const { past, present } = prevHistory;
      
      // If we should add to history and we have a present state
      if (shouldAddToHistory && present) {
        return {
          past: [...past, present].slice(-maxHistorySize), // Limit history size
          present: newWireframe,
          future: [], // Clear redo history when a new action is performed
        };
      } else {
        // Just update the present state without affecting history
        return {
          ...prevHistory,
          present: newWireframe,
        };
      }
    });
    
    if (shouldAddToHistory) {
      lastActionTimestampRef.current = now;
      
      // Show toast notification for action
      if (actionName) {
        toast({
          title: `Action: ${actionName}`,
          description: "Change has been applied and added to history",
          duration: 1500,
        });
      }
      
      // If autoSave is enabled, we could implement saving logic here
      if (autoSave) {
        // Implement autosave logic if needed
      }
    }
  }, [maxHistorySize, toast, autoSave]);
  
  // Undo the last action
  const undo = useCallback(() => {
    setHistory((prevHistory) => {
      const { past, present, future } = prevHistory;
      
      if (past.length === 0 || !present) return prevHistory;
      
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      
      toast({
        title: "Undo",
        description: "Previous state restored",
        duration: 1500,
      });
      
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, [toast]);
  
  // Redo the last undone action
  const redo = useCallback(() => {
    setHistory((prevHistory) => {
      const { past, present, future } = prevHistory;
      
      if (future.length === 0 || !present) return prevHistory;
      
      const next = future[0];
      const newFuture = future.slice(1);
      
      toast({
        title: "Redo",
        description: "Change reapplied",
        duration: 1500,
      });
      
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, [toast]);
  
  // Reset history with a new wireframe
  const resetHistory = useCallback((newWireframe: WireframeData | null) => {
    setHistory({
      past: [],
      present: newWireframe,
      future: [],
    });
  }, []);
  
  // Check if undo/redo are available
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  
  return {
    wireframe: history.present,
    updateWireframe,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    historySize: history.past.length + 1 + history.future.length,
  };
}
