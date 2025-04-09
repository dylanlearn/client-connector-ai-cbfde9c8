
import React from 'react';
import { cn } from '@/lib/utils';

interface ResizeHandlesProps {
  show: boolean;
  onResizeStart: (direction: string, e: React.MouseEvent) => void;
  onRotateStart?: (e: React.MouseEvent) => void;
  showRotateHandle?: boolean;
  className?: string;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ 
  show, 
  onResizeStart, 
  onRotateStart,
  showRotateHandle = true,
  className
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
  
  const baseHandleClasses = "absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-pointer z-20";
  
  return (
    <div className={cn("resize-handles w-full h-full absolute top-0 left-0 pointer-events-none", className)}>
      {/* Corner handles */}
      <div 
        className={cn(baseHandleClasses, "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('nw')}
        data-resize-handle="nw"
      />
      <div 
        className={cn(baseHandleClasses, "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('ne')}
        data-resize-handle="ne"
      />
      <div 
        className={cn(baseHandleClasses, "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('sw')}
        data-resize-handle="sw"
      />
      <div 
        className={cn(baseHandleClasses, "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('se')}
        data-resize-handle="se"
      />
      
      {/* Edge handles */}
      <div 
        className={cn(baseHandleClasses, "top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ns-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('n')}
        data-resize-handle="n"
      />
      <div 
        className={cn(baseHandleClasses, "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('e')}
        data-resize-handle="e"
      />
      <div 
        className={cn(baseHandleClasses, "bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 cursor-ns-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('s')}
        data-resize-handle="s"
      />
      <div 
        className={cn(baseHandleClasses, "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize pointer-events-auto")}
        onMouseDown={handleMouseDown('w')}
        data-resize-handle="w"
      />
      
      {/* Rotation handle */}
      {showRotateHandle && onRotateStart && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 pointer-events-auto">
          <div 
            className="w-3 h-3 bg-green-500 border border-white rounded-full cursor-pointer"
            onMouseDown={handleRotateMouseDown}
            data-resize-handle="rotate"
          />
          <div className="h-6 w-0.5 bg-gray-400 absolute top-3 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

export default ResizeHandles;
