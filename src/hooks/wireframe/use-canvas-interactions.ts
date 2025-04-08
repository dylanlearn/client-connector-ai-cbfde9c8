
import { useState, useCallback, useRef, RefObject, MouseEvent, WheelEvent } from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';
import { useFabric } from '@/hooks/use-fabric';
import { WireframeCanvasConfig } from '@/services/ai/wireframe/wireframe-types';

interface UseCanvasInteractionsProps {
  canvasRef: RefObject<HTMLDivElement>;
  fabricRef?: RefObject<HTMLCanvasElement>;
  panSpeed?: number;
  zoomSpeed?: number;
  minZoom?: number;
  maxZoom?: number;
  onConfigChange?: (config: Partial<WireframeCanvasConfig>) => void;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
}

export function useCanvasInteractions({
  canvasRef,
  fabricRef,
  panSpeed = 1,
  zoomSpeed = 0.1,
  minZoom = 0.25,
  maxZoom = 3,
  onConfigChange
}: UseCanvasInteractionsProps) {
  // Get fabric canvas instance if available
  const { fabricCanvas } = useFabric({ persistConfig: true });
  
  const updateCanvasSettings = useWireframeStore(state => state.updateCanvasSettings);
  const canvasSettings = useWireframeStore(state => state.canvasSettings);
  const saveStateForUndo = useWireframeStore(state => state.saveStateForUndo);
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  });
  
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  
  // Handle mouse down - start dragging
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Only enable dragging if space is pressed (for pan mode) or if we're dragging a component
    if (isSpacePressed || e.button === 1) { // Middle mouse button
      e.preventDefault();
      
      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        lastX: canvasSettings.panOffset.x,
        lastY: canvasSettings.panOffset.y
      });
      
      // Disable other fabric.js interactions while panning
      if (fabricCanvas) {
        fabricCanvas.selection = false;
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
      }
    }
  }, [isSpacePressed, canvasSettings.panOffset, fabricCanvas]);
  
  // Handle mouse move - update position while dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.isDragging) {
      const deltaX = (e.clientX - dragState.startX) * panSpeed;
      const deltaY = (e.clientY - dragState.startY) * panSpeed;
      
      const newPanOffset = {
        x: dragState.lastX + deltaX,
        y: dragState.lastY + deltaY
      };
      
      // Update canvas settings in store
      updateCanvasSettings({
        panOffset: newPanOffset
      });
      
      // If we have access to the fabricCanvas, update its viewport transform
      if (fabricCanvas) {
        fabricCanvas.absolutePan({
          x: -newPanOffset.x,
          y: -newPanOffset.y
        } as fabric.Point);
      }
      
      // Notify parent component about config changes if needed
      if (onConfigChange) {
        onConfigChange({
          panOffset: newPanOffset
        });
      }
    }
  }, [dragState, updateCanvasSettings, panSpeed, fabricCanvas, onConfigChange]);
  
  // Handle mouse up - stop dragging
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState(prev => ({
        ...prev,
        isDragging: false
      }));
      
      // Re-enable fabric.js interactions
      if (fabricCanvas) {
        fabricCanvas.selection = true;
      }
      
      // Save state after pan for undo
      saveStateForUndo();
    }
  }, [dragState.isDragging, saveStateForUndo, fabricCanvas]);
  
  // Handle mouse wheel - zoom in/out
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const direction = e.deltaY > 0 ? -1 : 1;
      const factor = direction * zoomSpeed;
      const newZoom = Math.min(maxZoom, Math.max(minZoom, canvasSettings.zoom + factor));
      
      // Calculate zoom origin (pointer position)
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate new pan offset to zoom toward mouse position
        const zoomFactor = newZoom / canvasSettings.zoom;
        const newPanX = mouseX - (mouseX - canvasSettings.panOffset.x) * zoomFactor;
        const newPanY = mouseY - (mouseY - canvasSettings.panOffset.y) * zoomFactor;
        
        const newPanOffset = {
          x: newPanX,
          y: newPanY
        };
        
        // Update canvas settings in store
        updateCanvasSettings({
          zoom: newZoom,
          panOffset: newPanOffset
        });
        
        // Update fabric.js zoom if available
        if (fabricCanvas) {
          fabricCanvas.setZoom(newZoom);
          fabricCanvas.absolutePan({
            x: -newPanOffset.x,
            y: -newPanOffset.y
          } as fabric.Point);
        }
        
        // Notify parent component about config changes if needed
        if (onConfigChange) {
          onConfigChange({
            zoom: newZoom,
            panOffset: newPanOffset
          });
        }
        
        // Save state after zoom for undo
        saveStateForUndo();
      }
    }
  }, [canvasRef, fabricCanvas, canvasSettings, zoomSpeed, minZoom, maxZoom, 
      updateCanvasSettings, saveStateForUndo, onConfigChange]);
  
  // Handle keyboard events for space bar to activate panning
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isSpacePressed) {
      setIsSpacePressed(true);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grab';
      }
    }
  }, [isSpacePressed, canvasRef]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    }
  }, [canvasRef]);
  
  // Functions to control zoom and grid
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(maxZoom, canvasSettings.zoom + zoomSpeed);
    
    updateCanvasSettings({
      zoom: newZoom
    });
    
    if (fabricCanvas) {
      fabricCanvas.setZoom(newZoom);
    }
    
    if (onConfigChange) {
      onConfigChange({ zoom: newZoom });
    }
    
    saveStateForUndo();
  }, [canvasSettings.zoom, zoomSpeed, maxZoom, updateCanvasSettings, 
      saveStateForUndo, fabricCanvas, onConfigChange]);
  
  const zoomOut = useCallback(() => {
    const newZoom = Math.max(minZoom, canvasSettings.zoom - zoomSpeed);
    
    updateCanvasSettings({
      zoom: newZoom
    });
    
    if (fabricCanvas) {
      fabricCanvas.setZoom(newZoom);
    }
    
    if (onConfigChange) {
      onConfigChange({ zoom: newZoom });
    }
    
    saveStateForUndo();
  }, [canvasSettings.zoom, zoomSpeed, minZoom, updateCanvasSettings, 
      saveStateForUndo, fabricCanvas, onConfigChange]);
  
  const resetZoom = useCallback(() => {
    updateCanvasSettings({
      zoom: 1,
      panOffset: { x: 0, y: 0 }
    });
    
    if (fabricCanvas) {
      fabricCanvas.setZoom(1);
      fabricCanvas.absolutePan(new fabric.Point(0, 0));
    }
    
    if (onConfigChange) {
      onConfigChange({
        zoom: 1,
        panOffset: { x: 0, y: 0 }
      });
    }
    
    saveStateForUndo();
  }, [updateCanvasSettings, saveStateForUndo, fabricCanvas, onConfigChange]);
  
  const toggleGrid = useCallback(() => {
    const newShowGrid = !canvasSettings.showGrid;
    
    updateCanvasSettings({
      showGrid: newShowGrid
    });
    
    if (onConfigChange) {
      onConfigChange({ showGrid: newShowGrid });
    }
  }, [updateCanvasSettings, canvasSettings.showGrid, onConfigChange]);
  
  const toggleSnapToGrid = useCallback(() => {
    const newSnapToGrid = !canvasSettings.snapToGrid;
    
    updateCanvasSettings({
      snapToGrid: newSnapToGrid
    });
    
    if (onConfigChange) {
      onConfigChange({ snapToGrid: newSnapToGrid });
    }
  }, [updateCanvasSettings, canvasSettings.snapToGrid, onConfigChange]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    isSpacePressed,
    isDragging: dragState.isDragging,
    canvasConfig: canvasSettings
  };
}
