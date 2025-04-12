
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { 
  AlignmentGuide, 
  DropZoneIndicator, 
  GridConfiguration 
} from '@/components/wireframe/utils/types';
import {
  generateAlignmentGuides,
  visualizeGuides,
  removeGuideVisualizations,
  snapObjectToGuides,
  findMatchingGuides
} from '@/components/wireframe/utils/alignment-guides';

interface DragEnhancementHandlerProps {
  /**
   * The fabric canvas instance
   */
  canvas: fabric.Canvas | null;
  /**
   * Whether the drag enhancements are enabled
   */
  enabled?: boolean;
  /**
   * Grid configuration
   */
  gridConfig: GridConfiguration;
  /**
   * Canvas width
   */
  width?: number;
  /**
   * Canvas height
   */
  height?: number;
  /**
   * Whether to show drop indicators for drag and drop
   */
  showDropIndicators?: boolean;
  /**
   * Additional options for the drag enhancements
   */
  options?: {
    snapThreshold?: number;
    showEdgeGuides?: boolean;
    showCenterGuides?: boolean;
    showDistributionGuides?: boolean;
    guideColor?: string;
    dropZoneColor?: string;
  };
}

const DragEnhancementHandler: React.FC<DragEnhancementHandlerProps> = ({
  canvas,
  enabled = true,
  gridConfig,
  width = 1200,
  height = 800,
  showDropIndicators = true,
  options = {}
}) => {
  const isMovingRef = useRef(false);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const dropZonesRef = useRef<DropZoneIndicator[]>([]);
  
  // Default options
  const {
    snapThreshold = gridConfig.snapThreshold || 10,
    showEdgeGuides = true,
    showCenterGuides = true,
    showDistributionGuides = false,
    guideColor = gridConfig.guideColor || 'rgba(0, 120, 255, 0.75)',
    dropZoneColor = 'rgba(100, 230, 100, 0.3)'
  } = options;
  
  // Handle object moving
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Object moving handler
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!e.target) return;
      activeObjectRef.current = e.target;
      isMovingRef.current = true;
      
      // Skip if the object is a grid or guide
      if (e.target.data?.type === 'grid' || e.target.data?.type === 'alignmentGuide') return;
      
      // Generate guides for the moving object
      const guides = generateAlignmentGuides(
        canvas,
        e.target,
        showEdgeGuides,
        showCenterGuides,
        showDistributionGuides
      );
      
      // Find matching guides
      const matchingGuides = findMatchingGuides(e.target, guides, snapThreshold);
      
      // Visualize matching guides
      if (matchingGuides.length > 0) {
        visualizeGuides(canvas, matchingGuides, guideColor);
        
        // Snap to guides
        snapObjectToGuides(e.target, matchingGuides, snapThreshold);
      } else {
        removeGuideVisualizations(canvas);
        
        // Regular grid snapping if no smart guides
        if (gridConfig.snapToGrid) {
          snapToGrid(e.target);
        }
      }
    };
    
    // Grid snapping function
    const snapToGrid = (obj: fabric.Object) => {
      if (!obj) return;
      
      const gridSize = gridConfig.size;
      const left = obj.left || 0;
      const top = obj.top || 0;
      
      // Snap to grid points
      obj.set({
        left: Math.round(left / gridSize) * gridSize,
        top: Math.round(top / gridSize) * gridSize
      });
    };
    
    // Object modified handler
    const handleObjectModified = () => {
      isMovingRef.current = false;
      removeGuideVisualizations(canvas);
      
      // Clean up drop zones if used
      if (showDropIndicators) {
        removeDropZones();
      }
    };
    
    // Selection cleared handler
    const handleSelectionCleared = () => {
      activeObjectRef.current = null;
      removeGuideVisualizations(canvas);
      
      // Clean up drop zones if used
      if (showDropIndicators) {
        removeDropZones();
      }
    };
    
    // Helper to remove drop zones
    const removeDropZones = () => {
      canvas.getObjects().filter(obj => 
        obj.data?.type === 'dropZone'
      ).forEach(obj => canvas.remove(obj));
      dropZonesRef.current = [];
    };
    
    // Add event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    // Cleanup function
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', handleSelectionCleared);
      removeGuideVisualizations(canvas);
      
      if (showDropIndicators) {
        removeDropZones();
      }
    };
  }, [
    canvas, 
    enabled, 
    gridConfig.snapToGrid, 
    gridConfig.size, 
    snapThreshold,
    showEdgeGuides,
    showCenterGuides,
    showDistributionGuides,
    showDropIndicators,
    guideColor,
    dropZoneColor
  ]);
  
  // Generate drop zone indicators
  useEffect(() => {
    if (!canvas || !enabled || !showDropIndicators) return;
    
    // Generate drop zones based on other objects
    const generateDropZones = () => {
      // Skip if no active object
      const activeObj = activeObjectRef.current;
      if (!activeObj || !isMovingRef.current) return;
      
      // Get all objects except the active one and grid/guides
      const otherObjects = canvas.getObjects().filter(obj => {
        // Skip the active object itself
        if (obj === activeObj) return false;
        
        // Skip grid lines and guides
        if (obj.data?.type === 'grid' || obj.data?.type === 'alignmentGuide' || obj.data?.type === 'dropZone') return false;
        
        // Include only visible objects
        return obj.visible !== false;
      });
      
      // Remove existing drop zones
      removeDropZones();
      
      // Create new drop zones
      const dropZones: DropZoneIndicator[] = [];
      
      // Top drop zones
      otherObjects.forEach(obj => {
        const objLeft = obj.left || 0;
        const objTop = obj.top || 0;
        const objWidth = (obj.width || 0) * (obj.scaleX || 1);
        const objHeight = (obj.height || 0) * (obj.scaleY || 1);
        
        // Top drop zone
        const topZone: DropZoneIndicator = {
          id: `dropzone-${obj.data?.id || ''}-top`,
          type: 'dropzone',
          position: { x: objLeft, y: objTop - (activeObj.height || 0) * (activeObj.scaleY || 1) },
          size: { width: objWidth, height: (activeObj.height || 0) * (activeObj.scaleY || 1) }
        };
        
        dropZones.push(topZone);
        
        // Right drop zone
        const rightZone: DropZoneIndicator = {
          id: `dropzone-${obj.data?.id || ''}-right`,
          type: 'dropzone',
          position: { x: objLeft + objWidth, y: objTop },
          size: { width: (activeObj.width || 0) * (activeObj.scaleX || 1), height: objHeight }
        };
        
        dropZones.push(rightZone);
        
        // Bottom drop zone
        const bottomZone: DropZoneIndicator = {
          id: `dropzone-${obj.data?.id || ''}-bottom`,
          type: 'dropzone',
          position: { x: objLeft, y: objTop + objHeight },
          size: { width: objWidth, height: (activeObj.height || 0) * (activeObj.scaleY || 1) }
        };
        
        dropZones.push(bottomZone);
        
        // Left drop zone
        const leftZone: DropZoneIndicator = {
          id: `dropzone-${obj.data?.id || ''}-left`,
          type: 'dropzone',
          position: { x: objLeft - (activeObj.width || 0) * (activeObj.scaleX || 1), y: objTop },
          size: { width: (activeObj.width || 0) * (activeObj.scaleX || 1), height: objHeight }
        };
        
        dropZones.push(leftZone);
        
        // Inside zone for container objects
        if (obj.data?.isContainer) {
          const insideZone: DropZoneIndicator = {
            id: `dropzone-${obj.data?.id || ''}-inside`,
            type: 'dropzone',
            position: { x: objLeft, y: objTop },
            size: { width: objWidth, height: objHeight }
          };
          
          dropZones.push(insideZone);
        }
      });
      
      // Visualize drop zones
      dropZones.forEach(zone => {
        const rect = new fabric.Rect({
          left: zone.position.x,
          top: zone.position.y,
          width: zone.size.width,
          height: zone.size.height,
          fill: dropZoneColor,
          stroke: 'rgba(100, 200, 100, 0.5)',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          data: { 
            type: 'dropZone',
            id: zone.id
          }
        });
        
        canvas.add(rect);
        rect.sendToBack();
      });
      
      dropZonesRef.current = dropZones;
    };
    
    // Helper to remove drop zones
    const removeDropZones = () => {
      canvas.getObjects().filter(obj => 
        obj.data?.type === 'dropZone'
      ).forEach(obj => canvas.remove(obj));
      dropZonesRef.current = [];
    };
    
    // Refresh drop zones periodically during drag
    const intervalId = setInterval(() => {
      if (isMovingRef.current && activeObjectRef.current) {
        generateDropZones();
      }
    }, 100);
    
    return () => {
      clearInterval(intervalId);
      removeDropZones();
    };
  }, [
    canvas, 
    enabled, 
    showDropIndicators, 
    dropZoneColor
  ]);
  
  // Component doesn't render anything
  return null;
};

export default DragEnhancementHandler;
