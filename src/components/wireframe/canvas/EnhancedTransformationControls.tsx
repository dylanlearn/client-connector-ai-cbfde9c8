
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ResizeHandles } from '../controls';
import QuickActionsOverlay, { createDefaultQuickActions, QuickAction } from '../controls/QuickActionsOverlay';
import { 
  RotateCw, 
  ArrowLeftRight,
  ArrowUpDown,
  FlipHorizontal,
  FlipVertical,
  Move,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';
import { 
  TransformationValues 
} from '@/hooks/wireframe/use-advanced-transform';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { AdvancedTransformControls } from '../controls';

interface EnhancedTransformationControlsProps {
  isActive: boolean;
  onResizeStart: (direction: string, e: React.MouseEvent) => void;
  onRotateStart: (e: React.MouseEvent) => void;
  onSkewStart?: (axis: 'x' | 'y', e: React.MouseEvent) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onEdit: () => void;
  onToggleLock: () => void;
  onFlip: (axis: 'horizontal' | 'vertical') => void;
  isLocked: boolean;
  rotation?: number;
  transformValues: TransformationValues & { opacity: number };
  onTransformChange: (values: Partial<TransformationValues>) => void;
  onResetTransformation: () => void;
  maintainAspectRatio: boolean;
  onToggleAspectRatio: (maintain: boolean) => void;
  showRotationValue?: boolean;
  children?: React.ReactNode;
  className?: string;
  showAdvancedControls?: boolean;
}

const EnhancedTransformationControls: React.FC<EnhancedTransformationControlsProps> = ({
  isActive,
  onResizeStart,
  onRotateStart,
  onSkewStart,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onEdit,
  onToggleLock,
  onFlip,
  isLocked,
  rotation = 0,
  transformValues,
  onTransformChange,
  onResetTransformation,
  maintainAspectRatio,
  onToggleAspectRatio,
  showRotationValue = true,
  children,
  className,
  showAdvancedControls = true
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showAdvancedTransform, setShowAdvancedTransform] = useState(false);
  
  // Ensure transformValues includes all required properties for AdvancedTransformControls
  const advancedTransformValues: import('../controls/AdvancedTransformControls').TransformationValues = {
    ...transformValues,
    opacity: transformValues.opacity || 1, // Provide a default value if opacity is undefined
    scale: transformValues.scale || 1 // Provide a default value if scale is undefined
  };
  
  // Define the quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'rotate',
      icon: <RotateCw className="h-4 w-4" />,
      label: "Rotate",
      onClick: () => {
        // We'll create a synthetic event when the button is clicked
        const syntheticEvent = new MouseEvent('click') as unknown as React.MouseEvent;
        onRotateStart(syntheticEvent);
      },
      disabled: isLocked
    },
    {
      id: 'flip-x',
      icon: <FlipHorizontal className="h-4 w-4" />,
      label: "Flip X",
      onClick: () => onFlip('horizontal'),
      disabled: isLocked
    },
    {
      id: 'flip-y',
      icon: <FlipVertical className="h-4 w-4" />,
      label: "Flip Y",
      onClick: () => onFlip('vertical'),
      disabled: isLocked
    },
    {
      id: 'transform',
      icon: <Settings className="h-4 w-4" />,
      label: "Transform",
      onClick: () => setShowAdvancedTransform(!showAdvancedTransform),
      disabled: false
    },
    ...createDefaultQuickActions(
      onDuplicate, 
      onDelete, 
      onBringForward, 
      onSendBackward,
      () => {},
      onEdit,
      isLocked,
      onToggleLock
    )
  ];
  
  if (!isActive) {
    return <>{children}</>;
  }
  
  return (
    <div 
      className={cn(
        "relative group", 
        className,
        { "cursor-move": !isLocked }
      )}
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      {children}
      
      {/* Resize and rotation handles */}
      {!isLocked && (
        <>
          <ResizeHandles 
            show={isActive}
            onResizeStart={onResizeStart}
            onRotateStart={onRotateStart}
            showRotateHandle={true}
            rotation={rotation}
            showRotationValue={showRotationValue}
            size="md"
            color="primary"
            enableCorners={true}
            enableEdges={true}
          />
          
          {/* Skew handles (optional) */}
          {onSkewStart && (
            <div className="skew-handles absolute w-full h-full pointer-events-none">
              <div 
                className="absolute top-1/2 right-0 w-3 h-8 bg-purple-500 border border-white rounded-sm transform translate-x-full -translate-y-1/2 cursor-ew-resize pointer-events-auto"
                onMouseDown={(e) => onSkewStart('x', e)}
                title="Skew horizontally"
              />
              <div 
                className="absolute bottom-0 left-1/2 h-3 w-8 bg-purple-500 border border-white rounded-sm transform -translate-x-1/2 translate-y-full cursor-ns-resize pointer-events-auto"
                onMouseDown={(e) => onSkewStart('y', e)}
                title="Skew vertically"
              />
            </div>
          )}
        </>
      )}
      
      {/* Advanced transform controls */}
      {showAdvancedControls && (
        <Popover open={showAdvancedTransform} onOpenChange={setShowAdvancedTransform}>
          <PopoverContent className="w-80 p-0" align="end" sideOffset={10}>
            <AdvancedTransformControls
              values={advancedTransformValues}
              onValuesChange={onTransformChange}
              onFlip={onFlip}
              onReset={onResetTransformation}
              maintainAspectRatio={maintainAspectRatio}
              onToggleAspectRatio={onToggleAspectRatio}
              disabled={isLocked}
            />
          </PopoverContent>
        </Popover>
      )}
      
      {/* Quick actions overlay */}
      <QuickActionsOverlay
        show={showQuickActions}
        actions={quickActions}
        position="top-right"
      />
    </div>
  );
};

export default EnhancedTransformationControls;
