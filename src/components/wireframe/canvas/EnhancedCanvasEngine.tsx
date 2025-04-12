
import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig, SectionRenderingOptions } from '@/components/wireframe/utils/types';
import { createCanvasGrid } from '@/components/wireframe/utils/grid-utils';
import { renderSectionToFabric } from '@/components/wireframe/utils/fabric-converters';

interface EnhancedCanvasEngineProps {
  width?: number;
  height?: number;
  canvasConfig?: Partial<WireframeCanvasConfig>;
  sections?: any[];
  className?: string;
}

const EnhancedCanvasEngine: React.FC<EnhancedCanvasEngineProps> = ({
  width = 1200,
  height = 800,
  canvasConfig = {},
  sections = [],
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor,
        selection: true,
        preserveObjectStacking: true
      });
      
      // Set canvas zoom and pan from config
      if (config.zoom !== 1) {
        canvas.setZoom(config.zoom);
      }
      
      if (config.panOffset.x !== 0 || config.panOffset.y !== 0) {
        canvas.absolutePan(new fabric.Point(
          config.panOffset.x,
          config.panOffset.y
        ));
      }
      
      // Add grid if enabled
      if (config.showGrid) {
        const gridLines = createCanvasGrid(canvas, config.gridSize, config.gridType);
        if (gridLines && gridLines.length) {
          gridLines.forEach(line => canvas.add(line));
        }
      }
      
      // Set up snap to grid if enabled
      if (config.snapToGrid) {
        canvas.on('object:moving', (options) => {
          if (options.target) {
            const target = options.target;
            const gridSize = config.gridSize;
            
            target.set({
              left: Math.round(target.left! / gridSize) * gridSize,
              top: Math.round(target.top! / gridSize) * gridSize
            });
          }
        });
      }
      
      setFabricCanvas(canvas);
      setIsLoading(false);
      
      return () => {
        canvas.dispose();
        setFabricCanvas(null);
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      setIsLoading(false);
    }
  }, [config.width, config.height, config.backgroundColor, config.zoom, 
      config.panOffset.x, config.panOffset.y, config.showGrid, config.snapToGrid, 
      config.gridSize, config.gridType]);
  
  // Render sections when available
  useEffect(() => {
    if (!fabricCanvas || !sections || sections.length === 0) return;
    
    // Clear existing sections
    const existingSections = fabricCanvas.getObjects().filter(
      obj => obj.data?.type === 'section'
    );
    existingSections.forEach(section => fabricCanvas.remove(section));
    
    // Render new sections
    sections.forEach(section => {
      const renderingOptions: SectionRenderingOptions = {
        width: section.dimensions?.width || 400,
        height: section.dimensions?.height || 300,
        darkMode: false,
        showGrid: config.showGrid,
        gridSize: config.gridSize
      };
      
      renderSectionToFabric(fabricCanvas, section, renderingOptions);
    });
    
    fabricCanvas.renderAll();
  }, [fabricCanvas, sections, config.showGrid, config.gridSize]);
  
  return (
    <div className={className}>
      <canvas ref={canvasRef} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p>Loading canvas...</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedCanvasEngine;
