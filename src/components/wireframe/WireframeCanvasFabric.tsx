
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { DeviceType } from './types';

interface WireframeCanvasFabricProps {
  wireframeData?: WireframeData;
  initialData?: WireframeData; // Add initialData prop
  editable?: boolean;
  readOnly?: boolean; // Add readOnly prop
  width?: number;
  height?: number;
  onSectionClick?: (sectionId: string) => void;
  onSectionUpdate?: (section: WireframeSection) => void;
  onUpdate?: (wireframe: WireframeData) => void; // Add onUpdate prop
  deviceType?: DeviceType;
  projectId?: string;
}

const WireframeCanvasFabric: React.FC<WireframeCanvasFabricProps> = ({
  wireframeData,
  initialData, // Include initialData in props
  editable = false,
  readOnly = false, // Include readOnly prop with default
  width = 1200,
  height = 800,
  onSectionClick,
  onSectionUpdate,
  onUpdate, // Include onUpdate in props
  deviceType = 'desktop',
  projectId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use initialData if provided, otherwise use wireframeData
  const dataToRender = initialData || wireframeData;

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: editable && !readOnly,
      preserveObjectStacking: true
    });

    fabricRef.current = canvas;
    setIsLoading(false);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [width, height, editable, readOnly]);

  // Render wireframe sections to canvas
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !dataToRender || !dataToRender.sections) return;

    // Clear canvas
    canvas.clear();

    // Render sections
    dataToRender.sections.forEach(section => {
      renderSection(canvas, section, {
        editable: editable && !readOnly,
        onSectionClick
      });
    });

    canvas.renderAll();
    
    // Callback when canvas is updated
    if (onUpdate && canvas) {
      canvas.on('object:modified', () => {
        const updatedData = extractWireframeDataFromCanvas(canvas, dataToRender);
        onUpdate(updatedData);
      });
    }
  }, [dataToRender, editable, readOnly, onSectionClick, onUpdate]);

  return (
    <div className="wireframe-canvas-fabric relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <span>Loading canvas...</span>
        </div>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
};

// Helper function to extract wireframe data from canvas
const extractWireframeDataFromCanvas = (
  canvas: fabric.Canvas, 
  baseData: WireframeData
): WireframeData => {
  // Extract sections from canvas objects
  const sections = canvas.getObjects()
    .filter(obj => obj.data?.type === 'section')
    .map(obj => ({
      id: obj.data?.id || '',
      name: obj.data?.name || 'Section',
      sectionType: obj.data?.sectionType || 'generic',
      x: obj.left || 0,
      y: obj.top || 0,
      width: obj.width || 400,
      height: obj.height || 300
    }));
  
  return {
    ...baseData,
    sections: sections
  };
};

// Helper function to render a section
const renderSection = (
  canvas: fabric.Canvas, 
  section: WireframeSection, 
  options: { editable?: boolean; onSectionClick?: (sectionId: string) => void }
) => {
  const { x = 0, y = 0, width = 400, height = 300 } = section;
  
  const rect = new fabric.Rect({
    left: x,
    top: y,
    width: width,
    height: height,
    fill: section.backgroundColor || 'rgba(240, 240, 240, 0.5)',
    stroke: '#ccc',
    strokeWidth: 1,
    rx: 5,
    ry: 5,
    selectable: options.editable,
    hoverCursor: options.onSectionClick ? 'pointer' : 'default',
    data: { 
      id: section.id,
      type: 'section',
      sectionType: section.sectionType
    }
  });
  
  // Add text label for section name
  const text = new fabric.Text(section.name, {
    left: x + 10,
    top: y + 10,
    fontSize: 16,
    fill: '#333',
    selectable: false
  });
  
  const group = new fabric.Group([rect, text], {
    left: x,
    top: y,
    selectable: options.editable
  });
  
  // Add click event if needed
  if (options.onSectionClick) {
    group.on('mousedown', () => {
      options.onSectionClick?.(section.id);
    });
  }
  
  canvas.add(group);
  
  // Render components if any
  if (section.components) {
    renderComponents(canvas, section, options);
  }
  
  // Render layout if specified
  if (section.layout) {
    renderLayout(canvas, section, options);
  }
};

// Helper function to render components
const renderComponents = (
  canvas: fabric.Canvas,
  section: WireframeSection, 
  options: { editable?: boolean }
) => {
  // Implementation for rendering components
};

// Helper function to render layout
const renderLayout = (
  canvas: fabric.Canvas,
  section: WireframeSection, 
  options: { editable?: boolean }
) => {
  const layout = section.layout;
  if (!layout) return;
  
  if (typeof layout === 'string') {
    // Simple layout type (e.g., 'grid', 'flex')
    renderFlexLayout(canvas, section, { type: layout }, options);
  } else {
    // Complex layout object
    renderFlexLayout(canvas, section, layout, options);
  }
};

// Helper function to render flex layout
export const renderFlexLayout = (
  canvas: fabric.Canvas, 
  section: WireframeSection, 
  layout: any, 
  options: any = {}
) => {
  const layoutProps = typeof layout === 'string' ? { type: layout } : layout;
  
  // Default layout settings
  const direction = layoutProps.direction || 'horizontal';
  const alignment = layoutProps.alignment || 'center';
  const justify = layoutProps.justifyContent || 'center';
  const columnsCount = layoutProps.columns || 1;
  
  // Parse the gap to ensure it's a number
  const gapSize = typeof section.gap === 'string' ? parseFloat(section.gap || '10') : (section.gap || 10);
  
  const wrap = layoutProps.wrap !== undefined ? layoutProps.wrap : true;
  
  // Get section position and dimensions
  const sectionX = section.x || 0;
  const sectionY = section.y || 0;
  const sectionWidth = typeof section.width === 'number' ? section.width : 400;
  const sectionHeight = typeof section.height === 'number' ? section.height : 300;
  
  // Example implementation for grid layout
  if (layoutProps.type === 'grid' && typeof columnsCount === 'number') {
    const columnWidth = sectionWidth / columnsCount;
    
    for (let i = 0; i < columnsCount; i++) {
      // Create a cell placeholder
      const cell = new fabric.Rect({
        left: sectionX + (i * columnWidth),
        top: sectionY + gapSize,
        width: columnWidth - gapSize * 2,
        height: sectionHeight - gapSize * 2,
        fill: 'rgba(200, 200, 200, 0.3)',
        stroke: '#ddd',
        strokeDashArray: [5, 5],
        strokeWidth: 1,
        rx: 3,
        ry: 3,
        selectable: false
      });
      
      canvas.add(cell);
    }
  }
};

export default WireframeCanvasFabric;
