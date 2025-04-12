
import { 
  generateWireframe as serviceGenerateWireframe,
  generateWireframeVariationWithStyle
} from '../wireframe-service';
import { WireframeData, WireframeGenerationParams, WireframeGenerationResult } from '../wireframe-types';

/**
 * API client for wireframe services
 */
export const wireframeApiService = {
  /**
   * Generate a wireframe via API
   */
  generateWireframe: async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    try {
      // This would normally call an API endpoint
      // For now, we'll use our local service
      return serviceGenerateWireframe(params);
    } catch (error) {
      console.error('API error generating wireframe:', error);
      return {
        wireframe: null,
        success: false,
        message: `API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
  
  /**
   * Save a wireframe via API
   */
  saveWireframe: async (wireframe: WireframeData): Promise<boolean> => {
    try {
      // This would normally call an API endpoint
      console.log('API: Save wireframe', wireframe.id);
      return true;
    } catch (error) {
      console.error('API error saving wireframe:', error);
      return false;
    }
  },
  
  /**
   * Get a wireframe by ID via API
   */
  getWireframe: async (wireframeId: string): Promise<WireframeData | null> => {
    try {
      // This would normally call an API endpoint
      console.log('API: Get wireframe', wireframeId);
      return null;
    } catch (error) {
      console.error('API error getting wireframe:', error);
      return null;
    }
  }
};

export default wireframeApiService;
