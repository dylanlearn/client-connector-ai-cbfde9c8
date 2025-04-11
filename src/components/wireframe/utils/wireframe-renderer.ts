import { fabric } from 'fabric';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

interface RenderOptions {
  readOnly?: boolean;
  showGrid?: boolean;
  gridSize?: number;
  darkMode?: boolean;
}

/**
 * Render a wireframe to a Fabric.js canvas
 */
export const renderWireframeToCanvas = (
  canvas: fabric.Canvas,
  wireframe: WireframeData,
  options: RenderOptions = {}
): void => {
  // Clear existing canvas
  canvas.clear();
  
  const { readOnly = false, showGrid = true, gridSize = 20, darkMode = false } = options;
  
  // Set canvas background color based on wireframe or options
  const backgroundColor = wireframe.colorScheme?.background || (darkMode ? '#1a1a1a' : '#ffffff');
  canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));
  
  // Render grid if enabled
  if (showGrid) {
    renderGrid(canvas, gridSize, darkMode);
  }
  
  // Sort sections by position
  const sortedSections = [...wireframe.sections].sort((a, b) => {
    const aY = a.position?.y || 0;
    const bY = b.position?.y || 0;
    return aY - bY;
  });
  
  // Render each section
  sortedSections.forEach((section) => {
    renderSection(canvas, section, {
      readOnly,
      darkMode,
      primaryColor: wireframe.colorScheme?.primary,
      secondaryColor: wireframe.colorScheme?.secondary
    });
  });
  
  // Finalize rendering
  canvas.renderAll();
};

/**
 * Render a grid on the canvas
 */
const renderGrid = (
  canvas: fabric.Canvas,
  gridSize: number,
  darkMode: boolean = false
): void => {
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  
  // Create vertical lines
  for (let i = 0; i < width / gridSize; i++) {
    const line = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
      stroke: gridColor,
      selectable: false,
      evented: false
    });
    canvas.add(line);
    line.sendToBack();
  }
  
  // Create horizontal lines
  for (let i = 0; i < height / gridSize; i++) {
    const line = new fabric.Line([0, i * gridSize, width, i * gridSize], {
      stroke: gridColor,
      selectable: false,
      evented: false
    });
    canvas.add(line);
    line.sendToBack();
  }
};

/**
 * Render a section to the canvas
 */
const renderSection = (
  canvas: fabric.Canvas,
  section: WireframeSection,
  options: {
    readOnly?: boolean;
    darkMode?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    deviceType?: 'desktop' | 'tablet' | 'mobile';
  } = {}
): fabric.Object => {
  const { readOnly = false, darkMode = false, primaryColor, secondaryColor, deviceType = 'desktop' } = options;
  
  // Default styles based on section type
  const getSectionStyle = (sectionType: string) => {
    switch (sectionType.toLowerCase()) {
      case 'hero':
        return {
          fill: primaryColor || '#3b82f6',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 400
        };
      case 'features':
        return {
          fill: secondaryColor || '#10b981',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 300
        };
      case 'feature':
        return {
          fill: secondaryColor || '#0ea5e9',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 350
        };
      case 'cta':
        return {
          fill: primaryColor || '#8b5cf6',
          textColor: '#ffffff',
          opacity: 0.2,
          height: 200
        };
      case 'testimonials':
        return {
          fill: secondaryColor || '#f59e0b',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 350
        };
      case 'testimonial':
        return {
          fill: secondaryColor || '#f59e0b',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 250
        };
      case 'stats':
        return {
          fill: primaryColor || '#6366f1',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 250
        };
      case 'pricing':
        return {
          fill: primaryColor || '#14b8a6',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 450
        };
      case 'faq':
        return {
          fill: secondaryColor || '#8b5cf6',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 400
        };
      case 'footer':
        return {
          fill: darkMode ? '#1f2937' : '#f3f4f6',
          textColor: darkMode ? '#e5e7eb' : '#111827',
          opacity: 1,
          height: 200
        };
      case 'blog':
        return {
          fill: secondaryColor || '#ec4899',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 400
        };
      case 'contact':
        return {
          fill: primaryColor || '#0ea5e9',
          textColor: '#ffffff',
          opacity: 0.1,
          height: 350
        };
      default:
        return {
          fill: darkMode ? '#2d3748' : '#f9fafb',
          textColor: darkMode ? '#e5e7eb' : '#111827',
          opacity: 1,
          height: 300
        };
    }
  };
  
  // Adjust section dimensions based on device type
  const getSectionDimensions = (baseHeight: number) => {
    switch (deviceType) {
      case 'mobile':
        return {
          width: 375,
          height: baseHeight * 1.5 // Mobile often requires more height
        };
      case 'tablet':
        return {
          width: 768,
          height: baseHeight * 1.2
        };
      default:
        return {
          width: 1200,
          height: baseHeight
        };
    }
  };
  
  // Get style based on section type
  const sectionStyle = getSectionStyle(section.sectionType || 'generic');
  const dimensions = getSectionDimensions(sectionStyle.height);
  
  // Create section background
  const background = new fabric.Rect({
    left: section.position?.x || 0,
    top: section.position?.y || 0,
    width: section.dimensions?.width || dimensions.width,
    height: section.dimensions?.height || dimensions.height,
    fill: section.style?.backgroundColor || section.backgroundColor || sectionStyle.fill,
    stroke: darkMode ? '#4a5568' : '#e5e7eb',
    strokeWidth: 1,
    rx: 3,
    ry: 3,
    opacity: section.style?.opacity || sectionStyle.opacity,
    selectable: !readOnly,
    hasControls: !readOnly,
    hasBorders: !readOnly,
    lockRotation: true,
    transparentCorners: false,
    cornerColor: primaryColor || '#3b82f6',
    cornerStyle: 'circle',
    cornerSize: 8,
  });
  
  // Create section label
  const label = new fabric.Text(section.name || `Section`, {
    left: (section.position?.x || 0) + 10,
    top: (section.position?.y || 0) + 10,
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '600',
    fill: sectionStyle.textColor,
    selectable: false,
  });
  
  // Create section type label
  const typeLabel = new fabric.Text(section.sectionType || 'generic', {
    left: (section.position?.x || 0) + 10,
    top: (section.position?.y || 0) + 30,
    fontSize: 14,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    fill: sectionStyle.textColor,
    opacity: 0.7,
    selectable: false,
  });

  // Create component count label if section has components
  const componentCount = section.components?.length || 0;
  const componentLabel = componentCount > 0 ? new fabric.Text(`${componentCount} components`, {
    left: (section.position?.x || 0) + 10,
    top: (section.position?.y || 0) + 50,
    fontSize: 12,
    fontFamily: 'Arial',
    fill: sectionStyle.textColor,
    opacity: 0.7,
    selectable: false,
  }) : null;
  
  // Create a group for the section
  const groupItems = [background, label, typeLabel];
  if (componentLabel) groupItems.push(componentLabel);
  
  const sectionGroup = new fabric.Group(groupItems, {
    data: {
      id: section.id || uuidv4(),
      type: 'section',
      sectionType: section.sectionType,
      name: section.name,
      originalSection: section
    },
    selectable: !readOnly,
    hasControls: !readOnly,
    hasBorders: !readOnly,
    lockRotation: true,
  });
  
  // Add the section to the canvas
  canvas.add(sectionGroup);
  
  return sectionGroup;
};
