
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { AlignmentGuide, DropZoneIndicator } from '@/components/wireframe/utils/types';

interface DragEnhancementHandlerProps {
  canvas: fabric.Canvas | null;
  showSmartGuides?: boolean;
  snapTolerance?: number;
  onDragStart?: (target: fabric.Object) => void;
  onDragMove?: (target: fabric.Object, guides: AlignmentGuide[]) => void;
  onDragEnd?: (target: fabric.Object) => void;
}

const DragEnhancementHandler: React.FC<DragEnhancementHandlerProps> = ({
  canvas,
  showSmartGuides = true,
  snapTolerance = 10,
  onDragStart,
  onDragMove,
  onDragEnd
}) => {
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const guidesRef = useRef<AlignmentGuide[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  
  // Initialize overlay canvas for guides visualization
  useEffect(() => {
    if (!canvas) return;
    
    const setupDragHandlers = () => {
      // Object move events
      canvas.on('object:moving', (e) => {
        if (!e.target || !showSmartGuides) return;
        
        if (!isDraggingRef.current) {
          isDraggingRef.current = true;
          if (onDragStart) onDragStart(e.target);
        }
        
        // Find other objects (excluding the one being dragged)
        const otherObjects = canvas.getObjects().filter(obj => obj !== e.target);
        
        // Generate guides
        generateAlignmentGuides(e.target, otherObjects, canvas);
        
        if (onDragMove) onDragMove(e.target, guidesRef.current);
      });
      
      // End of dragging
      canvas.on('mouse:up', () => {
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          guidesRef.current = [];
          clearGuides();
          
          const activeObject = canvas.getActiveObject();
          if (activeObject && onDragEnd) onDragEnd(activeObject);
        }
      });
    };
    
    setupDragHandlers();
    
    // Setup overlay canvas
    const canvasEl = canvas.getElement().parentNode;
    if (canvasEl && !overlayRef.current) {
      const overlay = document.createElement('canvas');
      overlay.width = canvas.getWidth();
      overlay.height = canvas.getHeight();
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '10';
      canvasEl.appendChild(overlay);
      overlayRef.current = overlay;
    }
    
    // Make sure we adjust overlay size when canvas size changes
    const resizeObserver = new ResizeObserver(() => {
      if (overlayRef.current && canvas) {
        overlayRef.current.width = canvas.getWidth();
        overlayRef.current.height = canvas.getHeight();
      }
    });
    
    if (canvas.getElement()) {
      resizeObserver.observe(canvas.getElement());
    }
    
    return () => {
      canvas.off('object:moving');
      canvas.off('mouse:up');
      
      if (canvas.getElement()) {
        resizeObserver.unobserve(canvas.getElement());
      }
      
      if (overlayRef.current && overlayRef.current.parentNode) {
        overlayRef.current.parentNode.removeChild(overlayRef.current);
      }
    };
  }, [canvas, showSmartGuides, snapTolerance, onDragStart, onDragMove, onDragEnd]);
  
  // Generate alignment guides
  const generateAlignmentGuides = (
    target: fabric.Object,
    otherObjects: fabric.Object[],
    canvas: fabric.Canvas
  ) => {
    if (!target || !canvas || !overlayRef.current) return;
    
    // Clear previous guides
    clearGuides();
    
    const guides: AlignmentGuide[] = [];
    
    // Target object bounds
    const targetBounds = getObjectBounds(target);
    
    // Check alignment with each other object
    otherObjects.forEach(obj => {
      if (!obj.visible) return;
      
      const objBounds = getObjectBounds(obj);
      
      // Horizontal alignments
      // Top edge alignment
      if (Math.abs(targetBounds.top - objBounds.top) < snapTolerance) {
        guides.push({
          position: objBounds.top,
          orientation: 'horizontal',
          type: 'edge',
          label: `Top: ${Math.round(objBounds.top)}px`,
          strength: 10
        });
        
        // Snap to guide if close enough
        if (Math.abs(targetBounds.top - objBounds.top) < snapTolerance / 2) {
          target.set('top', objBounds.top);
        }
      }
      
      // Middle alignment
      if (Math.abs(targetBounds.centerY - objBounds.centerY) < snapTolerance) {
        guides.push({
          position: objBounds.centerY,
          orientation: 'horizontal',
          type: 'center',
          label: `Middle: ${Math.round(objBounds.centerY)}px`,
          strength: 8
        });
        
        // Snap to guide if close enough
        if (Math.abs(targetBounds.centerY - objBounds.centerY) < snapTolerance / 2) {
          target.set('top', objBounds.centerY - targetBounds.height / 2);
        }
      }
      
      // Bottom edge alignment
      if (Math.abs(targetBounds.bottom - objBounds.bottom) < snapTolerance) {
        guides.push({
          position: objBounds.bottom,
          orientation: 'horizontal',
          type: 'edge',
          label: `Bottom: ${Math.round(objBounds.bottom)}px`,
          strength: 10
        });
        
        // Snap to guide if close enough
        if (Math.abs(targetBounds.bottom - objBounds.bottom) < snapTolerance / 2) {
          target.set('top', objBounds.bottom - targetBounds.height);
        }
      }
      
      // Vertical alignments
      // Left edge alignment
      if (Math.abs(targetBounds.left - objBounds.left) < snapTolerance) {
        guides.push({
          position: objBounds.left,
          orientation: 'vertical',
          type: 'edge',
          label: `Left: ${Math.round(objBounds.left)}px`,
          strength: 10
        });
        
        // Snap to guide if close enough
        if (Math.abs(targetBounds.left - objBounds.left) < snapTolerance / 2) {
          target.set('left', objBounds.left);
        }
      }
      
      // Center alignment
      if (Math.abs(targetBounds.centerX - objBounds.centerX) < snapTolerance) {
        guides.push({
          position: objBounds.centerX,
          orientation: 'vertical',
          type: 'center',
          label: `Center: ${Math.round(objBounds.centerX)}px`,
          strength: 8
        });
        
        // Snap to guide if close enough
        if (Math.abs(targetBounds.centerX - objBounds.centerX) < snapTolerance / 2) {
          target.set('left', objBounds.centerX - targetBounds.width / 2);
        }
      }
      
      // Right edge alignment
      if (Math.abs(targetBounds.right - objBounds.right) < snapTolerance) {
        guides.push({
          position: objBounds.right,
          orientation: 'vertical',
          type: 'edge',
          label: `Right: ${Math.round(objBounds.right)}px`,
          strength: 10
        });
        
        // Snap to guide if close enough
        if (Math.abs(targetBounds.right - objBounds.right) < snapTolerance / 2) {
          target.set('left', objBounds.right - targetBounds.width);
        }
      }
    });
    
    // Grid guides (snap to grid)
    if (canvas && canvas._objects[0] && (canvas._objects[0] as any).isGrid) {
      const gridSize = (canvas._objects[0] as any).gridSize || 10;
      
      // Horizontal grid lines
      const topGrid = Math.round(targetBounds.top / gridSize) * gridSize;
      const centerYGrid = Math.round(targetBounds.centerY / gridSize) * gridSize;
      const bottomGrid = Math.round(targetBounds.bottom / gridSize) * gridSize;
      
      if (Math.abs(targetBounds.top - topGrid) < snapTolerance) {
        guides.push({
          position: topGrid,
          orientation: 'horizontal',
          type: 'grid',
          strength: 5
        });
      }
      
      if (Math.abs(targetBounds.centerY - centerYGrid) < snapTolerance) {
        guides.push({
          position: centerYGrid,
          orientation: 'horizontal',
          type: 'grid',
          strength: 5
        });
      }
      
      if (Math.abs(targetBounds.bottom - bottomGrid) < snapTolerance) {
        guides.push({
          position: bottomGrid,
          orientation: 'horizontal',
          type: 'grid',
          strength: 5
        });
      }
      
      // Vertical grid lines
      const leftGrid = Math.round(targetBounds.left / gridSize) * gridSize;
      const centerXGrid = Math.round(targetBounds.centerX / gridSize) * gridSize;
      const rightGrid = Math.round(targetBounds.right / gridSize) * gridSize;
      
      if (Math.abs(targetBounds.left - leftGrid) < snapTolerance) {
        guides.push({
          position: leftGrid,
          orientation: 'vertical',
          type: 'grid',
          strength: 5
        });
      }
      
      if (Math.abs(targetBounds.centerX - centerXGrid) < snapTolerance) {
        guides.push({
          position: centerXGrid,
          orientation: 'vertical',
          type: 'grid',
          strength: 5
        });
      }
      
      if (Math.abs(targetBounds.right - rightGrid) < snapTolerance) {
        guides.push({
          position: rightGrid,
          orientation: 'vertical',
          type: 'grid',
          strength: 5
        });
      }
    }
    
    guidesRef.current = guides;
    
    // Render guides
    renderGuides(guides);
  };
  
  // Render guides on overlay canvas
  const renderGuides = (guides: AlignmentGuide[]) => {
    if (!overlayRef.current) return;
    
    const ctx = overlayRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    
    guides.forEach(guide => {
      // Choose color based on guide type
      ctx.strokeStyle = 
        guide.type === 'center' ? '#2196f3' : 
        guide.type === 'grid' ? '#9e9e9e' : 
        '#e91e63';
      
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      ctx.beginPath();
      
      if (guide.orientation === 'horizontal') {
        ctx.moveTo(0, guide.position);
        ctx.lineTo(overlayRef.current!.width, guide.position);
      } else {
        ctx.moveTo(guide.position, 0);
        ctx.lineTo(guide.position, overlayRef.current!.height);
      }
      
      ctx.stroke();
      
      // Draw label if available
      if (guide.label) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = '10px sans-serif';
        ctx.fillText(
          guide.label,
          guide.orientation === 'vertical' ? guide.position + 5 : 5,
          guide.orientation === 'horizontal' ? guide.position - 5 : 15
        );
      }
    });
  };
  
  // Clear guides from overlay
  const clearGuides = () => {
    if (!overlayRef.current) return;
    
    const ctx = overlayRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
  };
  
  // Helper to get object bounds
  const getObjectBounds = (obj: fabric.Object) => {
    const left = obj.left || 0;
    const top = obj.top || 0;
    const width = (obj.width || 0) * (obj.scaleX || 1);
    const height = (obj.height || 0) * (obj.scaleY || 1);
    
    return {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      centerX: left + width / 2,
      centerY: top + height / 2
    };
  };
  
  return null; // This component doesn't render anything visible
};

export default DragEnhancementHandler;
