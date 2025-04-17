
import { useCallback } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';
import { 
  alignObjects, 
  distributeObjects, 
  createAlignmentGuides, 
  clearAlignmentGuides 
} from '@/components/wireframe/utils/alignment-distribution';

export function useAlignmentDistribution(canvas: fabric.Canvas | null) {
  const { toast } = useToast();
  
  // Alignment callbacks
  const alignLeft = useCallback(() => {
    if (!canvas) return;
    if (alignObjects.left(canvas)) {
      toast({ 
        title: "Objects Aligned",
        description: "Objects aligned to the left edge"
      });
    }
  }, [canvas, toast]);
  
  const alignCenterH = useCallback(() => {
    if (!canvas) return;
    if (alignObjects.centerH(canvas)) {
      toast({ 
        title: "Objects Aligned",
        description: "Objects aligned to horizontal center"
      });
    }
  }, [canvas, toast]);
  
  const alignRight = useCallback(() => {
    if (!canvas) return;
    if (alignObjects.right(canvas)) {
      toast({ 
        title: "Objects Aligned",
        description: "Objects aligned to the right edge"
      });
    }
  }, [canvas, toast]);
  
  const alignTop = useCallback(() => {
    if (!canvas) return;
    if (alignObjects.top(canvas)) {
      toast({ 
        title: "Objects Aligned",
        description: "Objects aligned to the top edge"
      });
    }
  }, [canvas, toast]);
  
  const alignMiddle = useCallback(() => {
    if (!canvas) return;
    if (alignObjects.middle(canvas)) {
      toast({ 
        title: "Objects Aligned",
        description: "Objects aligned to vertical middle"
      });
    }
  }, [canvas, toast]);
  
  const alignBottom = useCallback(() => {
    if (!canvas) return;
    if (alignObjects.bottom(canvas)) {
      toast({ 
        title: "Objects Aligned",
        description: "Objects aligned to the bottom edge"
      });
    }
  }, [canvas, toast]);
  
  // Distribution callbacks
  const distributeHorizontally = useCallback(() => {
    if (!canvas) return;
    if (distributeObjects.horizontally(canvas)) {
      toast({ 
        title: "Objects Distributed",
        description: "Objects distributed horizontally"
      });
    } else {
      toast({ 
        title: "Cannot Distribute",
        description: "Need at least 3 objects to distribute",
        variant: "destructive"
      });
    }
  }, [canvas, toast]);
  
  const distributeVertically = useCallback(() => {
    if (!canvas) return;
    if (distributeObjects.vertically(canvas)) {
      toast({ 
        title: "Objects Distributed",
        description: "Objects distributed vertically"
      });
    } else {
      toast({ 
        title: "Cannot Distribute",
        description: "Need at least 3 objects to distribute",
        variant: "destructive"
      });
    }
  }, [canvas, toast]);
  
  const spaceEvenlyHorizontal = useCallback(() => {
    if (!canvas) return;
    if (distributeObjects.spaceEvenlyHorizontal(canvas)) {
      toast({ 
        title: "Objects Spaced",
        description: "Objects spaced evenly horizontally"
      });
    } else {
      toast({ 
        title: "Cannot Space Evenly",
        description: "Need at least 3 objects to space evenly",
        variant: "destructive"
      });
    }
  }, [canvas, toast]);
  
  const spaceEvenlyVertical = useCallback(() => {
    if (!canvas) return;
    if (distributeObjects.spaceEvenlyVertical(canvas)) {
      toast({ 
        title: "Objects Spaced",
        description: "Objects spaced evenly vertically"
      });
    } else {
      toast({ 
        title: "Cannot Space Evenly",
        description: "Need at least 3 objects to space evenly",
        variant: "destructive"
      });
    }
  }, [canvas, toast]);
  
  // Setup dynamic alignment guides
  const setupDynamicGuides = useCallback(() => {
    if (!canvas) return () => {};
    
    let activeGuides: fabric.Line[] = [];
    
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!e.target) return;
      
      // Clear any existing guides
      activeGuides.forEach(existingGuide => canvas.remove(existingGuide));
      activeGuides = [];
      
      // Get all other objects
      const allObjects = canvas.getObjects().filter(obj => 
        obj !== e.target && 
        obj.type !== 'line' && 
        obj.selectable !== false
      );
      
      // Create new guides
      activeGuides = createAlignmentGuides(canvas, e.target, allObjects);
      
      // Add guides to canvas
      activeGuides.forEach(guide => canvas.add(guide));
      
      // Ensure guides are at the back
      activeGuides.forEach(guide => {
        if (guide) {
          guide.sendToBack();
        }
      });
    };
    
    const handleObjectModified = () => {
      // Clear guides when object stops moving
      activeGuides.forEach(existingGuide => canvas.remove(existingGuide));
      activeGuides = [];
      canvas.requestRenderAll();
    };
    
    // Add event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    
    // Return cleanup function
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      clearAlignmentGuides(canvas);
    };
  }, [canvas]);
  
  // Create a function to check if multiple objects are selected
  const hasMultipleObjectsSelected = useCallback(() => {
    if (!canvas) return false;
    const activeObjects = canvas.getActiveObjects();
    return activeObjects && activeObjects.length > 1;
  }, [canvas]);
  
  return {
    alignLeft,
    alignCenterH,
    alignRight,
    alignTop,
    alignMiddle,
    alignBottom,
    distributeHorizontally,
    distributeVertically,
    spaceEvenlyHorizontal,
    spaceEvenlyVertical,
    setupDynamicGuides,
    hasMultipleObjectsSelected
  };
}
