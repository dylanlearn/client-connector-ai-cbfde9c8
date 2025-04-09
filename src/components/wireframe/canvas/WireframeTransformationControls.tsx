
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ResizeHandles from '../controls/ResizeHandles';
import QuickActionsOverlay, { createDefaultQuickActions } from '../controls/QuickActionsOverlay';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface TransformationControlsProps {
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
  isLocked: boolean;
  rotation?: number;
  showRotationValue?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const WireframeTransformationControls: React.FC<TransformationControlsProps> = ({
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
  isLocked,
  rotation = 0,
  showRotationValue = true,
  children,
  className
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Define the quick actions - we'll wrap the onRotateStart to handle the event inside
  const quickActions = createDefaultQuickActions(
    onDuplicate,
    onDelete,
    onBringForward,
    onSendBackward,
    // Wrap onRotateStart to handle the MouseEvent
    () => {
      // We'll create a synthetic event when the button is clicked
      const syntheticEvent = new MouseEvent('click') as unknown as React.MouseEvent;
      onRotateStart(syntheticEvent);
    },
    onEdit,
    isLocked,
    onToggleLock
  );
  
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
      )}
      
      {/* Skew handles (optional) */}
      {!isLocked && onSkewStart && (
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
      
      {/* Quick actions overlay */}
      <QuickActionsOverlay
        show={showQuickActions}
        actions={quickActions}
        position="top-right"
      />
    </div>
  );
};

export default WireframeTransformationControls;
