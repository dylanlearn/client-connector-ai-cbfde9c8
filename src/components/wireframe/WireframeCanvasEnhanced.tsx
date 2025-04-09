
import React, { useEffect, useState, useRef } from 'react';
import { WireframeSection } from '@/types/wireframe';
import { fabric } from 'fabric';
import { componentToFabricObject } from './utils/fabric-converters';
import GridSystem from './canvas/GridSystem';
import { useWireframeStore } from '@/stores/wireframe-store';
import { calculateSectionsBounds, findAlignmentGuides } from './utils/section-utils';

interface WireframeCanvasEnhancedProps {
  sections: WireframeSection[];
  width?: number;
  height?: number;
  editable?: boolean;
  showGrid?: boolean;
  snapToGrid?: boolean;
  responsiveMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionSelect?: (section: WireframeSection | null) => void;
}

const WireframeCanvasEnhanced: React.FC<WireframeCanvasEnhancedProps> = ({
  sections,
  width = 1200,
  height = 800,
  editable = true,
  showGrid = true,
  snapToGrid = true,
  responsiveMode = false,
  deviceType = 'desktop',
  onSectionSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedSection, setSelectedSection] = useState<WireframeSection | null>(null);
  const [guidelines, setGuidelines] = useState<{ position: number; orientation: 'horizontal' | 'vertical' }[]>([]);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: editable
    });
    
    fabricCanvas.on('selection:created', (e) => {
      const selected = e.selected?.[0];
      if (selected && selected.data) {
        const sectionId = selected.data.id;
        const foundSection = sections.find(section => section.id === sectionId);
        if (foundSection) {
          setSelectedSection(foundSection);
          if (onSectionSelect) {
            onSectionSelect(foundSection);
          }
        }
      }
    });
    
    fabricCanvas.on('selection:cleared', () => {
      setSelectedSection(null);
      if (onSectionSelect) {
        onSectionSelect(null);
      }
    });
    
    if (showGrid) {
      // Grid will be rendered as SVG overlay
    }
    
    setCanvas(fabricCanvas);
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [width, height, editable, onSectionSelect]);
  
  useEffect(() => {
    if (!canvas) return;
    
    canvas.clear();
    
    sections.forEach(section => {
      const fabricObject = componentToFabricObject(section, {
        deviceType,
        interactive: editable
      });
      
      if (fabricObject) {
        canvas.add(fabricObject as unknown as fabric.Object);
      }
    });
    
    canvas.renderAll();
  }, [canvas, sections, deviceType, editable]);
  
  useEffect(() => {
    if (!canvas || !snapToGrid) return;
    
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!e.target) return;
      
      const activeObj = e.target;
      
      if (snapToGrid) {
        const gridSize = 10;
        activeObj.set({
          left: Math.round(activeObj.left! / gridSize) * gridSize,
          top: Math.round(activeObj.top! / gridSize) * gridSize
        });
      }
      
      if (activeObj.data && sections.length > 1) {
        const activeSectionId = activeObj.data.id;
        const activeSection = sections.find(section => section.id === activeSectionId);
        
        if (activeSection) {
          const guides = findAlignmentGuides(activeSection, sections);
          setGuidelines(guides);
        }
      }
    };
    
    canvas.on('object:moving', handleObjectMoving);
    
    return () => {
      canvas.off('object:moving', handleObjectMoving);
    };
  }, [canvas, sections, snapToGrid]);
  
  useEffect(() => {
    if (!canvas) return;
    
    const clearGuidelines = () => {
      setGuidelines([]);
    };
    
    canvas.on('mouse:up', clearGuidelines);
    
    return () => {
      canvas.off('mouse:up', clearGuidelines);
    };
  }, [canvas]);
  
  return (
    <div className="wireframe-canvas-enhanced relative w-full h-full">
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      
      {showGrid && (
        <GridSystem
          canvasWidth={width}
          canvasHeight={height}
          gridSize={10}
          gridType="lines"
          guidelines={guidelines}
          visible={showGrid}
        />
      )}
      
      {guidelines.length > 0 && (
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={width}
          height={height}
        >
          {guidelines.map((guide, index) => {
            return guide.orientation === 'horizontal' ? (
              <line
                key={`h-${index}`}
                x1={0}
                y1={guide.position}
                x2={width}
                y2={guide.position}
                stroke="#3b82f6"
                strokeWidth={1}
                strokeDasharray="4,2"
              />
            ) : (
              <line
                key={`v-${index}`}
                x1={guide.position}
                y1={0}
                x2={guide.position}
                y2={height}
                stroke="#3b82f6"
                strokeWidth={1}
                strokeDasharray="4,2"
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default WireframeCanvasEnhanced;
