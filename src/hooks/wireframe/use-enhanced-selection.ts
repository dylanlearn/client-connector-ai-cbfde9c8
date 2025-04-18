
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { SelectionConfig } from '@/components/wireframe/layers/LayerTypes';

// Define selection modes
export type SelectionMode = 'normal' | 'multi' | 'group' | 'locked';

// Define enhanced selection options
export interface EnhancedSelectionOptions {
  allowMultiple?: boolean;
  lockSelection?: boolean;
  groupMode?: boolean;
  selectionStyle?: Partial<SelectionConfig['style']>;
  onSelect?: (objects: fabric.Object[]) => void;
  onDeselect?: () => void;
  onChange?: (objects: fabric.Object[]) => void;
}

/**
 * Enhanced selection hook with more features than the basic one
 */
export function useEnhancedSelection(canvas: fabric.Canvas | null, options: EnhancedSelectionOptions = {}) {
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('normal');
  const [selectionLocked, setSelectionLocked] = useState<boolean>(options.lockSelection || false);
  
  // Set up selection event handlers
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (e.selected && !selectionLocked) {
        const newSelection = e.selected;
        setSelectedObjects(newSelection);
        
        if (options.onSelect) {
          options.onSelect(newSelection);
        }
        if (options.onChange) {
          options.onChange(newSelection);
        }
      }
    };
    
    const handleSelectionUpdated = (e: fabric.IEvent) => {
      if (e.selected && !selectionLocked) {
        const updatedSelection = e.selected;
        setSelectedObjects(updatedSelection);
        
        if (options.onChange) {
          options.onChange(updatedSelection);
        }
      }
    };
    
    const handleSelectionCleared = () => {
      if (!selectionLocked) {
        setSelectedObjects([]);
        
        if (options.onDeselect) {
          options.onDeselect();
        }
        if (options.onChange) {
          options.onChange([]);
        }
      } else {
        // If selection is locked, reapply the selection
        if (selectedObjects.length > 0) {
          if (selectedObjects.length === 1) {
            canvas.setActiveObject(selectedObjects[0]);
          } else {
            const selection = new fabric.ActiveSelection(selectedObjects, { canvas });
            canvas.setActiveObject(selection);
          }
          canvas.requestRenderAll();
        }
      }
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    // Set initial selection mode
    if (options.groupMode) {
      setSelectionMode('group');
    } else if (options.allowMultiple) {
      setSelectionMode('multi');
    } else if (options.lockSelection) {
      setSelectionMode('locked');
    }
    
    // Apply any custom selection styling
    if (options.selectionStyle) {
      applySelectionStyles(options.selectionStyle);
    }
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, selectionLocked, options, selectedObjects]);
  
  // Apply default styling for selections
  useEffect(() => {
    if (!canvas) return;
    
    // Apply basic styling
    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: '#2196f3',
      cornerColor: '#2196f3',
      cornerStyle: 'circle',
      cornerSize: 8,
      padding: 5
    });
    
    canvas.selectionColor = 'rgba(33, 150, 243, 0.1)';
    canvas.selectionBorderColor = '#2196f3';
    canvas.selectionLineWidth = 1;
  }, [canvas]);
  
  // Apply custom styling to selection
  const applySelectionStyles = useCallback((styles: Partial<SelectionConfig['style']>) => {
    if (!canvas) return;
    
    // Create a full selection config with style property
    const fullConfig: SelectionConfig = {
      style: {
        transparentCorners: styles.transparentCorners !== undefined ? styles.transparentCorners : false,
        borderColor: styles.borderColor || '#2196f3',
        cornerColor: styles.cornerColor || '#2196f3',
        cornerStyle: styles.cornerStyle || 'circle',
        cornerSize: styles.cornerSize !== undefined ? styles.cornerSize : 8,
        cornerStrokeColor: styles.cornerStrokeColor || '#ffffff',
        selectionBackgroundColor: styles.selectionBackgroundColor || 'rgba(33, 150, 243, 0.1)'
      }
    };
    
    // Apply styling to fabric objects
    fabric.Object.prototype.set({
      transparentCorners: fullConfig.style.transparentCorners,
      borderColor: fullConfig.style.borderColor,
      cornerColor: fullConfig.style.cornerColor,
      cornerStyle: fullConfig.style.cornerStyle,
      cornerSize: fullConfig.style.cornerSize,
      cornerStrokeColor: fullConfig.style.cornerStrokeColor
    });
    
    // Apply canvas selection styles
    canvas.selectionColor = fullConfig.style.selectionBackgroundColor || 'rgba(33, 150, 243, 0.1)';
    canvas.selectionBorderColor = fullConfig.style.borderColor || '#2196f3';
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Lock current selection so it can't be changed
  const lockSelection = useCallback(() => {
    setSelectionLocked(true);
    setSelectionMode('locked');
  }, []);
  
  // Unlock selection
  const unlockSelection = useCallback(() => {
    setSelectionLocked(false);
    setSelectionMode(options.groupMode ? 'group' : options.allowMultiple ? 'multi' : 'normal');
  }, [options.groupMode, options.allowMultiple]);
  
  // Group selected objects
  const groupSelectedObjects = useCallback(() => {
    if (!canvas || selectedObjects.length < 2) return null;
    
    const group = new fabric.Group(selectedObjects);
    canvas.discardActiveObject();
    
    // Remove the selected objects
    selectedObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Add the group
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    
    setSelectedObjects([group]);
    return group;
  }, [canvas, selectedObjects]);
  
  // Ungroup a selected group
  const ungroupSelectedObject = useCallback(() => {
    if (!canvas || selectedObjects.length !== 1) return null;
    
    const selectedObject = selectedObjects[0];
    if (selectedObject.type !== 'group') return null;
    
    // Cast to Group type to access getObjects method
    const group = selectedObject as fabric.Group;
    const items = group.getObjects();
    
    // Ungroup and remove the group
    group.destroy();
    canvas.remove(group);
    
    // Add individual objects back
    const ungroupedObjects: fabric.Object[] = [];
    items.forEach((obj) => {
      canvas.add(obj);
      ungroupedObjects.push(obj);
    });
    
    // Select all the ungrouped objects
    const selection = new fabric.ActiveSelection(ungroupedObjects, { canvas });
    canvas.setActiveObject(selection);
    canvas.requestRenderAll();
    
    setSelectedObjects(ungroupedObjects);
    return ungroupedObjects;
  }, [canvas, selectedObjects]);
  
  // Bring selection forward
  const bringForward = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    
    selectedObjects.forEach(obj => {
      canvas.bringForward(obj);
    });
    canvas.requestRenderAll();
  }, [canvas, selectedObjects]);
  
  // Bring selection to front
  const bringToFront = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    
    selectedObjects.forEach(obj => {
      canvas.bringToFront(obj);
    });
    canvas.requestRenderAll();
  }, [canvas, selectedObjects]);
  
  // Send selection backward
  const sendBackward = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    
    selectedObjects.forEach(obj => {
      canvas.sendBackwards(obj);
    });
    canvas.requestRenderAll();
  }, [canvas, selectedObjects]);
  
  // Send selection to back
  const sendToBack = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    
    selectedObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    canvas.requestRenderAll();
  }, [canvas, selectedObjects]);
  
  return {
    selectedObjects,
    selectionMode,
    selectionLocked,
    lockSelection,
    unlockSelection,
    groupSelectedObjects,
    ungroupSelectedObject,
    bringForward,
    bringToFront,
    sendBackward,
    sendToBack,
    applySelectionStyles
  };
}

export default useEnhancedSelection;
