import { useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric'; // Import fabric properly
import { WireframeCanvasConfig } from '@/services/ai/wireframe/wireframe-types';

interface CanvasInteractionsProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  initialConfig: WireframeCanvasConfig;
  onConfigChange: (config: Partial<WireframeCanvasConfig>) => void;
}

interface CanvasInteractionsResult {
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleWheel: (e: React.WheelEvent) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  isDragging: boolean;
  isSpacePressed: boolean;
}

export function useCanvasInteractions({
  canvasRef,
  initialConfig,
  onConfigChange
}: CanvasInteractionsProps): CanvasInteractionsResult {
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [config, setConfig] = useState<WireframeCanvasConfig>(initialConfig);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  // Function to update the pan offset
  const updatePanOffset = useCallback(
    (deltaX: number, deltaY: number) => {
      const newX = config.panOffset.x + deltaX;
      const newY = config.panOffset.y + deltaY;
      
      // Create a fabric Point for consistent panning
      const point = new fabric.Point(newX, newY);
      
      onConfigChange({ panOffset: { x: newX, y: newY } });
    },
    [config, onConfigChange]
  );

  const zoomIn = useCallback(() => {
    onConfigChange({ zoom: Math.min(3, config.zoom + 0.1) });
  }, [config.zoom, onConfigChange]);

  const zoomOut = useCallback(() => {
    onConfigChange({ zoom: Math.max(0.1, config.zoom - 0.1) });
  }, [config.zoom, onConfigChange]);

  const resetZoom = useCallback(() => {
    onConfigChange({ zoom: 1, panOffset: { x: 0, y: 0 } });
  }, [onConfigChange]);
  
  const toggleGrid = useCallback(() => {
    onConfigChange({ showGrid: !config.showGrid });
  }, [config.showGrid, onConfigChange]);
  
  const toggleSnapToGrid = useCallback(() => {
    onConfigChange({ snapToGrid: !config.snapToGrid });
  }, [config.snapToGrid, onConfigChange]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isSpacePressed && canvasRef.current) {
        setIsDragging(true);
        canvasRef.current.style.cursor = 'grabbing';
      }
    },
    [isSpacePressed]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !canvasRef.current) return;

      const deltaX = e.movementX;
      const deltaY = e.movementY;
      updatePanOffset(deltaX, deltaY);
    },
    [isDragging, updatePanOffset, canvasRef]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging && canvasRef.current) {
      setIsDragging(false);
      canvasRef.current.style.cursor = isSpacePressed ? 'grab' : 'default';
    }
  }, [isDragging, isSpacePressed, canvasRef]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const zoomAmount = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(3, config.zoom + zoomAmount));
      onConfigChange({ zoom: newZoom });
    },
    [config.zoom, onConfigChange]
  );

  // Keyboard event handlers
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
      setIsDragging(false);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    }
  }, [canvasRef]);

  // Function to create a snap grid
  const createSnapGrid = useCallback(
    (canvas: fabric.Canvas, gridSize: number) => {
      const width = canvas.getWidth();
      const height = canvas.getHeight();

      for (let i = 0; i < width / gridSize; i++) {
        canvas.add(
          new fabric.Line([i * gridSize, 0, i * gridSize, height], {
            stroke: '#e0e0e0',
            selectable: false,
            evented: false,
            strokeWidth: 1
          })
        );
      }

      for (let i = 0; i < height / gridSize; i++) {
        canvas.add(
          new fabric.Line([0, i * gridSize, width, i * gridSize], {
            stroke: '#e0e0e0',
            selectable: false,
            evented: false,
            strokeWidth: 1
          })
        );
      }
    },
    []
  );

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
    isDragging,
    isSpacePressed
  };
}
