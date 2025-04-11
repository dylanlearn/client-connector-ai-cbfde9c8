
import { useState, useCallback, useRef, useEffect } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';

interface WireframeHistoryOptions {
  maxHistorySize?: number;
  autoSave?: boolean;
  debounceTime?: number;
  onSave?: (wireframe: WireframeData) => Promise<void>;
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
  const { 
    maxHistorySize = 50, 
    autoSave = false, 
    debounceTime = 500,
    onSave 
  } = options;
  
  // Initialize history state
  const [history, setHistory] = useState<WireframeHistoryState>({
    past: [],
    present: initialWireframe,
    future: [],
  });

  // Store the last action timestamp to prevent rapid history updates
  const lastActionTimestampRef = useRef<number>(0);
  
  // Store the debounced save timeout
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  
  // Update history when initialWireframe changes externally
  useEffect(() => {
    if (initialWireframe && !history.present) {
      setHistory({
        past: [],
        present: initialWireframe,
        future: [],
      });
    }
  }, [initialWireframe]);
  
  // Handle autosave
  const handleAutoSave = useCallback((wireframe: WireframeData) => {
    if (!autoSave || !onSave) return;
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set a new timeout for the save operation
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await onSave(wireframe);
      } catch (error) {
        console.error("Error autosaving wireframe:", error);
        toast({
          title: "Autosave failed",
          description: "Your changes couldn't be saved automatically",
          variant: "destructive",
          duration: 3000,
        });
      }
    }, debounceTime);
  }, [autoSave, onSave, toast, debounceTime]);
  
  // Update wireframe and add to history
  const updateWireframe = useCallback((
    newWireframe: WireframeData, 
    actionName?: string,
    skipHistory?: boolean
  ) => {
    // Prevent updates if there's no wireframe or new wireframe
    if (!newWireframe) return;
    
    const now = Date.now();
    // Don't add to history if update happens too quickly after the previous one or skipHistory is true
    const shouldAddToHistory = !skipHistory && now - lastActionTimestampRef.current > debounceTime;
    
    setHistory((prevHistory) => {
      const { past, present } = prevHistory;
      
      // If we should add to history and we have a present state
      if (shouldAddToHistory && present) {
        // Create new history state
        const newHistoryState = {
          past: [...past, present].slice(-maxHistorySize), // Limit history size
          present: newWireframe,
          future: [], // Clear redo history when a new action is performed
        };
        
        // Trigger autosave if enabled
        handleAutoSave(newWireframe);
        
        return newHistoryState;
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
          description: "Change has been added to history",
          duration: 1500,
        });
      }
    }
  }, [maxHistorySize, toast, handleAutoSave, debounceTime]);
  
  // Undo the last action
  const undo = useCallback(() => {
    setHistory((prevHistory) => {
      const { past, present, future } = prevHistory;
      
      if (past.length === 0 || !present) return prevHistory;
      
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      
      // Trigger autosave if enabled
      handleAutoSave(previous);
      
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
  }, [toast, handleAutoSave]);
  
  // Redo the last undone action
  const redo = useCallback(() => {
    setHistory((prevHistory) => {
      const { past, present, future } = prevHistory;
      
      if (future.length === 0 || !present) return prevHistory;
      
      const next = future[0];
      const newFuture = future.slice(1);
      
      // Trigger autosave if enabled
      handleAutoSave(next);
      
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
  }, [toast, handleAutoSave]);
  
  // Reset history with a new wireframe
  const resetHistory = useCallback((newWireframe: WireframeData | null) => {
    setHistory({
      past: [],
      present: newWireframe,
      future: [],
    });
    
    // Trigger autosave if enabled
    if (newWireframe) {
      handleAutoSave(newWireframe);
    }
    
    toast({
      title: "History Reset",
      description: "Wireframe history has been reset",
      duration: 1500,
    });
  }, [toast, handleAutoSave]);
  
  // Save current state explicitly
  const saveWireframe = useCallback(async () => {
    if (!onSave || !history.present) return false;
    
    try {
      await onSave(history.present);
      
      toast({
        title: "Saved",
        description: "Wireframe saved successfully",
        duration: 1500,
      });
      
      return true;
    } catch (error) {
      console.error("Error saving wireframe:", error);
      
      toast({
        title: "Save Failed",
        description: "Could not save wireframe",
        variant: "destructive",
        duration: 3000,
      });
      
      return false;
    }
  }, [history.present, onSave, toast]);
  
  // Add a snapshot to history without changing present state
  const addSnapshot = useCallback((snapshotName: string) => {
    if (!history.present) return;
    
    lastActionTimestampRef.current = Date.now();
    
    // We're simply adding the current state to history without changing it
    setHistory((prevHistory) => {
      const { past, present } = prevHistory;
      
      if (!present) return prevHistory;
      
      return {
        past: [...past, present].slice(-maxHistorySize),
        present,
        future: [], // Clear redo history when a snapshot is added
      };
    });
    
    toast({
      title: "Snapshot Added",
      description: `"${snapshotName}" snapshot saved to history`,
      duration: 1500,
    });
  }, [history.present, maxHistorySize, toast]);
  
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
    saveWireframe,
    addSnapshot,
    historySize: history.past.length + 1 + history.future.length,
    pastStates: history.past.length,
    futureStates: history.future.length,
  };
}
