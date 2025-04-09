
import { fabric } from 'fabric';
import { WireframeSection } from '@/types/wireframe';

interface FabricConversionOptions {
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
  darkMode?: boolean;
}

/**
 * Converts a wireframe section to a Fabric.js object
 */
export const componentToFabricObject = (
  section: WireframeSection, 
  options: FabricConversionOptions = {}
): fabric.Object | null => {
  const { deviceType = 'desktop', interactive = true, darkMode = false } = options;
  
  try {
    // Get appropriate width based on device type
    let width = 800;
    if (deviceType === 'tablet') width = 600;
    if (deviceType === 'mobile') width = 320;
    
    // Use section dimensions if available
    const sectionWidth = section.dimensions?.width || width - 40;
    const sectionHeight = section.dimensions?.height || 200;
    
    // Create background rectangle
    const rect = new fabric.Rect({
      width: sectionWidth,
      height: sectionHeight,
      fill: darkMode ? '#2d3748' : '#f9f9f9',
      stroke: darkMode ? '#4a5568' : '#ddd',
      strokeWidth: 1,
      rx: 5,
      ry: 5
    });
    
    // Create section name text
    const text = new fabric.Text(section.name || 'Unnamed Section', {
      fontSize: 14,
      fontFamily: 'sans-serif',
      fill: darkMode ? '#e2e8f0' : '#333',
      top: 10,
      left: 10
    });
    
    // Create section content based on section type
    let contentObjects: fabric.Object[] = [];
    
    switch(section.sectionType) {
      case 'header':
        contentObjects = createHeaderContent(section, darkMode);
        break;
      case 'hero':
        contentObjects = createHeroContent(section, darkMode);
        break;
      case 'features':
        contentObjects = createFeaturesContent(section, darkMode);
        break;
      case 'footer':
        contentObjects = createFooterContent(section, darkMode);
        break;
      default:
        // Generic placeholder
        contentObjects = [
          new fabric.Text('Section Content', {
            fontSize: 16,
            fontFamily: 'sans-serif',
            fill: darkMode ? '#e2e8f0' : '#666',
            top: 40,
            left: 10
          })
        ];
    }
    
    // Group all objects together
    const group = new fabric.Group([rect, text, ...contentObjects], {
      left: section.position?.x || 20,
      top: section.position?.y || 20,
      selectable: interactive,
      hasControls: interactive,
      hasBorders: interactive,
      subTargetCheck: true,
      data: {
        id: section.id,
        type: 'section',
        sectionType: section.sectionType
      }
    });
    
    // Apply any rotation if present
    if (section.styleProperties?.rotation) {
      group.rotate(section.styleProperties.rotation);
    }
    
    return group;
  } catch (error) {
    console.error('Error converting component to Fabric object:', error);
    return null;
  }
};

// Helper functions to create content for different section types
function createHeaderContent(section: WireframeSection, darkMode: boolean): fabric.Object[] {
  const logo = new fabric.Text('LOGO', {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fill: darkMode ? '#e2e8f0' : '#333',
    top: 20,
    left: 20
  });
  
  const nav = new fabric.Group([
    new fabric.Text('Home', { fontSize: 14, fill: darkMode ? '#e2e8f0' : '#333' }),
    new fabric.Text('About', { fontSize: 14, fill: darkMode ? '#e2e8f0' : '#333', left: 60 }),
    new fabric.Text('Services', { fontSize: 14, fill: darkMode ? '#e2e8f0' : '#333', left: 120 }),
    new fabric.Text('Contact', { fontSize: 14, fill: darkMode ? '#e2e8f0' : '#333', left: 180 })
  ], {
    top: 20,
    left: 120
  });
  
  return [logo, nav];
}

function createHeroContent(section: WireframeSection, darkMode: boolean): fabric.Object[] {
  const heading = new fabric.Text(section.copySuggestions?.heading || 'Hero Heading', {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fill: darkMode ? '#e2e8f0' : '#333',
    top: 50,
    left: 20
  });
  
  const subheading = new fabric.Text(section.copySuggestions?.subheading || 'Subheading text goes here', {
    fontSize: 16,
    fontFamily: 'sans-serif',
    fill: darkMode ? '#a0aec0' : '#666',
    top: 90,
    left: 20
  });
  
  const button = new fabric.Rect({
    width: 120,
    height: 40,
    fill: '#3b82f6',
    rx: 4,
    ry: 4,
    top: 130,
    left: 20
  });
  
  const buttonText = new fabric.Text('Get Started', {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fill: '#ffffff',
    top: 143,
    left: 40
  });
  
  const imageRect = new fabric.Rect({
    width: 200,
    height: 150,
    fill: darkMode ? '#4a5568' : '#e2e8f0',
    top: 50,
    left: 300,
    rx: 4,
    ry: 4
  });
  
  return [heading, subheading, button, buttonText, imageRect];
}

function createFeaturesContent(section: WireframeSection, darkMode: boolean): fabric.Object[] {
  const objects: fabric.Object[] = [];
  
  // Create 3 feature boxes
  for (let i = 0; i < 3; i++) {
    const boxLeft = 20 + i * 140;
    
    const box = new fabric.Rect({
      width: 120,
      height: 100,
      fill: darkMode ? '#4a5568' : '#f3f4f6',
      stroke: darkMode ? '#64748b' : '#e5e7eb',
      strokeWidth: 1,
      rx: 4,
      ry: 4,
      top: 50,
      left: boxLeft
    });
    
    const icon = new fabric.Circle({
      radius: 15,
      fill: '#3b82f6',
      top: 60,
      left: boxLeft + 20
    });
    
    const title = new fabric.Text(`Feature ${i+1}`, {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      fill: darkMode ? '#e2e8f0' : '#333',
      top: 100,
      left: boxLeft + 10
    });
    
    objects.push(box, icon, title);
  }
  
  return objects;
}

function createFooterContent(section: WireframeSection, darkMode: boolean): fabric.Object[] {
  const copyright = new fabric.Text('© 2025 Company Name', {
    fontSize: 12,
    fontFamily: 'sans-serif',
    fill: darkMode ? '#a0aec0' : '#666',
    top: 20,
    left: 20
  });
  
  const links = new fabric.Group([
    new fabric.Text('Privacy', { fontSize: 12, fill: darkMode ? '#e2e8f0' : '#333' }),
    new fabric.Text('Terms', { fontSize: 12, fill: darkMode ? '#e2e8f0' : '#333', left: 70 }),
    new fabric.Text('Contact', { fontSize: 12, fill: darkMode ? '#e2e8f0' : '#333', left: 130 })
  ], {
    top: 20,
    left: 300
  });
  
  return [copyright, links];
}

/**
 * Converts Fabric.js object states back to wireframe sections
 */
export const fabricObjectToComponent = (
  fabricObject: fabric.Object
): Partial<WireframeSection> | null => {
  if (!fabricObject || !fabricObject.data) return null;
  
  const data = fabricObject.data as any;
  
  if (data.type !== 'section') return null;
  
  // Extract position and dimensions
  const position = {
    x: fabricObject.left || 0,
    y: fabricObject.top || 0
  };
  
  const dimensions = {
    width: fabricObject.getScaledWidth(),
    height: fabricObject.getScaledHeight()
  };
  
  // Extract any rotation
  const styleProperties = fabricObject.angle 
    ? { rotation: fabricObject.angle }
    : undefined;
  
  return {
    id: data.id,
    sectionType: data.sectionType,
    position,
    dimensions,
    styleProperties
  };
};
