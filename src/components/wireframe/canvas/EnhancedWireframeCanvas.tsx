
import React, { useEffect } from 'react';
import { useFabric } from '@/hooks/fabric/use-fabric';
import { cn } from '@/lib/utils';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import EnhancedGridSystem from './EnhancedGridSystem';

export interface EnhancedWireframeCanvasProps {
  wireframe: WireframeData | null;
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  showGrid?: boolean;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

const EnhancedWireframeCanvas: React.FC<EnhancedWireframeCanvasProps> = ({
  wireframe,
  darkMode = false,
  deviceType = 'desktop',
  showGrid = true,
  onSectionClick,
  className
}) => {
  // Use our fabric hook
  const {
    canvasRef,
    fabricCanvas,
    canvasConfig,
    selectedObject,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    setGridColor,
    updateConfig,
    zoomIn,
    zoomOut,
    resetZoom
  } = useFabric({
    initialConfig: {
      showGrid,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      gridColor: darkMode ? '#374151' : '#e5e7eb'
    }
  });
  
  // Handle grid toggle
  useEffect(() => {
    updateConfig({ showGrid });
  }, [showGrid, updateConfig]);
  
  // Handle device type changes
  useEffect(() => {
    let width = 1200;
    let height = 800;
    
    if (deviceType === 'tablet') {
      width = 768;
      height = 1024;
    } else if (deviceType === 'mobile') {
      width = 375;
      height = 667;
    }
    
    updateConfig({ width, height });
  }, [deviceType, updateConfig]);
  
  return (
    <div className={cn("enhanced-wireframe-canvas relative", className)}>
      <canvas 
        ref={canvasRef}
        className={cn(
          "wireframe-canvas border border-gray-200",
          darkMode && "border-gray-700"
        )}
      />
      
      {canvasConfig.showGrid && fabricCanvas && (
        <EnhancedGridSystem 
          canvas={fabricCanvas}
          width={canvasConfig.width}
          height={canvasConfig.height}
          gridConfig={{
            size: canvasConfig.gridSize,
            type: canvasConfig.gridType,
            color: canvasConfig.gridColor,
            visible: canvasConfig.showGrid
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default EnhancedWireframeCanvas;
