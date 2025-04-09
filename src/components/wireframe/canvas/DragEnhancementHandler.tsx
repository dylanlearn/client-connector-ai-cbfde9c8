
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { AlignmentGuide, DropZoneIndicator } from '@/components/wireframe/utils/types';

interface DragEnhancementHandlerProps {
  canvas: fabric.Canvas;
  snapToGrid?: boolean;
  gridSize?: number;
  snapToObjects?: boolean;
  snapTolerance?: number;
  showSmartGuides?: boolean;
}

const DragEnhancementHandler: React.FC<DragEnhancementHandlerProps> = ({
  canvas,
  snapToGrid = true,
  gridSize = 10,
  snapToObjects = true,
  snapTolerance = 5,
  showSmartGuides = true
}) => {
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [dropZones, setDropZones] = useState<DropZoneIndicator[]>([]);
  
  // Setup event listeners for the canvas
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectMoving = (e: any) => {
      const obj = e.target;
      if (!obj) return;
      
      // Handle grid snapping
      if (snapToGrid) {
        const x = Math.round(obj.left! / gridSize) * gridSize;
        const y = Math.round(obj.top! / gridSize) * gridSize;
        
        obj.set({
          left: x,
          top: y
        });
      }
      
      // Handle object alignment guides
      if (snapToObjects && showSmartGuides) {
        const guides = generateAlignmentGuides(canvas, obj);
        setAlignmentGuides(guides);
        
        // Apply snapping based on guides
        applySnapping(obj, guides);
      }
    };
    
    const handleSelectionCleared = () => {
      setActiveObject(null);
      setAlignmentGuides([]);
      setDropZones([]);
    };
    
    const handleObjectSelected = (e: any) => {
      setActiveObject(e.target);
    };
    
    const handleObjectModified = () => {
      // Clear guides after modification
      setAlignmentGuides([]);
    };
    
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:selected', handleObjectSelected);
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:selected', handleObjectSelected);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas, snapToGrid, gridSize, snapToObjects, snapTolerance, showSmartGuides]);
  
  // Render the alignment guides
  useEffect(() => {
    if (!canvas || !showSmartGuides) return;
    
    // Remove any existing guide lines
    const existingGuides = canvas.getObjects().filter(obj => obj.data?.type === 'alignmentGuide');
    existingGuides.forEach(guide => canvas.remove(guide));
    
    // Draw new guide lines
    alignmentGuides.forEach(guide => {
      let line: fabric.Line;
      
      if (guide.orientation === 'horizontal') {
        line = new fabric.Line(
          [0, guide.position, canvas.width!, guide.position], 
          {
            stroke: '#ff5722',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            data: { type: 'alignmentGuide', guideData: guide }
          }
        );
      } else {
        line = new fabric.Line(
          [guide.position, 0, guide.position, canvas.height!], 
          {
            stroke: '#ff5722',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            data: { type: 'alignmentGuide', guideData: guide }
          }
        );
      }
      
      canvas.add(line);
      canvas.bringToFront(line);
    });
    
    canvas.renderAll();
    
    // Cleanup on unmount or when guides change
    return () => {
      const guides = canvas.getObjects().filter(obj => obj.data?.type === 'alignmentGuide');
      guides.forEach(guide => canvas.remove(guide));
      canvas.renderAll();
    };
  }, [canvas, alignmentGuides, showSmartGuides]);
  
  // Helper function to generate alignment guides
  const generateAlignmentGuides = (canvas: fabric.Canvas, activeObj: fabric.Object): AlignmentGuide[] => {
    if (!activeObj) return [];
    
    const guides: AlignmentGuide[] = [];
    const activeObjCenter = activeObj.getCenterPoint();
    const activeObjBounds = activeObj.getBoundingRect();
    
    // Grid guides (if enabled)
    if (snapToGrid) {
      for (let i = 0; i <= canvas.width!; i += gridSize) {
        guides.push({
          position: i,
          orientation: 'vertical',
          type: 'grid',
          label: `Grid ${i}px`,
          strength: 1
        });
      }
      
      for (let i = 0; i <= canvas.height!; i += gridSize) {
        guides.push({
          position: i,
          orientation: 'horizontal',
          type: 'grid',
          label: `Grid ${i}px`,
          strength: 1
        });
      }
    }
    
    // Object alignment guides
    canvas.getObjects().forEach(obj => {
      if (obj === activeObj || obj.data?.type === 'alignmentGuide') return;
      
      const objCenter = obj.getCenterPoint();
      const objBounds = obj.getBoundingRect();
      
      // Horizontal center alignment
      if (Math.abs(activeObjCenter.y - objCenter.y) < snapTolerance) {
        guides.push({
          position: objCenter.y,
          orientation: 'horizontal',
          type: 'center',
          label: 'Center Align',
          strength: 2
        });
      }
      
      // Vertical center alignment
      if (Math.abs(activeObjCenter.x - objCenter.x) < snapTolerance) {
        guides.push({
          position: objCenter.x,
          orientation: 'vertical',
          type: 'center',
          label: 'Center Align',
          strength: 2
        });
      }
      
      // Top edge alignment
      if (Math.abs(activeObjBounds.top - objBounds.top) < snapTolerance) {
        guides.push({
          position: objBounds.top,
          orientation: 'horizontal',
          type: 'edge',
          label: 'Top Align',
          strength: 3
        });
      }
      
      // Bottom edge alignment
      if (Math.abs(activeObjBounds.top + activeObjBounds.height - (objBounds.top + objBounds.height)) < snapTolerance) {
        guides.push({
          position: objBounds.top + objBounds.height,
          orientation: 'horizontal',
          type: 'edge',
          label: 'Bottom Align',
          strength: 3
        });
      }
      
      // Left edge alignment
      if (Math.abs(activeObjBounds.left - objBounds.left) < snapTolerance) {
        guides.push({
          position: objBounds.left,
          orientation: 'vertical',
          type: 'edge',
          label: 'Left Align',
          strength: 3
        });
      }
      
      // Right edge alignment
      if (Math.abs(activeObjBounds.left + activeObjBounds.width - (objBounds.left + objBounds.width)) < snapTolerance) {
        guides.push({
          position: objBounds.left + objBounds.width,
          orientation: 'vertical',
          type: 'edge',
          label: 'Right Align',
          strength: 3
        });
      }
    });
    
    // Sort guides by strength
    return guides.sort((a, b) => (b.strength || 0) - (a.strength || 0));
  };
  
  // Apply snapping based on guides
  const applySnapping = (obj: fabric.Object, guides: AlignmentGuide[]) => {
    if (!obj || !guides.length) return;
    
    const objBounds = obj.getBoundingRect();
    const objCenter = obj.getCenterPoint();
    
    // Find the strongest horizontal and vertical guides
    const horizontalGuides = guides.filter(g => g.orientation === 'horizontal');
    const verticalGuides = guides.filter(g => g.orientation === 'vertical');
    
    // Apply horizontal snapping
    if (horizontalGuides.length > 0) {
      const guide = horizontalGuides[0];
      let newTop = obj.top!;
      
      if (guide.type === 'center') {
        // Snap center to guide
        const centerOffset = objCenter.y - obj.top!;
        newTop = guide.position - centerOffset;
      } else if (guide.type === 'edge') {
        // Snap edge to guide
        if (Math.abs(objBounds.top - guide.position) < snapTolerance) {
          newTop = guide.position;
        } else {
          // Assume it's bottom alignment
          newTop = guide.position - objBounds.height;
        }
      }
      
      obj.set({ top: newTop });
    }
    
    // Apply vertical snapping
    if (verticalGuides.length > 0) {
      const guide = verticalGuides[0];
      let newLeft = obj.left!;
      
      if (guide.type === 'center') {
        // Snap center to guide
        const centerOffset = objCenter.x - obj.left!;
        newLeft = guide.position - centerOffset;
      } else if (guide.type === 'edge') {
        // Snap edge to guide
        if (Math.abs(objBounds.left - guide.position) < snapTolerance) {
          newLeft = guide.position;
        } else {
          // Assume it's right alignment
          newLeft = guide.position - objBounds.width;
        }
      }
      
      obj.set({ left: newLeft });
    }
    
    canvas.renderAll();
  };
  
  // Render tooltips for guides
  useEffect(() => {
    if (!canvas || !showSmartGuides) return;
    
    // Remove existing tooltips
    document.querySelectorAll('.alignment-tooltip').forEach(el => el.remove());
    
    // Create tooltips for each guide
    alignmentGuides.forEach(guide => {
      if (!guide.label) return;
      
      const tooltip = document.createElement('div');
      tooltip.className = 'alignment-tooltip';
      tooltip.textContent = guide.label;
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = 'rgba(0,0,0,0.7)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '2px 6px';
      tooltip.style.borderRadius = '3px';
      tooltip.style.fontSize = '12px';
      tooltip.style.pointerEvents = 'none';
      
      // Position the tooltip
      if (guide.orientation === 'horizontal') {
        tooltip.style.top = `${guide.position - 20}px`;
        tooltip.style.left = '10px';
      } else {
        tooltip.style.left = `${guide.position + 5}px`;
        tooltip.style.top = '10px';
      }
      
      document.body.appendChild(tooltip);
    });
    
    // Clean up on unmount or when guides change
    return () => {
      document.querySelectorAll('.alignment-tooltip').forEach(el => el.remove());
    };
  }, [canvas, alignmentGuides, showSmartGuides]);
  
  return null;
};

export default DragEnhancementHandler;
