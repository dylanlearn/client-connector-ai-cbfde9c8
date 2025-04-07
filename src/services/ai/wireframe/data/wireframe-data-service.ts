
import { WireframeApiService } from '../api';
import { AIWireframe, WireframeData } from '../wireframe-types';

/**
 * Service for handling wireframe data operations
 */
export const WireframeDataService = {
  /**
   * Helper function to extract WireframeData from various data structures
   */
  extractWireframeData: (wireframe: AIWireframe): WireframeData | null => {
    // Check if data property already exists
    if (wireframe.data) {
      return wireframe.data;
    }
    
    // Extract from generation_params if available
    if (wireframe.generation_params && typeof wireframe.generation_params === 'object') {
      if ('result_data' in wireframe.generation_params) {
        return wireframe.generation_params.result_data as WireframeData;
      }
    }
    
    // Extract from wireframe_data if available
    if (wireframe.wireframe_data) {
      return wireframe.wireframe_data;
    }
    
    // Construct a basic wireframe data object from available properties
    return {
      title: wireframe.title || wireframe.description || "Untitled Wireframe",
      description: wireframe.description || "",
      sections: wireframe.sections || []
    };
  },
  
  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: async (projectId: string): Promise<AIWireframe[]> => {
    try {
      const wireframes = await WireframeApiService.getProjectWireframes(projectId);
      
      // Process each wireframe to extract and structure the data correctly
      return wireframes.map(wireframe => {
        // Extract wireframe data using the helper function
        const wireframeData = WireframeDataService.extractWireframeData(wireframe);
        
        // Add structured data to the wireframe object
        return {
          ...wireframe,
          data: wireframeData
        };
      });
    } catch (error) {
      console.error("Error in wireframe service getProjectWireframes:", error);
      throw error;
    }
  },
  
  /**
   * Get a specific wireframe by ID
   */
  getWireframe: async (wireframeId: string): Promise<AIWireframe | null> => {
    try {
      const wireframe = await WireframeApiService.getWireframe(wireframeId);
      
      // Extract wireframe data using the helper function
      const wireframeData = WireframeDataService.extractWireframeData(wireframe);
      
      // Add the extracted data to the wireframe object
      return {
        ...wireframe,
        data: wireframeData
      };
    } catch (error) {
      console.error("Error in wireframe service getWireframe:", error);
      throw error;
    }
  },
};
