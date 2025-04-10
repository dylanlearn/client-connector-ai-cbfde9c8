
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
  } = {}
): fabric.Object => {
  const { readOnly = false, darkMode = false, primaryColor, secondaryColor } = options;
  
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
      case 'footer':
        return {
          fill: darkMode ? '#1f2937' : '#f3f4f6',
          textColor: darkMode ? '#e5e7eb' : '#111827',
          opacity: 1,
          height: 200
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
  
  // Get style based on section type
  const sectionStyle = getSectionStyle(section.sectionType || 'generic');
  
  // Create section background
  const background = new fabric.Rect({
    left: section.position?.x || 0,
    top: section.position?.y || 0,
    width: section.dimensions?.width || 1200,
    height: section.dimensions?.height || sectionStyle.height,
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
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: '600',
    fill: sectionStyle.textColor,
    selectable: false,
  });
  
  // Create section type label
  const typeLabel = new fabric.Text(section.sectionType || 'generic', {
    left: (section.position?.x || 0) + 10,
    top: (section.position?.y || 0) + 30,
    fontSize: 12,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    fill: sectionStyle.textColor,
    opacity: 0.7,
    selectable: false,
  });
  
  // Create a group for the section
  const sectionGroup = new fabric.Group([background, label, typeLabel], {
    data: {
      id: section.id || uuidv4(),
      type: 'section',
      sectionType: section.sectionType,
      name: section.name
    },
    selectable: !readOnly,
    hasControls: !readOnly,
    hasBorders: !readOnly,
    lockRotation: true,
  });
  
  // Add section components if any
  if (section.components && Array.isArray(section.components) && section.components.length > 0) {
    section.components.forEach(component => {
      // This would be implemented to render each component within the section
      // based on component type, position, etc.
      // This is where you'd extend the functionality to render actual components
    });
  }
  
  // Add the section to the canvas
  canvas.add(sectionGroup);
  
  return sectionGroup;
};
