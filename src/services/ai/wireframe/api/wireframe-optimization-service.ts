
import { WireframeData } from '../wireframe-types';

/**
 * Optimizes wireframe for different devices
 */
export const optimizeWireframeForDevice = async (wireframe: WireframeData): Promise<WireframeData> => {
  // This is a mock implementation that would normally contain device-specific optimizations
  // For a real implementation, we'd modify the sections to be more responsive
  
  // Create a deep copy to avoid modifying the original object
  const optimizedWireframe = JSON.parse(JSON.stringify(wireframe)) as WireframeData;
  
  // Add mobile considerations if not already present
  if (!optimizedWireframe.mobileConsiderations) {
    optimizedWireframe.mobileConsiderations = "This wireframe has been optimized for mobile devices.";
  }
  
  // For each section, ensure they have responsive layouts
  optimizedWireframe.sections = optimizedWireframe.sections.map(section => {
    if (!section.layout) {
      section.layout = {
        type: 'flex',
        direction: 'column',
        wrap: true
      };
    } else if (typeof section.layout === 'object') {
      // Ensure layout has responsive properties
      section.layout = {
        ...section.layout,
        wrap: section.layout.wrap !== undefined ? section.layout.wrap : true
      };
    }
    
    return section;
  });
  
  return optimizedWireframe;
};
