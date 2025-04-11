
import { WireframeGenerationParams, WireframeGenerationResult } from '../wireframe-types';
import { generateWireframe, generateWireframeFromTemplate } from './wireframe-generator';

/**
 * Service for wireframe API operations
 */
const wireframeApiService = {
  /**
   * Generate a new wireframe
   */
  generate: async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    return await generateWireframe(params);
  },
  
  /**
   * Generate a wireframe from a template
   */
  generateFromTemplate: async (
    templateId: string, 
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    return await generateWireframeFromTemplate(templateId, params);
  },
  
  /**
   * Export a wireframe to different formats
   */
  exportWireframe: async (wireframeId: string, format: 'html' | 'image' | 'pdf') => {
    // Implementation would go here
    return { success: true, format, url: `example.com/wireframe/${wireframeId}.${format}` };
  }
};

export { wireframeApiService };
export default wireframeApiService;
