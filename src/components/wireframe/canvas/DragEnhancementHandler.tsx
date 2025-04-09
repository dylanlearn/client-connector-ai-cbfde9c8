
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { AlignmentGuide, DropZoneIndicator } from '@/components/wireframe/utils/types';

interface DragEnhancementHandlerProps {
  canvas: fabric.Canvas | null;
  snapToGrid?: boolean;
  gridSize?: number;
  snapToObjects?: boolean;
  snapTolerance?: number;
  showSmartGuides?: boolean;
  className?: string;
}

// Guide colors
const GUIDE_COLORS = {
  edge: '#2196F3',
  center: '#FF4081',
  distribution: '#4CAF50',
  boundary: '#FFC107'
};

const DragEnhancementHandler: React.FC<DragEnhancementHandlerProps> = ({
  canvas,
  snapToGrid = true,
  gridSize = 10,
  snapToObjects = true,
  snapTolerance = 5,
  showSmartGuides = true,
  className
}) => {
  const [guideLines, setGuideLines] = useState<AlignmentGuide[]>([]);
  const [dropZones, setDropZones] = useState<DropZoneIndicator[]>([]);
  const [activeDragObject, setActiveDragObject] = useState<fabric.Object | null>(null);
  
  const guideLineRefs = useRef<Map<string, fabric.Line>>(new Map());
  const guideLabelRefs = useRef<Map<string, fabric.Text>>(new Map());
  const dropZoneRefs = useRef<Map<string, fabric.Rect>>(new Map());
  
  // Clean up guidelines and drop zones when component unmounts
  useEffect(() => {
    return () => {
      if (canvas) {
        clearGuides();
        clearDropZones();
      }
    };
  }, []);
  
  // Set up drag events when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectMoving = (e: fabric.IEvent) => {
      const target = e.target;
      if (!target) return;
      
      setActiveDragObject(target);
      
      if (snapToGrid) {
        snapToGridLines(target);
      }
      
      if (snapToObjects && showSmartGuides) {
        const guides = generateObjectGuidelines(target);
        updateGuidelines(guides);
        snapToGuidelines(target, guides);
      }
      
      // Update drop zones for the current dragged object
      updateDropZones(target);
    };
    
    const handleObjectModified = () => {
      clearGuides();
      clearDropZones();
      setActiveDragObject(null);
    };
    
    const handleSelectionCleared = () => {
      clearGuides();
      clearDropZones();
      setActiveDragObject(null);
    };
    
    const handleDragStart = (e: fabric.IEvent) => {
      const target = e.target;
      if (!target) return;
      
      // Pre-generate drop zones for this object
      generateDropZones(target);
    };
    
    const handleDragEnd = () => {
      clearGuides();
      clearDropZones();
      setActiveDragObject(null);
    };
    
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('mouse:down', handleDragStart);
    canvas.on('mouse:up', handleDragEnd);
    
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('mouse:down', handleDragStart);
      canvas.off('mouse:up', handleDragEnd);
    };
  }, [canvas, snapToGrid, gridSize, snapToObjects, snapTolerance, showSmartGuides]);
  
  // Clear all visible guide lines
  const clearGuides = () => {
    if (!canvas) return;
    
    guideLineRefs.current.forEach((line) => {
      canvas.remove(line);
    });
    
    guideLabelRefs.current.forEach((text) => {
      canvas.remove(text);
    });
    
    guideLineRefs.current.clear();
    guideLabelRefs.current.clear();
    setGuideLines([]);
  };
  
  // Clear all visible drop zones
  const clearDropZones = () => {
    if (!canvas) return;
    
    dropZoneRefs.current.forEach((rect) => {
      canvas.remove(rect);
    });
    
    dropZoneRefs.current.clear();
    setDropZones([]);
  };
  
  // Snap an object to the grid
  const snapToGridLines = (target: fabric.Object) => {
    if (!canvas) return;
    
    const grid = gridSize;
    
    // Snap to nearest grid point
    if (target.left) {
      target.left = Math.round(target.left / grid) * grid;
    }
    
    if (target.top) {
      target.top = Math.round(target.top / grid) * grid;
    }
  };
  
  // Generate alignment guidelines for an object relative to other objects
  const generateObjectGuidelines = (target: fabric.Object): AlignmentGuide[] => {
    if (!canvas) return [];
    
    const allObjects = canvas.getObjects().filter(obj => obj !== target);
    const guides: AlignmentGuide[] = [];
    
    const targetBounds = {
      left: target.left || 0,
      top: target.top || 0,
      right: (target.left || 0) + (target.width || 0) * (target.scaleX || 1),
      bottom: (target.top || 0) + (target.height || 0) * (target.scaleY || 1),
      centerX: (target.left || 0) + ((target.width || 0) * (target.scaleX || 1)) / 2,
      centerY: (target.top || 0) + ((target.height || 0) * (target.scaleY || 1)) / 2
    };
    
    allObjects.forEach(obj => {
      if (!obj.visible) return;
      
      const objBounds = {
        left: obj.left || 0,
        top: obj.top || 0,
        right: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1),
        bottom: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1),
        centerX: (obj.left || 0) + ((obj.width || 0) * (obj.scaleX || 1)) / 2,
        centerY: (obj.top || 0) + ((obj.height || 0) * (obj.scaleY || 1)) / 2
      };
      
      // Vertical alignment - left edges
      if (Math.abs(targetBounds.left - objBounds.left) < snapTolerance) {
        guides.push({
          position: objBounds.left,
          orientation: 'vertical',
          type: 'edge',
          strength: 10,
          label: `Left: ${Math.round(objBounds.left)}`
        });
      }
      
      // Vertical alignment - right edges
      if (Math.abs(targetBounds.right - objBounds.right) < snapTolerance) {
        guides.push({
          position: objBounds.right,
          orientation: 'vertical',
          type: 'edge',
          strength: 10,
          label: `Right: ${Math.round(objBounds.right)}`
        });
      }
      
      // Vertical alignment - centers
      if (Math.abs(targetBounds.centerX - objBounds.centerX) < snapTolerance) {
        guides.push({
          position: objBounds.centerX,
          orientation: 'vertical',
          type: 'center',
          strength: 8,
          label: `CenterX: ${Math.round(objBounds.centerX)}`
        });
      }
      
      // Horizontal alignment - top edges
      if (Math.abs(targetBounds.top - objBounds.top) < snapTolerance) {
        guides.push({
          position: objBounds.top,
          orientation: 'horizontal',
          type: 'edge',
          strength: 10,
          label: `Top: ${Math.round(objBounds.top)}`
        });
      }
      
      // Horizontal alignment - bottom edges
      if (Math.abs(targetBounds.bottom - objBounds.bottom) < snapTolerance) {
        guides.push({
          position: objBounds.bottom,
          orientation: 'horizontal',
          type: 'edge',
          strength: 10,
          label: `Bottom: ${Math.round(objBounds.bottom)}`
        });
      }
      
      // Horizontal alignment - centers
      if (Math.abs(targetBounds.centerY - objBounds.centerY) < snapTolerance) {
        guides.push({
          position: objBounds.centerY,
          orientation: 'horizontal',
          type: 'center',
          strength: 8,
          label: `CenterY: ${Math.round(objBounds.centerY)}`
        });
      }
    });
    
    return guides;
  };
  
  // Snap object to existing guidelines
  const snapToGuidelines = (target: fabric.Object, guides: AlignmentGuide[]) => {
    if (!canvas || !guides.length) return;
    
    // Calculate target bounds
    const targetWidth = (target.width || 0) * (target.scaleX || 1);
    const targetHeight = (target.height || 0) * (target.scaleY || 1);
    
    // Find the strongest vertical guide
    const verticalGuides = guides.filter(g => g.orientation === 'vertical');
    if (verticalGuides.length > 0) {
      const strongestVGuide = verticalGuides.reduce((prev, curr) => 
        (curr.strength || 0) > (prev.strength || 0) ? curr : prev
      );
      
      // Apply the vertical snap
      if (strongestVGuide.type === 'edge') {
        target.left = strongestVGuide.position;
      } else if (strongestVGuide.type === 'center') {
        target.left = strongestVGuide.position - targetWidth / 2;
      }
    }
    
    // Find the strongest horizontal guide
    const horizontalGuides = guides.filter(g => g.orientation === 'horizontal');
    if (horizontalGuides.length > 0) {
      const strongestHGuide = horizontalGuides.reduce((prev, curr) => 
        (curr.strength || 0) > (prev.strength || 0) ? curr : prev
      );
      
      // Apply the horizontal snap
      if (strongestHGuide.type === 'edge') {
        target.top = strongestHGuide.position;
      } else if (strongestHGuide.type === 'center') {
        target.top = strongestHGuide.position - targetHeight / 2;
      }
    }
  };
  
  // Update the visible guidelines
  const updateGuidelines = (guides: AlignmentGuide[]) => {
    if (!canvas) return;
    
    // Clear old guides
    clearGuides();
    setGuideLines(guides);
    
    // Create new guidelines
    guides.forEach((guide) => {
      const guideId = `${guide.orientation}-${guide.position}-${guide.type}`;
      
      // Create guide line
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      
      let line: fabric.Line;
      if (guide.orientation === 'horizontal') {
        line = new fabric.Line([0, guide.position, canvasWidth, guide.position], {
          stroke: guide.type === 'center' ? GUIDE_COLORS.center : GUIDE_COLORS.edge,
          strokeDashArray: [5, 5],
          strokeWidth: 1,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          temporary: true
        });
      } else {
        line = new fabric.Line([guide.position, 0, guide.position, canvasHeight], {
          stroke: guide.type === 'center' ? GUIDE_COLORS.center : GUIDE_COLORS.edge,
          strokeDashArray: [5, 5],
          strokeWidth: 1,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          temporary: true
        });
      }
      
      canvas.add(line);
      canvas.bringToFront(line);
      guideLineRefs.current.set(guideId, line);
      
      // Add label if specified
      if (guide.label) {
        const labelX = guide.orientation === 'vertical' ? guide.position + 5 : 10;
        const labelY = guide.orientation === 'horizontal' ? guide.position - 20 : 10;
        
        const text = new fabric.Text(guide.label, {
          left: labelX,
          top: labelY,
          fontSize: 12,
          fontFamily: 'Arial',
          fill: guide.type === 'center' ? GUIDE_COLORS.center : GUIDE_COLORS.edge,
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: 2,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          temporary: true
        });
        
        canvas.add(text);
        canvas.bringToFront(text);
        guideLabelRefs.current.set(`label-${guideId}`, text);
      }
    });
    
    canvas.renderAll();
  };
  
  // Generate drop zones for a dragged object
  const generateDropZones = (target: fabric.Object) => {
    if (!canvas) return;
    
    const canvasObjects = canvas.getObjects().filter(obj => 
      obj !== target && (obj.type !== 'line' && obj.type !== 'text')
    );
    
    const zones: DropZoneIndicator[] = [];
    
    canvasObjects.forEach(obj => {
      if ((obj as any).temporary) return;
      
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);
      
      // Create drop zones around an object
      const margin = 10;
      
      // Top drop zone
      zones.push({
        id: `top-${obj.data?.id || Math.random().toString(36)}`,
        rect: {
          left: objLeft - margin,
          top: objTop - objHeight - margin,
          width: objWidth + margin * 2,
          height: objHeight
        },
        active: false,
        type: 'top'
      });
      
      // Bottom drop zone
      zones.push({
        id: `bottom-${obj.data?.id || Math.random().toString(36)}`,
        rect: {
          left: objLeft - margin,
          top: objTop + objHeight + margin,
          width: objWidth + margin * 2,
          height: objHeight
        },
        active: false,
        type: 'bottom'
      });
      
      // Left drop zone
      zones.push({
        id: `left-${obj.data?.id || Math.random().toString(36)}`,
        rect: {
          left: objLeft - objWidth - margin,
          top: objTop - margin,
          width: objWidth,
          height: objHeight + margin * 2
        },
        active: false,
        type: 'left'
      });
      
      // Right drop zone
      zones.push({
        id: `right-${obj.data?.id || Math.random().toString(36)}`,
        rect: {
          left: objLeft + objWidth + margin,
          top: objTop - margin,
          width: objWidth,
          height: objHeight + margin * 2
        },
        active: false,
        type: 'right'
      });
    });
    
    setDropZones(zones);
  };
  
  // Update drop zones when object is being dragged
  const updateDropZones = (target: fabric.Object) => {
    if (!canvas || !dropZones.length) return;
    
    // Calculate target bounds
    const targetLeft = target.left || 0;
    const targetTop = target.top || 0;
    const targetWidth = (target.width || 0) * (target.scaleX || 1);
    const targetHeight = (target.height || 0) * (target.scaleY || 1);
    const targetRight = targetLeft + targetWidth;
    const targetBottom = targetTop + targetHeight;
    
    // Clear existing drop zone visuals
    clearDropZones();
    
    // Update drop zones
    const updatedZones = dropZones.map(zone => {
      const zoneRect = zone.rect;
      
      // Check if target is overlapping with drop zone
      const isOverlapping = (
        targetRight > zoneRect.left &&
        targetLeft < zoneRect.left + zoneRect.width &&
        targetBottom > zoneRect.top &&
        targetTop < zoneRect.top + zoneRect.height
      );
      
      // If overlapping, show drop zone visual
      if (isOverlapping) {
        const dropZone = new fabric.Rect({
          left: zoneRect.left,
          top: zoneRect.top,
          width: zoneRect.width,
          height: zoneRect.height,
          fill: 'rgba(66, 133, 244, 0.2)',
          stroke: 'rgba(66, 133, 244, 0.8)',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          rx: 5,
          ry: 5,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          temporary: true
        });
        
        canvas.add(dropZone);
        canvas.sendToBack(dropZone);
        dropZoneRefs.current.set(zone.id, dropZone);
        
        return { ...zone, active: true };
      }
      
      return { ...zone, active: false };
    });
    
    setDropZones(updatedZones);
    canvas.renderAll();
  };
  
  // This component doesn't render anything visible
  return null;
};

export default DragEnhancementHandler;
