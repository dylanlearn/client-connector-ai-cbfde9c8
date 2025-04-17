
import React, { useState } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  Trash2, 
  Lock, 
  Unlock,
  MoveHorizontal,
  MoveVertical, 
  CornerDownRight,
  CornerUpLeft,
  Move,
  ArrowUpNarrow,
  ArrowDownNarrow,
  Maximize2,
  Hash
} from 'lucide-react';

interface SelectionSettingsPanelProps {
  selectedObjects: fabric.Object[];
  canvas: fabric.Canvas | null;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onLockToggle?: () => void;
}

const SelectionSettingsPanel: React.FC<SelectionSettingsPanelProps> = ({
  selectedObjects,
  canvas,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onLockToggle
}) => {
  const [opacity, setOpacity] = useState<number>(100);
  
  // Get the first selected object to display its properties
  const primaryObject = selectedObjects[0];
  const isLocked = primaryObject?.lockMovementX && primaryObject?.lockMovementY;
  
  // Calculate combined dimensions of multiple objects
  const getBoundingRect = () => {
    if (!canvas || selectedObjects.length === 0) return null;
    
    if (selectedObjects.length === 1) {
      const obj = selectedObjects[0];
      return {
        width: Math.round(obj.width! * obj.scaleX!),
        height: Math.round(obj.height! * obj.scaleY!),
        left: Math.round(obj.left!),
        top: Math.round(obj.top!),
        angle: Math.round(obj.angle!)
      };
    }
    
    // For multiple objects, get the selection bounding box
    const activeSelection = canvas.getActiveObject();
    if (activeSelection && activeSelection.type === 'activeSelection') {
      return {
        width: Math.round(activeSelection.width! * activeSelection.scaleX!),
        height: Math.round(activeSelection.height! * activeSelection.scaleY!),
        left: Math.round(activeSelection.left!),
        top: Math.round(activeSelection.top!),
        angle: Math.round(activeSelection.angle!)
      };
    }
    
    return null;
  };
  
  const rect = getBoundingRect();
  
  // Apply opacity to all selected objects
  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
    
    if (canvas) {
      selectedObjects.forEach(obj => {
        obj.set('opacity', value[0] / 100);
      });
      canvas.renderAll();
    }
  };
  
  // Handle movement by precise amounts
  const moveObjects = (direction: 'left' | 'right' | 'up' | 'down', pixels: number) => {
    if (!canvas) return;
    
    const moveMap = {
      left: { left: -pixels },
      right: { left: pixels },
      up: { top: -pixels },
      down: { top: pixels }
    };
    
    selectedObjects.forEach(obj => {
      obj.set(moveMap[direction]);
      obj.setCoords();
    });
    
    canvas.renderAll();
    canvas.fire('object:modified');
  };
  
  return (
    <div className="selection-settings-panel space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">
            {selectedObjects.length > 1 
              ? `${selectedObjects.length} Objects Selected` 
              : 'Object Properties'
            }
          </h3>
          
          {/* Object type info */}
          <p className="text-sm text-muted-foreground mb-4">
            {selectedObjects.length > 1 
              ? 'Multiple types' 
              : primaryObject?.type || 'Unknown'
            }
          </p>
          
          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-1 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicate}
              className="flex flex-col items-center justify-center h-16 gap-1"
              title="Duplicate (Ctrl+D)"
            >
              <Copy size={16} />
              <span className="text-xs">Duplicate</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex flex-col items-center justify-center h-16 gap-1"
              title="Delete (Delete)"
            >
              <Trash2 size={16} />
              <span className="text-xs">Delete</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onLockToggle}
              className="flex flex-col items-center justify-center h-16 gap-1"
              title="Lock/Unlock (Ctrl+L)"
            >
              {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
              <span className="text-xs">{isLocked ? 'Unlock' : 'Lock'}</span>
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          {/* Position & Size */}
          {rect && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Hash size={14} className="mr-1" />
                  Dimensions
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>W: {rect.width}px</div>
                  <div>H: {rect.height}px</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Move size={14} className="mr-1" />
                  Position
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>X: {rect.left}px</div>
                  <div>Y: {rect.top}px</div>
                  {rect.angle !== 0 && (
                    <div>Rotation: {rect.angle}°</div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Opacity</h4>
                <Slider 
                  value={[opacity]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={handleOpacityChange} 
                />
                <div className="text-xs text-right mt-1">{opacity}%</div>
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          
          {/* Movement controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Precise Movement</h4>
            
            <div className="flex justify-center mb-2">
              <Toggle
                variant="outline"
                size="sm"
                onClick={() => moveObjects('up', 1)}
                title="Move Up 1px"
              >
                <ArrowUpNarrow size={16} />
              </Toggle>
            </div>
            
            <div className="flex justify-between">
              <Toggle
                variant="outline"
                size="sm"
                onClick={() => moveObjects('left', 1)}
                title="Move Left 1px"
              >
                <MoveHorizontal size={16} />
              </Toggle>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBringForward}
                  title="Bring Forward (Ctrl+])"
                >
                  <ArrowUpNarrow size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSendBackward}
                  title="Send Backward (Ctrl+[)"
                >
                  <ArrowDownNarrow size={16} />
                </Button>
              </div>
              
              <Toggle
                variant="outline"
                size="sm"
                onClick={() => moveObjects('right', 1)}
                title="Move Right 1px"
              >
                <MoveHorizontal size={16} className="transform rotate-180" />
              </Toggle>
            </div>
            
            <div className="flex justify-center">
              <Toggle
                variant="outline"
                size="sm"
                onClick={() => moveObjects('down', 1)}
                title="Move Down 1px"
              >
                <ArrowDownNarrow size={16} />
              </Toggle>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectionSettingsPanel;
