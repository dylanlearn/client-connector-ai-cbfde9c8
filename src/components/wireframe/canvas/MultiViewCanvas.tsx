
import React from 'react';
import { cn } from '@/lib/utils';
import AdvancedWireframeEditor from '../AdvancedWireframeEditor';

export interface ViewportConfig {
  zoom: number;
  rotation: number;
  pan: { x: number; y: number };
  focusSection?: string | null;
  width: string;
  height: string;
}

interface MultiViewCanvasProps {
  viewports: ViewportConfig[];
  width: number;
  height: number;
  className?: string;
  onAreaFocus?: (viewportIndex: number, sectionId: string) => void;
}

const MultiViewCanvas: React.FC<MultiViewCanvasProps> = ({
  viewports,
  width,
  height,
  className,
  onAreaFocus
}) => {
  return (
    <div 
      className={cn(
        "multi-view-canvas flex flex-wrap", 
        className
      )}
    >
      {viewports.map((viewport, index) => (
        <div
          key={index}
          className="viewport-container relative"
          style={{
            width: viewport.width,
            height: viewport.height
          }}
        >
          <div 
            className="viewport-transform-container transition-transform duration-200 ease-out"
            style={{
              transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom}) rotate(${viewport.rotation}deg)`,
              transformOrigin: 'center center',
              width: '100%',
              height: '100%'
            }}
          >
            <AdvancedWireframeEditor
              width={width}
              height={height}
              pan={viewport.pan}
              zoom={viewport.zoom}
              rotation={viewport.rotation}
              viewportIndex={index}
              onAreaFocus={(sectionId) => onAreaFocus?.(index, sectionId)}
              focusSection={viewport.focusSection}
            />
          </div>
          <div className="viewport-index absolute top-2 left-2 bg-primary/80 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultiViewCanvas;
