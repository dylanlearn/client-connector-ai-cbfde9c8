
import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { AlignmentGuide } from '../utils/grid-system';

interface SmartGuideProps {
  canvas: fabric.Canvas;
  enabled: boolean;
  guideColor?: string;
  snapThreshold?: number;
  showDistanceIndicators?: boolean;
  showEdgeGuides?: boolean;
  showCenterGuides?: boolean;
  magneticStrength?: number; // 0-10 scale for how strong the snap is
}

const SmartGuideSystem: React.FC<SmartGuideProps> = ({
  canvas,
  enabled = true,
  guideColor = 'rgba(0, 120, 255, 0.75)',
  snapThreshold = 8,
  showDistanceIndicators = true,
  showEdgeGuides = true,
  showCenterGuides = true,
  magneticStrength = 5
}) => {
  const [activeGuides, setActiveGuides] = useState<fabric.Line[]>([]);
  const [distanceLabels, setDistanceLabels] = useState<fabric.Text[]>([]);
  
  // Effect to set up and clean up guides
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Guide storage
    let guides: fabric.Line[] = [];
    let distanceIndicators: fabric.Text[] = [];
    
    // Handler for object movement
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!e.target) return;
      
      // Remove existing guides
      clearGuides();
      
      const movingObject = e.target;
      const otherObjects = canvas.getObjects().filter(obj => 
        obj !== movingObject && 
        obj.type !== 'line' && 
        obj.type !== 'text' &&
        !(obj.data && obj.data.type === 'guide')
      );
      
      // Calculate bounds of moving object
      const bounds = getObjectBounds(movingObject);
      
      // Create guides array
      const alignmentGuides: AlignmentGuide[] = [];
      
      // Get guides from other objects
      otherObjects.forEach(obj => {
        const otherBounds = getObjectBounds(obj);
        
        // Edge guides
        if (showEdgeGuides) {
          // Vertical edges (left, center, right)
          addEdgeGuide(alignmentGuides, bounds, otherBounds, 'vertical', 'left');
          addEdgeGuide(alignmentGuides, bounds, otherBounds, 'vertical', 'right');
          
          // Horizontal edges (top, middle, bottom)
          addEdgeGuide(alignmentGuides, bounds, otherBounds, 'horizontal', 'top');
          addEdgeGuide(alignmentGuides, bounds, otherBounds, 'horizontal', 'bottom');
        }
        
        // Center guides
        if (showCenterGuides) {
          addCenterGuide(alignmentGuides, bounds, otherBounds, 'vertical');
          addCenterGuide(alignmentGuides, bounds, otherBounds, 'horizontal');
        }
        
        // Equal spacing guides (for 3+ objects)
        if (otherObjects.length >= 2) {
          addEqualSpacingGuides(alignmentGuides, bounds, otherObjects);
        }
      });
      
      // Find nearest guides and apply snapping based on magnetic strength
      const strongestVerticalGuide = findStrongestGuide(alignmentGuides, 'vertical', snapThreshold);
      const strongestHorizontalGuide = findStrongestGuide(alignmentGuides, 'horizontal', snapThreshold);
      
      // Apply snapping based on magnetic strength (0-10)
      const snapFactor = magneticStrength / 10;
      
      if (strongestVerticalGuide) {
        // Create visual guide
        createGuide('vertical', strongestVerticalGuide.position);
        
        // Apply snapping if position differs
        if (strongestVerticalGuide.type === 'left-edge') {
          const targetLeft = strongestVerticalGuide.position;
          if (Math.abs(movingObject.left! - targetLeft) <= snapThreshold) {
            const currentLeft = movingObject.left || 0;
            // Apply partial or full snapping based on magnetic strength
            const snapAmount = (targetLeft - currentLeft) * snapFactor;
            movingObject.set({ left: currentLeft + snapAmount });
            
            // Show distance indicator if enabled
            if (showDistanceIndicators) {
              createDistanceIndicator('vertical', strongestVerticalGuide.position, 
                Math.round(Math.abs(currentLeft - targetLeft)));
            }
          }
        }
      }
      
      if (strongestHorizontalGuide) {
        // Create visual guide
        createGuide('horizontal', strongestHorizontalGuide.position);
        
        // Apply snapping if position differs
        if (strongestHorizontalGuide.type === 'top-edge') {
          const targetTop = strongestHorizontalGuide.position;
          if (Math.abs(movingObject.top! - targetTop) <= snapThreshold) {
            const currentTop = movingObject.top || 0;
            // Apply partial or full snapping based on magnetic strength
            const snapAmount = (targetTop - currentTop) * snapFactor;
            movingObject.set({ top: currentTop + snapAmount });
            
            // Show distance indicator if enabled
            if (showDistanceIndicators) {
              createDistanceIndicator('horizontal', strongestHorizontalGuide.position, 
                Math.round(Math.abs(currentTop - targetTop)));
            }
          }
        }
      }
      
      canvas.renderAll();
    };
    
    // Function to add edge guide
    const addEdgeGuide = (
      guides: AlignmentGuide[], 
      bounds: { left: number; top: number; right: number; bottom: number; centerX: number; centerY: number; },
      otherBounds: { left: number; top: number; right: number; bottom: number; centerX: number; centerY: number; },
      orientation: 'horizontal' | 'vertical',
      edge: 'left' | 'right' | 'top' | 'bottom'
    ) => {
      // Get positions based on orientation and edge
      let position1 = 0, position2 = 0;
      
      if (orientation === 'vertical') {
        position1 = edge === 'left' ? bounds.left : bounds.right;
        position2 = edge === 'left' ? otherBounds.left : otherBounds.right;
      } else {
        position1 = edge === 'top' ? bounds.top : bounds.bottom;
        position2 = edge === 'top' ? otherBounds.top : otherBounds.bottom;
      }
      
      // Check if within threshold
      if (Math.abs(position1 - position2) <= snapThreshold) {
        guides.push({
          orientation,
          position: position2,
          type: `${edge}-edge`,
          strength: 10 - Math.abs(position1 - position2)
        });
      }
    };
    
    // Function to add center guide
    const addCenterGuide = (
      guides: AlignmentGuide[],
      bounds: { left: number; top: number; right: number; bottom: number; centerX: number; centerY: number; },
      otherBounds: { left: number; top: number; right: number; bottom: number; centerX: number; centerY: number; },
      orientation: 'horizontal' | 'vertical'
    ) => {
      const position1 = orientation === 'vertical' ? bounds.centerX : bounds.centerY;
      const position2 = orientation === 'vertical' ? otherBounds.centerX : otherBounds.centerY;
      
      if (Math.abs(position1 - position2) <= snapThreshold) {
        guides.push({
          orientation,
          position: position2,
          type: 'center',
          strength: 10 - Math.abs(position1 - position2)
        });
      }
    };
    
    // Function to add equal spacing guides
    const addEqualSpacingGuides = (
      guides: AlignmentGuide[],
      bounds: { left: number; top: number; right: number; bottom: number; centerX: number; centerY: number; },
      objects: fabric.Object[]
    ) => {
      // Sort objects by position
      const sortedByX = [...objects].sort((a, b) => (a.left || 0) - (b.left || 0));
      const sortedByY = [...objects].sort((a, b) => (a.top || 0) - (b.top || 0));
      
      // Check for equal horizontal spacing
      for (let i = 1; i < sortedByX.length; i++) {
        const prev = sortedByX[i-1];
        const curr = sortedByX[i];
        
        const prevRight = (prev.left || 0) + (prev.width || 0) * (prev.scaleX || 1);
        const spacing = (curr.left || 0) - prevRight;
        
        // Check if moving object would create equal spacing with another pair
        for (let j = 1; j < sortedByX.length; j++) {
          if (i === j) continue;
          
          const prevJ = sortedByX[j-1];
          const currJ = sortedByX[j];
          
          const prevRightJ = (prevJ.left || 0) + (prevJ.width || 0) * (prevJ.scaleX || 1);
          const spacingJ = (currJ.left || 0) - prevRightJ;
          
          if (Math.abs(spacing - spacingJ) <= snapThreshold) {
            guides.push({
              orientation: 'vertical',
              position: prevRight + spacing,
              type: 'equal-spacing',
              strength: 8 - Math.abs(spacing - spacingJ)
            });
          }
        }
      }
      
      // Similar logic for vertical spacing
      // (omitted for brevity but would follow same pattern)
    };
    
    // Find strongest guide in a given orientation
    const findStrongestGuide = (
      guides: AlignmentGuide[],
      orientation: 'horizontal' | 'vertical',
      threshold: number
    ): AlignmentGuide | null => {
      const filteredGuides = guides.filter(g => 
        g.orientation === orientation && 
        (g.strength || 0) > 0
      );
      
      if (filteredGuides.length === 0) return null;
      
      return filteredGuides.reduce((strongest, current) => 
        (current.strength || 0) > (strongest.strength || 0) ? current : strongest
      );
    };
    
    // Create visual guide line
    const createGuide = (orientation: 'horizontal' | 'vertical', position: number) => {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      
      const line = new fabric.Line(
        orientation === 'horizontal'
          ? [0, position, canvasWidth, position]
          : [position, 0, position, canvasHeight],
        {
          stroke: guideColor,
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          data: { type: 'guide' }
        }
      );
      
      canvas.add(line);
      guides.push(line);
      setActiveGuides(prev => [...prev, line]);
    };
    
    // Create distance indicator
    const createDistanceIndicator = (orientation: 'horizontal' | 'vertical', position: number, distance: number) => {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      
      const text = new fabric.Text(`${distance}px`, {
        fontSize: 12,
        fill: guideColor,
        backgroundColor: 'rgba(255,255,255,0.7)',
        left: orientation === 'vertical' ? position + 5 : canvasWidth / 2,
        top: orientation === 'horizontal' ? position - 20 : canvasHeight / 2,
        selectable: false,
        evented: false,
        data: { type: 'guide-label' }
      });
      
      canvas.add(text);
      distanceIndicators.push(text);
      setDistanceLabels(prev => [...prev, text]);
    };
    
    // Clear all guides and indicators
    const clearGuides = () => {
      guides.forEach(guide => canvas.remove(guide));
      distanceIndicators.forEach(label => canvas.remove(label));
      
      guides = [];
      distanceIndicators = [];
      
      setActiveGuides([]);
      setDistanceLabels([]);
    };
    
    // Get object bounds with center points
    const getObjectBounds = (obj: fabric.Object) => {
      const left = obj.left || 0;
      const top = obj.top || 0;
      const width = (obj.width || 0) * (obj.scaleX || 1);
      const height = (obj.height || 0) * (obj.scaleY || 1);
      
      return {
        left,
        top,
        right: left + width,
        bottom: top + height,
        centerX: left + width / 2,
        centerY: top + height / 2
      };
    };
    
    // Clear on object modified or selection cleared
    const handleObjectModified = () => clearGuides();
    const handleSelectionCleared = () => clearGuides();
    
    // Set up event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    // Cleanup
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', handleSelectionCleared);
      clearGuides();
    };
  }, [
    canvas, 
    enabled, 
    guideColor, 
    snapThreshold, 
    showDistanceIndicators, 
    showEdgeGuides, 
    showCenterGuides,
    magneticStrength
  ]);
  
  return null; // This component doesn't render anything
};

export default SmartGuideSystem;
