
import { useState, useCallback, useMemo } from 'react';
import { ViewMode } from '@/components/wireframe/controls/CanvasViewportControls';

export interface FocusArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useCanvasNavigation() {
  // State for canvas navigation parameters
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [focusArea, setFocusArea] = useState<FocusArea | null>(null);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.1));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  // Rotation controls
  const handleRotateClockwise = useCallback(() => {
    setRotation(prevRotation => (prevRotation + 15) % 360);
  }, []);

  const handleRotateCounterClockwise = useCallback(() => {
    setRotation(prevRotation => (prevRotation - 15 + 360) % 360);
  }, []);

  const handleRotateReset = useCallback(() => {
    setRotation(0);
  }, []);

  // Pan controls
  const handlePan = useCallback((x: number, y: number) => {
    setPan(prevPan => ({
      x: prevPan.x + x,
      y: prevPan.y + y
    }));
  }, []);

  const handlePanReset = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);
  
  // View mode toggle
  const toggleViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Focus area controls
  const applyFocusArea = useCallback((area: FocusArea) => {
    setFocusArea(area);
    // Adjust zoom and pan to focus on the area
    const targetZoom = 1.5; // Example zoom level for focused area
    setZoom(targetZoom);
    setPan({
      x: -area.x + (area.width / 2),
      y: -area.y + (area.height / 2)
    });
  }, []);

  const resetFocusArea = useCallback(() => {
    if (focusArea) {
      setFocusArea(null);
      handleZoomReset();
      handlePanReset();
    }
  }, [focusArea, handleZoomReset, handlePanReset]);

  // Combine all transformations
  const canvasTransform = useMemo(() => {
    return `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`;
  }, [zoom, rotation, pan]);

  return {
    zoom,
    rotation,
    pan,
    viewMode,
    focusArea,
    canvasTransform,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotateClockwise,
    handleRotateCounterClockwise,
    handleRotateReset,
    handlePan,
    handlePanReset,
    toggleViewMode,
    applyFocusArea,
    resetFocusArea
  };
}
