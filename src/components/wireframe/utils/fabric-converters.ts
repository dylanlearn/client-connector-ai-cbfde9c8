
import { fabric } from 'fabric';
import { WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { getBackgroundClass } from './variant-utils';

// Convert background class to fabric color
const backgroundClassToFabricColor = (className: string, isDark: boolean): string => {
  if (className.includes('bg-gray-900')) return '#1e293b';
  if (className.includes('bg-gray-800')) return '#334155';
  if (className.includes('bg-gray-50')) return '#f8fafc';
  if (className.includes('bg-white')) return '#ffffff';
  if (className.includes('bg-gradient')) {
    return isDark ? '#334155' : '#f1f5f9';
  }
  
  return isDark ? '#1e293b' : '#ffffff';
};

// Convert section to fabric object
export const componentToFabricObject = (
  section: WireframeSection, 
  index: number,
  deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): fabric.Object | null => {
  if (!section) return null;

  // Get section style from properties or defaults
  const style = section?.styleProperties || {};
  const bgClass = getBackgroundClass(style.backgroundStyle, false);
  const bgColor = backgroundClassToFabricColor(bgClass, false);
  
  // Default position based on index if not specified
  const yPosition = section.position?.y ?? (index * 150 + 50);
  const xPosition = section.position?.x ?? 50;

  // Default widths based on device type
  let defaultWidth: number;
  switch (deviceType) {
    case 'mobile':
      defaultWidth = 320;
      break;
    case 'tablet':
      defaultWidth = 700;
      break;
    case 'desktop':
    default:
      defaultWidth = 1000;
      break;
  }

  const width = section.dimensions?.width ?? defaultWidth;
  const height = section.dimensions?.height ?? 150;

  // Create a group for the section
  const sectionGroup = new fabric.Group([], {
    left: xPosition,
    top: yPosition,
    width: width,
    height: height,
    hasControls: true,
    hasBorders: true,
    lockRotation: true,
    subTargetCheck: true,
    cornerColor: '#0ea5e9',
    borderColor: '#0ea5e9',
    cornerSize: 8
  });

  // Create background rectangle
  const background = new fabric.Rect({
    width: width,
    height: height,
    fill: bgColor,
    rx: 5,
    ry: 5,
    strokeWidth: 1,
    stroke: '#e2e8f0'
  });
  
  // Add section name text
  const sectionName = new fabric.Text(section.name || 'Unnamed Section', {
    fontSize: 16,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    left: 10,
    top: 10,
    fill: getBestTextColor(bgColor)
  });

  // Add section type as a badge
  const typeText = new fabric.Text(section.sectionType || 'Section', {
    fontSize: 12,
    fontFamily: 'sans-serif',
    left: 10,
    top: 36,
    fill: getBestTextColor(bgColor, 0.7)
  });

  // Add components if available
  let componentObjects: fabric.Object[] = [];
  if (section.components && section.components.length > 0) {
    // Calculate component size based on number of components and section size
    const componentCount = section.components.length;
    const componentsPerRow = Math.min(componentCount, 3);
    const componentWidth = (width - 30) / componentsPerRow;
    const componentHeight = Math.min(80, (height - 60) / Math.ceil(componentCount / componentsPerRow));
    
    section.components.forEach((component, compIndex) => {
      const row = Math.floor(compIndex / componentsPerRow);
      const col = compIndex % componentsPerRow;
      
      const componentObj = createComponentObject(
        component,
        10 + (col * (componentWidth + 5)),
        60 + (row * (componentHeight + 5)), 
        componentWidth - 5,
        componentHeight
      );
      
      if (componentObj) {
        componentObjects.push(componentObj);
      }
    });
  }

  // Add all objects to the group
  sectionGroup.addWithUpdate(background);
  sectionGroup.addWithUpdate(sectionName);
  sectionGroup.addWithUpdate(typeText);
  
  componentObjects.forEach(obj => {
    sectionGroup.addWithUpdate(obj);
  });

  return sectionGroup;
};

// Create object for a component
const createComponentObject = (
  component: WireframeComponent,
  left: number, 
  top: number, 
  width: number, 
  height: number
): fabric.Object => {
  // Component container
  const container = new fabric.Rect({
    left: left,
    top: top,
    width: width,
    height: height,
    fill: '#ffffff',
    stroke: '#e2e8f0',
    strokeWidth: 1,
    rx: 3,
    ry: 3,
    shadow: new fabric.Shadow({ 
      color: 'rgba(0,0,0,0.1)', 
      offsetX: 0, 
      offsetY: 2, 
      blur: 4 
    })
  });

  // Component content placeholder
  let contentText = "Component";
  if (component.content) {
    contentText = typeof component.content === 'string' 
      ? component.content.substring(0, 20) 
      : "Component";
  } else if (component.type) {
    contentText = component.type;
  }

  const text = new fabric.Text(contentText, {
    left: left + 5,
    top: top + height / 2,
    fontSize: 12,
    fontFamily: 'sans-serif',
    originX: 'left',
    originY: 'center',
    fill: '#64748b'
  });

  // Group them
  return new fabric.Group([container, text], {
    left: left,
    top: top,
    width: width,
    height: height,
    subTargetCheck: false,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true
  });
};

// Helper function to determine best text color based on background
function getBestTextColor(bgColor: string, opacity = 1): string {
  // Simple luminance calculation
  const isHex = bgColor.startsWith('#');
  let r, g, b;
  
  if (isHex) {
    // Convert hex to rgb
    const hex = bgColor.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (bgColor.startsWith('rgb')) {
    // Parse rgb string
    const matches = bgColor.match(/\d+/g);
    if (matches && matches.length >= 3) {
      r = parseInt(matches[0]);
      g = parseInt(matches[1]);
      b = parseInt(matches[2]);
    } else {
      r = 0;
      g = 0;
      b = 0;
    }
  } else {
    r = 0;
    g = 0;
    b = 0;
  }
  
  // Calculate luminance (simplified)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? `rgba(0,0,0,${opacity})` : `rgba(255,255,255,${opacity})`;
}
