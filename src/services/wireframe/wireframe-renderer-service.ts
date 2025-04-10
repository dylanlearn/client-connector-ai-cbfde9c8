
import { fabric } from 'fabric';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

interface RenderingOptions {
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean;
  config?: Partial<WireframeCanvasConfig>;
  interactive?: boolean;
  renderGrid?: boolean;
}

export const wireframeRendererService = {
  renderWireframeToCanvas: (
    canvas: fabric.Canvas,
    wireframe: WireframeData,
    options: RenderingOptions = {}
  ) => {
    // Clear existing objects
    canvas.clear();
    canvas.backgroundColor = options.config?.backgroundColor || (options.darkMode ? '#1a1a1a' : '#ffffff');
    
    // Render grid if enabled
    if (options.renderGrid) {
      renderGrid(canvas, options.config);
    }
    
    // Ensure wireframe has all required properties
    if (wireframe && Array.isArray(wireframe.sections)) {
      // Render sections
      wireframe.sections.forEach(section => {
        renderSection(canvas, section, options);
      });
    }
    
    // Update canvas
    canvas.renderAll();
  }
};

function renderGrid(canvas: fabric.Canvas, config: Partial<WireframeCanvasConfig> = {}) {
  const gridSize = config.gridSize || 20;
  const gridColor = config.gridColor || 'rgba(224,224,224,0.5)';
  
  // Use width and height as numbers
  const canvasWidth = typeof config.width === 'number' ? config.width : canvas.width || 0;
  const canvasHeight = typeof config.height === 'number' ? config.height : canvas.height || 0;
  
  for (let i = 0; i < canvasWidth / gridSize; i++) {
    const x = i * gridSize;
    canvas.add(new fabric.Line([x, 0, x, canvasHeight], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      data: { type: 'grid' }
    }));
  }
  
  for (let i = 0; i < canvasHeight / gridSize; i++) {
    const y = i * gridSize;
    canvas.add(new fabric.Line([0, y, canvasWidth, y], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      data: { type: 'grid' }
    }));
  }
}

function renderSection(
  canvas: fabric.Canvas,
  section: WireframeSection,
  options: RenderingOptions = {}
) {
  // Parse position to ensure we're working with numbers
  const x = section.position?.x ?? section.x ?? 0;
  const y = section.position?.y ?? section.y ?? 0;
  
  // Parse dimensions to ensure we're working with numbers
  const width = typeof section.dimensions?.width === 'string' ? 
    parseFloat(section.dimensions.width) : 
    (section.dimensions?.width ?? section.width ?? 300);
  
  const height = typeof section.dimensions?.height === 'string' ? 
    parseFloat(section.dimensions.height) : 
    (section.dimensions?.height ?? section.height ?? 200);
  
  const sectionRect = new fabric.Rect({
    left: x,
    top: y,
    width: width,
    height: height,
    fill: 'transparent',
    stroke: 'rgba(0,0,0,0.1)',
    strokeWidth: 1,
    selectable: !!options.interactive,
    evented: !!options.interactive,
    hasControls: false,
    hasBorders: false,
    data: {
      type: 'section',
      id: section.id,
      name: section.name,
      sectionType: section.sectionType,
      originalSection: section
    }
  });
  
  canvas.add(sectionRect);
  
  // Render layout within the section
  if (section.layout) {
    renderLayout(canvas, section, section.layout, options);
  }
}

function renderLayout(
  canvas: fabric.Canvas,
  section: WireframeSection,
  layout: any,
  options: RenderingOptions = {}
) {
  const layoutType = typeof layout === 'string' ? layout : layout.type;
  
  switch (layoutType) {
    case 'flex':
    case 'grid':
      renderFlexLayout(canvas, section, layout, options);
      break;
    case 'list':
      // Implement list layout rendering
      break;
    case 'form':
      // Implement form layout rendering
      break;
    default:
      console.warn(`Unsupported layout type: ${layoutType}`);
  }
}

// Properly handle layout properties
export function renderFlexLayout(canvas: fabric.Canvas, section: WireframeSection, layout: any, options: any = {}) {
  const layoutProps = typeof layout === 'string' ? { type: layout } : layout;
  
  // Default layout settings
  const direction = layoutProps.direction || 'horizontal';
  const alignment = layoutProps.alignment || 'center';
  const justify = layoutProps.justifyContent || 'center';
  const columnsCount = layoutProps.columns || 1;
  
  // Parse the gap to ensure it's a number
  const gapSize = typeof section.gap === 'string' ? parseFloat(section.gap) : (section.gap || 10);
  
  const wrap = layoutProps.wrap !== undefined ? layoutProps.wrap : true;
  
  // Parse section values to ensure they are numbers
  const sectionX = section.x !== undefined ? section.x : 0;
  const sectionY = section.y !== undefined ? section.y : 0;
  const sectionWidth = typeof section.width === 'string' ? parseFloat(section.width) : (section.width || 300);
  const sectionHeight = typeof section.height === 'string' ? parseFloat(section.height) : (section.height || 200);
  
  // Set up grid layout
  if (direction === 'grid' && typeof layoutProps.columns === 'number') {
    const columnWidth = sectionWidth / columnsCount;
    let xOffset = 0;
    let yOffset = 0;
    
    for (let i = 0; i < columnsCount; i++) {
      // Example: Render a placeholder in each grid cell
      const cellRect = new fabric.Rect({
        left: sectionX + xOffset,
        top: sectionY + yOffset,
        width: columnWidth - gapSize,
        height: sectionHeight - gapSize,
        fill: 'rgba(0,255,0,0.1)',
        selectable: false,
        evented: false
      });
      canvas.add(cellRect);
      
      xOffset += columnWidth;
    }
  }
  
  // Set up flexbox-like layout
  if (direction === 'horizontal' || direction === 'vertical') {
    let xOffset = sectionX;
    let yOffset = sectionY;
    let itemIndex = 0;
    
    // Example: Render placeholders for items
    for (let i = 0; i < 5; i++) {
      const itemWidth = 50;
      const itemHeight = 30;
      
      if (direction === 'horizontal') {
        xOffset += itemWidth + gapSize;
        if (xOffset > sectionX + sectionWidth && wrap) {
          xOffset = sectionX;
          yOffset += itemHeight + gapSize;
        }
      } else {
        yOffset += itemHeight + gapSize;
        if (yOffset > sectionY + sectionHeight && wrap) {
          yOffset = sectionY;
          xOffset += itemWidth + gapSize;
        }
      }
      
      const itemRect = new fabric.Rect({
        left: xOffset,
        top: yOffset,
        width: itemWidth,
        height: itemHeight,
        fill: 'rgba(255,0,0,0.1)',
        selectable: false,
        evented: false
      });
      canvas.add(itemRect);
      
      itemIndex++;
    }
  }
}
