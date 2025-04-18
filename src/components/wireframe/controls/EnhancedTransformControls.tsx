
import React, { useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  RotateCw, Copy, Trash2, ChevronUp, ChevronDown, 
  Lock, Unlock, CornerDownRight, CornerUpLeft 
} from 'lucide-react';

interface TransformHandle {
  cursor: string;
  visible: boolean;
  position: {
    x: number;
    y: number;
    originX: 'left' | 'center' | 'right';
    originY: 'top' | 'center' | 'bottom';
  };
}

interface EnhancedTransformControlsProps {
  canvas: fabric.Canvas;
  activeObject: fabric.Object | null;
  showRotationControl?: boolean;
  showScaleControls?: boolean;
  showSkewControls?: boolean;
  showFlipControls?: boolean;
  cornerSize?: number;
}

const EnhancedTransformControls: React.FC<EnhancedTransformControlsProps> = ({
  canvas,
  activeObject,
  showRotationControl = true,
  showScaleControls = true,
  showSkewControls = false,
  showFlipControls = true,
  cornerSize = 10
}) => {
  const { toast } = useToast();
  const [isLocked, setIsLocked] = useState(false);

  // Update locked state when active object changes
  useEffect(() => {
    if (!activeObject) {
      setIsLocked(false);
      return;
    }
    
    setIsLocked(!!activeObject.lockMovementX && !!activeObject.lockMovementY);
  }, [activeObject]);

  useEffect(() => {
    if (!canvas) return;

    // Configure transform controls appearance
    fabric.Object.prototype.set({
      borderColor: '#2196f3',
      cornerColor: '#2196f3',
      cornerStyle: 'circle',
      cornerSize: cornerSize,
      transparentCorners: false,
      cornerStrokeColor: '#ffffff',
      borderScaleFactor: 1.5,
      // Add custom controls
      hasRotatingPoint: showRotationControl,
      controls: {
        ...fabric.Object.prototype.controls
      }
    });

    // Add custom control points if needed
    if (showSkewControls) {
      // Define skew control for X-axis
      fabric.Object.prototype.controls.skewX = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetY: -20,
        cursorStyle: 'ew-resize',
        actionHandler: fabric.controlsUtils.skewHandler('x'),
        actionName: 'skewX',
        render: renderSkewControl,
        cornerSize: cornerSize
      });
      
      // Define skew control for Y-axis
      fabric.Object.prototype.controls.skewY = new fabric.Control({
        x: 0.5,
        y: 0,
        offsetX: 20,
        cursorStyle: 'ns-resize',
        actionHandler: fabric.controlsUtils.skewHandler('y'),
        actionName: 'skewY',
        render: renderSkewControl,
        cornerSize: cornerSize
      });
    }

    canvas.renderAll();

    return () => {
      // Restore default controls when component unmounts
      fabric.Object.prototype.controls = { ...fabric.Control.prototype.controls };
      if (canvas) canvas.renderAll();
    };
  }, [canvas, cornerSize, showRotationControl, showScaleControls, showSkewControls]);

  // Custom control rendering for skew handles
  const renderSkewControl = (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) => {
    const size = cornerSize;
    ctx.save();
    ctx.fillStyle = '#9c27b0';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(left - size/2, top - size/2, size, size);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // Handle duplication
  const handleDuplicate = useCallback(() => {
    if (!canvas || !activeObject) return;

    activeObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (activeObject.left || 0) + 20,
        top: (activeObject.top || 0) + 20,
        evented: true,
      });
      
      if (cloned.type === 'activeSelection') {
        const activeSelection = cloned as fabric.ActiveSelection;
        // Handle cloning of active selections
        canvas.discardActiveObject();
        
        activeSelection.canvas = canvas;
        activeSelection.forEachObject((obj) => {
          canvas.add(obj);
        });
        
        canvas.setActiveObject(activeSelection);
      } else {
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
      }
      
      canvas.requestRenderAll();
      
      toast({
        title: "Object Duplicated",
        description: "A copy of the selected object has been created."
      });
    });
  }, [canvas, activeObject, toast]);

  // Handle deletion
  const handleDelete = useCallback(() => {
    if (!canvas || !activeObject) return;

    if (activeObject.type === 'activeSelection') {
      const activeSelection = activeObject as fabric.ActiveSelection;
      
      // Remove all objects in the active selection
      activeSelection.forEachObject((obj) => {
        canvas.remove(obj);
      });
      
      canvas.discardActiveObject();
    } else {
      canvas.remove(activeObject);
    }
    
    canvas.requestRenderAll();
    
    toast({
      title: "Object Deleted",
      description: "The selected object has been removed from the canvas."
    });
  }, [canvas, activeObject, toast]);

  // Handle bring forward
  const handleBringForward = useCallback(() => {
    if (!canvas || !activeObject) return;

    canvas.bringForward(activeObject);
    canvas.requestRenderAll();
    
    toast({
      title: "Brought Forward",
      description: "Object moved up one layer."
    });
  }, [canvas, activeObject, toast]);

  // Handle send backward
  const handleSendBackward = useCallback(() => {
    if (!canvas || !activeObject) return;

    canvas.sendBackwards(activeObject);
    canvas.requestRenderAll();
    
    toast({
      title: "Sent Backward",
      description: "Object moved down one layer."
    });
  }, [canvas, activeObject, toast]);

  // Handle toggle lock
  const handleToggleLock = useCallback(() => {
    if (!canvas || !activeObject) return;

    const newLockState = !isLocked;
    
    activeObject.set({
      lockMovementX: newLockState,
      lockMovementY: newLockState,
      lockRotation: newLockState,
      lockScalingX: newLockState,
      lockScalingY: newLockState,
      hasControls: !newLockState,
      selectable: !newLockState
    });
    
    setIsLocked(newLockState);
    canvas.requestRenderAll();
    
    toast({
      title: newLockState ? "Object Locked" : "Object Unlocked",
      description: newLockState 
        ? "The object is now locked and cannot be modified." 
        : "The object is now unlocked and can be modified."
    });
  }, [canvas, activeObject, isLocked, toast]);

  // Handle flip horizontal
  const handleFlipHorizontal = useCallback(() => {
    if (!canvas || !activeObject) return;

    activeObject.set('flipX', !activeObject.flipX);
    canvas.requestRenderAll();
  }, [canvas, activeObject]);

  // Handle flip vertical
  const handleFlipVertical = useCallback(() => {
    if (!canvas || !activeObject) return;

    activeObject.set('flipY', !activeObject.flipY);
    canvas.requestRenderAll();
  }, [canvas, activeObject]);

  // If no active object or canvas, don't render anything
  if (!canvas || !activeObject) return null;

  return (
    <div className="enhanced-transform-controls absolute top-0 left-0 right-0 z-10 p-2 bg-background/80 backdrop-blur-sm border-b flex items-center gap-2 shadow-sm">
      <div className="transform-actions flex items-center gap-1">
        {/* Duplication */}
        <button
          onClick={handleDuplicate}
          className="p-1 rounded hover:bg-primary/10 transition-colors"
          title="Duplicate Object (Ctrl+D)"
        >
          <Copy size={16} />
        </button>
        
        {/* Delete */}
        <button
          onClick={handleDelete}
          className="p-1 rounded hover:bg-destructive/10 transition-colors"
          title="Delete Object (Delete)"
        >
          <Trash2 size={16} />
        </button>
        
        {/* Lock/Unlock */}
        <button
          onClick={handleToggleLock}
          className="p-1 rounded hover:bg-primary/10 transition-colors"
          title={isLocked ? "Unlock Object (Ctrl+L)" : "Lock Object (Ctrl+L)"}
        >
          {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
        </button>
        
        {/* Bring Forward */}
        <button
          onClick={handleBringForward}
          className="p-1 rounded hover:bg-primary/10 transition-colors"
          title="Bring Forward (Ctrl+])"
        >
          <ChevronUp size={16} />
        </button>
        
        {/* Send Backward */}
        <button
          onClick={handleSendBackward}
          className="p-1 rounded hover:bg-primary/10 transition-colors"
          title="Send Backward (Ctrl+[)"
        >
          <ChevronDown size={16} />
        </button>
        
        {/* Flip Controls */}
        {showFlipControls && (
          <>
            <button
              onClick={handleFlipHorizontal}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Flip Horizontal"
            >
              <CornerDownRight size={16} />
            </button>
            
            <button
              onClick={handleFlipVertical}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Flip Vertical"
            >
              <CornerUpLeft size={16} className="rotate-90" />
            </button>
          </>
        )}
      </div>
      
      {activeObject && (
        <div className="object-info text-xs font-mono ml-auto text-muted-foreground">
          {activeObject.type} 
          {activeObject.id && ` #${activeObject.id}`}
        </div>
      )}
    </div>
  );
};

export default EnhancedTransformControls;
