
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
  }, []);
  
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
    
    // Optionally add to history immediately or defer to explicit save
  }, []);
  
  // Save the current state to history with a description
  const saveToHistory = useCallback((description: string = 'Update') => {
    addToHistory(currentData, description);
  }, [addToHistory, currentData]);
  
  // Undo to previous state
  const undo = useCallback(() => {
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
  
  // Redo to next state
  const redo = useCallback(() => {
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
    goToHistoryEntry
  };
}
