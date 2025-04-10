
import { useState, useCallback, useEffect } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { toast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { v4 as uuidv4 } from 'uuid';

export interface HistoryState {
  wireframe: WireframeData;
  timestamp: number;
  id: string;
  description: string;
}

export interface UseWireframeHistoryOptions {
  wireframeId: string;
  initialWireframe?: WireframeData;
  maxHistoryStates?: number;
  onChange?: (wireframe: WireframeData) => void;
  saveToStorage?: boolean;
}

export function useWireframeHistory({
  wireframeId,
  initialWireframe,
  maxHistoryStates = 50,
  onChange,
  saveToStorage = true
}: UseWireframeHistoryOptions) {
  // Store history states
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isHistoryAction, setIsHistoryAction] = useState<boolean>(false);
  
  // Get storage key
  const storageKey = `wireframe-history-${wireframeId}`;
  
  // Local storage for history persistence
  const { getItem, setItem } = useLocalStorage();

  // Initialize history with the initial wireframe if provided
  useEffect(() => {
    if (initialWireframe && history.length === 0) {
      const initialState: HistoryState = {
        wireframe: JSON.parse(JSON.stringify(initialWireframe)), // Deep copy
        timestamp: Date.now(),
        id: uuidv4(),
        description: 'Initial state'
      };
      
      setHistory([initialState]);
      setCurrentIndex(0);
      
      // Save to localStorage if enabled
      if (saveToStorage) {
        setItem(storageKey, JSON.stringify([initialState]));
      }
    } else if (saveToStorage && history.length === 0) {
      // Try to load history from localStorage
      const savedHistory = getItem(storageKey);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory) as HistoryState[];
          setHistory(parsedHistory);
          setCurrentIndex(parsedHistory.length - 1);
        } catch (e) {
          console.error('Failed to parse wireframe history:', e);
        }
      }
    }
  }, [initialWireframe, history.length, saveToStorage, storageKey, getItem, setItem]);

  // Save wireframe state to history
  const saveHistoryState = useCallback((
    wireframe: WireframeData,
    description: string = 'Wireframe updated'
  ) => {
    const newState: HistoryState = {
      wireframe: JSON.parse(JSON.stringify(wireframe)), // Deep copy
      timestamp: Date.now(),
      id: uuidv4(),
      description
    };
    
    setHistory(prevHistory => {
      // If we're not at the end of the history, remove future states
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      
      // Add new state
      const updatedHistory = [...newHistory, newState];
      
      // Limit history size
      if (updatedHistory.length > maxHistoryStates) {
        const trimmedHistory = updatedHistory.slice(updatedHistory.length - maxHistoryStates);
        
        // Save to localStorage if enabled
        if (saveToStorage) {
          setItem(storageKey, JSON.stringify(trimmedHistory));
        }
        
        return trimmedHistory;
      }
      
      // Save to localStorage if enabled
      if (saveToStorage) {
        setItem(storageKey, JSON.stringify(updatedHistory));
      }
      
      return updatedHistory;
    });
    
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      return Math.min(newIndex, maxHistoryStates - 1);
    });
  }, [currentIndex, maxHistoryStates, saveToStorage, storageKey, setItem]);
  
  // Undo to previous state
  const undo = useCallback(() => {
    if (currentIndex <= 0) {
      toast('Nothing to undo');
      return null;
    }
    
    setIsHistoryAction(true);
    const newIndex = currentIndex - 1;
    const previousState = history[newIndex];
    
    setCurrentIndex(newIndex);
    
    if (onChange && previousState) {
      onChange(previousState.wireframe);
      
      toast(previousState.description || 'Previous change undone');
    }
    
    setIsHistoryAction(false);
    return previousState?.wireframe || null;
  }, [currentIndex, history, onChange]);
  
  // Redo to next state
  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) {
      toast('Nothing to redo');
      return null;
    }
    
    setIsHistoryAction(true);
    const newIndex = currentIndex + 1;
    const nextState = history[newIndex];
    
    setCurrentIndex(newIndex);
    
    if (onChange && nextState) {
      onChange(nextState.wireframe);
      
      toast(nextState.description || 'Next change redone');
    }
    
    setIsHistoryAction(false);
    return nextState?.wireframe || null;
  }, [currentIndex, history, onChange]);
  
  // Get current wireframe
  const getCurrentWireframe = useCallback(() => {
    if (history.length === 0 || currentIndex < 0) {
      return initialWireframe || null;
    }
    
    return history[currentIndex]?.wireframe || null;
  }, [history, currentIndex, initialWireframe]);
  
  // Check if undo/redo are available
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
    isHistoryAction,
    getCurrentWireframe
  };
}
