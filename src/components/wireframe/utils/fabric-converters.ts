
import { fabric } from 'fabric';
import { WireframeSection } from '@/types/wireframe';
import { getResponsiveLayout, isSectionVisibleOnDevice } from './section-utils';

interface ConversionOptions {
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
  scale?: number;
}

// Default styles for different section types
const getSectionTypeStyles = (sectionType: string): { fill: string; stroke: string } => {
  switch (sectionType.toLowerCase()) {
    case 'navigation':
    case 'nav':
      return { fill: '#E5F2FF', stroke: '#90CAF9' };
    case 'hero':
      return { fill: '#E3F2FD', stroke: '#64B5F6' };
    case 'features':
    case 'feature':
      return { fill: '#E8F5E9', stroke: '#81C784' };
    case 'testimonials':
    case 'testimonial':
      return { fill: '#FFF8E1', stroke: '#FFD54F' };
    case 'pricing':
      return { fill: '#F3E5F5', stroke: '#BA68C8' };
    case 'cta':
      return { fill: '#FFEBEE', stroke: '#EF5350' };
    case 'footer':
      return { fill: '#ECEFF1', stroke: '#B0BEC5' };
    default:
      return { fill: '#F5F5F5', stroke: '#BDBDBD' };
  }
};

// Function to convert a wireframe section to a Fabric.js object
export const componentToFabricObject = (
  section: WireframeSection,
  options: ConversionOptions = { deviceType: 'desktop', interactive: true }
): fabric.Object | null => {
  const { deviceType = 'desktop', interactive = true } = options;
  
  // Check if this section should be visible on this device type
  if (!isSectionVisibleOnDevice(section, deviceType)) {
    console.log(`Section ${section.id} (${section.sectionType}) not visible on ${deviceType}`);
    return null;
  }
  
  // Get dimensions and position with defaults
  const width = section.dimensions?.width || 800;
  const height = section.dimensions?.height || 200;
  const left = section.position?.x || 0;
  const top = section.position?.y || 0;
  
  // Get styles based on section type
  const { fill, stroke } = getSectionTypeStyles(section.sectionType);
  
  try {
    // Create the main section container as a group
    const sectionGroup = new fabric.Group([], {
      left,
      top,
      width,
      height,
      data: { id: section.id, type: section.sectionType },
      selectable: interactive,
      hasControls: interactive,
      hasBorders: interactive,
      lockScalingX: !interactive,
      lockScalingY: !interactive,
      lockRotation: true,
    });
    
    // Create and add the background rectangle
    const background = new fabric.Rect({
      left: 0,
      top: 0,
      width,
      height,
      fill,
      stroke,
      strokeWidth: 1,
      rx: 4,
      ry: 4,
      selectable: false,
    });
    sectionGroup.addWithUpdate(background);
    
    // Add section title
    const title = new fabric.Text(section.name || section.sectionType, {
      left: 10,
      top: 10,
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: '#333333',
      selectable: false,
    });
    sectionGroup.addWithUpdate(title);
    
    // If we have components in the section, visualize them
    if (section.components && section.components.length > 0) {
      const componentHeight = Math.min(80, (height - 50) / section.components.length);
      
      section.components.forEach((component, index) => {
        const compLeft = 10;
        const compTop = 40 + (index * (componentHeight + 5));
        const compWidth = width - 20;
        
        const compBox = new fabric.Rect({
          left: compLeft,
          top: compTop,
          width: compWidth,
          height: componentHeight,
          fill: '#FFFFFF',
          stroke: '#DDDDDD',
          strokeWidth: 1,
          rx: 2,
          ry: 2,
          selectable: false,
        });
        
        const compText = new fabric.Text(component.type || `Component ${index + 1}`, {
          left: compLeft + 5,
          top: compTop + 5,
          fontSize: 12,
          fontFamily: 'Arial',
          fill: '#666666',
          selectable: false,
        });
        
        sectionGroup.addWithUpdate(compBox);
        sectionGroup.addWithUpdate(compText);
      });
    }
    
    // Add copy suggestions if available
    if (section.copySuggestions) {
      let yPos = height - 65;
      
      if (typeof section.copySuggestions === 'object') {
        if (section.copySuggestions.heading) {
          const headingText = new fabric.Text(`H: ${section.copySuggestions.heading.substring(0, 20)}${section.copySuggestions.heading.length > 20 ? '...' : ''}`, {
            left: 10,
            top: yPos,
            fontSize: 12,
            fontFamily: 'Arial',
            fill: '#666666',
            selectable: false,
          });
          sectionGroup.addWithUpdate(headingText);
          yPos += 18;
        }
        
        if (section.copySuggestions.subheading) {
          const subheadingText = new fabric.Text(`S: ${section.copySuggestions.subheading.substring(0, 20)}${section.copySuggestions.subheading.length > 20 ? '...' : ''}`, {
            left: 10,
            top: yPos,
            fontSize: 10,
            fontFamily: 'Arial',
            fill: '#888888',
            selectable: false,
          });
          sectionGroup.addWithUpdate(subheadingText);
          yPos += 15;
        }
      }
    }
    
    // Add device type indicator
    if (deviceType !== 'desktop') {
      const deviceBadge = new fabric.Text(deviceType.toUpperCase(), {
        left: width - 70,
        top: 10,
        fontSize: 10,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        backgroundColor: deviceType === 'mobile' ? '#FF5722' : '#2196F3',
        padding: 3,
        selectable: false,
      });
      sectionGroup.addWithUpdate(deviceBadge);
    }
    
    return sectionGroup;
  } catch (error) {
    console.error(`Error creating fabric object for section ${section.id}:`, error);
    return null;
  }
};

// Helper function to convert section display options to Fabric.js options
export const getSectionDisplayOptions = (
  section: WireframeSection,
  deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): { width: number; height: number; left: number; top: number } => {
  // Default values
  const defaults = {
    width: deviceType === 'desktop' ? 1200 : deviceType === 'tablet' ? 768 : 375,
    height: 400,
    left: 0,
    top: 0
  };
  
  // Get section's own dimensions if available
  const width = section.dimensions?.width || defaults.width;
  const height = section.dimensions?.height || defaults.height;
  const left = section.position?.x || defaults.left;
  const top = section.position?.y || defaults.top;
  
  // For responsive modes, adjust width based on device
  const responsiveWidth = 
    deviceType === 'desktop' ? width :
    deviceType === 'tablet' ? Math.min(width, 768) :
    Math.min(width, 375);
  
  return {
    width: deviceType !== 'desktop' ? responsiveWidth : width,
    height,
    left,
    top
  };
};
