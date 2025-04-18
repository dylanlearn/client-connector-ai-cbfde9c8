
import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { SelectionConfig } from '@/components/wireframe/utils/types';

export interface SelectionHistoryEntry {
  objectIds: string[];
  timestamp: number;
}

export interface UseEnhancedSelectionOptions {
  canvas: fabric.Canvas | null;
  maxHistorySize?: number;
  selectionPriority?: 'front-to-back' | 'back-to-front';
  persistSelection?: boolean;
  initialSelectedIds?: string[];
}

/**
 * Enhanced hook for managing object selection with history support
 */
export function useEnhancedSelection({
  canvas,
  maxHistorySize = 10,
  selectionPriority = 'front-to-back',
  persistSelection = false,
  initialSelectedIds = []
}: UseEnhancedSelectionOptions) {
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [selectionHistory, setSelectionHistory] = useState<SelectionHistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const ignoreNextUpdate = useRef<boolean>(false);
  
  // Initialize selection if initialSelectedIds are provided
  useEffect(() => {
    if (canvas && initialSelectedIds.length > 0) {
      selectMultipleObjectsById(initialSelectedIds);
    }
  }, [canvas, initialSelectedIds]);
  
  // Set up selection event handlers
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (ignoreNextUpdate.current) {
        ignoreNextUpdate.current = false;
        return;
      }
      
      if (e.selected) {
        const newSelection = e.selected;
        setSelectedObjects(newSelection);
        setSelectedObject(newSelection[0] || null);
        
        // Add to selection history
        addToSelectionHistory(newSelection);
      }
    };
    
    const handleSelectionUpdated = (e: fabric.IEvent) => {
      if (ignoreNextUpdate.current) {
        ignoreNextUpdate.current = false;
        return;
      }
      
      if (e.selected) {
        const newSelection = e.selected;
        setSelectedObjects(newSelection);
        setSelectedObject(newSelection[0] || null);
        
        // Add to selection history
        addToSelectionHistory(newSelection);
      }
    };
    
    const handleSelectionCleared = () => {
      if (ignoreNextUpdate.current) {
        ignoreNextUpdate.current = false;
        return;
      }
      
      setSelectedObjects([]);
      setSelectedObject(null);
      
      // Add empty selection to history
      addToSelectionHistory([]);
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    // Handle keyboard shortcuts for selection history
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if target is an input element
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Alt+Left Arrow: Go back in selection history
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateSelectionHistory(-1);
      }
      
      // Alt+Right Arrow: Go forward in selection history
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        navigateSelectionHistory(1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, selectionHistory, historyIndex]);
  
  // Apply selection styling
  useEffect(() => {
    if (!canvas) return;
    
    // Apply default selection styling
    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: '#2196f3',
      cornerColor: '#2196f3',
      cornerStyle: 'circle',
      cornerSize: 10,
      padding: 5,
      cornerStrokeColor: '#ffffff'
    });
    
    canvas.selectionColor = 'rgba(33, 150, 243, 0.1)';
    canvas.selectionBorderColor = '#2196f3';
    canvas.selectionLineWidth = 1;
    
    canvas.renderAll();
  }, [canvas]);
  
  // Add to selection history
  const addToSelectionHistory = useCallback((objects: fabric.Object[]) => {
    setSelectionHistory(prev => {
      // Extract object IDs
      const objectIds = objects.map(obj => obj.data?.id || '').filter(id => id);
      
      // Create a new history entry
      const newEntry = {
        objectIds,
        timestamp: Date.now()
      };
      
      // Truncate history if we're not at the end (user went back in history)
      const updatedHistory = historyIndex >= 0 && historyIndex < prev.length - 1
        ? prev.slice(0, historyIndex + 1)
        : prev;
      
      // Add the new entry
      const newHistory = [...updatedHistory, newEntry].slice(-maxHistorySize);
      
      // Update history index
      setHistoryIndex(newHistory.length - 1);
      
      return newHistory;
    });
  }, [historyIndex, maxHistorySize]);
  
  // Navigate selection history
  const navigateSelectionHistory = useCallback((delta: number) => {
    if (!canvas) return;
    
    setHistoryIndex(prevIndex => {
      const newIndex = Math.max(0, Math.min(prevIndex + delta, selectionHistory.length - 1));
      
      // Apply the historical selection if it changed
      if (newIndex !== prevIndex && selectionHistory[newIndex]) {
        ignoreNextUpdate.current = true;
        const historyEntry = selectionHistory[newIndex];
        
        if (historyEntry.objectIds.length === 0) {
          // Clear selection
          canvas.discardActiveObject();
          setSelectedObjects([]);
          setSelectedObject(null);
        } else {
          // Restore selection
          selectMultipleObjectsById(historyEntry.objectIds, true);
        }
        
        canvas.requestRenderAll();
      }
      
      return newIndex;
    });
  }, [canvas, selectionHistory]);
  
  // Apply selection configuration
  const applySelectionConfig = useCallback((config: SelectionConfig) => {
    if (!canvas) return;
    
    // Apply selection styling
    fabric.Object.prototype.set({
      transparentCorners: config.style.transparentCorners,
      borderColor: config.style.borderColor,
      cornerColor: config.style.cornerColor,
      cornerStyle: config.style.cornerStyle,
      cornerSize: config.style.cornerSize,
      cornerStrokeColor: config.style.cornerStrokeColor
    });
    
    canvas.selectionColor = config.style.selectionBackgroundColor || 'rgba(33, 150, 243, 0.1)';
    canvas.selectionBorderColor = config.style.borderColor;
    
    canvas.renderAll();
  }, [canvas]);
  
  // Select object by ID
  const selectObjectById = useCallback((id: string, skipHistory = false) => {
    if (!canvas) return false;
    
    const objects = canvas.getObjects();
    let targetObject: fabric.Object | undefined;
    
    if (selectionPriority === 'front-to-back') {
      // Search from front to back (higher zIndex first)
      const sortedObjects = [...objects].sort((a, b) => 
        (b.zIndex || 0) - (a.zIndex || 0)
      );
      targetObject = sortedObjects.find(obj => obj.data?.id === id);
    } else {
      // Default search from back to front
      targetObject = objects.find(obj => obj.data?.id === id);
    }
    
    if (targetObject) {
      canvas.setActiveObject(targetObject);
      canvas.renderAll();
      setSelectedObject(targetObject);
      setSelectedObjects([targetObject]);
      
      if (!skipHistory) {
        addToSelectionHistory([targetObject]);
      }
      return true;
    }
    
    return false;
  }, [canvas, selectionPriority, addToSelectionHistory]);
  
  // Select multiple objects by IDs
  const selectMultipleObjectsById = useCallback((ids: string[], skipHistory = false) => {
    if (!canvas || ids.length === 0) return false;
    
    const objects = canvas.getObjects();
    const targetObjects = objects.filter(obj => obj.data?.id && ids.includes(obj.data.id));
    
    if (targetObjects.length > 0) {
      if (targetObjects.length === 1) {
        canvas.setActiveObject(targetObjects[0]);
      } else {
        const selection = new fabric.ActiveSelection(targetObjects, { canvas });
        canvas.setActiveObject(selection);
      }
      
      canvas.requestRenderAll();
      setSelectedObjects(targetObjects);
      setSelectedObject(targetObjects[0]);
      
      if (!skipHistory) {
        addToSelectionHistory(targetObjects);
      }
      return true;
    }
    
    return false;
  }, [canvas, addToSelectionHistory]);
  
  // Clear selection
  const clearSelection = useCallback((skipHistory = false) => {
    if (!canvas) return;
    
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
    setSelectedObjects([]);
    
    if (!skipHistory) {
      addToSelectionHistory([]);
    }
  }, [canvas, addToSelectionHistory]);
  
  // Get selection history data
  const getSelectionHistory = useCallback(() => {
    return {
      history: selectionHistory,
      currentIndex: historyIndex
    };
  }, [selectionHistory, historyIndex]);
  
  return {
    selectedObject,
    selectedObjects,
    selectObjectById,
    selectMultipleObjectsById,
    clearSelection,
    applySelectionConfig,
    selectionHistory,
    historyIndex,
    navigateSelectionHistory,
    getSelectionHistory
  };
}

export default useEnhancedSelection;
