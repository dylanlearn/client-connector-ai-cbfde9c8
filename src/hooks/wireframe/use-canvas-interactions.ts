
import { useState, useCallback, useRef, RefObject, MouseEvent, WheelEvent } from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';

interface UseCanvasInteractionsProps {
  canvasRef: RefObject<HTMLDivElement>;
  panSpeed?: number;
  zoomSpeed?: number;
  minZoom?: number;
  maxZoom?: number;
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
  panSpeed = 1,
  zoomSpeed = 0.1,
  minZoom = 0.25,
  maxZoom = 3
}: UseCanvasInteractionsProps) {
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
    }
  }, [isSpacePressed, canvasSettings.panOffset]);
  
  // Handle mouse move - update position while dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.isDragging) {
      const deltaX = (e.clientX - dragState.startX) * panSpeed;
      const deltaY = (e.clientY - dragState.startY) * panSpeed;
      
      updateCanvasSettings({
        panOffset: {
          x: dragState.lastX + deltaX,
          y: dragState.lastY + deltaY
        }
      });
    }
  }, [dragState, updateCanvasSettings, panSpeed]);
  
  // Handle mouse up - stop dragging
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState(prev => ({
        ...prev,
        isDragging: false
      }));
      
      // Save state after pan for undo
      saveStateForUndo();
    }
  }, [dragState.isDragging, saveStateForUndo]);
  
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
        
        updateCanvasSettings({
          zoom: newZoom,
          panOffset: {
            x: newPanX,
            y: newPanY
          }
        });
        
        // Save state after zoom for undo
        saveStateForUndo();
      }
    }
  }, [canvasRef, canvasSettings, zoomSpeed, minZoom, maxZoom, updateCanvasSettings, saveStateForUndo]);
  
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
    saveStateForUndo();
  }, [canvasSettings.zoom, zoomSpeed, maxZoom, updateCanvasSettings, saveStateForUndo]);
  
  const zoomOut = useCallback(() => {
    const newZoom = Math.max(minZoom, canvasSettings.zoom - zoomSpeed);
    updateCanvasSettings({
      zoom: newZoom
    });
    saveStateForUndo();
  }, [canvasSettings.zoom, zoomSpeed, minZoom, updateCanvasSettings, saveStateForUndo]);
  
  const resetZoom = useCallback(() => {
    updateCanvasSettings({
      zoom: 1,
      panOffset: { x: 0, y: 0 }
    });
    saveStateForUndo();
  }, [updateCanvasSettings, saveStateForUndo]);
  
  const toggleGrid = useCallback(() => {
    updateCanvasSettings({
      showGrid: !canvasSettings.showGrid
    });
  }, [updateCanvasSettings, canvasSettings.showGrid]);
  
  const toggleSnapToGrid = useCallback(() => {
    updateCanvasSettings({
      snapToGrid: !canvasSettings.snapToGrid
    });
  }, [updateCanvasSettings, canvasSettings.snapToGrid]);
  
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
    isDragging: dragState.isDragging
  };
}
