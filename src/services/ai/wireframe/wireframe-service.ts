
import { WireframeApiService } from './wireframe-api';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe, 
  WireframeData 
} from './wireframe-types';

/**
 * Service layer for wireframe generation and management
 * Handles API calls and local wireframe management
 */
export const WireframeService = {
  /**
   * Generate a new wireframe using the provided parameters
   */
  generateWireframe: async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    try {
      // Call the API service to generate the wireframe
      const result = await WireframeApiService.generateWireframe(params);
      
      // Save the generated wireframe to the database if there's a project ID
      if (params.projectId && result.wireframe) {
        await WireframeApiService.saveWireframe(
          params.projectId,
          params.prompt,
          result.wireframe,
          params,
          result.model || 'default'
        );
      }
      
      return result;
    } catch (error) {
      console.error("Error in wireframe service generateWireframe:", error);
      throw error;
    }
  },
  
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
      if (wireframe.generation_params.result_data) {
        return wireframe.generation_params.result_data as WireframeData;
      }
    }
    
    // Construct a basic wireframe data object from available properties
    return {
      title: wireframe.description || "Untitled Wireframe",
      description: "",
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
        const wireframeData = WireframeService.extractWireframeData(wireframe);
        
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
      const wireframeData = WireframeService.extractWireframeData(wireframe);
      
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
  
  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: async (
    wireframeId: string,
    feedback: string,
    rating?: number
  ): Promise<void> => {
    try {
      await WireframeApiService.updateWireframeFeedback(wireframeId, feedback, rating);
    } catch (error) {
      console.error("Error in wireframe service updateWireframeFeedback:", error);
      throw error;
    }
  },
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string): Promise<void> => {
    try {
      await WireframeApiService.deleteWireframe(wireframeId);
    } catch (error) {
      console.error("Error in wireframe service deleteWireframe:", error);
      throw error;
    }
  }
};
