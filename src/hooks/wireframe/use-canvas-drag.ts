
import { useState, useCallback, useEffect, RefObject } from 'react';

export interface UseDragOptions {
  enabled?: boolean;
  onDrag?: (deltaX: number, deltaY: number) => void;
  dragButton?: number; // 0 = left click, 1 = middle click, 2 = right click
}

export function useCanvasDrag(
  containerRef: RefObject<HTMLElement>,
  options: UseDragOptions = {}
) {
  const {
    enabled = true,
    onDrag,
    dragButton = 1, // Default to middle mouse button for dragging
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      // Check if it's the right mouse button or if space is pressed with left click
      if ((e.button === dragButton) || (spacePressed && e.button === 0)) {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [dragButton, spacePressed]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && enabled) {
        e.preventDefault();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        if (onDrag) {
          onDrag(deltaX, deltaY);
        }
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragStart, enabled, onDrag]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setSpacePressed(true);
      // Change cursor to indicate panning is available
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  }, [containerRef]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setSpacePressed(false);
      // Reset cursor
      if (containerRef.current) {
        containerRef.current.style.cursor = 'default';
      }
    }
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleKeyUp
  ]);

  return {
    isDragging,
    spacePressed
  };
}
