
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { useFabric } from '@/hooks/use-fabric';
import { WireframeData, WireframeSection } from '@/types/wireframe';
import { getDeviceStyles } from '@/components/wireframe/registry/component-types';

interface WireframeCanvasEngineProps {
  wireframeData: WireframeData;
  editable?: boolean;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
}

const WireframeCanvasEngine: React.FC<WireframeCanvasEngineProps> = ({
  wireframeData,
  editable = false,
  onCanvasReady,
  deviceType = 'desktop'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvas, initializeFabric } = useFabric();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize the canvas
  useEffect(() => {
    if (canvasRef.current && !isInitialized) {
      initializeFabric(canvasRef.current);
      setIsInitialized(true);
    }
    
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvasRef, isInitialized, initializeFabric, canvas]);

  // Render wireframe sections
  const renderWireframe = useCallback(() => {
    if (!canvas || !wireframeData || !wireframeData.sections) return;
    
    canvas.clear();
    let topPosition = 20;
    
    wireframeData.sections.forEach((section, index) => {
      if (!section) return;

      // Get the height based on section type
      const sectionHeight = getSectionHeight(section);
      
      // Create section container
      const sectionRect = new fabric.Rect({
        left: 20,
        top: topPosition,
        width: canvas.width! - 40,
        height: sectionHeight,
        fill: '#f9f9f9',
        stroke: '#ddd',
        strokeWidth: 1,
        rx: 5,
        ry: 5
      });
      
      // Create section label
      const sectionLabel = new fabric.Text(section.name || `Section ${index + 1}`, {
        left: 30,
        top: topPosition + 10,
        fontSize: 14,
        fontFamily: 'Arial'
      });
      
      // Apply responsive styles based on device type
      if (section.responsiveConfig) {
        // Use the correct signature for getDeviceStyles
        const styles = getDeviceStyles(section.baseStyles || {}, section.responsiveConfig || {}, deviceType);
        
        // Apply styles to section
        // Implementation depends on styling structure
      }
      
      // Add section to canvas
      canvas.add(sectionRect, sectionLabel);
      
      // Render components within section
      if (section.components && Array.isArray(section.components)) {
        renderComponents(section.components, topPosition + 40);
      }
      
      topPosition += sectionHeight + 20;
    });
    
    canvas.renderAll();
    
    if (onCanvasReady) onCanvasReady(canvas);
  }, [canvas, wireframeData, deviceType, onCanvasReady]);
  
  // Utility function to get section height
  const getSectionHeight = (section: WireframeSection): number => {
    if (!section) return 100;
    
    switch (section.sectionType) {
      case 'hero':
        return 200;
      case 'features':
        return 300;
      case 'testimonials':
        return 250;
      case 'cta':
        return 150;
      default:
        return 200;
    }
  };
  
  // Render components within a section
  const renderComponents = (components: any[], startY: number) => {
    if (!canvas || !components.length) return;
    
    let componentY = startY;
    
    components.forEach((component, index) => {
      if (!component) return;
      
      const componentRect = new fabric.Rect({
        left: 40,
        top: componentY,
        width: canvas.width! - 80,
        height: 50,
        fill: '#ffffff',
        stroke: '#eeeeee',
        strokeWidth: 1,
        rx: 3,
        ry: 3
      });
      
      const componentLabel = new fabric.Text(component.type || `Component ${index + 1}`, {
        left: 50,
        top: componentY + 15,
        fontSize: 12,
        fontFamily: 'Arial'
      });
      
      canvas.add(componentRect, componentLabel);
      componentY += 60;
    });
  };
  
  // Update canvas when wireframeData changes
  useEffect(() => {
    if (isInitialized && canvas && wireframeData) {
      renderWireframe();
    }
  }, [isInitialized, canvas, wireframeData, renderWireframe]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvas || !canvasRef.current) return;
      
      const parentWidth = canvasRef.current.parentElement?.clientWidth || 800;
      canvas.setDimensions({ width: parentWidth, height: 600 });
      renderWireframe();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas, renderWireframe]);
  
  return (
    <div className="wireframe-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WireframeCanvasEngine;
