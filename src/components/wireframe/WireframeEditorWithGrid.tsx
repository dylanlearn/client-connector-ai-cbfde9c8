
import React from 'react';
import { cn } from '@/lib/utils';
import { fabric } from 'fabric';
import AdvancedWireframeEditor from './AdvancedWireframeEditor';

interface WireframeEditorWithGridProps {
  width?: number;
  height?: number;
  className?: string;
}

const WireframeEditorWithGrid: React.FC<WireframeEditorWithGridProps> = ({
  width = 1200,
  height = 800,
  className
}) => {
  return (
    <div className={cn("wireframe-editor-container", className)}>
      <AdvancedWireframeEditor 
        width={width}
        height={height}
      />
    </div>
  );
};

export default WireframeEditorWithGrid;
