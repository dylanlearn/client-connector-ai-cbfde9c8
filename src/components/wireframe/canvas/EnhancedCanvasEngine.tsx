
import React, { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { 
  renderSectionToFabric,
  objectToFabric,
  fabricToObject,
  componentToFabricObject
} from '../utils/fabric-converters';

interface EnhancedCanvasEngineProps {
  width?: number;
  height?: number;
  canvasConfig?: Partial<WireframeCanvasConfig>;
  sections?: any[];
  components?: any[];
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onObjectSelected?: (obj: fabric.Object | null) => void;
  className?: string;
}

const EnhancedCanvasEngine: React.FC<EnhancedCanvasEngineProps> = ({
  width = 1200,
  height = 800,
  canvasConfig,
  sections = [],
  components = [],
  onCanvasReady,
  onObjectSelected,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: canvasConfig?.backgroundColor || '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });
    
    setCanvas(fabricCanvas);
    
    // Set up event listeners
    fabricCanvas.on('selection:created', (e) => {
      if (onObjectSelected) {
        onObjectSelected(e.selected?.[0] || null);
      }
    });
    
    fabricCanvas.on('selection:cleared', () => {
      if (onObjectSelected) {
        onObjectSelected(null);
      }
    });
    
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas);
    }
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [width, height, canvasConfig?.backgroundColor, onObjectSelected, onCanvasReady]);
  
  // Render sections to canvas
  useEffect(() => {
    if (!canvas || !sections.length) return;
    
    // Clear existing sections
    const existingSections = canvas.getObjects().filter(obj => 
      (obj as any).data?.type === 'section'
    );
    
    existingSections.forEach(obj => canvas.remove(obj));
    
    // Add new sections
    sections.forEach((section) => {
      renderSectionToFabric(canvas, section, {
        darkMode: canvasConfig?.backgroundColor === '#333333',
        showGrid: canvasConfig?.showGrid,
        gridSize: canvasConfig?.gridSize
      });
    });
    
    canvas.renderAll();
  }, [canvas, sections, canvasConfig]);
  
  // Render components to canvas
  useEffect(() => {
    if (!canvas || !components.length) return;
    
    // Clear existing components
    const existingComponents = canvas.getObjects().filter(obj => 
      (obj as any).data?.type === 'component'
    );
    
    existingComponents.forEach(obj => canvas.remove(obj));
    
    // Add new components
    components.forEach((component) => {
      if (!component) return;
      const fabricObj = componentToFabricObject(component);
      canvas.add(fabricObj);
    });
    
    canvas.renderAll();
  }, [canvas, components]);
  
  return (
    <div className={`enhanced-canvas-engine ${className || ''}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default EnhancedCanvasEngine;
