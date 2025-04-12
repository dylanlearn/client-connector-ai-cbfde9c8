
import React, { useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { AlignmentGuide, DropZoneIndicator } from '@/components/wireframe/utils/types';
import { snapToGuide, findNearestGuide } from '@/components/wireframe/utils/alignment-guides';

interface DragEnhancementHandlerProps {
  canvas: fabric.Canvas | null;
  enabled?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  showSmartGuides?: boolean;
  onObjectMove?: (obj: fabric.Object, position: { x: number, y: number }) => void;
}

export const DragEnhancementHandler: React.FC<DragEnhancementHandlerProps> = ({
  canvas,
  enabled = true,
  gridSize = 10,
  snapToGrid = true,
  showSmartGuides = true,
  onObjectMove
}) => {
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [activeGuide, setActiveGuide] = useState<AlignmentGuide | null>(null);
  const [dropZones, setDropZones] = useState<DropZoneIndicator[]>([]);

  // Generate alignment guides when canvas or active object changes
  useEffect(() => {
    if (!canvas || !enabled || !showSmartGuides) return;

    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (e.selected && e.selected.length > 0) {
        setActiveObject(e.selected[0]);
        generateAlignmentGuides(e.selected[0]);
      }
    };

    const handleSelectionCleared = () => {
      setActiveObject(null);
      setAlignmentGuides([]);
      setActiveGuide(null);
    };

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionCreated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, enabled, showSmartGuides]);

  // Object moving handler
  useEffect(() => {
    if (!canvas || !enabled) return;

    const handleObjectMoving = (e: fabric.IEvent) => {
      const obj = e.target;
      if (!obj) return;

      // Apply grid snapping
      if (snapToGrid && gridSize) {
        const newLeft = Math.round(obj.left! / gridSize) * gridSize;
        const newTop = Math.round(obj.top! / gridSize) * gridSize;
        obj.set({ left: newLeft, top: newTop });
      }

      // Apply alignment guide snapping
      if (showSmartGuides && alignmentGuides.length) {
        const objectBounds = {
          x: obj.left!,
          y: obj.top!,
          width: obj.width! * (obj.scaleX || 1),
          height: obj.height! * (obj.scaleY || 1)
        };

        // Find the nearest guide
        const result = findNearestGuide(
          { x: objectBounds.x, y: objectBounds.y },
          { width: objectBounds.width, height: objectBounds.height },
          alignmentGuides,
          10
        );

        if (result && result.guide) {
          setActiveGuide(result.guide);

          // Apply snapping
          if (result.guide.orientation === 'vertical') {
            obj.set({ left: obj.left! + result.offset });
          } else {
            obj.set({ top: obj.top! + result.offset });
          }
        } else {
          setActiveGuide(null);
        }
      }

      // Notify parent component
      if (onObjectMove) {
        onObjectMove(obj, { x: obj.left!, y: obj.top! });
      }
    };

    canvas.on('object:moving', handleObjectMoving);

    return () => {
      canvas.off('object:moving', handleObjectMoving);
    };
  }, [canvas, enabled, snapToGrid, gridSize, showSmartGuides, alignmentGuides, onObjectMove]);

  // Generate alignment guides for an object
  const generateAlignmentGuides = useCallback((activeObj: fabric.Object) => {
    if (!canvas) return;

    const guides: AlignmentGuide[] = [];
    const allObjects = canvas.getObjects().filter(obj => obj !== activeObj && !obj.data?.isGuide);

    // Get active object bounds
    const activeBounds = {
      left: activeObj.left!,
      top: activeObj.top!,
      right: activeObj.left! + (activeObj.width! * (activeObj.scaleX || 1)),
      bottom: activeObj.top! + (activeObj.height! * (activeObj.scaleY || 1)),
      centerX: activeObj.left! + (activeObj.width! * (activeObj.scaleX || 1) / 2),
      centerY: activeObj.top! + (activeObj.height! * (activeObj.scaleY || 1) / 2),
      width: activeObj.width! * (activeObj.scaleX || 1),
      height: activeObj.height! * (activeObj.scaleY || 1)
    };

    // Canvas center guides
    const canvasCenter = {
      x: canvas.width! / 2,
      y: canvas.height! / 2
    };

    guides.push({
      position: canvasCenter.x,
      orientation: 'vertical',
      type: 'center',
      strength: 3,
      label: 'Canvas center X'
    });

    guides.push({
      position: canvasCenter.y,
      orientation: 'horizontal',
      type: 'center',
      strength: 3,
      label: 'Canvas center Y'
    });

    // Process each object to create alignment guides
    allObjects.forEach(obj => {
      // Get object bounds
      const bounds = {
        left: obj.left!,
        top: obj.top!,
        right: obj.left! + (obj.width! * (obj.scaleX || 1)),
        bottom: obj.top! + (obj.height! * (obj.scaleY || 1)),
        centerX: obj.left! + (obj.width! * (obj.scaleX || 1) / 2),
        centerY: obj.top! + (obj.height! * (obj.scaleY || 1) / 2)
      };

      // Vertical guides - left edges
      guides.push({
        position: bounds.left,
        orientation: 'vertical',
        type: 'edge',
        strength: 2,
        label: `Left edge (${obj.data?.name || 'Object'})`
      });

      // Vertical guides - right edges
      guides.push({
        position: bounds.right,
        orientation: 'vertical',
        type: 'edge',
        strength: 2,
        label: `Right edge (${obj.data?.name || 'Object'})`
      });

      // Vertical guides - center
      guides.push({
        position: bounds.centerX,
        orientation: 'vertical',
        type: 'center',
        strength: 3,
        label: `Center X (${obj.data?.name || 'Object'})`
      });

      // Horizontal guides - top edges
      guides.push({
        position: bounds.top,
        orientation: 'horizontal',
        type: 'edge',
        strength: 2,
        label: `Top edge (${obj.data?.name || 'Object'})`
      });

      // Horizontal guides - bottom edges
      guides.push({
        position: bounds.bottom,
        orientation: 'horizontal',
        type: 'edge',
        strength: 2,
        label: `Bottom edge (${obj.data?.name || 'Object'})`
      });

      // Horizontal guides - center
      guides.push({
        position: bounds.centerY,
        orientation: 'horizontal',
        type: 'center',
        strength: 3,
        label: `Center Y (${obj.data?.name || 'Object'})`
      });

      // Additional distribution guides
      guides.push({
        position: bounds.top - activeBounds.height,
        orientation: 'horizontal',
        type: 'distribution',
        strength: 1,
        label: `Equal spacing above (${obj.data?.name || 'Object'})`
      });

      guides.push({
        position: bounds.bottom + activeBounds.height,
        orientation: 'horizontal',
        type: 'distribution',
        strength: 1,
        label: `Equal spacing below (${obj.data?.name || 'Object'})`
      });
    });

    // Grid guides
    if (gridSize) {
      const canvasWidth = canvas.width || 1000;
      const canvasHeight = canvas.height || 800;

      for (let x = 0; x < canvasWidth; x += gridSize) {
        guides.push({
          position: x,
          orientation: 'vertical',
          type: 'grid',
          strength: 1,
          label: `Grid ${x}px`
        });
      }

      for (let y = 0; y < canvasHeight; y += gridSize) {
        guides.push({
          position: y,
          orientation: 'horizontal',
          type: 'grid',
          strength: 1,
          label: `Grid ${y}px`
        });
      }
    }

    setAlignmentGuides(guides);
  }, [canvas, gridSize]);

  // Render guide lines on canvas
  useEffect(() => {
    if (!canvas || !showSmartGuides || !activeGuide) return;

    // Remove existing guide lines
    const existingGuides = canvas.getObjects().filter(obj => obj.data?.isGuide);
    existingGuides.forEach(guide => canvas.remove(guide));

    // Create guide line
    const guideLine = new fabric.Line(
      activeGuide.orientation === 'vertical'
        ? [activeGuide.position, 0, activeGuide.position, canvas.height!]
        : [0, activeGuide.position, canvas.width!, activeGuide.position],
      {
        stroke: 'rgba(0, 120, 255, 0.8)',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        data: { isGuide: true }
      }
    );

    // Add guide label if available
    if (activeGuide.label) {
      const labelText = new fabric.Text(activeGuide.label, {
        left: activeGuide.orientation === 'vertical' ? activeGuide.position + 5 : 10,
        top: activeGuide.orientation === 'vertical' ? 10 : activeGuide.position + 5,
        fontSize: 12,
        fill: 'rgba(0, 120, 255, 1)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 3,
        selectable: false,
        evented: false,
        data: { isGuide: true }
      });

      canvas.add(labelText);
    }

    canvas.add(guideLine);
    canvas.renderAll();

    return () => {
      // Cleanup function to remove guide line when component unmounts or guide changes
      if (canvas) {
        const guides = canvas.getObjects().filter(obj => obj.data?.isGuide);
        guides.forEach(guide => canvas.remove(guide));
        canvas.renderAll();
      }
    };
  }, [canvas, showSmartGuides, activeGuide]);

  return null; // This is a behavior-only component with no UI
};

export default DragEnhancementHandler;
