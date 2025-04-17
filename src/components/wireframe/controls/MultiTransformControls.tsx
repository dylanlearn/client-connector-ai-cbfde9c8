
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { fabric } from 'fabric';
import { Copy, Trash2, Lock, Unlock, ArrowUpCircle, ArrowDownCircle, Grid, Command } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MultiTransformControlsProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
  onDuplicate: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLockToggle: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  onDistributeHorizontally: () => void;
  onDistributeVertically: () => void;
  className?: string;
}

const MultiTransformControls: React.FC<MultiTransformControlsProps> = ({
  canvas,
  selectedObjects,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onLockToggle,
  onBringForward,
  onSendBackward,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignTop,
  onAlignMiddle,
  onAlignBottom,
  onDistributeHorizontally,
  onDistributeVertically,
  className
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });
  
  // Detect if selection is locked or a group
  useEffect(() => {
    if (!selectedObjects || selectedObjects.length === 0) return;
    
    // Check if all selected objects are locked
    const allLocked = selectedObjects.every(obj => obj.lockMovementX && obj.lockMovementY);
    setIsLocked(allLocked);
    
    // Check if selection is a group or contains groups
    const hasGroups = selectedObjects.some(obj => obj.type === 'group');
    setIsGroup(hasGroups);
    
    // Calculate selection bounds
    if (canvas) {
      const activeSelection = canvas.getActiveObject();
      if (activeSelection && (activeSelection.type === 'activeSelection' || activeSelection.type === 'group')) {
        setBounds({
          left: activeSelection.left || 0,
          top: activeSelection.top || 0,
          width: activeSelection.width! * (activeSelection.scaleX || 1),
          height: activeSelection.height! * (activeSelection.scaleY || 1)
        });
      }
    }
  }, [canvas, selectedObjects]);
  
  if (!selectedObjects || selectedObjects.length === 0) {
    return null;
  }
  
  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn(
        "multi-transform-controls absolute pointer-events-none",
        className
      )}>
        {/* Selection outline indicator - positioned absolutely */}
        <div 
          className="selection-outline absolute border-2 border-dashed border-primary pointer-events-none"
          style={{
            left: bounds.left + 'px',
            top: bounds.top + 'px',
            width: bounds.width + 'px',
            height: bounds.height + 'px',
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Controls toolbar */}
        <div className="controls-toolbar absolute top-0 right-0 transform translate-x-full -translate-y-1/2 flex bg-background border rounded-md shadow-sm pointer-events-auto">
          <div className="flex flex-col divide-y">
            {/* Object actions */}
            <div className="flex p-1 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onDuplicate}
                    className="p-1 hover:bg-muted rounded-sm"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicate (Ctrl+D)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onDelete}
                    className="p-1 hover:bg-muted rounded-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete (Del)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onLockToggle}
                    className="p-1 hover:bg-muted rounded-sm"
                  >
                    {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLocked ? 'Unlock' : 'Lock'} (Ctrl+L)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Group actions */}
            <div className="flex p-1 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onGroup}
                    className="p-1 hover:bg-muted rounded-sm" 
                    disabled={selectedObjects.length < 2}
                  >
                    <Command className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Group (Ctrl+G)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onUngroup}
                    className="p-1 hover:bg-muted rounded-sm"
                    disabled={!isGroup}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ungroup (Ctrl+Shift+G)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Z-index actions */}
            <div className="flex p-1 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onBringForward}
                    className="p-1 hover:bg-muted rounded-sm"
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bring Forward (Ctrl+])</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onSendBackward}
                    className="p-1 hover:bg-muted rounded-sm"
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send Backward (Ctrl+[)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MultiTransformControls;
