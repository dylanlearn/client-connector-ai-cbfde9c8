
import React, { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { AlignmentGuide, DropZoneIndicator } from '@/components/wireframe/utils/types';

interface DragEnhancementHandlerProps {
  canvas: fabric.Canvas | null;
  snapTolerance?: number;
  showSmartGuides?: boolean;
  showDropZones?: boolean;
  showHoverOutlines?: boolean;
}

const DragEnhancementHandler: React.FC<DragEnhancementHandlerProps> = ({
  canvas,
  snapTolerance = 5,
  showSmartGuides = true,
  showDropZones = true,
  showHoverOutlines = true,
}) => {
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [dropZones, setDropZones] = useState<DropZoneIndicator[]>([]);
  const [hoverTarget, setHoverTarget] = useState<fabric.Object | null>(null);
  const guideRefs = useRef<Record<string, fabric.Line>>({});
  const dropZoneRefs = useRef<Record<string, fabric.Object>>({});
  const hoverOutlineRef = useRef<fabric.Rect | null>(null);
  const isMovingRef = useRef(false);
  
  // Set up canvas event handlers
  useEffect(() => {
    if (!canvas) return;
    
    // Create hover outline element if not exists
    if (showHoverOutlines && !hoverOutlineRef.current) {
      hoverOutlineRef.current = new fabric.Rect({
        fill: 'transparent',
        stroke: '#2196F3',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        opacity: 0.8,
        evented: false,
        selectable: false,
        visible: false,
      });
      canvas.add(hoverOutlineRef.current);
    }
    
    // Handle object movement start
    const handleMouseDown = (e: fabric.IEvent<MouseEvent>) => {
      if (e.target && !e.target.isGuide) {
        isMovingRef.current = true;
        
        // Clear previous guides and drop zones
        clearGuides();
        clearDropZones();
      }
    };
    
    // Handle object movement
    const handleObjectMoving = (e: fabric.IEvent<MouseEvent>) => {
      if (!e.target || !isMovingRef.current) return;
      
      const movingObject = e.target;
      
      // Find all other objects for alignment
      const otherObjects = canvas.getObjects().filter(obj => 
        obj !== movingObject && 
        !obj.isGuide && 
        obj !== hoverOutlineRef.current &&
        !Object.values(guideRefs.current).includes(obj as fabric.Line) &&
        !Object.values(dropZoneRefs.current).includes(obj)
      );
      
      if (showSmartGuides) {
        // Generate alignment guides
        const newGuides = generateAlignmentGuides(movingObject, otherObjects);
        setGuides(newGuides);
        
        // Apply snapping
        applySnappingToObject(movingObject, newGuides);
        
        // Update guides visualization
        updateGuidesVisualization(newGuides);
      }
      
      if (showDropZones) {
        // Generate and update drop zones
        const potentialDropZones = findPotentialDropZones(movingObject, otherObjects);
        setDropZones(potentialDropZones);
        
        // Update drop zones visualization
        updateDropZonesVisualization(potentialDropZones);
      }
    };
    
    // Handle object movement end
    const handleMouseUp = () => {
      isMovingRef.current = false;
      
      // Clear guides after a short delay to let the user see them
      setTimeout(() => {
        if (!isMovingRef.current) {
          clearGuides();
          clearDropZones();
        }
      }, 500);
    };
    
    // Handle hover effects
    const handleMouseOver = (e: fabric.IEvent<MouseEvent>) => {
      if (!showHoverOutlines || isMovingRef.current) return;
      
      const target = e.target;
      if (!target || target.isGuide || target === hoverOutlineRef.current) return;
      
      setHoverTarget(target);
      updateHoverOutline(target);
    };
    
    const handleMouseOut = (e: fabric.IEvent<MouseEvent>) => {
      if (!showHoverOutlines || isMovingRef.current) return;
      
      const target = e.target;
      if (!target || target === hoverOutlineRef.current) return;
      
      if (target === hoverTarget) {
        setHoverTarget(null);
        
        if (hoverOutlineRef.current) {
          hoverOutlineRef.current.visible = false;
          canvas.renderAll();
        }
      }
    };
    
    // Add event handlers
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('mouse:over', handleMouseOver);
    canvas.on('mouse:out', handleMouseOut);
    
    // Clean up
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('mouse:over', handleMouseOver);
      canvas.off('mouse:out', handleMouseOut);
      
      // Remove all guides and temporary elements
      clearGuides();
      clearDropZones();
      
      if (hoverOutlineRef.current) {
        canvas.remove(hoverOutlineRef.current);
        hoverOutlineRef.current = null;
      }
    };
  }, [canvas, showSmartGuides, snapTolerance, showDropZones, showHoverOutlines]);
  
  // Generate alignment guides for an object relative to other objects
  const generateAlignmentGuides = (obj: fabric.Object, others: fabric.Object[]): AlignmentGuide[] => {
    if (!obj) return [];
    
    const guides: AlignmentGuide[] = [];
    
    const objBounds = {
      left: obj.left || 0,
      top: obj.top || 0,
      right: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1),
      bottom: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1),
      centerX: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1) / 2,
      centerY: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1) / 2,
    };
    
    others.forEach(other => {
      const otherBounds = {
        left: other.left || 0,
        top: other.top || 0,
        right: (other.left || 0) + (other.width || 0) * (other.scaleX || 1),
        bottom: (other.top || 0) + (other.height || 0) * (other.scaleY || 1),
        centerX: (other.left || 0) + (other.width || 0) * (other.scaleX || 1) / 2,
        centerY: (other.top || 0) + (other.height || 0) * (other.scaleY || 1) / 2,
      };
      
      // Check horizontal alignments (left, center, right)
      if (Math.abs(objBounds.left - otherBounds.left) <= snapTolerance) {
        guides.push({
          position: otherBounds.left,
          orientation: 'vertical',
          type: 'edge',
          label: `Left: ${Math.round(otherBounds.left)}`,
          strength: 10
        });
      }
      
      if (Math.abs(objBounds.centerX - otherBounds.centerX) <= snapTolerance) {
        guides.push({
          position: otherBounds.centerX,
          orientation: 'vertical',
          type: 'center',
          label: `Center: ${Math.round(otherBounds.centerX)}`,
          strength: 8
        });
      }
      
      if (Math.abs(objBounds.right - otherBounds.right) <= snapTolerance) {
        guides.push({
          position: otherBounds.right,
          orientation: 'vertical',
          type: 'edge',
          label: `Right: ${Math.round(otherBounds.right)}`,
          strength: 10
        });
      }
      
      // Check vertical alignments (top, center, bottom)
      if (Math.abs(objBounds.top - otherBounds.top) <= snapTolerance) {
        guides.push({
          position: otherBounds.top,
          orientation: 'horizontal',
          type: 'edge',
          label: `Top: ${Math.round(otherBounds.top)}`,
          strength: 10
        });
      }
      
      if (Math.abs(objBounds.centerY - otherBounds.centerY) <= snapTolerance) {
        guides.push({
          position: otherBounds.centerY,
          orientation: 'horizontal',
          type: 'center',
          label: `Middle: ${Math.round(otherBounds.centerY)}`,
          strength: 8
        });
      }
      
      if (Math.abs(objBounds.bottom - otherBounds.bottom) <= snapTolerance) {
        guides.push({
          position: otherBounds.bottom,
          orientation: 'horizontal',
          type: 'edge',
          label: `Bottom: ${Math.round(otherBounds.bottom)}`,
          strength: 10
        });
      }
      
      // Check for equal spacing/distribution guides
      // (For simplicity, not implemented in this version)
    });
    
    return guides;
  };
  
  // Apply snapping to an object based on guides
  const applySnappingToObject = (obj: fabric.Object, guides: AlignmentGuide[]) => {
    if (!obj || guides.length === 0) return;
    
    let strongestHorizontalGuide: AlignmentGuide | null = null;
    let strongestVerticalGuide: AlignmentGuide | null = null;
    
    // Find strongest guides for each direction
    guides.forEach(guide => {
      if (guide.orientation === 'horizontal') {
        if (!strongestHorizontalGuide || (guide.strength || 0) > (strongestHorizontalGuide.strength || 0)) {
          strongestHorizontalGuide = guide;
        }
      } else {
        if (!strongestVerticalGuide || (guide.strength || 0) > (strongestVerticalGuide.strength || 0)) {
          strongestVerticalGuide = guide;
        }
      }
    });
    
    // Apply horizontal snapping
    if (strongestHorizontalGuide) {
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);
      
      switch (strongestHorizontalGuide.type) {
        case 'edge':
          // Snapping to top edge
          if (Math.abs((obj.top || 0) - strongestHorizontalGuide.position) <= snapTolerance) {
            obj.set('top', strongestHorizontalGuide.position);
          }
          // Snapping to bottom edge
          else if (Math.abs((obj.top || 0) + objHeight - strongestHorizontalGuide.position) <= snapTolerance) {
            obj.set('top', strongestHorizontalGuide.position - objHeight);
          }
          break;
        case 'center':
          // Snapping to center
          obj.set('top', strongestHorizontalGuide.position - objHeight / 2);
          break;
      }
    }
    
    // Apply vertical snapping
    if (strongestVerticalGuide) {
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      
      switch (strongestVerticalGuide.type) {
        case 'edge':
          // Snapping to left edge
          if (Math.abs((obj.left || 0) - strongestVerticalGuide.position) <= snapTolerance) {
            obj.set('left', strongestVerticalGuide.position);
          }
          // Snapping to right edge
          else if (Math.abs((obj.left || 0) + objWidth - strongestVerticalGuide.position) <= snapTolerance) {
            obj.set('left', strongestVerticalGuide.position - objWidth);
          }
          break;
        case 'center':
          // Snapping to center
          obj.set('left', strongestVerticalGuide.position - objWidth / 2);
          break;
      }
    }
  };
  
  // Update visual guides on the canvas
  const updateGuidesVisualization = (guides: AlignmentGuide[]) => {
    if (!canvas) return;
    
    // Clear previous guides
    Object.values(guideRefs.current).forEach(guide => {
      canvas.remove(guide);
    });
    guideRefs.current = {};
    
    // Create new guides
    guides.forEach((guide, index) => {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      
      const id = `guide-${index}`;
      let line: fabric.Line;
      
      if (guide.orientation === 'horizontal') {
        line = new fabric.Line([0, guide.position, canvasWidth, guide.position], {
          stroke: guide.type === 'center' ? '#0066ff' : '#00cc66',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          isGuide: true // Custom property to identify guides
        });
      } else {
        line = new fabric.Line([guide.position, 0, guide.position, canvasHeight], {
          stroke: guide.type === 'center' ? '#0066ff' : '#00cc66',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          isGuide: true
        });
      }
      
      // Add label if specified
      if (guide.label) {
        const text = new fabric.Text(guide.label, {
          left: guide.orientation === 'vertical' ? guide.position + 5 : 5,
          top: guide.orientation === 'horizontal' ? guide.position + 5 : 5,
          fontSize: 10,
          fill: guide.type === 'center' ? '#0066ff' : '#00cc66',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: 3,
          selectable: false,
          evented: false,
          isGuide: true
        });
        
        canvas.add(text);
        guideRefs.current[`${id}-label`] = text as unknown as fabric.Line;
      }
      
      canvas.add(line);
      guideRefs.current[id] = line;
    });
    
    canvas.renderAll();
  };
  
  // Find potential drop zones for the dragging object
  const findPotentialDropZones = (obj: fabric.Object, others: fabric.Object[]): DropZoneIndicator[] => {
    if (!obj) return [];
    
    const dropZones: DropZoneIndicator[] = [];
    
    // Create zones for each other object's proximity
    others.forEach((other, index) => {
      const otherBounds = {
        left: other.left || 0,
        top: other.top || 0,
        width: (other.width || 0) * (other.scaleX || 1),
        height: (other.height || 0) * (other.scaleY || 1),
      };
      
      const objCenter = {
        x: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1) / 2,
        y: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1) / 2,
      };
      
      // Check if the object is close to another object
      const isNear = (
        Math.abs(objCenter.x - (otherBounds.left + otherBounds.width / 2)) < otherBounds.width / 2 + 50 &&
        Math.abs(objCenter.y - (otherBounds.top + otherBounds.height / 2)) < otherBounds.height / 2 + 50
      );
      
      if (isNear) {
        // Determine drop zone position relative to the other object
        // For this example, create zones at top, right, bottom, left
        const margins = 10; // Space between the object and drop zone
        
        // Top zone
        dropZones.push({
          id: `dropzone-${index}-top`,
          bounds: {
            left: otherBounds.left,
            top: otherBounds.top - 20 - margins,
            width: otherBounds.width,
            height: 20
          },
          type: 'suggested',
          highlightColor: 'rgba(33, 150, 243, 0.3)'
        });
        
        // Bottom zone
        dropZones.push({
          id: `dropzone-${index}-bottom`,
          bounds: {
            left: otherBounds.left,
            top: otherBounds.top + otherBounds.height + margins,
            width: otherBounds.width,
            height: 20
          },
          type: 'suggested',
          highlightColor: 'rgba(33, 150, 243, 0.3)'
        });
        
        // Left zone
        dropZones.push({
          id: `dropzone-${index}-left`,
          bounds: {
            left: otherBounds.left - 20 - margins,
            top: otherBounds.top,
            width: 20,
            height: otherBounds.height
          },
          type: 'suggested',
          highlightColor: 'rgba(33, 150, 243, 0.3)'
        });
        
        // Right zone
        dropZones.push({
          id: `dropzone-${index}-right`,
          bounds: {
            left: otherBounds.left + otherBounds.width + margins,
            top: otherBounds.top,
            width: 20,
            height: otherBounds.height
          },
          type: 'suggested',
          highlightColor: 'rgba(33, 150, 243, 0.3)'
        });
      }
    });
    
    return dropZones;
  };
  
  // Update drop zones visualization
  const updateDropZonesVisualization = (zones: DropZoneIndicator[]) => {
    if (!canvas) return;
    
    // Clear previous drop zones
    Object.values(dropZoneRefs.current).forEach(zone => {
      canvas.remove(zone);
    });
    dropZoneRefs.current = {};
    
    // Create new drop zones
    zones.forEach(zone => {
      const rect = new fabric.Rect({
        left: zone.bounds.left,
        top: zone.bounds.top,
        width: zone.bounds.width,
        height: zone.bounds.height,
        fill: zone.highlightColor,
        stroke: 'transparent',
        selectable: false,
        evented: false,
        isGuide: true
      });
      
      canvas.add(rect);
      canvas.sendToBack(rect);
      dropZoneRefs.current[zone.id] = rect;
    });
    
    canvas.renderAll();
  };
  
  // Update hover outline visual
  const updateHoverOutline = (obj: fabric.Object) => {
    if (!canvas || !hoverOutlineRef.current) return;
    
    const { left = 0, top = 0, width = 0, height = 0, scaleX = 1, scaleY = 1 } = obj;
    
    hoverOutlineRef.current.set({
      left: left - 5,
      top: top - 5,
      width: width * scaleX + 10,
      height: height * scaleY + 10,
      visible: true
    });
    
    canvas.bringToFront(hoverOutlineRef.current);
    canvas.renderAll();
  };
  
  // Clear alignment guides
  const clearGuides = () => {
    if (!canvas) return;
    
    Object.values(guideRefs.current).forEach(guide => {
      canvas.remove(guide);
    });
    guideRefs.current = {};
    setGuides([]);
    
    canvas.renderAll();
  };
  
  // Clear drop zones
  const clearDropZones = () => {
    if (!canvas) return;
    
    Object.values(dropZoneRefs.current).forEach(zone => {
      canvas.remove(zone);
    });
    dropZoneRefs.current = {};
    setDropZones([]);
    
    canvas.renderAll();
  };
  
  // Component renders nothing visually as it just adds functionality
  return null;
};

export default DragEnhancementHandler;
