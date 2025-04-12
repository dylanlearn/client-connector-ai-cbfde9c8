
import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig, SectionRenderingOptions } from '../utils/types';
import { updateGridOnCanvas } from '../utils/grid-system';
import { renderSectionToFabric } from '../utils/fabric-converters';
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
        updateGridOnCanvas(
          canvas, 
          {
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
          }, 
          config.width, 
          config.height
        );
      }
      
      // Set up event handlers
      canvas.on('selection:created', (e) => {
        if (onObjectsSelected && e.selected) {
          onObjectsSelected(e.selected);
        }
      });
      
      canvas.on('selection:updated', (e) => {
        if (onObjectsSelected && e.selected) {
          onObjectsSelected(e.selected);
        }
      });
      
      canvas.on('selection:cleared', () => {
        if (onObjectsSelected) {
          onObjectsSelected([]);
        }
      });
      
      canvas.on('object:modified', (e) => {
        if (onObjectModified && e.target) {
          onObjectModified(e.target);
        }
      });
      
      setFabricCanvas(canvas);
      setIsLoading(false);
      
      // Notify parent component that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
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
      config.gridSize, config.gridType, config.showSmartGuides, onCanvasReady,
      onObjectsSelected, onObjectModified]);
  
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
        gridSize: config.gridSize,
        responsive: true,
        deviceType: 'desktop',
        interactive: true,
        showBorders: true
      };
      
      const sectionObject = renderSectionToFabric(fabricCanvas, section, renderingOptions);
      
      // Set up section click handler if provided
      if (onSectionClick && sectionObject) {
        sectionObject.on('mousedown', () => {
          onSectionClick(section.id, section);
        });
      }
    });
    
    fabricCanvas.renderAll();
  }, [fabricCanvas, sections, config.showGrid, config.gridSize, onSectionClick]);
  
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
