
import { useState, useCallback, useRef } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface HistoryEntry {
  wireframeData: WireframeData;
  timestamp: number;
  description: string;
}

interface UseWireframeHistoryOptions {
  maxHistorySize?: number;
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
}

export function useWireframeHistory(
  initialData: WireframeData,
  options: UseWireframeHistoryOptions = {}
) {
  const {
    maxHistorySize = 50,
    autoSave = false,
    autoSaveInterval = 30000 // 30 seconds
  } = options;
  
  const [currentData, setCurrentData] = useState<WireframeData>(initialData);
  const [history, setHistory] = useState<HistoryEntry[]>([{
    wireframeData: initialData,
    timestamp: Date.now(),
    description: 'Initial state'
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const isProcessingHistoryAction = useRef(false);
  const { toast } = useToast();
  
  // Update canUndo and canRedo whenever history or historyIndex changes
  useEffect(() => {
    setCanUndo(historyIndex > 0);
    setCanRedo(historyIndex < history.length - 1);
  }, [history, historyIndex]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;
    
    const timer = setInterval(() => {
      // Only save if changes have been made since last history entry
      const lastEntry = history[historyIndex];
      if (
        lastEntry && 
        JSON.stringify(lastEntry.wireframeData) !== JSON.stringify(currentData)
      ) {
        addToHistory(currentData, 'Auto-saved');
      }
    }, autoSaveInterval);
    
    return () => clearInterval(timer);
  }, [autoSave, autoSaveInterval, currentData, history, historyIndex]);
  
  // Add a new entry to the history
  const addToHistory = useCallback((
    data: WireframeData, 
    description: string = 'Update'
  ) => {
    if (isProcessingHistoryAction.current) return;
    
    setHistory(prevHistory => {
      // If we're not at the end of the history, remove all entries after the current index
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      
      // Add the new entry
      const newEntry: HistoryEntry = {
        wireframeData: JSON.parse(JSON.stringify(data)), // Deep clone to prevent mutation
        timestamp: Date.now(),
        description
      };
      
      // Add to history and trim if necessary
      const updatedHistory = [...newHistory, newEntry].slice(-maxHistorySize);
      
      // Update the history index to point to the new entry
      setHistoryIndex(updatedHistory.length - 1);
      
      return updatedHistory;
    });
  }, [historyIndex, maxHistorySize]);
  
  // Update the current data
  const updateWireframe = useCallback((updates: Partial<WireframeData>, description?: string) => {
    setCurrentData(prevData => {
      const newData = {
        ...prevData,
        ...updates
      };
      
      // Don't add to history here to prevent duplicate entries
      // History entry will be added explicitly when needed
      
      return newData;
    });
    
    // If description is provided, automatically add to history
    if (description) {
      addToHistory(currentData, description);
    }
  }, [currentData, addToHistory]);
  
  // Update a specific section
  const updateSection = useCallback((sectionId: string, updates: Partial<WireframeSection>, description?: string) => {
    setCurrentData(prevData => {
      const newSections = prevData.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      );
      
      return {
        ...prevData,
        sections: newSections
      };
    });
    
    // If description is provided, automatically add to history
    if (description) {
      addToHistory(currentData, description);
    }
  }, [currentData, addToHistory]);
  
  // Save the current state to history with a description
  const saveToHistory = useCallback((description: string = 'Update') => {
    addToHistory(currentData, description);
  }, [addToHistory, currentData]);
  
  // Undo to previous state - renamed to goBack for test compatibility
  const goBack = useCallback(() => {
    if (historyIndex <= 0 || isProcessingHistoryAction.current) return;
    
    isProcessingHistoryAction.current = true;
    
    const prevIndex = historyIndex - 1;
    const prevEntry = history[prevIndex];
    
    setCurrentData(prevEntry.wireframeData);
    setHistoryIndex(prevIndex);
    
    toast({
      title: 'Undo Successful',
      description: `Reverted to: ${prevEntry.description}`,
      duration: 2000
    });
    
    isProcessingHistoryAction.current = false;
  }, [history, historyIndex, toast]);
  
  // Alias for goBack for API compatibility
  const undo = goBack;
  
  // Redo to next state - renamed to goForward for test compatibility
  const goForward = useCallback(() => {
    if (historyIndex >= history.length - 1 || isProcessingHistoryAction.current) return;
    
    isProcessingHistoryAction.current = true;
    
    const nextIndex = historyIndex + 1;
    const nextEntry = history[nextIndex];
    
    setCurrentData(nextEntry.wireframeData);
    setHistoryIndex(nextIndex);
    
    toast({
      title: 'Redo Successful',
      description: `Restored: ${nextEntry.description}`,
      duration: 2000
    });
    
    isProcessingHistoryAction.current = false;
  }, [history, historyIndex, toast]);
  
  // Alias for goForward for API compatibility
  const redo = goForward;
  
  // Go to a specific history entry
  const goToHistoryEntry = useCallback((index: number) => {
    if (index < 0 || index >= history.length || isProcessingHistoryAction.current) return;
    
    isProcessingHistoryAction.current = true;
    
    const entry = history[index];
    setCurrentData(entry.wireframeData);
    setHistoryIndex(index);
    
    toast({
      title: 'History Navigation',
      description: `Jumped to: ${entry.description}`,
      duration: 2000
    });
    
    isProcessingHistoryAction.current = false;
  }, [history, toast]);
  
  // Clear history - renamed from clearHistory for test compatibility
  const clearHistory = useCallback(() => {
    setHistory([{
      wireframeData: currentData,
      timestamp: Date.now(),
      description: 'Reset history'
    }]);
    setHistoryIndex(0);
  }, [currentData]);
  
  // Reset history with a new wireframe
  const resetHistory = useCallback((newWireframe: WireframeData) => {
    setCurrentData(newWireframe);
    clearHistory();
  }, [clearHistory]);
  
  // Add a snapshot without changing the current state
  const addSnapshot = useCallback((snapshotName: string) => {
    addToHistory(currentData, snapshotName);
  }, [addToHistory, currentData]);
  
  // Calculate history size stats
  const historySize = history.length;
  const pastStates = historyIndex;
  const futureStates = history.length - historyIndex - 1;
  
  return {
    currentData,
    history,
    historyIndex,
    canUndo,
    canRedo,
    updateWireframe,
    updateSection,
    saveToHistory,
    undo,
    redo,
    goToHistoryEntry,
    // Compatibility with test cases
    goBack,
    goForward,
    clearHistory,
    // Additional features
    resetHistory,
    addSnapshot,
    historySize,
    pastStates,
    futureStates,
    // Also expose the current data as wireframe for use-wireframe-editor
    wireframe: currentData
  };
}

// Export the hook as default
export default useWireframeHistory;
