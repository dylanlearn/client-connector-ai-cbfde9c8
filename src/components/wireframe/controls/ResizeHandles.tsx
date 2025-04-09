
import React from 'react';
import { cn } from '@/lib/utils';
import { CircleIcon, RotateCcw } from 'lucide-react';

interface ResizeHandlesProps {
  show: boolean;
  onResizeStart: (direction: string, e: React.MouseEvent) => void;
  onRotateStart?: (e: React.MouseEvent) => void;
  showRotateHandle?: boolean;
  className?: string;
  rotation?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  enableCorners?: boolean;
  enableEdges?: boolean;
  showRotationValue?: boolean;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ 
  show, 
  onResizeStart, 
  onRotateStart,
  showRotateHandle = true,
  className,
  rotation = 0,
  size = 'md',
  color = 'primary',
  enableCorners = true,
  enableEdges = true,
  showRotationValue = false
}) => {
  if (!show) return null;
  
  const handleMouseDown = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onResizeStart(direction, e);
  };
  
  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRotateStart) onRotateStart(e);
  };
  
  const handleSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
  
  const handleColors = {
    primary: 'bg-blue-500 border-white',
    secondary: 'bg-purple-500 border-white',
    accent: 'bg-orange-500 border-white',
  };
  
  const baseHandleClasses = cn(
    "absolute border rounded-full cursor-pointer z-20 pointer-events-auto",
    handleSizes[size],
    handleColors[color]
  );
  
  return (
    <div className={cn("resize-handles w-full h-full absolute top-0 left-0 pointer-events-none", className)}>
      {/* Corner handles */}
      {enableCorners && (
        <>
          <div 
            className={cn(baseHandleClasses, "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize")}
            onMouseDown={handleMouseDown('nw')}
            data-resize-handle="nw"
          />
          <div 
            className={cn(baseHandleClasses, "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize")}
            onMouseDown={handleMouseDown('ne')}
            data-resize-handle="ne"
          />
          <div 
            className={cn(baseHandleClasses, "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize")}
            onMouseDown={handleMouseDown('sw')}
            data-resize-handle="sw"
          />
          <div 
            className={cn(baseHandleClasses, "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize")}
            onMouseDown={handleMouseDown('se')}
            data-resize-handle="se"
          />
        </>
      )}
      
      {/* Edge handles */}
      {enableEdges && (
        <>
          <div 
            className={cn(baseHandleClasses, "top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ns-resize")}
            onMouseDown={handleMouseDown('n')}
            data-resize-handle="n"
          />
          <div 
            className={cn(baseHandleClasses, "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize")}
            onMouseDown={handleMouseDown('e')}
            data-resize-handle="e"
          />
          <div 
            className={cn(baseHandleClasses, "bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 cursor-ns-resize")}
            onMouseDown={handleMouseDown('s')}
            data-resize-handle="s"
          />
          <div 
            className={cn(baseHandleClasses, "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize")}
            onMouseDown={handleMouseDown('w')}
            data-resize-handle="w"
          />
        </>
      )}
      
      {/* Enhanced Rotation handle */}
      {showRotateHandle && onRotateStart && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 pointer-events-auto flex flex-col items-center">
          <div 
            className={cn(
              "w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-grab flex items-center justify-center",
              "hover:bg-blue-600 active:cursor-grabbing shadow-md transition-colors"
            )}
            onMouseDown={handleRotateMouseDown}
            data-resize-handle="rotate"
          >
            <RotateCcw size={14} className="text-white" />
          </div>
          <div className="h-8 w-0.5 bg-blue-400/70 mt-1" />
          
          {showRotationValue && (
            <div className="absolute top-7 left-1/2 -translate-x-1/2 -translate-y-4 whitespace-nowrap bg-background/80 backdrop-blur-sm text-xs px-1.5 py-0.5 rounded border border-blue-200 shadow-sm">
              {Math.round(rotation)}°
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResizeHandles;
