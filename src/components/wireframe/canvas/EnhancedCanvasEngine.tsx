
import React, { useRef } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '../utils/types';
import { useCanvasInitialization } from './useCanvasInitialization';
import { useSectionRenderer } from './useSectionRenderer';
import DragEnhancementHandler from './DragEnhancementHandler';

interface EnhancedCanvasEngineProps {
  width?: number;
  height?: number;
  canvasConfig?: Partial<WireframeCanvasConfig>;
  sections?: any[];
  className?: string;
  onSectionClick?: (id: string, section: any) => void;
  onObjectsSelected?: (objects: fabric.Object[]) => void;
  onObjectModified?: (object: fabric.Object) => void;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
}

const EnhancedCanvasEngine: React.FC<EnhancedCanvasEngineProps> = ({
  width = 1200,
  height = 800,
  canvasConfig = {},
  sections = [],
  className,
  onSectionClick,
  onObjectsSelected,
  onObjectModified,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Default configuration
  const defaultConfig: WireframeCanvasConfig = {
    width,
    height,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    gridType: 'lines',
    snapTolerance: 5,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    gridColor: '#e0e0e0'
  };
  
  // Merged configuration
  const config = { ...defaultConfig, ...canvasConfig };
  
  // Initialize canvas using our custom hook
  const { fabricCanvas, isLoading } = useCanvasInitialization(
    canvasRef,
    config,
    onObjectsSelected,
    onObjectModified,
    onCanvasReady
  );
  
  // Render sections using our custom hook
  useSectionRenderer(
    fabricCanvas, 
    sections,
    {
      showGrid: config.showGrid,
      gridSize: config.gridSize
    },
    onSectionClick
  );
  
  return (
    <div className={className}>
      <canvas ref={canvasRef} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p>Loading canvas...</p>
        </div>
      )}
      
      {/* Drag Enhancement Handler */}
      {fabricCanvas && (
        <DragEnhancementHandler
          canvas={fabricCanvas}
          enabled={config.snapToGrid || config.showSmartGuides}
          gridConfig={{
            visible: config.showGrid,
            size: config.gridSize,
            snapToGrid: config.snapToGrid,
            type: config.gridType,
            columns: 12,
            gutterWidth: 20,
            marginWidth: 40,
            snapThreshold: config.snapTolerance,
            showGuides: config.showSmartGuides,
            guideColor: 'rgba(0, 120, 255, 0.75)',
            showRulers: true,
            rulerSize: 20
          }}
          width={config.width}
          height={config.height}
          showDropIndicators={true}
        />
      )}
    </div>
  );
};

export default EnhancedCanvasEngine;
