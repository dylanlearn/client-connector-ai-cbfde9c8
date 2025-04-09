import React, { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig, SectionRenderingOptions } from '@/components/wireframe/utils/types';
import EnhancedCanvasRulers from './EnhancedCanvasRulers';

interface WireframeCanvasEngineProps {
  canvasConfig?: Partial<WireframeCanvasConfig>;
  sections?: any[];
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

const DEFAULT_CONFIG: WireframeCanvasConfig = {
  width: 1200,
  height: 800,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  gridType: 'lines',
  snapTolerance: 5,
  backgroundColor: '#ffffff',
  showSmartGuides: true,
  showRulers: true,
  rulerSize: 20,
  historyEnabled: true,
  maxHistorySteps: 100,
  rulerColor: '#888888',
  rulerMarkings: true
};

const WireframeCanvasEngine: React.FC<WireframeCanvasEngineProps> = ({
  canvasConfig = {},
  sections = [],
  onCanvasReady,
  onSectionClick,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [config, setConfig] = useState<WireframeCanvasConfig>({
    ...DEFAULT_CONFIG,
    ...canvasConfig
  });

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor,
      selection: true,
      preserveObjectStacking: true
    });
    
    setCanvas(fabricCanvas);
    
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas);
    }
    
    // Set up canvas with history tracking if enabled
    if (config.historyEnabled) {
      const historyStack: string[] = [];
      let historyIndex = -1;
      const maxSteps = config.maxHistorySteps || 50;
      
      // Save initial state
      const initialState = JSON.stringify(fabricCanvas.toJSON());
      historyStack.push(initialState);
      historyIndex = 0;
      
      // Set up event listeners for history tracking
      fabricCanvas.on('object:modified', () => {
        saveToHistory();
      });
      
      fabricCanvas.on('object:added', () => {
        saveToHistory();
      });
      
      fabricCanvas.on('object:removed', () => {
        saveToHistory();
      });
      
      // Function to save current state to history
      const saveToHistory = () => {
        const currentState = JSON.stringify(fabricCanvas.toJSON());
        
        // If we're not at the end of the stack, remove future states
        if (historyIndex < historyStack.length - 1) {
          historyStack.splice(historyIndex + 1);
        }
        
        // Add current state to history
        historyStack.push(currentState);
        historyIndex = historyStack.length - 1;
        
        // Limit history size
        if (historyStack.length > maxSteps) {
          historyStack.shift();
          historyIndex--;
        }
      };
      
      // Add undo/redo methods to canvas
      (fabricCanvas as any).undo = () => {
        if (historyIndex > 0) {
          historyIndex--;
          const state = historyStack[historyIndex];
          fabricCanvas.loadFromJSON(state, () => {
            fabricCanvas.renderAll();
          });
        }
      };
      
      (fabricCanvas as any).redo = () => {
        if (historyIndex < historyStack.length - 1) {
          historyIndex++;
          const state = historyStack[historyIndex];
          fabricCanvas.loadFromJSON(state, () => {
            fabricCanvas.renderAll();
          });
        }
      };
    }
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [canvasRef, config.width, config.height, config.backgroundColor, config.historyEnabled, config.maxHistorySteps]);
  
  // Render sections to canvas
  useEffect(() => {
    if (!canvas || !sections.length) return;
    
    // Clear any existing sections
    const existingSections = canvas.getObjects().filter(obj => 
      (obj as any).data?.type === 'section'
    );
    
    existingSections.forEach(obj => canvas.remove(obj));
    
    // Render each section
    sections.forEach((section, index) => {
      const options: SectionRenderingOptions = {
        darkMode: false, // Default to light mode
        showGrid: config.showGrid,
        gridSize: config.gridSize,
        showBorders: true
      };
      
      // Create section rectangle
      const width = section.dimensions?.width || 800;
      const height = section.dimensions?.height || 200;
      const top = section.position?.y || (index * (height + 20) + 20);
      const left = section.position?.x || 20;
      
      const sectionRect = new fabric.Rect({
        left,
        top,
        width,
        height,
        fill: section.backgroundColor || '#f8f9fa',
        stroke: '#e0e0e0',
        strokeWidth: 1,
        rx: 4,
        ry: 4,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        data: {
          id: section.id,
          type: 'section',
          sectionType: section.sectionType || 'generic'
        }
      });
      
      // Create section label
      const label = new fabric.Text(section.name || `Section ${index + 1}`, {
        left: left + 10,
        top: top + 10,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#333333',
        selectable: false
      });
      
      // Create section group
      const sectionGroup = new fabric.Group([sectionRect, label], {
        data: {
          id: section.id,
          type: 'section',
          sectionType: section.sectionType || 'generic'
        }
      });
      
      // Add section to canvas
      canvas.add(sectionGroup);
      
      // Add click handler
      sectionGroup.on('selected', () => {
        if (onSectionClick) {
          onSectionClick(section.id);
        }
      });
      
      // If section has components, render them
      if (section.components && Array.isArray(section.components)) {
        section.components.forEach((component: any, compIndex: number) => {
          if (!component) return;
          
          // Calculate component position relative to section
          const compLeft = left + (component.position?.x || 10);
          const compTop = top + (component.position?.y || 40 + compIndex * 30);
          const compWidth = component.dimensions?.width || 100;
          const compHeight = component.dimensions?.height || 30;
          
          // Create component based on type
          let compObject: fabric.Object;
          
          switch (component.type) {
            case 'text':
              compObject = new fabric.Text(component.content || 'Text Component', {
                left: compLeft,
                top: compTop,
                fontSize: component.fontSize || 14,
                fontFamily: component.fontFamily || 'Arial',
                fill: component.color || '#333333',
                width: compWidth,
                data: {
                  id: component.id,
                  type: 'component',
                  componentType: 'text',
                  sectionId: section.id
                }
              });
              break;
              
            case 'image':
              compObject = new fabric.Rect({
                left: compLeft,
                top: compTop,
                width: compWidth,
                height: compHeight,
                fill: '#e0e0e0',
                stroke: '#cccccc',
                strokeWidth: 1,
                data: {
                  id: component.id,
                  type: 'component',
                  componentType: 'image',
                  sectionId: section.id
                }
              });
              
              // Add image placeholder icon
              const imgText = new fabric.Text('🖼️', {
                left: compLeft + compWidth / 2,
                top: compTop + compHeight / 2,
                fontSize: 20,
                originX: 'center',
                originY: 'center'
              });
              
              canvas.add(imgText);
              break;
              
            case 'button':
              compObject = new fabric.Rect({
                left: compLeft,
                top: compTop,
                width: compWidth,
                height: compHeight,
                fill: component.backgroundColor || '#4285f4',
                rx: 4,
                ry: 4,
                data: {
                  id: component.id,
                  type: 'component',
                  componentType: 'button',
                  sectionId: section.id
                }
              });
              
              // Add button text
              const btnText = new fabric.Text(component.label || 'Button', {
                left: compLeft + compWidth / 2,
                top: compTop + compHeight / 2,
                fontSize: 14,
                fontFamily: 'Arial',
                fill: '#ffffff',
                originX: 'center',
                originY: 'center'
              });
              
              canvas.add(btnText);
              break;
              
            default:
              compObject = new fabric.Rect({
                left: compLeft,
                top: compTop,
                width: compWidth,
                height: compHeight,
                fill: '#f5f5f5',
                stroke: '#dddddd',
                strokeWidth: 1,
                data: {
                  id: component.id,
                  type: 'component',
                  componentType: component.type || 'generic',
                  sectionId: section.id
                }
              });
          }
          
          // Add component to canvas
          canvas.add(compObject);
          
          // Ensure section group is above components
          sectionGroup.moveTo(canvas.getObjects().length);
        });
      }
    });
    
    canvas.renderAll();
  }, [canvas, sections, config.showGrid, config.gridSize, onSectionClick]);
  
  return (
    <div className="relative h-full w-full overflow-hidden">
      {config.showRulers && canvas && (
        <EnhancedCanvasRulers
          width={config.width}
          height={config.height}
          zoom={config.zoom}
          panOffset={config.panOffset}
          rulerSize={config.rulerSize}
          showRulers={config.showRulers}
          className="z-10"
        />
      )}
      <div 
        className="canvas-container"
        style={{
          position: 'absolute',
          top: config.showRulers ? (config.rulerSize || 20) : 0,
          left: config.showRulers ? (config.rulerSize || 20) : 0,
          right: 0,
          bottom: 0,
          overflow: 'auto'
        }}
      >
        <canvas ref={canvasRef} className={className} />
      </div>
    </div>
  );
};

export default WireframeCanvasEngine;
