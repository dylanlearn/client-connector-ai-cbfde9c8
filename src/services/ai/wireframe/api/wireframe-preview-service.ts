
import { WireframeData } from '../wireframe-types';

/**
 * Generate an image preview URL for a wireframe
 */
export const generateImagePreview = async (wireframe: WireframeData): Promise<string> => {
  // In a real implementation, this would create an actual image preview
  // This is a mock implementation that just returns a placeholder image URL
  
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock image URL
  return `https://via.placeholder.com/1200x800?text=${encodeURIComponent(wireframe.title || 'Wireframe Preview')}`;
};
