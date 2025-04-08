import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useWireframeStore } from '@/stores/wireframe-store';
import { cn } from '@/lib/utils';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';
import { componentToFabricObject } from '../utils/fabric-converters';
import CanvasControls from '../controls/CanvasControls';
import { getDeviceStyles } from '../registry/component-types';

interface WireframeCanvasEngineProps {
  sections?: WireframeSection[];
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  readOnly?: boolean;
  onSectionSelect?: (sectionId: string) => void;
  onSectionUpdate?: (section: WireframeSection) => void;
  className?: string;
}

const WireframeCanvasEngine: React.FC<WireframeCanvasEngineProps> = ({
  sections = [],
  darkMode = false,
  deviceType = 'desktop',
  readOnly = false,
  onSectionSelect,
  onSectionUpdate,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const applyDeviceSpecificStyles = (baseStyles, responsiveConfig, device) => {
    return getDeviceStyles(
      { ...baseStyles, ...(responsiveConfig ? responsiveConfig[device] || {} : {}) }, 
      device
    );
  };

  const getCanvasDimensions = () => {
    switch (deviceType) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      case 'desktop':
      default:
        return { width: 1280, height: 800 };
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const dimensions = getCanvasDimensions();
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      selection: !readOnly,
      preserveObjectStacking: true
    });
    
    if (showGrid) {
      createGrid(fabricCanvas, dimensions.width, dimensions.height);
    }

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [darkMode, deviceType, showGrid]);

  const createGrid = (canvas: fabric.Canvas, width: number, height: number) => {
    const gridSize = 20;
    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    
    canvas.getObjects().forEach(obj => {
      if (obj.data?.type === 'grid') {
        canvas.remove(obj);
      }
    });

    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: gridColor,
        selectable: false,
        excludeFromExport: true,
        evented: false
      });
      line.set('data', { type: 'grid' });
      canvas.add(line);
    }

    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: gridColor,
        selectable: false,
        excludeFromExport: true,
        evented: false
      });
      line.set('data', { type: 'grid' });
      canvas.add(line);
    }

    canvas.getObjects().forEach(obj => {
      if (obj.data?.type === 'grid') {
        canvas.sendToBack(obj);
      }
    });
    
    canvas.renderAll();
  };

  const handleZoom = (newZoom: number) => {
    if (!canvas) return;
    
    setZoom(newZoom);
    canvas.setZoom(newZoom);
    canvas.renderAll();
  };

  useEffect(() => {
    if (!canvas) return;

    canvas.getObjects().forEach(obj => {
      if (obj.data?.type === 'section') {
        canvas.remove(obj);
      }
    });

    sections.forEach((section, index) => {
      const fabricSection = componentToFabricObject(section, index, deviceType);
      if (fabricSection) {
        fabricSection.set('data', { 
          type: 'section', 
          sectionId: section.id 
        });
        
        if (!readOnly) {
          fabricSection.on('selected', () => {
            setSelectedObject(fabricSection);
            if (onSectionSelect && section.id) {
              onSectionSelect(section.id);
            }
          });
          
          fabricSection.on('modified', () => {
            if (onSectionUpdate && section.id) {
              const updatedSection = {
                ...section,
                position: {
                  x: fabricSection.left || 0,
                  y: fabricSection.top || 0
                },
                dimensions: {
                  width: fabricSection.getScaledWidth(),
                  height: fabricSection.getScaledHeight()
                }
              };
              onSectionUpdate(updatedSection);
            }
          });
        } else {
          fabricSection.selectable = false;
          fabricSection.evented = false;
        }
        
        canvas.add(fabricSection);
      }
    });

    canvas.renderAll();
  }, [canvas, sections, deviceType, readOnly]);

  useEffect(() => {
    if (!canvas) return;
    canvas.setBackgroundColor(darkMode ? '#1e293b' : '#ffffff', () => {
      canvas.renderAll();
      
      if (showGrid) {
        createGrid(canvas, canvas.width || 0, canvas.height || 0);
      }
    });
  }, [darkMode, canvas, showGrid]);

  useEffect(() => {
    if (!canvas) return;
    
    const dimensions = getCanvasDimensions();
    canvas.setWidth(dimensions.width);
    canvas.setHeight(dimensions.height);
    
    if (showGrid) {
      createGrid(canvas, dimensions.width, dimensions.height);
    }
    
    canvas.renderAll();
  }, [deviceType, canvas, showGrid]);

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    if (canvas) {
      if (!showGrid) {
        createGrid(canvas, canvas.width || 0, canvas.height || 0);
      } else {
        canvas.getObjects().forEach(obj => {
          if (obj.data?.type === 'grid') {
            canvas.remove(obj);
          }
        });
        canvas.renderAll();
      }
    }
  };

  const handleResetZoom = () => {
    handleZoom(1);
  };

  const handleZoomIn = () => {
    handleZoom(Math.min(zoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    handleZoom(Math.max(zoom - 0.1, 0.5));
  };

  return (
    <div className={cn("wireframe-canvas-container", className)}>
      {!readOnly && (
        <CanvasControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onToggleGrid={toggleGrid}
          showGrid={showGrid}
          className="mb-2"
        />
      )}
      
      <div className={cn(
        "relative border rounded-md overflow-hidden",
        darkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <canvas ref={canvasRef} />
        
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
          {deviceType} • {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
};

export default WireframeCanvasEngine;
