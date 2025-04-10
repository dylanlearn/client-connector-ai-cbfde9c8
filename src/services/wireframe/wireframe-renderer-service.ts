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
    
    // Render sections
    wireframe.sections.forEach(section => {
      renderSection(canvas, section, options);
    });
    
    // Update canvas
    canvas.renderAll();
  }
};

function renderGrid(canvas: fabric.Canvas, config: Partial<WireframeCanvasConfig> = {}) {
  const gridSize = config.gridSize || 20;
  const gridColor = config.gridColor || 'rgba(224,224,224,0.5)';
  
  for (let i = 0; i < (config.width || canvas.width!) / gridSize; i++) {
    const x = i * gridSize;
    canvas.add(new fabric.Line([x, 0, x, config.height || canvas.height!], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      data: { type: 'grid' }
    }));
  }
  
  for (let i = 0; i < (config.height || canvas.height!) / gridSize; i++) {
    const y = i * gridSize;
    canvas.add(new fabric.Line([0, y, config.width || canvas.width!, y], {
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
  const sectionRect = new fabric.Rect({
    left: section.x,
    top: section.y,
    width: section.width,
    height: section.height,
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
  const gapSize = layoutProps.gap || 10;
  const wrap = layoutProps.wrap !== undefined ? layoutProps.wrap : true;
  
  // Set up grid layout
  if (direction === 'grid' && typeof layoutProps.columns === 'number') {
    const columnWidth = section.width / columnsCount;
    let xOffset = 0;
    let yOffset = 0;
    
    for (let i = 0; i < columnsCount; i++) {
      // Example: Render a placeholder in each grid cell
      const cellRect = new fabric.Rect({
        left: section.x + xOffset,
        top: section.y + yOffset,
        width: columnWidth - gapSize,
        height: section.height - gapSize,
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
    let xOffset = section.x;
    let yOffset = section.y;
    let itemIndex = 0;
    
    // Example: Render placeholders for items
    for (let i = 0; i < 5; i++) {
      const itemWidth = 50;
      const itemHeight = 30;
      
      if (direction === 'horizontal') {
        xOffset += itemWidth + gapSize;
        if (xOffset > section.x + section.width && wrap) {
          xOffset = section.x;
          yOffset += itemHeight + gapSize;
        }
      } else {
        yOffset += itemHeight + gapSize;
        if (yOffset > section.y + section.height && wrap) {
          yOffset = section.y;
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
