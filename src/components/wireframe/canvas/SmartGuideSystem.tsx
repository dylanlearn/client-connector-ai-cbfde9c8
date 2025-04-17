
import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

interface SmartGuideSystemProps {
  canvas: fabric.Canvas | null;
  enabled?: boolean;
  threshold?: number;
  guideColor?: string;
  snapThreshold?: number;
  showLabels?: boolean;
}

/**
 * Smart Guide System that provides dynamic visual alignment guides and snapping
 */
const SmartGuideSystem: React.FC<SmartGuideSystemProps> = ({
  canvas,
  enabled = true,
  threshold = 10,
  guideColor = 'rgba(0, 120, 255, 0.75)',
  snapThreshold = 5,
  showLabels = true
}) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    let activeGuides: fabric.Line[] = [];
    let activeLabels: fabric.Text[] = [];
    let isSnapped = false;
    
    // Function to create a guide line
    const createGuideLine = (
      points: number[], 
      label?: string
    ): { line: fabric.Line; text?: fabric.Text } => {
      const line = new fabric.Line(points, {
        stroke: guideColor,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Create label if needed
      let text;
      if (showLabels && label) {
        const isHorizontal = points[1] === points[3]; // y1 === y3 means horizontal line
        
        text = new fabric.Text(label, {
          left: isHorizontal ? Math.min(points[0], points[2]) : points[0] + 5,
          top: isHorizontal ? points[1] - 20 : Math.min(points[1], points[3]),
          fontSize: 12,
          fill: guideColor,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: 2,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
      }
      
      return { line, text };
    };
    
    // Clear guides
    const clearGuides = () => {
      activeGuides.forEach(guide => canvas.remove(guide));
      activeLabels.forEach(label => canvas.remove(label));
      activeGuides = [];
      activeLabels = [];
    };
    
    // Handle object moving
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!e.target) return;
      
      clearGuides();
      
      const movingObject = e.target;
      const objBounds = movingObject.getBoundingRect(true, true);
      
      const objCenter = {
        x: objBounds.left + objBounds.width / 2,
        y: objBounds.top + objBounds.height / 2
      };
      
      const objEdges = {
        left: objBounds.left,
        right: objBounds.left + objBounds.width,
        top: objBounds.top,
        bottom: objBounds.top + objBounds.height
      };
      
      // Get all other objects
      const otherObjects = canvas.getObjects().filter(obj => 
        obj !== movingObject && 
        obj.type !== 'line' && 
        obj.type !== 'text' &&
        obj.selectable !== false && 
        !obj.evented
      );
      
      // Reset snapping flags
      isSnapped = false;
      let snapPosX = null;
      let snapPosY = null;
      
      // Check each object for potential guides
      otherObjects.forEach(otherObj => {
        const otherBounds = otherObj.getBoundingRect(true, true);
        const otherCenter = {
          x: otherBounds.left + otherBounds.width / 2,
          y: otherBounds.top + otherBounds.height / 2
        };
        
        const otherEdges = {
          left: otherBounds.left,
          right: otherBounds.left + otherBounds.width,
          top: otherBounds.top,
          bottom: otherBounds.top + otherBounds.height
        };
        
        // Center alignments
        if (Math.abs(objCenter.x - otherCenter.x) < threshold) {
          // Vertical center alignment
          const { line, text } = createGuideLine(
            [otherCenter.x, 0, otherCenter.x, canvas.height || 600],
            'Center X'
          );
          
          activeGuides.push(line);
          canvas.add(line);
          
          if (text) {
            activeLabels.push(text);
            canvas.add(text);
          }
          
          // Snap to center X if within snap threshold
          if (Math.abs(objCenter.x - otherCenter.x) < snapThreshold) {
            snapPosX = otherCenter.x - objBounds.width / 2;
            isSnapped = true;
          }
        }
        
        if (Math.abs(objCenter.y - otherCenter.y) < threshold) {
          // Horizontal center alignment
          const { line, text } = createGuideLine(
            [0, otherCenter.y, canvas.width || 800, otherCenter.y],
            'Center Y'
          );
          
          activeGuides.push(line);
          canvas.add(line);
          
          if (text) {
            activeLabels.push(text);
            canvas.add(text);
          }
          
          // Snap to center Y if within snap threshold
          if (Math.abs(objCenter.y - otherCenter.y) < snapThreshold) {
            snapPosY = otherCenter.y - objBounds.height / 2;
            isSnapped = true;
          }
        }
        
        // Edge alignments
        
        // Left edge
        if (Math.abs(objEdges.left - otherEdges.left) < threshold) {
          const { line, text } = createGuideLine(
            [otherEdges.left, 0, otherEdges.left, canvas.height || 600],
            'Left'
          );
          
          activeGuides.push(line);
          canvas.add(line);
          
          if (text) {
            activeLabels.push(text);
            canvas.add(text);
          }
          
          // Snap to left edge if within snap threshold
          if (Math.abs(objEdges.left - otherEdges.left) < snapThreshold) {
            snapPosX = otherEdges.left;
            isSnapped = true;
          }
        }
        
        // Right edge
        if (Math.abs(objEdges.right - otherEdges.right) < threshold) {
          const { line, text } = createGuideLine(
            [otherEdges.right, 0, otherEdges.right, canvas.height || 600],
            'Right'
          );
          
          activeGuides.push(line);
          canvas.add(line);
          
          if (text) {
            activeLabels.push(text);
            canvas.add(text);
          }
          
          // Snap to right edge if within snap threshold
          if (Math.abs(objEdges.right - otherEdges.right) < snapThreshold) {
            snapPosX = otherEdges.right - objBounds.width;
            isSnapped = true;
          }
        }
        
        // Top edge
        if (Math.abs(objEdges.top - otherEdges.top) < threshold) {
          const { line, text } = createGuideLine(
            [0, otherEdges.top, canvas.width || 800, otherEdges.top],
            'Top'
          );
          
          activeGuides.push(line);
          canvas.add(line);
          
          if (text) {
            activeLabels.push(text);
            canvas.add(text);
          }
          
          // Snap to top edge if within snap threshold
          if (Math.abs(objEdges.top - otherEdges.top) < snapThreshold) {
            snapPosY = otherEdges.top;
            isSnapped = true;
          }
        }
        
        // Bottom edge
        if (Math.abs(objEdges.bottom - otherEdges.bottom) < threshold) {
          const { line, text } = createGuideLine(
            [0, otherEdges.bottom, canvas.width || 800, otherEdges.bottom],
            'Bottom'
          );
          
          activeGuides.push(line);
          canvas.add(line);
          
          if (text) {
            activeLabels.push(text);
            canvas.add(text);
          }
          
          // Snap to bottom edge if within snap threshold
          if (Math.abs(objEdges.bottom - otherEdges.bottom) < snapThreshold) {
            snapPosY = otherEdges.bottom - objBounds.height;
            isSnapped = true;
          }
        }
      });
      
      // Apply snapping if needed
      if (isSnapped) {
        if (snapPosX !== null) {
          movingObject.set({ left: snapPosX });
        }
        if (snapPosY !== null) {
          movingObject.set({ top: snapPosY });
        }
      }
      
      // Send guides to back
      activeGuides.forEach(guide => guide.sendToBack());
      
      canvas.requestRenderAll();
    };
    
    const handleObjectModified = () => {
      clearGuides();
      canvas.requestRenderAll();
      
      if (isSnapped) {
        toast({
          title: 'Object Snapped',
          description: 'Object aligned with guide',
          duration: 1500
        });
        isSnapped = false;
      }
    };
    
    // Add event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', clearGuides);
    
    // Clean up on unmount
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', clearGuides);
      clearGuides();
    };
  }, [canvas, enabled, guideColor, showLabels, threshold, snapThreshold, toast]);
  
  return null; // No UI, just behavior
};

export default SmartGuideSystem;
